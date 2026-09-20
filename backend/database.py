"""
Database and storage layer for LegalMetrology ComplyScan.
Uses SQLite for self-contained, high-performance persistence.
"""

import sqlite3
import json
import uuid
import datetime
from typing import Dict, Any, List, Optional

DB_FILE = "C:/Users/admin/Desktop/website/backend/complyscan.db"

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes tables and seeds initial realistic mock cases and scans."""
    conn = get_db()
    cursor = conn.cursor()

    # Scans Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS scans (
        id TEXT PRIMARY KEY,
        title TEXT,
        category TEXT,
        mode TEXT,
        image_url TEXT,
        overall_status TEXT,
        compliance_score INTEGER,
        extracted_data TEXT,
        evaluation_result TEXT,
        bounding_boxes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Cases Table for Officers
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS cases (
        id TEXT PRIMARY KEY,
        scan_id TEXT,
        product_name TEXT,
        manufacturer TEXT,
        violation_type TEXT,
        severity TEXT,
        status TEXT,
        assigned_officer TEXT,
        state TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (scan_id) REFERENCES scans(id)
    )
    """)

    # Complaints Table for Citizens
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS complaints (
        id TEXT PRIMARY KEY,
        scan_id TEXT,
        complainant_name TEXT,
        complainant_phone TEXT,
        complainant_email TEXT,
        store_name TEXT,
        store_city TEXT,
        store_state TEXT,
        description TEXT,
        status TEXT DEFAULT 'SUBMITTED',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Check if seed data exists
    cursor.execute("SELECT COUNT(*) as cnt FROM scans")
    count = cursor.fetchone()["cnt"]

    if count == 0:
        seed_data(cursor)

    conn.commit()
    conn.close()

def seed_data(cursor):
    """Seed realistic compliance records and officer cases."""
    sample_cases = [
        {
            "id": "CASE-2026-0891",
            "product_name": "SilkGlow Herbal Shampoo 200ml",
            "manufacturer": "GlowCosmetics Corp, Delhi",
            "violation_type": "MRP Missing 'Inclusive of all taxes' & Missing Consumer Care",
            "severity": "HIGH",
            "status": "INVESTIGATING",
            "assigned_officer": "R. K. Sharma (Inspector, Delhi Zone)",
            "state": "Delhi",
            "score": 62,
            "overall_status": "POSSIBLE_VIOLATION"
        },
        {
            "id": "CASE-2026-0892",
            "product_name": "Royal Garam Masala 100g",
            "manufacturer": "SpiceCraft Ltd.",
            "violation_type": "Ambiguous Mfg Date & Incomplete Registered Address",
            "severity": "MEDIUM",
            "status": "NOTICE_ISSUED",
            "assigned_officer": "Priya Verma (Enforcement Officer, MH)",
            "state": "Maharashtra",
            "score": 75,
            "overall_status": "NEEDS_REVIEW"
        },
        {
            "id": "CASE-2026-0893",
            "product_name": "QuickBite Salted Peanuts 50g",
            "manufacturer": "AgroSnacks LLP, Ahmedabad",
            "violation_type": "Net Quantity non-standard notation ('50 gms net approx')",
            "severity": "LOW",
            "status": "RESOLVED",
            "assigned_officer": "Amit Patel (Officer, Gujarat)",
            "state": "Gujarat",
            "score": 85,
            "overall_status": "POSSIBLE_VIOLATION"
        },
        {
            "id": "CASE-2026-0894",
            "product_name": "UltraClean Hand Sanitizer 500ml",
            "manufacturer": "BioShield Pharma, Hyderabad",
            "violation_type": "Missing Mandatory Country of Origin & Unit Sale Price",
            "severity": "HIGH",
            "status": "PENDING_REVIEW",
            "assigned_officer": "S. Reddy (Legal Metrology, Telangana)",
            "state": "Telangana",
            "score": 58,
            "overall_status": "POSSIBLE_VIOLATION"
        },
        {
            "id": "CASE-2026-0895",
            "product_name": "PureDrop Mineral Water 1L",
            "manufacturer": "AquaPure Beverages, Bengaluru",
            "violation_type": "Dual MRP Sticker Overprint (Overpricing Violation)",
            "severity": "HIGH",
            "status": "HEARING_SCHEDULED",
            "assigned_officer": "K. Venkatesh (Senior Inspector, Karnataka)",
            "state": "Karnataka",
            "score": 40,
            "overall_status": "POSSIBLE_VIOLATION"
        }
    ]

    for c in sample_cases:
        scan_id = str(uuid.uuid4())[:8]
        cursor.execute("""
        INSERT INTO scans (id, title, category, mode, image_url, overall_status, compliance_score, extracted_data, evaluation_result, bounding_boxes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            scan_id,
            c["product_name"],
            "Retail Packaged Goods",
            "physical",
            "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800",
            c["overall_status"],
            c["score"],
            json.dumps({"manufacturer": c["manufacturer"], "commodity_name": c["product_name"]}),
            json.dumps({"overall_status": c["overall_status"], "summary": c["violation_type"], "fields": []}),
            json.dumps([])
        ))

        cursor.execute("""
        INSERT INTO cases (id, scan_id, product_name, manufacturer, violation_type, severity, status, assigned_officer, state, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            c["id"],
            scan_id,
            c["product_name"],
            c["manufacturer"],
            c["violation_type"],
            c["severity"],
            c["status"],
            c["assigned_officer"],
            c["state"],
            "Automated audit generated by LegalMetrology AI Rule Engine."
        ))

def save_scan_record(scan_id: str, title: str, category: str, mode: str, image_url: str,
                     extracted_data: Dict[str, Any], evaluation: Dict[str, Any], bounding_boxes: List[Dict[str, Any]]):
    """Saves a scan record and creates a case if violation/review detected."""
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO scans (id, title, category, mode, image_url, overall_status, compliance_score, extracted_data, evaluation_result, bounding_boxes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        scan_id,
        title,
        category,
        mode,
        image_url,
        evaluation.get("overall_status", "PASS"),
        evaluation.get("compliance_score", 100),
        json.dumps(extracted_data),
        json.dumps(evaluation),
        json.dumps(bounding_boxes)
    ))

    # If violation or needs review, automatically create an officer case
    overall = evaluation.get("overall_status")
    if overall in ["POSSIBLE_VIOLATION", "NEEDS_REVIEW"]:
        case_id = f"CASE-2026-{scan_id[:4].upper()}"
        violations = [f["name"] for f in evaluation.get("fields", []) if f["status"] in ["POSSIBLE_VIOLATION", "NEEDS_REVIEW"]]
        v_type = ", ".join(violations[:2]) if violations else "PCR 2011 Non-Compliance"
        severity = "HIGH" if overall == "POSSIBLE_VIOLATION" else "MEDIUM"

        cursor.execute("""
        INSERT INTO cases (id, scan_id, product_name, manufacturer, violation_type, severity, status, assigned_officer, state, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            case_id,
            scan_id,
            title,
            extracted_data.get("manufacturer") or "Unknown Manufacturer",
            v_type,
            severity,
            "PENDING_REVIEW",
            "Auto-Assigned to Inspection Pool",
            "National Central Registry",
            f"Automated case created: {evaluation.get('summary')}"
        ))

    conn.commit()
    conn.close()

def get_recent_scans(limit: int = 15):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM scans ORDER BY created_at DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    results = []
    for r in rows:
        results.append({
            "id": r["id"],
            "title": r["title"],
            "category": r["category"],
            "mode": r["mode"],
            "image_url": r["image_url"],
            "overall_status": r["overall_status"],
            "compliance_score": r["compliance_score"],
            "extracted_data": json.loads(r["extracted_data"]) if r["extracted_data"] else {},
            "evaluation_result": json.loads(r["evaluation_result"]) if r["evaluation_result"] else {},
            "bounding_boxes": json.loads(r["bounding_boxes"]) if r["bounding_boxes"] else [],
            "created_at": r["created_at"]
        })
    conn.close()
    return results

def get_all_cases():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM cases ORDER BY created_at DESC")
    rows = cursor.fetchall()
    cases = [dict(r) for r in rows]
    conn.close()
    return cases

def update_case_status(case_id: str, new_status: str, notes: Optional[str] = None):
    conn = get_db()
    cursor = conn.cursor()
    if notes:
        cursor.execute("UPDATE cases SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", (new_status, notes, case_id))
    else:
        cursor.execute("UPDATE cases SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", (new_status, case_id))
    conn.commit()
    conn.close()

def save_complaint(complaint_data: Dict[str, Any]) -> str:
    conn = get_db()
    cursor = conn.cursor()
    c_id = f"GRIEVANCE-{uuid.uuid4().hex[:6].upper()}"
    cursor.execute("""
    INSERT INTO complaints (id, scan_id, complainant_name, complainant_phone, complainant_email, store_name, store_city, store_state, description, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'SUBMITTED')
    """, (
        c_id,
        complaint_data.get("scan_id"),
        complaint_data.get("name"),
        complaint_data.get("phone"),
        complaint_data.get("email"),
        complaint_data.get("store_name"),
        complaint_data.get("store_city"),
        complaint_data.get("store_state"),
        complaint_data.get("description")
    ))
    conn.commit()
    conn.close()
    return c_id
