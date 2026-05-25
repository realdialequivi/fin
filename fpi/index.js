const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// ─── LANDING ─────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/demo', (req, res) => {
  res.sendFile(path.join(__dirname, 'demo.html'));
});

// ─── DATABASE ────────────────────────────────────────────────
// Strategy reference (FPI lineup, plausible mock)
const STRATEGIES = [
  { id: "QFC-MSC",   name: "QFC Multi-Strategy Core",        category: "Quantified Funds",            risk: "MODERATE",      ytd: 9.4 },
  { id: "CLASSIC",   name: "Classic",                        category: "Turnkey Portfolios",          risk: "MODERATE",      ytd: 7.8 },
  { id: "ALL-TERR",  name: "All-Terrain",                    category: "Turnkey Portfolios",          risk: "BALANCED",      ytd: 6.5 },
  { id: "SATF",      name: "Self-adjusting Trend Following", category: "Dynamic Risk Managed",        risk: "AGGRESSIVE",    ytd: 12.1 },
  { id: "TGOLD",     name: "Tactical Gold",                  category: "Alternative",                 risk: "MODERATE",      ytd: 14.2 },
  { id: "GBS",       name: "Gold Bullion Strategy",          category: "Alternative",                 risk: "MODERATE",      ytd: 11.6 },
  { id: "FLEXDX",    name: "FlexDirex Single-Stock ETF",     category: "FlexDirex",                   risk: "AGGRESSIVE",    ytd: 18.7 },
  { id: "VAM-PRO",   name: "Variable Annuity Management",    category: "VA Management",               risk: "CONSERVATIVE",  ytd: 5.2 },
  { id: "FUNDLINK",  name: "FPI FundLink Income",            category: "FPI FundLink",                risk: "CONSERVATIVE",  ytd: 4.6 },
  { id: "PRINCIPLED",name: "Principled Investing Growth",    category: "Principled Investing",        risk: "MODERATE",      ytd: 8.1 },
  { id: "SDBA-GR",   name: "SDBA Growth Sleeve",             category: "Workplace Retirement / SDBA", risk: "MODERATE",      ytd: 7.4 },
  { id: "DAF-BAL",   name: "Donor-Advised Balanced",         category: "Donor-Advised Funds",         risk: "BALANCED",      ytd: 6.9 }
];

