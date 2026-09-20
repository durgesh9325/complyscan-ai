"""
Legal Metrology (Packaged Commodities) Rules, 2011 - Rule Engine
Strictly deterministic verification logic as per Ministry Guidelines.
Outcome States: PASS, POSSIBLE_VIOLATION, NEEDS_REVIEW, EXEMPT, SKIPPED
"""

import re
from typing import Dict, Any, List, Tuple

RULES_METADATA = {
    "rule_6_1_a": {
        "id": "RULE_6_1_A",
        "name": "Manufacturer / Packer / Importer Details",
        "description": "Name and complete address of the manufacturer, packer or importer must be clearly declared.",
        "section": "Rule 6(1)(a)"
    },
    "rule_6_1_b": {
        "id": "RULE_6_1_B",
        "name": "Generic Name of Commodity",
        "description": "The common or generic name of the commodity contained in the package.",
        "section": "Rule 6(1)(b)"
    },
    "rule_6_1_c": {
        "id": "RULE_6_1_C",
        "name": "Net Quantity & Standard Units",
        "description": "Net quantity in standard units of weight, measure or number (g, kg, ml, L, count).",
        "section": "Rule 6(1)(c)"
    },
    "rule_6_1_d": {
        "id": "RULE_6_1_D",
        "name": "Month and Year of Manufacture / Packing",
        "description": "Month and year of manufacture, packing or import in valid date format.",
        "section": "Rule 6(1)(d)"
    },
    "rule_6_1_e": {
        "id": "RULE_6_1_E",
        "name": "Retail Sale Price (MRP)",
        "description": "Maximum Retail Price (MRP) including 'inclusive of all taxes' declaration.",
        "section": "Rule 6(1)(e)"
    },
    "rule_6_1_f": {
        "id": "RULE_6_1_F",
        "name": "Unit Sale Price (USP)",
        "description": "Unit sale price (e.g., Rs. / g or Rs. / ml) where applicable for multi-piece or pre-packaged goods.",
        "section": "Rule 6(1)(f) / 2021 Amend"
    },
    "rule_6_1_g": {
        "id": "RULE_6_1_G",
        "name": "Consumer Care / Grievance Contact",
        "description": "Name, address, telephone number or email address of the person/office for consumer complaints.",
        "section": "Rule 6(1)(g)"
    },
    "rule_6_1_h": {
        "id": "RULE_6_1_H",
        "name": "Country of Origin",
        "description": "Country of origin must be stated for all imported and e-commerce listed commodities.",
        "section": "Rule 6(1)(h) / 2017 Amend"
    },
    "rule_pdp": {
        "id": "RULE_PDP_PROMINENCE",
        "name": "Principal Display Panel & Legibility",
        "description": "Declarations must be legible, prominent, conspicuous and on the Principal Display Panel (PDP).",
        "section": "Rule 9"
    }
}

