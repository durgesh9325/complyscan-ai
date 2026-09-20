// Instant Offline-Ready Fallback Dataset & Client-Side Evaluation
export const DEMO_PRESETS_DATA = {
  demo_compliant_biscuit: {
    scan_id: "PRESET_01_PASS",
    title: "HealthyBite Digestive Biscuits 500g (Compliant)",
    category: "FMCG / Biscuits",
    mode: "physical",
    image_url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&auto=format&fit=crop&q=80",
    extracted_data: {
      manufacturer: "HealthyBite Foods India Pvt. Ltd., Plot 45, Industrial Area, Phase II, Pune - 411028, Maharashtra",
      commodity_name: "Digestive Wholewheat High Fibre Biscuits",
      net_quantity: "500 g (Contains 4 individual freshness packs)",
      mfg_date: "08/2026 (Batch: HB-26084)",
      mrp: "Rs. 95.00 (Inclusive of all taxes)",
      unit_sale_price: "Rs. 0.19 / g",
      consumer_care: "Toll Free: 1800-209-4455 | Email: customercare@healthybite.in | Address: Same as Mfg.",
      country_of_origin: "India",
      package_type: "retail",
      image_clarity_score: 0.96
    },
    evaluation: {
      overall_status: "PASS",
      overall_verdict: "Fully Compliant with Mandatory Declarations",
      compliance_score: 100,
      passed_count: 9,
      violation_count: 0,
      review_count: 0,
      summary: "All 9 mandatory PCR 2011 declarations were successfully detected and verified.",
      fields: [
        {
          id: "RULE_6_1_A",
          name: "Manufacturer / Packer / Importer Details",
          section: "Rule 6(1)(a)",
          status: "PASS",
          confidence: 0.98,
          detected_value: "HealthyBite Foods India Pvt. Ltd., Plot 45, Industrial Area, Phase II, Pune - 411028, Maharashtra",
          message: "Valid manufacturer/packer details and registered address detected."
        },
        {
          id: "RULE_6_1_B",
          name: "Generic Name of Commodity",
          section: "Rule 6(1)(b)",
          status: "PASS",
          confidence: 0.95,
          detected_value: "Digestive Wholewheat High Fibre Biscuits",
          message: "Commodity declared as 'Digestive Wholewheat High Fibre Biscuits'."
        },
        {
          id: "RULE_6_1_C",
          name: "Net Quantity & Standard Units",
          section: "Rule 6(1)(c)",
          status: "PASS",
          confidence: 0.97,
          detected_value: "500 g (Contains 4 individual freshness packs)",
          message: "Net quantity is declared in authorized Legal Metrology standard units."
        },
        {
          id: "RULE_6_1_D",
          name: "Month and Year of Manufacture / Packing",
          section: "Rule 6(1)(d)",
          status: "PASS",
          confidence: 0.94,
          detected_value: "08/2026 (Batch: HB-26084)",
          message: "Valid packing/manufacturing date format detected."
        },
        {
          id: "RULE_6_1_E",
          name: "Retail Sale Price (MRP)",
          section: "Rule 6(1)(e)",
          status: "PASS",
          confidence: 0.99,
          detected_value: "Rs. 95.00 (Inclusive of all taxes)",
          message: "Valid MRP with 'Inclusive of all taxes' declaration."
        },
        {
          id: "RULE_6_1_F",
          name: "Unit Sale Price (USP)",
          section: "Rule 6(1)(f) / 2021 Amend",
          status: "PASS",
          confidence: 0.90,
          detected_value: "Rs. 0.19 / g",
          message: "Unit sale price declared: 'Rs. 0.19 / g'."
        },
        {
          id: "RULE_6_1_G",
          name: "Consumer Care / Grievance Contact",
          section: "Rule 6(1)(g)",
          status: "PASS",
          confidence: 0.96,
          detected_value: "Toll Free: 1800-209-4455 | Email: customercare@healthybite.in | Address: Same as Mfg.",
          message: "Valid consumer complaint channel (Phone / Email / Address) provided."
        },
        {
          id: "RULE_6_1_H",
          name: "Country of Origin",
          section: "Rule 6(1)(h) / 2017 Amend",
          status: "PASS",
          confidence: 0.96,
          detected_value: "India",
          message: "Country of Origin clearly declared as 'India'."
        },
        {
          id: "RULE_PDP_PROMINENCE",
          name: "Principal Display Panel & Legibility",
          section: "Rule 9",
          status: "PASS",
          confidence: 0.96,
          detected_value: "Principal Display Panel Verified (Score: 96%)",
          message: "Declarations appear prominent, legible and on the primary display face."
        }
      ]
    },
    bounding_boxes: [
      { label: "Principal Display Panel", box: [10, 10, 80, 40], field: "pdp" },
      { label: "MRP (Rs. 95.00 Incl. Taxes)", box: [55, 60, 90, 72], field: "mrp" },
      { label: "Net Qty: 500g", box: [15, 65, 45, 75], field: "net_quantity" },
      { label: "Mfg Details & Address", box: [10, 78, 90, 92], field: "manufacturer" }
    ],
    timestamp: "Just now"
  },

  demo_violation_shampoo: {
    scan_id: "PRESET_02_VIOLATION",
    title: "SilkGlow Herbal Shampoo 200ml (Missing MRP Taxes & Consumer Care)",
    category: "Personal Care / Cosmetics",
    mode: "physical",
    image_url: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=80",
    extracted_data: {
      manufacturer: "GlowCosmetics Corp, Unit 3B, New Delhi",
      commodity_name: "Anti-Dandruff Herbal Hair Cleanser",
      net_quantity: "200 ml",
      mfg_date: "04/2026",
      mrp: "Rs. 180.00",
      unit_sale_price: null,
      consumer_care: null,
      country_of_origin: "India",
      package_type: "retail",
      image_clarity_score: 0.88
    },
    evaluation: {
      overall_status: "POSSIBLE_VIOLATION",
      overall_verdict: "Non-Compliant - Statutory Violations Flagged",
      compliance_score: 62,
      passed_count: 5,
      violation_count: 3,
      review_count: 1,
      summary: "3 statutory non-compliances flagged under PCR 2011: Missing 'Inclusive of all taxes' on MRP, Missing mandatory Consumer Care helpline/email, Missing Unit Sale Price (USP).",
      fields: [
        {
          id: "RULE_6_1_A",
          name: "Manufacturer / Packer / Importer Details",
          section: "Rule 6(1)(a)",
          status: "NEEDS_REVIEW",
          confidence: 0.72,
          detected_value: "GlowCosmetics Corp, Unit 3B, New Delhi",
          message: "Address appears incomplete (Missing complete postal pincode & state details)."
        },
        {
          id: "RULE_6_1_B",
          name: "Generic Name of Commodity",
          section: "Rule 6(1)(b)",
          status: "PASS",
          confidence: 0.90,
          detected_value: "Anti-Dandruff Herbal Hair Cleanser",
          message: "Commodity declared as 'Anti-Dandruff Herbal Hair Cleanser'."
        },
        {
          id: "RULE_6_1_C",
          name: "Net Quantity & Standard Units",
          section: "Rule 6(1)(c)",
          status: "PASS",
          confidence: 0.92,
          detected_value: "200 ml",
          message: "Net quantity is declared in standard units (200 ml)."
        },
        {
          id: "RULE_6_1_D",
          name: "Month and Year of Manufacture / Packing",
          section: "Rule 6(1)(d)",
          status: "PASS",
          confidence: 0.85,
          detected_value: "04/2026",
          message: "Valid packing/manufacturing date format detected."
        },
        {
          id: "RULE_6_1_E",
          name: "Retail Sale Price (MRP)",
          section: "Rule 6(1)(e)",
          status: "POSSIBLE_VIOLATION",
          confidence: 0.91,
          detected_value: "Rs. 180.00",
          message: "VIOLATION: Missing mandatory 'Inclusive of all taxes' statutory declaration."
        },
        {
          id: "RULE_6_1_F",
          name: "Unit Sale Price (USP)",
          section: "Rule 6(1)(f) / 2021 Amend",
          status: "POSSIBLE_VIOLATION",
          confidence: 0.85,
          detected_value: null,
          message: "VIOLATION: Unit Sale Price (per ml) is mandatory for packages > 20ml under 2021 Amendment."
        },
        {
          id: "RULE_6_1_G",
          name: "Consumer Care / Grievance Contact",
          section: "Rule 6(1)(g)",
          status: "POSSIBLE_VIOLATION",
          confidence: 0.0,
          detected_value: null,
          message: "VIOLATION: Missing mandatory consumer grievance contact (Telephone, Email, or Address)."
        },
        {
          id: "RULE_6_1_H",
          name: "Country of Origin",
          section: "Rule 6(1)(h) / 2017 Amend",
          status: "PASS",
          confidence: 0.90,
          detected_value: "India",
          message: "Country of Origin clearly declared as 'India'."
        },
        {
          id: "RULE_PDP_PROMINENCE",
          name: "Principal Display Panel & Legibility",
          section: "Rule 9",
          status: "PASS",
          confidence: 0.88,
          detected_value: "Legibility Score: 88%",
          message: "Declarations appear legible on the display panel."
        }
      ]
    },
    bounding_boxes: [
      { label: "Net Volume: 200ml", box: [20, 68, 48, 76], field: "net_quantity" },
      { label: "MRP Rs. 180.00 (Taxes Missing)", box: [52, 68, 88, 76], field: "mrp" },
      { label: "Mfg Unit 3B (Incomplete)", box: [15, 82, 85, 94], field: "manufacturer" }
    ],
    timestamp: "Just now"
  },

  demo_blurry_spice: {
    scan_id: "PRESET_03_BLURRY",
    title: "Royal Garam Masala 100g (Blurry Mfg Date & Address)",
    category: "FoodTech / Spices",
    mode: "physical",
    image_url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80",
    extracted_data: {
      manufacturer: "SpiceCraft Ltd.",
      commodity_name: "Pure Blended Garam Masala Powder",
      net_quantity: "100 g",
      mfg_date: "BATCH??/26",
      mrp: "Rs. 62.00 (Incl. of all taxes)",
      unit_sale_price: "Rs. 0.62 / g",
      consumer_care: "care@spicecraft.com",
      country_of_origin: "India",
      package_type: "retail",
      image_clarity_score: 0.44
    },
    evaluation: {
      overall_status: "NEEDS_REVIEW",
      overall_verdict: "Manual Inspection Advised - Legibility Concerns",
      compliance_score: 72,
      passed_count: 6,
      violation_count: 0,
      review_count: 3,
      summary: "Image clarity score (44%) is below standard threshold. Manufacturing date and address clarity require human inspector verification.",
      fields: [
        {
          id: "RULE_6_1_A",
          name: "Manufacturer / Packer / Importer Details",
          section: "Rule 6(1)(a)",
          status: "NEEDS_REVIEW",
          confidence: 0.52,
          detected_value: "SpiceCraft Ltd.",
          message: "Short address detected without complete city or state postal code."
        },
        {
          id: "RULE_6_1_B",
          name: "Generic Name of Commodity",
          section: "Rule 6(1)(b)",
          status: "PASS",
          confidence: 0.88,
          detected_value: "Pure Blended Garam Masala Powder",
          message: "Generic name clearly declared."
        },
        {
          id: "RULE_6_1_C",
          name: "Net Quantity & Standard Units",
          section: "Rule 6(1)(c)",
          status: "PASS",
          confidence: 0.90,
          detected_value: "100 g",
          message: "Declared in standard metric units."
        },
        {
          id: "RULE_6_1_D",
          name: "Month and Year of Manufacture / Packing",
          section: "Rule 6(1)(d)",
          status: "NEEDS_REVIEW",
          confidence: 0.40,
          detected_value: "BATCH??/26",
          message: "Blurry or unreadable date characters detected on OCR inspection."
        },
        {
          id: "RULE_6_1_E",
          name: "Retail Sale Price (MRP)",
          section: "Rule 6(1)(e)",
          status: "PASS",
          confidence: 0.91,
          detected_value: "Rs. 62.00 (Incl. of all taxes)",
          message: "Valid MRP detected with tax statement."
        },
        {
          id: "RULE_6_1_F",
          name: "Unit Sale Price (USP)",
          section: "Rule 6(1)(f) / 2021 Amend",
          status: "PASS",
          confidence: 0.90,
          detected_value: "Rs. 0.62 / g",
          message: "Unit sale price declared."
        },
        {
          id: "RULE_6_1_G",
          name: "Consumer Care / Grievance Contact",
          section: "Rule 6(1)(g)",
          status: "PASS",
          confidence: 0.85,
          detected_value: "care@spicecraft.com",
          message: "Consumer email address detected."
        },
        {
          id: "RULE_6_1_H",
          name: "Country of Origin",
          section: "Rule 6(1)(h) / 2017 Amend",
          status: "PASS",
          confidence: 0.92,
          detected_value: "India",
          message: "Country of origin verified."
        },
        {
          id: "RULE_PDP_PROMINENCE",
          name: "Principal Display Panel & Legibility",
          section: "Rule 9",
          status: "NEEDS_REVIEW",
          confidence: 0.44,
          detected_value: "Legibility Score: 44% (Low Contrast)",
          message: "Low contrast and edge sharpness flagged on Principal Display Panel."
        }
      ]
    },
    bounding_boxes: [
      { label: "Net Wt: 100g", box: [18, 55, 42, 64], field: "net_quantity" },
      { label: "Low Contrast Mfg Date", box: [48, 55, 85, 64], field: "mfg_date" }
    ],
    timestamp: "Just now"
  },

  demo_exempt_bulk_rice: {
    scan_id: "PRESET_04_EXEMPT",
    title: "Annapurna Basmati Rice Bulk Pack 30kg (Exempt Package)",
    category: "Agriculture / Grains",
    mode: "physical",
    image_url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80",
    extracted_data: {
      manufacturer: "Annapurna Agro Mills Ltd., Karnal, Haryana",
      commodity_name: "Premium Traditional Long Grain Basmati Rice",
      net_quantity: "30 kg (Bulk Institutional/Wholesale)",
      mfg_date: "06/2026",
      mrp: "Rs. 3,450.00",
      unit_sale_price: null,
      consumer_care: "info@annapurnaagro.com",
      country_of_origin: "India",
      package_type: "wholesale",
      image_clarity_score: 0.92
    },
    evaluation: {
      overall_status: "EXEMPT",
      overall_verdict: "Exempt from Standard PCR 2011 Requirements",
      compliance_score: 100,
      passed_count: 0,
      violation_count: 0,
      review_count: 0,
      summary: "Exempt under Rule 26: Package net quantity (30 kg) exceeds the 25kg / 25L statutory threshold for standard retail package rules.",
      fields: []
    },
    bounding_boxes: [
      { label: "Bulk Bag 30kg (>25kg Rule 26)", box: [20, 40, 80, 75], field: "net_quantity" }
    ],
    timestamp: "Just now"
  }
};