// 30 clients (FPI = advisor's book of clients / households)
const CLIENTES = [
  {
    id: "CLI-001", cedula: "123-45-6789", nombre: "Margaret Whitman Hayes",
    email: "mhayes@gmail.com", telefono: "+1-248-555-0142", ciudad: "Bloomfield Hills, MI",
    genero: "F", fecha_nacimiento: "1962-03-14", ocupacion: "Retired Physician",
    ingresos_mensuales: 24000,
    productos: [
      { tipo: "PORTFOLIO", numero: "PF-2022-00891", strategy: "QFC Multi-Strategy Core",
        aum: 1850000, contributions_ytd: 0, ytd_return: 9.4, risk_profile: "MODERATE",
        ontarget_status: "ON_TARGET", target_value: 1820000, fecha_inception: "2022-01-15",
        proxima_review: "2026-06-15", estado: "AL_DIA" },
      { tipo: "IRA", numero: "IRA-2023-04521", strategy: "All-Terrain",
        aum: 420000, ytd_return: 6.5, risk_profile: "BALANCED",
        fecha_apertura: "2023-06-01", estado: "ACTIVA" }
    ]
  },
  {
    id: "CLI-002", cedula: "234-56-7890", nombre: "James Anderson Cole",
    email: "jcole@outlook.com", telefono: "+1-312-555-0238", ciudad: "Chicago, IL",
    genero: "M", fecha_nacimiento: "1968-07-22", ocupacion: "Business Owner",
    ingresos_mensuales: 38000,
    productos: [
      { tipo: "PORTFOLIO", numero: "PF-2024-00234", strategy: "Self-adjusting Trend Following",
        aum: 2400000, ytd_return: 12.1, risk_profile: "AGGRESSIVE",
        ontarget_status: "OUTPERFORMING", target_value: 2250000,
        fecha_inception: "2024-04-10", proxima_review: "2026-04-10",
        estado: "ACTIVO" },
      { tipo: "VA", numero: "VA-2023-00156", strategy: "Variable Annuity Management",
        aum: 680000, ytd_return: 5.2, risk_profile: "CONSERVATIVE",
        carrier: "Jackson National", fecha_inception: "2023-02-01", estado: "ACTIVO" }
    ]
  },
  {
    id: "CLI-003", cedula: "345-67-8901", nombre: "Patricia Sullivan Reed",
    email: "preed@gmail.com", telefono: "+1-415-555-0177", ciudad: "San Francisco, CA",
    genero: "F", fecha_nacimiento: "1971-11-05", ocupacion: "Tech Executive",
    ingresos_mensuales: 65000,
    productos: [
      { tipo: "PORTFOLIO", numero: "PF-2024-00089", strategy: "FlexDirex Single-Stock ETF",
        aum: 3200000, ytd_return: 18.7, risk_profile: "AGGRESSIVE",
        ontarget_status: "OUTPERFORMING", target_value: 2900000,
        fecha_inception: "2024-01-05", estado: "ACTIVO" },
      { tipo: "DAF", numero: "DAF-2024-00445", strategy: "Donor-Advised Balanced",
        aum: 500000, ytd_return: 6.9,
        beneficiarios: ["Reed Family Foundation"],
        fecha_inception: "2024-03-01", estado: "VIGENTE" },
      { tipo: "IRA", numero: "IRA-2022-00891", strategy: "Classic",
        aum: 215000, ytd_return: 7.8, fecha_apertura: "2022-09-15", estado: "ACTIVA" }
    ]
  },
  {
    id: "CLI-004", cedula: "456-78-9012", nombre: "Daniel Patrick Murphy",
    email: "dmurphy@gmail.com", telefono: "+1-617-555-0193", ciudad: "Boston, MA",
    genero: "M", fecha_nacimiento: "1985-02-28", ocupacion: "Software Engineer",
    ingresos_mensuales: 18500,
    productos: [
      { tipo: "PORTFOLIO", numero: "PF-2025-01234", strategy: "Classic",
        aum: 320000, ytd_return: 7.8, risk_profile: "MODERATE",
        ontarget_status: "ON_TARGET", target_value: 315000,
        proxima_review: "2026-04-20", estado: "AL_DIA" },
      { tipo: "IRA", numero: "IRA-2025-09234", strategy: "All-Terrain",
        aum: 78000, ytd_return: 6.5, estado: "ACTIVA" }
    ]
  },
  {
    id: "CLI-005", cedula: "567-89-0123", nombre: "Robert Allen Stevenson",
    email: "rstevenson@hotmail.com", telefono: "+1-214-555-0421", ciudad: "Dallas, TX",
    genero: "M", fecha_nacimiento: "1955-08-12", ocupacion: "Retired Executive",
    ingresos_mensuales: 45000,
    productos: [
      { tipo: "PORTFOLIO", numero: "PF-2025-00567", strategy: "Tactical Gold",
        aum: 1500000, ytd_return: 14.2, risk_profile: "MODERATE",
        ontarget_status: "OUTPERFORMING", target_value: 1380000,
        estado: "ACTIVO" },
      { tipo: "PORTFOLIO", numero: "PF-2026-00011", strategy: "Gold Bullion Strategy",
        aum: 800000, ytd_return: 11.6, risk_profile: "MODERATE",
        ontarget_status: "ON_TARGET", target_value: 790000, estado: "ACTIVO" },
      { tipo: "VA", numero: "VA-2023-00123", strategy: "Variable Annuity Management",
        aum: 950000, ytd_return: 5.2,
        beneficiarios: ["Helen Stevenson", "Robert Stevenson Jr."], estado: "VIGENTE" }
    ]
  },
  {
    id: "CLI-006", cedula: "678-90-1234", nombre: "Laura Margaret Schroeder",
    email: "lschroeder@correo.co", telefono: "+1-305-555-0388", ciudad: "Miami, FL",
    genero: "F", fecha_nacimiento: "1979-05-19", ocupacion: "Attorney",
    ingresos_mensuales: 22000,
    productos: [
      { tipo: "PORTFOLIO", numero: "PF-2024-00456", strategy: "Self-adjusting Trend Following",
        aum: 540000, ytd_return: -2.3, risk_profile: "AGGRESSIVE",
        ontarget_status: "BELOW_TARGET", target_value: 610000,
        proxima_review: "2026-04-01", estado: "EN_MORA", dias_mora: 8 }
    ]
  },
  {
    id: "CLI-007", cedula: "789-01-2345", nombre: "Edward Henry Palmer",
    email: "epalmer@empresa.com", telefono: "+1-704-555-0419", ciudad: "Charlotte, NC",
    genero: "M", fecha_nacimiento: "1960-12-01", ocupacion: "Retired CPA",
    ingresos_mensuales: 14000,
    productos: [
      { tipo: "IRA", numero: "IRA-2020-01234", strategy: "FPI FundLink Income",
        aum: 380000, ytd_return: 4.6, estado: "ACTIVA" },
      { tipo: "VA", numero: "VA-2022-00678", strategy: "Variable Annuity Management",
        aum: 460000, ytd_return: 5.2,
        beneficiarios: ["Martha Palmer"], fecha_inception: "2022-01-01", estado: "VIGENTE" }
    ]
  },
  {
    id: "CLI-008", cedula: "890-12-3456", nombre: "Isabella Maria Romano",
    email: "iromano@gmail.com", telefono: "+1-718-555-0254", ciudad: "Brooklyn, NY",
    genero: "F", fecha_nacimiento: "1998-04-07", ocupacion: "Graduate Student",
    ingresos_mensuales: 4200,
    productos: [
      { tipo: "PORTFOLIO", numero: "PF-2025-02891", strategy: "Classic",
        aum: 32000, ytd_return: 7.8, risk_profile: "MODERATE",
        ontarget_status: "ON_TARGET", target_value: 31500,
        proxima_review: "2026-04-01", estado: "AL_DIA" },
      { tipo: "IRA", numero: "IRA-2025-10011", strategy: "All-Terrain",
        aum: 8500, ytd_return: 6.5, estado: "ACTIVA" }
    ]
  },
  {
    id: "CLI-009", cedula: "901-23-4567", nombre: "Gloria Hope Vargas",
    email: "gvargas@yahoo.com", telefono: "+1-602-555-0337", ciudad: "Phoenix, AZ",
    genero: "F", fecha_nacimiento: "1958-09-23", ocupacion: "Retired Teacher",
    ingresos_mensuales: 7500,
    productos: [
      { tipo: "PORTFOLIO", numero: "PF-2026-00089", strategy: "FPI FundLink Income",
        aum: 540000, ytd_return: 4.6, risk_profile: "CONSERVATIVE",
        ontarget_status: "ON_TARGET", target_value: 535000, estado: "ACTIVO" },
      { tipo: "IRA", numero: "IRA-2018-05671", strategy: "Classic",
        aum: 285000, ytd_return: 7.8, estado: "ACTIVA" }
    ]
  },
  {
    id: "CLI-010", cedula: "012-34-5678", nombre: "Daniel Ethan Giraldo",
    email: "dgiraldo@tech.co", telefono: "+1-206-555-0489", ciudad: "Seattle, WA",
    genero: "M", fecha_nacimiento: "1986-01-16", ocupacion: "Product Manager",
    ingresos_mensuales: 21000,
    productos: [
      { tipo: "PORTFOLIO", numero: "PF-2025-00289", strategy: "Principled Investing Growth",
        aum: 480000, ytd_return: 8.1, risk_profile: "MODERATE",
        ontarget_status: "ON_TARGET", target_value: 470000,
        proxima_review: "2026-04-01", estado: "AL_DIA" },
      { tipo: "PORTFOLIO", numero: "PF-2025-00201", strategy: "FPI FundLink Income",
        aum: 220000, ytd_return: 4.6, risk_profile: "CONSERVATIVE", estado: "ACTIVO" }
    ]
  },
  {
    id: "CLI-011", cedula: "111-22-3333", nombre: "Henry Marshall Brooks",
    email: "hbrooks@gmail.com", telefono: "+1-503-555-0573", ciudad: "Portland, OR",
    genero: "M", fecha_nacimiento: "1972-06-30", ocupacion: "Architect",
    ingresos_mensuales: 24000,
    productos: [
      { tipo: "PORTFOLIO", numero: "PF-2022-00078", strategy: "All-Terrain",
        aum: 1100000, ytd_return: 6.5, risk_profile: "BALANCED",
        ontarget_status: "ON_TARGET", target_value: 1090000,
        proxima_review: "2026-04-01", estado: "AL_DIA" },
      { tipo: "VA", numero: "VA-2022-00340", strategy: "Variable Annuity Management",
        aum: 720000, ytd_return: 5.2,
        beneficiarios: ["Patricia Brooks", "Thomas Brooks"], estado: "VIGENTE" }
    ]
  },
  {
    id: "CLI-012", cedula: "222-33-4444", nombre: "Natalie Anne Morrison",
    email: "nmorrison@hotmail.com", telefono: "+1-303-555-0612", ciudad: "Denver, CO",
    genero: "F", fecha_nacimiento: "1988-10-12", ocupacion: "University Professor",
    ingresos_mensuales: 12500,
    productos: [
      { tipo: "PORTFOLIO", numero: "PF-2024-00145", strategy: "QFC Multi-Strategy Core",
        aum: 285000, ytd_return: 9.4, risk_profile: "MODERATE",
        ontarget_status: "ON_TARGET", target_value: 280000, estado: "ACTIVO" },
      { tipo: "IRA", numero: "IRA-2025-00901", strategy: "Classic",
        aum: 92000, ytd_return: 7.8, estado: "ACTIVO" }
    ]
  },
  {
    id: "CLI-013", cedula: "333-44-5555", nombre: "Peter Anthony Ramirez",
    email: "pramirez@empresa.co", telefono: "+1-512-555-0388", ciudad: "Austin, TX",
    genero: "M", fecha_nacimiento: "1982-04-25", ocupacion: "Civil Engineer",
    ingresos_mensuales: 17500,
    productos: [
      { tipo: "PORTFOLIO", numero: "PF-2023-00234", strategy: "Tactical Gold",
        aum: 410000, ytd_return: 14.2, risk_profile: "MODERATE",
        ontarget_status: "OUTPERFORMING", target_value: 380000,
        proxima_review: "2026-04-01", estado: "AL_DIA" }
    ]
  },
  {
    id: "CLI-014", cedula: "444-55-6666", nombre: "Claudia Patricia Mitchell",
    email: "cmitchell@gmail.com", telefono: "+1-615-555-0712", ciudad: "Nashville, TN",
    genero: "F", fecha_nacimiento: "1975-02-14", ocupacion: "Head Nurse",
    ingresos_mensuales: 9800,
    productos: [
      { tipo: "IRA", numero: "IRA-2019-03456", strategy: "All-Terrain",
        aum: 165000, ytd_return: 6.5, estado: "ACTIVA" },
      { tipo: "VA", numero: "VA-2021-00512", strategy: "Variable Annuity Management",
        aum: 240000, ytd_return: 5.2,
        beneficiarios: ["John Mitchell", "Sara Mitchell"], estado: "VIGENTE" }
    ]
  },
  {
    id: "CLI-015", cedula: "555-66-7777", nombre: "Sebastian Carter Vargas",
    email: "scarter@startupco.com", telefono: "+1-650-555-0834", ciudad: "Palo Alto, CA",
    genero: "M", fecha_nacimiento: "1991-08-03", ocupacion: "Startup Founder",
    ingresos_mensuales: 16000,
    productos: [
      { tipo: "PORTFOLIO", numero: "PF-2025-00789", strategy: "FlexDirex Single-Stock ETF",
        aum: 250000, ytd_return: 18.7, risk_profile: "AGGRESSIVE",
        ontarget_status: "OUTPERFORMING", target_value: 215000,
        proxima_review: "2026-04-15", estado: "AL_DIA" },
      { tipo: "IRA", numero: "IRA-2025-00345", strategy: "FPI FundLink Income",
        aum: 45000, ytd_return: 4.6, estado: "ACTIVO" }
    ]
  },
  {
    id: "CLI-016", cedula: "666-77-8888", nombre: "Alexandra Sophie Vance",
    email: "avance@gmail.com", telefono: "+1-919-555-0945", ciudad: "Raleigh, NC",
    genero: "F", fecha_nacimiento: "1991-12-20", ocupacion: "Pharmacist",
    ingresos_mensuales: 13500,
    productos: [
      { tipo: "PORTFOLIO", numero: "PF-2025-01122", strategy: "Classic",
        aum: 320000, ytd_return: 7.8, risk_profile: "MODERATE",
        ontarget_status: "ON_TARGET", target_value: 315000, estado: "ACTIVO" }
    ]
  },
  {
    id: "CLI-017", cedula: "777-88-9999", nombre: "George Ivan Osborne",
    email: "gosborne@correo.com", telefono: "+1-801-555-0451", ciudad: "Salt Lake City, UT",
    genero: "M", fecha_nacimiento: "1969-05-17", ocupacion: "Veterinarian",
    ingresos_mensuales: 11500,
    productos: [
      { tipo: "PORTFOLIO", numero: "PF-2024-00198", strategy: "Gold Bullion Strategy",
        aum: 290000, ytd_return: 11.6, risk_profile: "MODERATE",
        ontarget_status: "OUTPERFORMING", target_value: 270000,
        proxima_review: "2026-04-01", estado: "AL_DIA" }
    ]
  },
  {
    id: "CLI-018", cedula: "888-99-0000", nombre: "Paola Andrea Quintana",
    email: "pquintana@outlook.com", telefono: "+1-505-555-0723", ciudad: "Albuquerque, NM",
    genero: "F", fecha_nacimiento: "1994-03-08", ocupacion: "Psychologist",
    ingresos_mensuales: 8400,
    productos: [
      { tipo: "PORTFOLIO", numero: "PF-2024-01567", strategy: "All-Terrain",
        aum: 145000, ytd_return: 6.5, risk_profile: "BALANCED",
        ontarget_status: "BELOW_TARGET", target_value: 165000,
        proxima_review: "2026-04-01", estado: "AL_DIA" },
      { tipo: "IRA", numero: "IRA-2024-07891", strategy: "Classic",
        aum: 38000, ytd_return: 7.8, estado: "ACTIVA" }
    ]
  },
  {
    id: "CLI-019", cedula: "999-00-1111", nombre: "Arthur Louis Thompson",
    email: "athompson@yahoo.com", telefono: "+1-843-555-0184", ciudad: "Charleston, SC",
    genero: "M", fecha_nacimiento: "1955-11-28", ocupacion: "Retired Professor",
    ingresos_mensuales: 9500,
    productos: [
      { tipo: "PORTFOLIO", numero: "PF-2025-00789", strategy: "FPI FundLink Income",
        aum: 410000, ytd_return: 4.6, risk_profile: "CONSERVATIVE",
        ontarget_status: "ON_TARGET", target_value: 405000, estado: "ACTIVO" },
      { tipo: "VA", numero: "VA-2020-00891", strategy: "Variable Annuity Management",
        aum: 220000, ytd_return: 5.2,
        beneficiarios: ["Lucy Thompson"], estado: "VIGENTE" }
    ]
  },
  {
    id: "CLI-020", cedula: "121-21-2121", nombre: "Stephanie Reed Berman",
    email: "sberman@empresa.co", telefono: "+1-646-555-0297", ciudad: "New York, NY",
    genero: "F", fecha_nacimiento: "1990-07-11", ocupacion: "Full-Stack Developer",
    ingresos_mensuales: 19500,
    productos: [
      { tipo: "PORTFOLIO", numero: "PF-2025-00412", strategy: "Self-adjusting Trend Following",
        aum: 380000, ytd_return: 12.1, risk_profile: "AGGRESSIVE",
        ontarget_status: "OUTPERFORMING", target_value: 350000, estado: "ACTIVO" },
      { tipo: "IRA", numero: "IRA-2024-01234", strategy: "All-Terrain",
        aum: 95000, ytd_return: 6.5, estado: "ACTIVA" }
    ]
  },
  {
    id: "CLI-021", cedula: "131-31-3131", nombre: "William Andrew Zachary",
    email: "wzachary@correo.com", telefono: "+1-202-555-0539", ciudad: "Washington, DC",
    genero: "M", fecha_nacimiento: "1980-09-04", ocupacion: "CFO",
    ingresos_mensuales: 55000,
    productos: [
      { tipo: "PORTFOLIO", numero: "PF-2025-00456", strategy: "QFC Multi-Strategy Core",
        aum: 2800000, ytd_return: 9.4, risk_profile: "MODERATE",
        ontarget_status: "ON_TARGET", target_value: 2780000, estado: "ACTIVO" },
      { tipo: "PORTFOLIO", numero: "PF-2024-00067", strategy: "Tactical Gold",
        aum: 1200000, ytd_return: 14.2, risk_profile: "MODERATE",
        ontarget_status: "OUTPERFORMING", target_value: 1080000, estado: "ACTIVO" },
      { tipo: "DAF", numero: "DAF-2025-00456", strategy: "Donor-Advised Balanced",
        aum: 850000, ytd_return: 6.9,
        beneficiarios: ["Zachary Family Foundation"], estado: "AL_DIA" }
    ]
  },
  {
    id: "CLI-022", cedula: "141-41-4141", nombre: "Lina Marie Adkins",
    email: "ladkins@gmail.com", telefono: "+1-720-555-0682", ciudad: "Boulder, CO",
    genero: "F", fecha_nacimiento: "1999-01-22", ocupacion: "Digital Marketer",
    ingresos_mensuales: 7200,
    productos: [
      { tipo: "PORTFOLIO", numero: "PF-2025-03456", strategy: "Principled Investing Growth",
        aum: 58000, ytd_return: 8.1, risk_profile: "MODERATE",
        ontarget_status: "ON_TARGET", target_value: 57000,
        proxima_review: "2026-04-20", estado: "AL_DIA" }
    ]
  },
  {
    id: "CLI-023", cedula: "151-51-5151", nombre: "Francis Joseph Calloway",
    email: "fcalloway@empresa.com", telefono: "+1-216-555-0746", ciudad: "Cleveland, OH",
    genero: "M", fecha_nacimiento: "1974-03-19", ocupacion: "Orthodontist",
    ingresos_mensuales: 28000,
    productos: [
      { tipo: "PORTFOLIO", numero: "PF-2026-00234", strategy: "QFC Multi-Strategy Core",
        aum: 1100000, ytd_return: 9.4, risk_profile: "MODERATE",
        ontarget_status: "ON_TARGET", target_value: 1085000, estado: "ACTIVO" },
      { tipo: "VA", numero: "VA-2023-00789", strategy: "Variable Annuity Management",
        aum: 540000, ytd_return: 5.2,
        beneficiarios: ["Sandra Calloway", "Felix Calloway"], estado: "VIGENTE" }
    ]
  },
  {
    id: "CLI-024", cedula: "161-61-6161", nombre: "Caroline Vance Arbuckle",
    email: "carbuckle@hotmail.com", telefono: "+1-404-555-0937", ciudad: "Atlanta, GA",
    genero: "F", fecha_nacimiento: "1987-06-25", ocupacion: "Dietitian",
    ingresos_mensuales: 9200,
    productos: [
      { tipo: "PORTFOLIO", numero: "PF-2024-00987", strategy: "All-Terrain",
        aum: 175000, ytd_return: 6.5, risk_profile: "BALANCED",
        ontarget_status: "ON_TARGET", target_value: 172000,
        proxima_review: "2026-04-01", estado: "AL_DIA" },
      { tipo: "IRA", numero: "IRA-2023-08901", strategy: "Classic",
        aum: 42000, ytd_return: 7.8, estado: "ACTIVA" }
    ]
  },
  {
    id: "CLI-025", cedula: "171-71-7171", nombre: "Alvin Joseph Mendoza",
    email: "amendoza@outlook.com", telefono: "+1-702-555-0428", ciudad: "Las Vegas, NV",
    genero: "M", fecha_nacimiento: "1956-04-02", ocupacion: "Retired Contractor",
    ingresos_mensuales: 8800,
    productos: [
      { tipo: "PORTFOLIO", numero: "PF-2025-01345", strategy: "FPI FundLink Income",
        aum: 620000, ytd_return: 4.6, risk_profile: "CONSERVATIVE",
        ontarget_status: "ON_TARGET", target_value: 615000, estado: "ACTIVO" },
      { tipo: "IRA", numero: "IRA-2015-09012", strategy: "All-Terrain",
        aum: 195000, ytd_return: 6.5, estado: "ACTIVA" }
    ]
  },
  {
    id: "CLI-026", cedula: "181-81-8181", nombre: "Maria Julia Ortiz",
    email: "mortiz@universidad.edu", telefono: "+1-559-555-0612", ciudad: "Fresno, CA",
    genero: "F", fecha_nacimiento: "2000-09-15", ocupacion: "Graduate Student",
    ingresos_mensuales: 3200,
    productos: [
      { tipo: "IRA", numero: "IRA-2026-01023", strategy: "Classic",
        aum: 4500, ytd_return: 7.8, fecha_apertura: "2026-01-20", estado: "ACTIVA" }
    ]
  },
  {
    id: "CLI-027", cedula: "191-91-9191", nombre: "Raphael Anthony Bermudez",
    email: "rbermudez@correo.co", telefono: "+1-561-555-0356", ciudad: "Palm Beach, FL",
    genero: "M", fecha_nacimiento: "1963-07-08", ocupacion: "Hotel Group CEO",
    ingresos_mensuales: 90000,
    productos: [
      { tipo: "PORTFOLIO", numero: "PF-2023-00023", strategy: "QFC Multi-Strategy Core",
        aum: 4800000, ytd_return: 9.4, risk_profile: "MODERATE",
        ontarget_status: "ON_TARGET", target_value: 4750000, estado: "ACTIVO" },
      { tipo: "PORTFOLIO", numero: "PF-2026-00345", strategy: "Tactical Gold",
        aum: 1800000, ytd_return: 14.2, risk_profile: "MODERATE",
        ontarget_status: "OUTPERFORMING", target_value: 1620000, estado: "ACTIVO" },
      { tipo: "DAF", numero: "DAF-2024-00901", strategy: "Donor-Advised Balanced",
        aum: 1200000, ytd_return: 6.9,
        beneficiarios: ["Bermudez Family Trust", "Raphael Jr."], estado: "VIGENTE" }
    ]
  },
  {
    id: "CLI-028", cedula: "212-12-1212", nombre: "Julia Paige Townsend",
    email: "jtownsend@gmail.com", telefono: "+1-865-555-0784", ciudad: "Knoxville, TN",
    genero: "F", fecha_nacimiento: "2001-03-30", ocupacion: "IT Technician",
    ingresos_mensuales: 4800,
    productos: [
      { tipo: "PORTFOLIO", numero: "PF-2025-04012", strategy: "Classic",
        aum: 18000, ytd_return: 7.8, risk_profile: "MODERATE",
        ontarget_status: "ON_TARGET", target_value: 17800,
        proxima_review: "2026-04-10", estado: "AL_DIA" }
    ]
  },
  {
    id: "CLI-029", cedula: "232-32-3232", nombre: "Edward Joseph Parker",
    email: "eparker@empresa.com", telefono: "+1-901-555-0249", ciudad: "Memphis, TN",
    genero: "M", fecha_nacimiento: "1976-01-14", ocupacion: "Operations Director",
    ingresos_mensuales: 32000,
    productos: [
      { tipo: "PORTFOLIO", numero: "PF-2023-00298", strategy: "All-Terrain",
        aum: 920000, ytd_return: 6.5, risk_profile: "BALANCED",
        ontarget_status: "ON_TARGET", target_value: 910000,
        proxima_review: "2026-04-01", estado: "AL_DIA" },
      { tipo: "PORTFOLIO", numero: "PF-2025-00512", strategy: "Self-adjusting Trend Following",
        aum: 540000, ytd_return: 12.1, risk_profile: "AGGRESSIVE",
        ontarget_status: "OUTPERFORMING", target_value: 495000, estado: "ACTIVO" }
    ]
  },
  {
    id: "CLI-030", cedula: "242-42-4242", nombre: "Angela Christine Newman",
    email: "anewman@correo.co", telefono: "+1-208-555-0892", ciudad: "Boise, ID",
    genero: "F", fecha_nacimiento: "1990-05-06", ocupacion: "Business Administrator",
    ingresos_mensuales: 13000,
    productos: [
      { tipo: "PORTFOLIO", numero: "PF-2024-01890", strategy: "Principled Investing Growth",
        aum: 210000, ytd_return: 8.1, risk_profile: "MODERATE",
        ontarget_status: "ON_TARGET", target_value: 208000,
        proxima_review: "2026-04-01", estado: "AL_DIA" },
      { tipo: "VA", numero: "VA-2024-01012", strategy: "Variable Annuity Management",
        aum: 320000, ytd_return: 5.2,
        beneficiarios: ["Mario Newman"], estado: "VIGENTE" }
    ]
  }
];