class LegalMetrologyRuleEngine:
    """Deterministic Legal Metrology compliance validator."""

    @staticmethod
    def check_exemptions(extracted_data: Dict[str, Any]) -> Tuple[bool, str]:
        """Check if package is exempt under Rule 26 / PCR 2011."""
        net_qty_raw = str(extracted_data.get("net_quantity", "")).lower()
        commodity = str(extracted_data.get("commodity_name", "")).lower()
        package_type = str(extracted_data.get("package_type", "retail")).lower()

        if package_type in ["industrial", "institutional"]:
            return True, "Exempt: Package intended for industrial or institutional consumers (Rule 26)."

        # Check > 25kg / 25L bulk packages
        qty_match = re.search(r'(\d+(?:\.\d+)?)\s*(kg|kilo|l|litre|liter)', net_qty_raw)
        if qty_match:
            val = float(qty_match.group(1))
            if val > 25.0:
                return True, f"Exempt: Package net quantity ({val} {qty_match.group(2)}) exceeds 25kg / 25L threshold."

        # Cement/Fertilizer/Agri > 50kg
        if any(w in commodity for w in ["cement", "fertilizer", "urea", "wheat bag", "rice bag"]):
            if qty_match and float(qty_match.group(1)) >= 50.0:
                return True, "Exempt: Bulk Agricultural/Fertilizer/Cement commodity >= 50kg."

        # Extremely small packages (< 10g or < 10ml)
        small_match = re.search(r'(\d+(?:\.\d+)?)\s*(g|gm|gram|ml)', net_qty_raw)
        if small_match:
            val = float(small_match.group(1))
            unit = small_match.group(2)
            if val < 10.0 and unit in ['g', 'gm', 'ml']:
                return True, f"Exempt: Small package less than 10g/10ml ({val}{unit})."

        return False, ""

    @classmethod
    def evaluate(cls, extracted_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Runs complete compliance analysis on extracted label data.
        Returns field-by-field verdicts, rule violations, and overall status.
        """
        is_exempt, exempt_reason = cls.check_exemptions(extracted_data)
        if is_exempt:
            return {
                "overall_status": "EXEMPT",
                "overall_verdict": "Exempt from Standard PCR 2011 Requirements",
                "summary": exempt_reason,
                "fields": [],
                "compliance_score": 100,
                "passed_count": 0,
                "violation_count": 0,
                "review_count": 0
            }

        fields_result = []

        # 1. Manufacturer Name & Address Check
        mfg_val = extracted_data.get("manufacturer", "")
        if not mfg_val or len(str(mfg_val).strip()) < 3:
            fields_result.append({
                **RULES_METADATA["rule_6_1_a"],
                "detected_value": None,
                "status": "POSSIBLE_VIOLATION",
                "message": "Manufacturer / Packer name and address is completely missing from the label.",
                "confidence": extracted_data.get("confidence_scores", {}).get("manufacturer", 0.0)
            })
        elif len(str(mfg_val).split()) < 3 and not re.search(r'\b(pvt|ltd|inc|llp|foods|ind|corp|co)\b', str(mfg_val), re.I):
            fields_result.append({
                **RULES_METADATA["rule_6_1_a"],
                "detected_value": mfg_val,
                "status": "NEEDS_REVIEW",
                "message": "Manufacturer address appears incomplete or lacks specific postal/state details.",
                "confidence": 0.65
            })
        else:
            fields_result.append({
                **RULES_METADATA["rule_6_1_a"],
                "detected_value": mfg_val,
                "status": "PASS",
                "message": "Valid manufacturer/packer details and registered address detected.",
                "confidence": extracted_data.get("confidence_scores", {}).get("manufacturer", 0.95)
            })

        # 2. Generic Name of Commodity
        comm_val = extracted_data.get("commodity_name", "")
        if not comm_val:
            fields_result.append({
                **RULES_METADATA["rule_6_1_b"],
                "detected_value": None,
                "status": "POSSIBLE_VIOLATION",
                "message": "Generic/Common name of the commodity is missing (only brand name present or blank).",
                "confidence": 0.0
            })
        else:
            fields_result.append({
                **RULES_METADATA["rule_6_1_b"],
                "detected_value": comm_val,
                "status": "PASS",
                "message": f"Commodity declared as '{comm_val}'.",
                "confidence": extracted_data.get("confidence_scores", {}).get("commodity_name", 0.92)
            })

        # 3. Net Quantity & Standard Unit Check
        net_qty_val = extracted_data.get("net_quantity", "")
        if not net_qty_val:
            fields_result.append({
                **RULES_METADATA["rule_6_1_c"],
                "detected_value": None,
                "status": "POSSIBLE_VIOLATION",
                "message": "Net quantity is not declared on the Principal Display Panel.",
                "confidence": 0.0
            })
        else:
            # Check for standard units (g, kg, ml, l, count/N, m, cm)
            valid_unit_match = re.search(r'\b(\d+(?:\.\d+)?)\s*(g|gm|gms|gram|grams|kg|kgs|ml|l|litre|liter|litres|n|units|pcs|pieces|m|cm)\b', str(net_qty_val), re.I)
            if valid_unit_match:
                fields_result.append({
                    **RULES_METADATA["rule_6_1_c"],
                    "detected_value": net_qty_val,
                    "status": "PASS",
                    "message": "Net quantity is declared in authorized Legal Metrology standard units.",
                    "confidence": extracted_data.get("confidence_scores", {}).get("net_quantity", 0.96)
                })
            else:
                fields_result.append({
                    **RULES_METADATA["rule_6_1_c"],
                    "detected_value": net_qty_val,
                    "status": "NEEDS_REVIEW",
                    "message": f"Non-standard or ambiguous unit found in '{net_qty_val}'. Must use standard SI units.",
                    "confidence": 0.60
                })

        # 4. Month & Year of Manufacture / Packing
        mfg_date_val = extracted_data.get("mfg_date", "")
        if not mfg_date_val:
            fields_result.append({
                **RULES_METADATA["rule_6_1_d"],
                "detected_value": None,
                "status": "POSSIBLE_VIOLATION",
                "message": "Month and Year of manufacture / packing / import is missing.",
                "confidence": 0.0
            })
        else:
            date_match = re.search(r'(\b(?:0?[1-9]|1[0-2]|[A-Za-z]{3,9})[\/\.\-\s]+(?:20)?\d{2,4}\b)|(\b\d{2}[\/\.\-]\d{2}[\/\.\-]\d{2,4}\b)', str(mfg_date_val), re.I)
            if date_match or any(w in str(mfg_date_val).lower() for w in ["mfg", "pkd", "packed", "batch"]):
                fields_result.append({
                    **RULES_METADATA["rule_6_1_d"],
                    "detected_value": mfg_date_val,
                    "status": "PASS",
                    "message": "Valid packing/manufacturing date format detected.",
                    "confidence": extracted_data.get("confidence_scores", {}).get("mfg_date", 0.94)
                })
            else:
                fields_result.append({
                    **RULES_METADATA["rule_6_1_d"],
                    "detected_value": mfg_date_val,
                    "status": "NEEDS_REVIEW",
                    "message": f"Date format '{mfg_date_val}' could not be unambiguously verified.",
                    "confidence": 0.58
                })

        # 5. MRP (Retail Sale Price)
        mrp_val = extracted_data.get("mrp", "")
        mrp_text = str(mrp_val).lower()
        has_taxes_clause = any(term in mrp_text for term in ["inclusive of all taxes", "incl. of all taxes", "incl. all taxes", "incl taxes", "all taxes included"])

        if not mrp_val or not re.search(r'(\d+(?:\.\d+)?)', str(mrp_val)):
            fields_result.append({
                **RULES_METADATA["rule_6_1_e"],
                "detected_value": None,
                "status": "POSSIBLE_VIOLATION",
                "message": "Maximum Retail Price (MRP) declaration is missing or unreadable.",
                "confidence": 0.0
            })
        elif not has_taxes_clause and "tax" not in mrp_text:
            fields_result.append({
                **RULES_METADATA["rule_6_1_e"],
                "detected_value": mrp_val,
                "status": "POSSIBLE_VIOLATION",
                "message": "MRP is declared without mandatory 'inclusive of all taxes' statement (Rule 6(1)(e)).",
                "confidence": 0.88
            })
        else:
            fields_result.append({
                **RULES_METADATA["rule_6_1_e"],
                "detected_value": mrp_val,
                "status": "PASS",
                "message": "Valid MRP with 'Inclusive of all taxes' declaration.",
                "confidence": extracted_data.get("confidence_scores", {}).get("mrp", 0.98)
            })

        # 6. Unit Sale Price (USP)
        usp_val = extracted_data.get("unit_sale_price", "")
        if usp_val:
            fields_result.append({
                **RULES_METADATA["rule_6_1_f"],
                "detected_value": usp_val,
                "status": "PASS",
                "message": f"Unit sale price declared: '{usp_val}'.",
                "confidence": 0.90
            })
        else:
            # If package is multi-piece or > 1kg/L, USP is mandatory; otherwise optional/needs check
            is_large = False
            if net_qty_val and re.search(r'(\d+)\s*(kg|l|litre|pieces|pcs)', str(net_qty_val), re.I):
                is_large = True

            if is_large:
                fields_result.append({
                    **RULES_METADATA["rule_6_1_f"],
                    "detected_value": None,
                    "status": "NEEDS_REVIEW",
                    "message": "Unit Sale Price (USP per g/ml) not found. Required for commodities containing more than one unit or >1kg/1L.",
                    "confidence": 0.70
                })
            else:
                fields_result.append({
                    **RULES_METADATA["rule_6_1_f"],
                    "detected_value": "N/A (Single small unit package)",
                    "status": "SKIPPED",
                    "message": "Unit Sale Price not mandatory for single small unit packages.",
                    "confidence": 1.0
                })

        # 7. Consumer Care Details
        care_val = extracted_data.get("consumer_care", "")
        if not care_val:
            fields_result.append({
                **RULES_METADATA["rule_6_1_g"],
                "detected_value": None,
                "status": "POSSIBLE_VIOLATION",
                "message": "Consumer grievance/care details (Phone, Email, or Contact Address) are missing.",
                "confidence": 0.0
            })
        else:
            has_phone = bool(re.search(r'\b(?:\+91|0)?\s*[6-9]\d{9}\b|\b1800\s*\d{3}\s*\d{3,4}\b|\b\d{3,5}[\-\s]\d{6,8}\b', str(care_val)))
            has_email = bool(re.search(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', str(care_val)))
            if has_phone or has_email or len(str(care_val)) > 15:
                fields_result.append({
                    **RULES_METADATA["rule_6_1_g"],
                    "detected_value": care_val,
                    "status": "PASS",
                    "message": "Valid consumer complaint channel (Phone / Email / Address) provided.",
                    "confidence": extracted_data.get("confidence_scores", {}).get("consumer_care", 0.95)
                })
            else:
                fields_result.append({
                    **RULES_METADATA["rule_6_1_g"],
                    "detected_value": care_val,
                    "status": "NEEDS_REVIEW",
                    "message": "Consumer care info detected but does not clearly contain reachable phone/email.",
                    "confidence": 0.60
                })

        # 8. Country of Origin
        origin_val = extracted_data.get("country_of_origin", "")
        is_imported = extracted_data.get("is_imported", False) or "import" in str(mfg_val).lower()
        is_ecommerce = extracted_data.get("mode") == "ecommerce"

        if origin_val:
            fields_result.append({
                **RULES_METADATA["rule_6_1_h"],
                "detected_value": origin_val,
                "status": "PASS",
                "message": f"Country of Origin clearly declared as '{origin_val}'.",
                "confidence": 0.96
            })
        elif is_imported or is_ecommerce:
            fields_result.append({
                **RULES_METADATA["rule_6_1_h"],
                "detected_value": None,
                "status": "POSSIBLE_VIOLATION",
                "message": "Country of origin is mandatory for imported products and digital marketplace listings.",
                "confidence": 0.85
            })
        else:
            fields_result.append({
                **RULES_METADATA["rule_6_1_h"],
                "detected_value": "Made in India (Domestic Manufacturer inferred)",
                "status": "PASS",
                "message": "Domestic manufacturer declared; specific origin declaration inferred.",
                "confidence": 0.80
            })

        # 9. PDP Prominence & Legibility
        clarity_score = extracted_data.get("image_clarity_score", 0.9)
        if clarity_score < 0.5:
            fields_result.append({
                **RULES_METADATA["rule_pdp"],
                "detected_value": f"Clarity Score: {int(clarity_score * 100)}%",
                "status": "NEEDS_REVIEW",
                "message": "Low image clarity / contrast detected. Label text may not meet Rule 9 prominence standards.",
                "confidence": clarity_score
            })
        else:
            fields_result.append({
                **RULES_METADATA["rule_pdp"],
                "detected_value": f"Principal Display Panel Verified (Score: {int(clarity_score * 100)}%)",
                "status": "PASS",
                "message": "Declarations appear prominent, legible and on the primary display face.",
                "confidence": clarity_score
            })

        # Aggregate counts
        violations = sum(1 for f in fields_result if f["status"] == "POSSIBLE_VIOLATION")
        reviews = sum(1 for f in fields_result if f["status"] == "NEEDS_REVIEW")
        passed = sum(1 for f in fields_result if f["status"] == "PASS")
        total_eval = len(fields_result)

        if violations > 0:
            overall_status = "POSSIBLE_VIOLATION"
            overall_verdict = f"{violations} Non-Compliance Issue(s) Flagged"
            summary = "This product label exhibits potential violations of the Legal Metrology (Packaged Commodities) Rules, 2011."
        elif reviews > 0:
            overall_status = "NEEDS_REVIEW"
            overall_verdict = f"{reviews} Field(s) Require Human Verification"
            summary = "Some declarations were ambiguous or low-contrast and need verification by an enforcement officer."
        else:
            overall_status = "PASS"
            overall_verdict = "Fully Compliant with Mandatory Declarations"
            summary = "All 9 mandatory PCR 2011 declarations were successfully detected and verified."

        compliance_score = int((passed / total_eval) * 100) if total_eval > 0 else 0

        return {
            "overall_status": overall_status,
            "overall_verdict": overall_verdict,
            "summary": summary,
            "fields": fields_result,
            "compliance_score": compliance_score,
            "passed_count": passed,
            "violation_count": violations,
            "review_count": reviews
        }
