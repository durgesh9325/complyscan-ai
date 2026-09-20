# ComplyScan AI ⚖️
### Automated Legal Metrology (Packaged Commodities) Compliance Auditing System
**Smart India Hackathon (SIH 2026) • Problem Statement ID: SIH26034**  
**Ministry of Consumer Affairs, Food & Public Distribution | Team ByteBusters**

---

## 📌 Problem Context & Solution
Under the **Legal Metrology (Packaged Commodities) Rules, 2011**, all pre-packaged commodities sold in physical retail or e-commerce marketplaces in India must display mandatory statutory declarations on their Principal Display Panel (PDP).

Manual inspections are slow, subjective, and difficult to scale across millions of SKUs. **ComplyScan AI** is an intelligent, deterministic auditing system that extracts label text via computer vision OCR and validates it against statutory rules in under **3 seconds**.

---

## 🌟 Key Features

### 1. 🔍 Citizen & Consumer Scanner
- **Drag & Drop / Camera Capture**: Direct photo upload of physical packages or e-commerce screenshots.
- **⚡ 1-Click Instant Demo Presets**: Test real-world products immediately (Compliant Biscuits, Shampoo with Missing MRP & Care, Blurry Spice packaging, Exempt Bulk 30kg Rice).
- **Simulated Bounding Box Visualizer**: Highlights exact detected declarations on the label.
- **Bilingual UI Support**: Switch between **English** and **हिन्दी** with 1 click.
- **1-Click Consumer Grievance Filing**: Route complaints directly with unique tracking IDs.
- **Legal PDF Certificate Download**: Instant downloadable compliance certificates.

### 2. 🏢 Business & Manufacturer Self-Audit Portal
- **Pre-Launch Label Verification**: Test packaging artwork texts before printing.
- **Unit Sale Price (USP) Auto-Calculator**: Automatically computes statutory price per g/ml.
- **Bulk E-Commerce Catalog Audit**: Batch-verify multi-SKU feeds with pass/violation ratios.

### 3. 👮 Legal Metrology Officer Command Dashboard
- **Live National KPIs**: Total audits, violation rate, active cases, and resolved notices.
- **Recharts Data Visualizations**: Violation density by commodity category and state risk distribution.
- **Interactive Case Registry**: Filter cases by status, search by brand, and update statutory notice statuses (`INVESTIGATING`, `NOTICE_ISSUED`, `HEARING_SCHEDULED`, `RESOLVED`).

---

## 🏛️ PCR 2011 Rules Implemented

| Rule | Mandatory Declaration | Verification Logic |
| :--- | :--- | :--- |
| **Rule 6(1)(a)** | Manufacturer / Packer / Importer | Validates entity name + complete physical address |
| **Rule 6(1)(b)** | Generic Name of Commodity | Verifies common name is declared on PDP |
| **Rule 6(1)(c)** | Net Quantity & SI Units | Checks standard metric units (`g`, `kg`, `ml`, `L`, `N`) |
| **Rule 6(1)(d)** | Month & Year of Manufacture/Packing | Validates date format (`MM/YYYY` or Month Year) |
| **Rule 6(1)(e)** | Retail Sale Price (MRP) | Checks for "MRP" / "Rs." and "Inclusive of all taxes" |
| **Rule 6(1)(f)** | Unit Sale Price (USP) | Checks price per unit (per g/ml) for pack size > 20g |
| **Rule 6(1)(g)** | Consumer Care Contact | Validates phone number, email or physical care address |
| **Rule 6(1)(h)** | Country of Origin | Mandatory for imported & e-commerce goods |
| **Rule 9** | Principal Display Panel Legibility | Calculates clarity and readability score |
| **Rule 26** | Statutory Exemptions | Flags bulk packs (>25kg/25L) or small packs (<10g) |

---

## 🚀 How to Run the Application

### Option A: One-Click Launch (Windows)
Double-click `run.bat` in this folder:
```cmd
run.bat
```
This automatically starts both the FastAPI backend (`http://127.0.0.1:8000`) and the Vite React frontend (`http://localhost:5173`) and opens your browser.

---

### Option B: Manual Terminal Launch

#### 1. Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```
API Documentation available at: `http://127.0.0.1:8000/docs`

#### 2. Frontend (React + Vite + Tailwind CSS)
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📁 Project Structure

```
website/
├── run.bat                     # 1-Click launcher
├── README.md                   # Project documentation
├── backend/
│   ├── main.py                 # FastAPI REST API endpoints
│   ├── rules_engine.py         # Deterministic PCR 2011 Rule Engine
│   ├── ocr_service.py          # Label OCR & Image preprocessing
│   ├── database.py             # SQLite persistence & analytics
│   ├── requirements.txt        # Python dependencies
│   └── uploads/                # Label upload directory
└── frontend/
    ├── package.json            # React & Vite dependencies
    ├── vite.config.js          # Vite config & API Proxy
    ├── src/
    │   ├── App.jsx             # Main Application & Router
    │   ├── index.css           # Tailwind CSS Theme tokens
    │   ├── translations.js     # Bilingual (EN/HI) dictionary
    │   ├── components/
    │   │   ├── Navbar.jsx      # Sticky Ministry Header
    │   │   ├── Footer.jsx      # Legal disclaimer & SIH footer
    │   │   └── StatusBadge.jsx # Standardized Status Pills
    │   └── pages/
    │       ├── Home.jsx        # Landing page & quick demo pills
    │       ├── Scanner.jsx     # Upload & preset scanner interface
    │       ├── Report.jsx      # Audit Report with PDF & Grievances
    │       ├── Dashboard.jsx   # Officer Enforcement Dashboard
    │       ├── SellerPortal.jsx# Pre-launch self-audit & bulk check
    │       ├── KnowYourRights.jsx # Consumer awareness guide
    │       └── ScanHistory.jsx # Historical audit log
```

---

## 🏆 SIH Team: ByteBusters
*Built for Digital India & Transparent Consumer Protection under the Ministry of Consumer Affairs, Food & Public Distribution.*