// Indexes for fast lookups
const porCedula = {};
const porNumeroProducto = {};
CLIENTES.forEach(c => {
  porCedula[c.cedula] = c;
  // Allow lookup by SSN with or without dashes
  porCedula[c.cedula.replace(/-/g,'')] = c;
  c.productos.forEach(p => { porNumeroProducto[p.numero] = { cliente: c, producto: p }; });
});

// ─── ROUTES ───────────────────────────────────────────────────

// GET /api — health check
app.get('/api', (req, res) => {
  res.json({
    api: 'Flexible Plan Investments API',
    version: '1.0',
    status: 'OK',
    clientes: CLIENTES.length,
    productos: CLIENTES.reduce((acc, c) => acc + c.productos.length, 0),
    endpoints: [
      'GET /clientes',
      'GET /clientes/:ssn',
      'GET /productos/:numero',
      'GET /strategies',
      'GET /estadisticas',
      'POST /solicitudes/portfolio',
      'POST /solicitudes/rebalance',
      'POST /pqr'
    ]
  });
});

// GET /clientes — list all
app.get('/clientes', (req, res) => {
  res.json({
    total: CLIENTES.length,
    clientes: CLIENTES.map(c => ({
      id: c.id,
      cedula: c.cedula,
      nombre: c.nombre,
      email: c.email,
      ciudad: c.ciudad,
      ocupacion: c.ocupacion,
      ingresos_mensuales: c.ingresos_mensuales,
      productos_count: c.productos.length,
      tipos_producto: [...new Set(c.productos.map(p => p.tipo))],
      total_aum: c.productos.reduce((a, p) => a + (p.aum || 0), 0),
      tiene_mora: c.productos.some(p => p.estado === 'EN_MORA' || p.ontarget_status === 'BELOW_TARGET')
    }))
  });
});

// GET /clientes/:ssn — full profile
app.get('/clientes/:cedula', (req, res) => {
  const cliente = porCedula[req.params.cedula];
  if (!cliente) {
    return res.status(404).json({
      error: 'Client not found',
      cedula: req.params.cedula,
      mensaje: 'No client exists with that SSN in our database.'
    });
  }
  res.json({
    ...cliente,
    resumen: {
      productos_count: cliente.productos.length,
      tiene_mora: cliente.productos.some(p => p.estado === 'EN_MORA' || p.ontarget_status === 'BELOW_TARGET'),
      tipos: [...new Set(cliente.productos.map(p => p.tipo))],
      total_aum: cliente.productos.reduce((a, p) => a + (p.aum || 0), 0)
    }
  });
});

// GET /productos/:numero — any account by number
app.get('/productos/:numero', (req, res) => {
  const found = porNumeroProducto[req.params.numero];
  if (!found) {
    return res.status(404).json({
      error: 'Account not found',
      numero: req.params.numero
    });
  }
  res.json({
    numero: req.params.numero,
    cliente: {
      nombre: found.cliente.nombre,
      cedula: found.cliente.cedula,
      email: found.cliente.email
    },
    ...found.producto
  });
});

// GET /strategies — list FPI strategy lineup
app.get('/strategies', (req, res) => {
  res.json({ total: STRATEGIES.length, strategies: STRATEGIES });
});

// GET /ontarget — clients with OnTarget status
app.get('/ontarget', (req, res) => {
  const breakdown = { ON_TARGET: 0, OUTPERFORMING: 0, BELOW_TARGET: 0 };
  const flagged = [];
  CLIENTES.forEach(c => {
    c.productos.forEach(p => {
      if (p.ontarget_status) {
        breakdown[p.ontarget_status] = (breakdown[p.ontarget_status] || 0) + 1;
        if (p.ontarget_status === 'BELOW_TARGET') {
          flagged.push({ cliente: c.nombre, ssn: c.cedula, portfolio: p.numero, strategy: p.strategy, aum: p.aum, target: p.target_value });
        }
      }
    });
  });
  res.json({ breakdown, flagged_below_target: flagged });
});

// GET /estadisticas — dashboard
app.get('/estadisticas', (req, res) => {
  const stats = { total_clientes: CLIENTES.length, total_productos: 0, por_tipo: {}, por_ciudad: {}, below_target: 0, total_aum: 0, total_va_aum: 0 };
  CLIENTES.forEach(c => {
    stats.por_ciudad[c.ciudad] = (stats.por_ciudad[c.ciudad] || 0) + 1;
    c.productos.forEach(p => {
      stats.total_productos++;
      stats.por_tipo[p.tipo] = (stats.por_tipo[p.tipo] || 0) + 1;
      if (p.ontarget_status === 'BELOW_TARGET') stats.below_target++;
      stats.total_aum += p.aum || 0;
      if (p.tipo === 'VA') stats.total_va_aum += p.aum || 0;
    });
  });
  res.json(stats);
});

// POST /solicitudes/portfolio — open new managed portfolio
app.post('/solicitudes/portfolio', (req, res) => {
  const radicado = `REQ-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  res.status(201).json({
    numero_radicado: radicado,
    estado: 'IN_REVIEW',
    tiempo_respuesta: '2 business days',
    mensaje: 'Your portfolio onboarding request was received successfully. FPI Operations will follow up at the email on file.',
    documentos_requeridos: ['Signed advisory agreement', 'Risk tolerance questionnaire', 'Account transfer (ACAT) form'],
    datos_recibidos: req.body
  });
});

// POST /solicitudes/rebalance — request strategy rebalance
app.post('/solicitudes/rebalance', (req, res) => {
  const numero = `RBL-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  res.status(201).json({
    numero_rebalance: numero,
    estado: 'SCHEDULED',
    execution_window: 'Next trading day, market open',
    mensaje: 'Rebalance order accepted. You will receive a trade confirmation once orders fill.',
    datos_recibidos: req.body
  });
});

// POST /pqr — service request / complaint
app.post('/pqr', (req, res) => {
  const numero = `SVC-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  res.status(201).json({
    numero_pqr: numero,
    estado: 'RECEIVED',
    fecha_radicacion: new Date().toISOString().split('T')[0],
    fecha_limite_respuesta: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    mensaje: 'Your service request was logged. Per FPI compliance policy, an advisor liaison will respond within 10 business days.',
    datos_recibidos: req.body
  });
});

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.path });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ FPI API running on port ${PORT}`);
    console.log(`   Landing: ${fs.existsSync(path.join(__dirname, 'index.html')) ? '✅ index.html found' : '⚠️  index.html missing — API only'}`);
  });
}

module.exports = app;
