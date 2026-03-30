const express = require('express');
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

// ─── BASE DE DATOS ────────────────────────────────────────────
const CLIENTES = [
  {
    id: "CLI-001", cedula: "1019847231", nombre: "Valentina Ospina Restrepo",
    email: "vospina@gmail.com", telefono: "3101234567", ciudad: "Medellín",
    genero: "F", fecha_nacimiento: "1990-03-14", ocupacion: "Ingeniera de Software",
    ingresos_mensuales: 8500000,
    productos: [
      { tipo: "CREDITO_PERSONAL", numero: "CP-2024-00891", monto_aprobado: 15000000,
        saldo_pendiente: 9800000, cuotas_totales: 36, cuotas_pagadas: 14,
        valor_cuota: 490000, tasa_ea: "DTF+8%", fecha_desembolso: "2024-01-15",
        proxima_cuota: "2026-04-15", estado: "AL_DIA" },
      { tipo: "CUENTA_AHORRO", numero: "CA-2023-04521", saldo_disponible: 2340000,
        tasa_ea: 4.0, fecha_apertura: "2023-06-01", estado: "ACTIVA" }
    ]
  },
  {
    id: "CLI-002", cedula: "1075398214", nombre: "Andrés Felipe Cardona Muñoz",
    email: "acardona@outlook.com", telefono: "3152345678", ciudad: "Bogotá",
    genero: "M", fecha_nacimiento: "1985-07-22", ocupacion: "Gerente Comercial",
    ingresos_mensuales: 12000000,
    productos: [
      { tipo: "CDT", numero: "CDT-2025-00234", monto: 50000000, tasa_anual: 12.5,
        fecha_constitucion: "2025-04-10", fecha_vencimiento: "2026-04-10",
        dias_restantes: 14, rendimiento_estimado: 6250000, estado: "ACTIVO" },
      { tipo: "CREDITO_VEHICULO", numero: "CV-2023-00156", vehiculo: "Toyota Hilux 2023",
        monto_aprobado: 95000000, saldo_pendiente: 71000000, cuotas_totales: 60,
        cuotas_pagadas: 20, valor_cuota: 2100000, tasa_ea: "DTF+5%",
        proxima_cuota: "2026-04-01", estado: "AL_DIA" }
    ]
  },
  {
    id: "CLI-003", cedula: "43892017", nombre: "María Fernanda Ríos Gómez",
    email: "mfrios@empresa.co", telefono: "3183456789", ciudad: "Cali",
    genero: "F", fecha_nacimiento: "1978-11-05", ocupacion: "Médica Especialista",
    ingresos_mensuales: 18000000,
    productos: [
      { tipo: "INVERSION_INTELIGENTE", numero: "INV-2024-00089", monto_invertido: 100000000,
        rentabilidad_ytd: 8.3, valor_actual: 108300000, tipo_fondo: "Renta Fija + Variable",
        fecha_inicio: "2024-01-05", estado: "ACTIVO" },
      { tipo: "SEGURO_VIDA", numero: "SV-2024-00445", cobertura: 200000000,
        prima_mensual: 85000, beneficiarios: ["Carlos Ríos", "Ana Ríos"],
        fecha_inicio: "2024-03-01", estado: "VIGENTE" },
      { tipo: "CUENTA_AHORRO", numero: "CA-2022-00891", saldo_disponible: 8920000,
        tasa_ea: 4.0, fecha_apertura: "2022-09-15", estado: "ACTIVA" }
    ]
  },
  {
    id: "CLI-004", cedula: "1152847392", nombre: "Juan Pablo Herrera Zapata",
    email: "jpherrera@gmail.com", telefono: "3009876543", ciudad: "Medellín",
    genero: "M", fecha_nacimiento: "1995-02-28", ocupacion: "Diseñador UX",
    ingresos_mensuales: 5500000,
    productos: [
      { tipo: "CREDITO_PERSONAL", numero: "CP-2025-01234", monto_aprobado: 8000000,
        saldo_pendiente: 7200000, cuotas_totales: 24, cuotas_pagadas: 3,
        valor_cuota: 390000, tasa_ea: "DTF+8%", proxima_cuota: "2026-04-20", estado: "AL_DIA" },
      { tipo: "CUENTA_AHORRO", numero: "CA-2025-09234", saldo_disponible: 450000,
        tasa_ea: 4.0, fecha_apertura: "2025-01-10", estado: "ACTIVA" }
    ]
  },
  {
    id: "CLI-005", cedula: "71928374", nombre: "Carlos Alberto Londoño Pérez",
    email: "clondono@hotmail.com", telefono: "3214567890", ciudad: "Pereira",
    genero: "M", fecha_nacimiento: "1970-08-12", ocupacion: "Empresario",
    ingresos_mensuales: 25000000,
    productos: [
      { tipo: "CDT", numero: "CDT-2025-00567", monto: 200000000, tasa_anual: 12.5,
        fecha_vencimiento: "2026-09-01", dias_restantes: 157, rendimiento_estimado: 25000000, estado: "ACTIVO" },
      { tipo: "CDT", numero: "CDT-2026-00011", monto: 80000000, tasa_anual: 12.5,
        fecha_vencimiento: "2027-01-15", dias_restantes: 294, rendimiento_estimado: 10000000, estado: "ACTIVO" },
      { tipo: "SEGURO_VIDA", numero: "SV-2023-00123", cobertura: 200000000,
        prima_mensual: 120000, beneficiarios: ["Rosa Pérez", "Camila Londoño"],
        fecha_inicio: "2023-05-01", estado: "VIGENTE" }
    ]
  },
  {
    id: "CLI-006", cedula: "1023948571", nombre: "Luisa Margarita Salcedo Torres",
    email: "lsalcedo@correo.co", telefono: "3167891234", ciudad: "Barranquilla",
    genero: "F", fecha_nacimiento: "1992-05-19", ocupacion: "Abogada",
    ingresos_mensuales: 9000000,
    productos: [
      { tipo: "CREDITO_PERSONAL", numero: "CP-2024-00456", monto_aprobado: 20000000,
        saldo_pendiente: 14500000, cuotas_totales: 36, cuotas_pagadas: 12,
        valor_cuota: 650000, tasa_ea: "DTF+8%", proxima_cuota: "2026-04-01",
        estado: "EN_MORA", dias_mora: 8 }
    ]
  },
  {
    id: "CLI-007", cedula: "79238471", nombre: "Roberto Enrique Palacios Vega",
    email: "rpalacios@empresa.com", telefono: "3018765432", ciudad: "Bucaramanga",
    genero: "M", fecha_nacimiento: "1968-12-01", ocupacion: "Contador Público",
    ingresos_mensuales: 7500000,
    productos: [
      { tipo: "CUENTA_AHORRO", numero: "CA-2020-01234", saldo_disponible: 15670000,
        tasa_ea: 4.0, fecha_apertura: "2020-03-15", estado: "ACTIVA" },
      { tipo: "SEGURO_VIDA", numero: "SV-2022-00678", cobertura: 150000000,
        prima_mensual: 65000, beneficiarios: ["Marta Vega"], fecha_inicio: "2022-01-01", estado: "VIGENTE" }
    ]
  },
  {
    id: "CLI-008", cedula: "1098234567", nombre: "Isabela Montoya Cárdenas",
    email: "imontoya@gmail.com", telefono: "3145678901", ciudad: "Medellín",
    genero: "F", fecha_nacimiento: "1998-04-07", ocupacion: "Estudiante de Posgrado",
    ingresos_mensuales: 2800000,
    productos: [
      { tipo: "CREDITO_PERSONAL", numero: "CP-2025-02891", monto_aprobado: 3000000,
        saldo_pendiente: 2100000, cuotas_totales: 12, cuotas_pagadas: 3,
        valor_cuota: 285000, proxima_cuota: "2026-04-01", estado: "AL_DIA" },
      { tipo: "CUENTA_AHORRO", numero: "CA-2025-10011", saldo_disponible: 125000,
        tasa_ea: 4.0, estado: "ACTIVA" }
    ]
  },
  {
    id: "CLI-009", cedula: "32198475", nombre: "Gloria Esperanza Vargas Ruiz",
    email: "gvargas@yahoo.com", telefono: "3134567890", ciudad: "Manizales",
    genero: "F", fecha_nacimiento: "1965-09-23", ocupacion: "Pensionada",
    ingresos_mensuales: 4500000,
    productos: [
      { tipo: "CDT", numero: "CDT-2026-00089", monto: 30000000, tasa_anual: 12.5,
        dias_restantes: 99, rendimiento_estimado: 1875000, estado: "ACTIVO" },
      { tipo: "CUENTA_AHORRO", numero: "CA-2018-05671", saldo_disponible: 5430000,
        tasa_ea: 4.0, estado: "ACTIVA" }
    ]
  },
  {
    id: "CLI-010", cedula: "1037289456", nombre: "Daniel Alejandro Giraldo Soto",
    email: "dgiraldo@tech.co", telefono: "3108901234", ciudad: "Bogotá",
    genero: "M", fecha_nacimiento: "1993-01-16", ocupacion: "Product Manager",
    ingresos_mensuales: 11000000,
    productos: [
      { tipo: "CREDITO_VEHICULO", numero: "CV-2025-00289", vehiculo: "Mazda CX-5 2024",
        monto_aprobado: 78000000, saldo_pendiente: 70000000, cuotas_totales: 60,
        cuotas_pagadas: 5, valor_cuota: 1680000, proxima_cuota: "2026-04-01", estado: "AL_DIA" },
      { tipo: "INVERSION_INTELIGENTE", numero: "INV-2025-00201", monto_invertido: 20000000,
        rentabilidad_ytd: 5.1, valor_actual: 21020000, tipo_fondo: "Renta Fija", estado: "ACTIVO" }
    ]
  },
  {
    id: "CLI-011", cedula: "55891234", nombre: "Héctor Manuel Suárez Pinto",
    email: "hsuarez@gmail.com", telefono: "3176543210", ciudad: "Cali",
    genero: "M", fecha_nacimiento: "1972-06-30", ocupacion: "Arquitecto",
    ingresos_mensuales: 13000000,
    productos: [
      { tipo: "CREDITO_VEHICULO", numero: "CV-2022-00078", vehiculo: "Ram 1500 2022",
        monto_aprobado: 110000000, saldo_pendiente: 55000000, cuotas_totales: 72,
        cuotas_pagadas: 36, valor_cuota: 2200000, proxima_cuota: "2026-04-01", estado: "AL_DIA" },
      { tipo: "SEGURO_VIDA", numero: "SV-2022-00340", cobertura: 200000000,
        prima_mensual: 95000, beneficiarios: ["Patricia Suárez", "Tomás Suárez"], estado: "VIGENTE" }
    ]
  },
  {
    id: "CLI-012", cedula: "1064823917", nombre: "Natalia Andrea Moreno Bernal",
    email: "namoreno@hotmail.com", telefono: "3029012345", ciudad: "Bogotá",
    genero: "F", fecha_nacimiento: "1988-10-12", ocupacion: "Docente Universitaria",
    ingresos_mensuales: 6800000,
    productos: [
      { tipo: "INVERSION_INTELIGENTE", numero: "INV-2024-00145", monto_invertido: 15000000,
        rentabilidad_ytd: 7.8, valor_actual: 16170000, tipo_fondo: "Renta Variable", estado: "ACTIVO" },
      { tipo: "CDT", numero: "CDT-2025-00901", monto: 10000000, tasa_anual: 12.5,
        dias_restantes: 187, rendimiento_estimado: 1250000, estado: "ACTIVO" }
    ]
  },
  {
    id: "CLI-013", cedula: "1122334455", nombre: "Pedro Antonio Ramírez Castro",
    email: "pramirez@empresa.co", telefono: "3201234567", ciudad: "Medellín",
    genero: "M", fecha_nacimiento: "1982-04-25", ocupacion: "Ingeniero Civil",
    ingresos_mensuales: 9500000,
    productos: [
      { tipo: "CREDITO_PERSONAL", numero: "CP-2023-00234", monto_aprobado: 18000000,
        saldo_pendiente: 4500000, cuotas_totales: 36, cuotas_pagadas: 31,
        valor_cuota: 590000, proxima_cuota: "2026-04-01", estado: "AL_DIA" }
    ]
  },
  {
    id: "CLI-014", cedula: "43219876", nombre: "Claudia Patricia Mejía Acosta",
    email: "cmejia@gmail.com", telefono: "3163456789", ciudad: "Armenia",
    genero: "F", fecha_nacimiento: "1975-02-14", ocupacion: "Enfermera Jefe",
    ingresos_mensuales: 5200000,
    productos: [
      { tipo: "CUENTA_AHORRO", numero: "CA-2019-03456", saldo_disponible: 3280000,
        tasa_ea: 4.0, estado: "ACTIVA" },
      { tipo: "SEGURO_VIDA", numero: "SV-2021-00512", cobertura: 100000000,
        prima_mensual: 45000, beneficiarios: ["Juan Mejía", "Sara Mejía"], estado: "VIGENTE" }
    ]
  },
  {
    id: "CLI-015", cedula: "1044567890", nombre: "Sebastián Castro Vargas",
    email: "scastro@startupco.com", telefono: "3109876543", ciudad: "Bogotá",
    genero: "M", fecha_nacimiento: "1997-08-03", ocupacion: "Emprendedor",
    ingresos_mensuales: 7000000,
    productos: [
      { tipo: "CREDITO_PERSONAL", numero: "CP-2025-00789", monto_aprobado: 10000000,
        saldo_pendiente: 9100000, cuotas_totales: 24, cuotas_pagadas: 2,
        valor_cuota: 495000, proxima_cuota: "2026-04-15", estado: "AL_DIA" },
      { tipo: "INVERSION_INTELIGENTE", numero: "INV-2025-00345", monto_invertido: 5000000,
        rentabilidad_ytd: 4.2, valor_actual: 5210000, tipo_fondo: "Renta Fija", estado: "ACTIVO" }
    ]
  },
  {
    id: "CLI-016", cedula: "1081234567", nombre: "Alejandra Sofía Varón Díaz",
    email: "avaron@gmail.com", telefono: "3187654321", ciudad: "Cali",
    genero: "F", fecha_nacimiento: "1991-12-20", ocupacion: "Química Farmacéutica",
    ingresos_mensuales: 7800000,
    productos: [
      { tipo: "CDT", numero: "CDT-2025-01122", monto: 25000000, tasa_anual: 12.5,
        dias_restantes: 95, rendimiento_estimado: 3125000, estado: "ACTIVO" }
    ]
  },
  {
    id: "CLI-017", cedula: "80234789", nombre: "Jorge Iván Ospina Jaramillo",
    email: "jospina@correo.com", telefono: "3145432198", ciudad: "Pereira",
    genero: "M", fecha_nacimiento: "1969-05-17", ocupacion: "Veterinario",
    ingresos_mensuales: 6200000,
    productos: [
      { tipo: "CREDITO_VEHICULO", numero: "CV-2024-00198", vehiculo: "Renault Duster 2024",
        monto_aprobado: 55000000, saldo_pendiente: 48000000, cuotas_totales: 60,
        cuotas_pagadas: 8, valor_cuota: 1150000, proxima_cuota: "2026-04-01", estado: "AL_DIA" }
    ]
  },
  {
    id: "CLI-018", cedula: "1059234187", nombre: "Paola Andrea Quintero Reyes",
    email: "pquintero@outlook.com", telefono: "3006789012", ciudad: "Ibagué",
    genero: "F", fecha_nacimiento: "1994-03-08", ocupacion: "Psicóloga",
    ingresos_mensuales: 4800000,
    productos: [
      { tipo: "CREDITO_PERSONAL", numero: "CP-2024-01567", monto_aprobado: 6000000,
        saldo_pendiente: 3800000, cuotas_totales: 18, cuotas_pagadas: 8,
        valor_cuota: 390000, proxima_cuota: "2026-04-01", estado: "AL_DIA" },
      { tipo: "CUENTA_AHORRO", numero: "CA-2024-07891", saldo_disponible: 890000,
        tasa_ea: 4.0, estado: "ACTIVA" }
    ]
  },
  {
    id: "CLI-019", cedula: "13428917", nombre: "Armando Luis Trujillo Medina",
    email: "atrujillo@yahoo.com", telefono: "3174561234", ciudad: "Santa Marta",
    genero: "M", fecha_nacimiento: "1960-11-28", ocupacion: "Pensionado",
    ingresos_mensuales: 3800000,
    productos: [
      { tipo: "CDT", numero: "CDT-2025-00789", monto: 15000000, tasa_anual: 12.5,
        dias_restantes: 248, rendimiento_estimado: 1875000, estado: "ACTIVO" },
      { tipo: "SEGURO_VIDA", numero: "SV-2020-00891", cobertura: 80000000,
        prima_mensual: 38000, beneficiarios: ["Lucía Medina"], estado: "VIGENTE" }
    ]
  },
  {
    id: "CLI-020", cedula: "1094823741", nombre: "Stefanía Rueda Bermúdez",
    email: "srueda@empresa.co", telefono: "3123456789", ciudad: "Medellín",
    genero: "F", fecha_nacimiento: "1996-07-11", ocupacion: "Desarrolladora Full Stack",
    ingresos_mensuales: 9200000,
    productos: [
      { tipo: "INVERSION_INTELIGENTE", numero: "INV-2025-00412", monto_invertido: 30000000,
        rentabilidad_ytd: 9.2, valor_actual: 32760000, tipo_fondo: "Renta Variable", estado: "ACTIVO" },
      { tipo: "CUENTA_AHORRO", numero: "CA-2024-01234", saldo_disponible: 4560000,
        tasa_ea: 4.0, estado: "ACTIVA" }
    ]
  },
  {
    id: "CLI-021", cedula: "19234897", nombre: "Guillermo Andrés Zapata Niño",
    email: "gzapata@correo.com", telefono: "3032345678", ciudad: "Bogotá",
    genero: "M", fecha_nacimiento: "1980-09-04", ocupacion: "Gerente Financiero",
    ingresos_mensuales: 22000000,
    productos: [
      { tipo: "CDT", numero: "CDT-2025-00456", monto: 150000000, tasa_anual: 12.5,
        dias_restantes: 65, rendimiento_estimado: 18750000, estado: "ACTIVO" },
      { tipo: "INVERSION_INTELIGENTE", numero: "INV-2024-00067", monto_invertido: 80000000,
        rentabilidad_ytd: 11.4, valor_actual: 89120000, tipo_fondo: "Renta Fija + Variable", estado: "ACTIVO" },
      { tipo: "CREDITO_VEHICULO", numero: "CV-2025-00456", vehiculo: "BMW X3 2025",
        monto_aprobado: 120000000, saldo_pendiente: 108000000, cuotas_totales: 60,
        cuotas_pagadas: 5, valor_cuota: 2800000, proxima_cuota: "2026-04-15", estado: "AL_DIA" }
    ]
  },
  {
    id: "CLI-022", cedula: "1128934576", nombre: "Lina María Agudelo Castañeda",
    email: "lagudelo@gmail.com", telefono: "3161234567", ciudad: "Manizales",
    genero: "F", fecha_nacimiento: "1999-01-22", ocupacion: "Marketing Digital",
    ingresos_mensuales: 4200000,
    productos: [
      { tipo: "CREDITO_PERSONAL", numero: "CP-2025-03456", monto_aprobado: 5000000,
        saldo_pendiente: 4600000, cuotas_totales: 18, cuotas_pagadas: 2,
        valor_cuota: 320000, proxima_cuota: "2026-04-20", estado: "AL_DIA" }
    ]
  },
  {
    id: "CLI-023", cedula: "71892345", nombre: "Francisco Javier Cano Bedoya",
    email: "fjcano@empresa.com", telefono: "3049876543", ciudad: "Medellín",
    genero: "M", fecha_nacimiento: "1974-03-19", ocupacion: "Odontólogo",
    ingresos_mensuales: 15000000,
    productos: [
      { tipo: "CDT", numero: "CDT-2026-00234", monto: 60000000, tasa_anual: 12.5,
        dias_restantes: 310, rendimiento_estimado: 7500000, estado: "ACTIVO" },
      { tipo: "SEGURO_VIDA", numero: "SV-2023-00789", cobertura: 200000000,
        prima_mensual: 110000, beneficiarios: ["Sandra Cano", "Felipe Cano"], estado: "VIGENTE" }
    ]
  },
  {
    id: "CLI-024", cedula: "1112345678", nombre: "Carolina Vélez Arbeláez",
    email: "cvelez@hotmail.com", telefono: "3198765432", ciudad: "Cali",
    genero: "F", fecha_nacimiento: "1987-06-25", ocupacion: "Nutricionista",
    ingresos_mensuales: 5600000,
    productos: [
      { tipo: "CREDITO_PERSONAL", numero: "CP-2024-00987", monto_aprobado: 12000000,
        saldo_pendiente: 8900000, cuotas_totales: 30, cuotas_pagadas: 9,
        valor_cuota: 480000, proxima_cuota: "2026-04-01", estado: "AL_DIA" },
      { tipo: "CUENTA_AHORRO", numero: "CA-2023-08901", saldo_disponible: 1230000,
        tasa_ea: 4.0, estado: "ACTIVA" }
    ]
  },
  {
    id: "CLI-025", cedula: "94123789", nombre: "Álvaro Jesús Mejía Palomino",
    email: "amejia@outlook.com", telefono: "3057891234", ciudad: "Barranquilla",
    genero: "M", fecha_nacimiento: "1958-04-02", ocupacion: "Pensionado",
    ingresos_mensuales: 5100000,
    productos: [
      { tipo: "CDT", numero: "CDT-2025-01345", monto: 40000000, tasa_anual: 12.5,
        dias_restantes: 218, rendimiento_estimado: 5000000, estado: "ACTIVO" },
      { tipo: "CUENTA_AHORRO", numero: "CA-2015-09012", saldo_disponible: 9870000,
        tasa_ea: 4.0, estado: "ACTIVA" }
    ]
  },
  {
    id: "CLI-026", cedula: "1086712349", nombre: "Mariana Juliana Ortiz Salazar",
    email: "mortiz@universidad.edu.co", telefono: "3121234567", ciudad: "Bogotá",
    genero: "F", fecha_nacimiento: "2000-09-15", ocupacion: "Estudiante",
    ingresos_mensuales: 1500000,
    productos: [
      { tipo: "CUENTA_AHORRO", numero: "CA-2026-01023", saldo_disponible: 85000,
        tasa_ea: 4.0, fecha_apertura: "2026-01-20", estado: "ACTIVA" }
    ]
  },
  {
    id: "CLI-027", cedula: "8123456", nombre: "Rafael Antonio Bermúdez Cure",
    email: "rbermudez@correo.co", telefono: "3189012345", ciudad: "Cartagena",
    genero: "M", fecha_nacimiento: "1963-07-08", ocupacion: "Empresario Turístico",
    ingresos_mensuales: 28000000,
    productos: [
      { tipo: "INVERSION_INTELIGENTE", numero: "INV-2023-00023", monto_invertido: 250000000,
        rentabilidad_ytd: 12.1, valor_actual: 280250000, tipo_fondo: "Renta Fija + Variable", estado: "ACTIVO" },
      { tipo: "CDT", numero: "CDT-2026-00345", monto: 100000000, tasa_anual: 12.5,
        dias_restantes: 140, rendimiento_estimado: 6250000, estado: "ACTIVO" },
      { tipo: "SEGURO_VIDA", numero: "SV-2024-00901", cobertura: 200000000,
        prima_mensual: 150000, beneficiarios: ["Ana Cure", "Rafael Jr."], estado: "VIGENTE" }
    ]
  },
  {
    id: "CLI-028", cedula: "1139823471", nombre: "Juliana Paola Torres Mendoza",
    email: "jtorres@gmail.com", telefono: "3001234567", ciudad: "Neiva",
    genero: "F", fecha_nacimiento: "2001-03-30", ocupacion: "Técnica en Sistemas",
    ingresos_mensuales: 2200000,
    productos: [
      { tipo: "CREDITO_PERSONAL", numero: "CP-2025-04012", monto_aprobado: 2000000,
        saldo_pendiente: 1600000, cuotas_totales: 10, cuotas_pagadas: 2,
        valor_cuota: 220000, proxima_cuota: "2026-04-10", estado: "AL_DIA" }
    ]
  },
  {
    id: "CLI-029", cedula: "91234567", nombre: "Eduardo José Parra Villalba",
    email: "eparra@empresa.com", telefono: "3172345678", ciudad: "Bucaramanga",
    genero: "M", fecha_nacimiento: "1976-01-14", ocupacion: "Gerente de Operaciones",
    ingresos_mensuales: 16000000,
    productos: [
      { tipo: "CREDITO_VEHICULO", numero: "CV-2023-00298", vehiculo: "Jeep Compass 2023",
        monto_aprobado: 85000000, saldo_pendiente: 60000000, cuotas_totales: 72,
        cuotas_pagadas: 24, valor_cuota: 1750000, proxima_cuota: "2026-04-01", estado: "AL_DIA" },
      { tipo: "INVERSION_INTELIGENTE", numero: "INV-2025-00512", monto_invertido: 50000000,
        rentabilidad_ytd: 8.9, valor_actual: 54450000, tipo_fondo: "Renta Variable", estado: "ACTIVO" }
    ]
  },
  {
    id: "CLI-030", cedula: "1104123456", nombre: "Ángela Cristina Niño Bermúdez",
    email: "anino@correo.co", telefono: "3053456789", ciudad: "Villavicencio",
    genero: "F", fecha_nacimiento: "1990-05-06", ocupacion: "Administradora de Empresas",
    ingresos_mensuales: 6500000,
    productos: [
      { tipo: "CREDITO_PERSONAL", numero: "CP-2024-01890", monto_aprobado: 10000000,
        saldo_pendiente: 7200000, cuotas_totales: 30, cuotas_pagadas: 10,
        valor_cuota: 395000, proxima_cuota: "2026-04-01", estado: "AL_DIA" },
      { tipo: "SEGURO_VIDA", numero: "SV-2024-01012", cobertura: 120000000,
        prima_mensual: 52000, beneficiarios: ["Mario Niño"], estado: "VIGENTE" }
    ]
  }
];

// Índices para búsqueda rápida
const porCedula = {};
const porNumeroProducto = {};
CLIENTES.forEach(c => {
  porCedula[c.cedula] = c;
  c.productos.forEach(p => { porNumeroProducto[p.numero] = { cliente: c, producto: p }; });
});

// ─── RUTAS ────────────────────────────────────────────────────

// GET / — health check
app.get('/', (req, res) => {
  res.json({
    api: 'FinanzasFácil Colombia API',
    version: '1.0',
    status: 'OK',
    clientes: CLIENTES.length,
    productos: CLIENTES.reduce((acc, c) => acc + c.productos.length, 0),
    endpoints: [
      'GET /clientes',
      'GET /clientes/:cedula',
      'GET /productos/:numero',
      'GET /estadisticas',
      'POST /solicitudes/credito',
      'POST /solicitudes/cdt',
      'POST /pqr'
    ]
  });
});

// GET /clientes — lista todos
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
      tiene_mora: c.productos.some(p => p.estado === 'EN_MORA')
    }))
  });
});

// GET /clientes/:cedula — perfil completo
app.get('/clientes/:cedula', (req, res) => {
  const cliente = porCedula[req.params.cedula];
  if (!cliente) {
    return res.status(404).json({
      error: 'Cliente no encontrado',
      cedula: req.params.cedula,
      mensaje: 'No existe un cliente con esa cédula en nuestra base de datos.'
    });
  }
  res.json({
    ...cliente,
    resumen: {
      productos_count: cliente.productos.length,
      tiene_mora: cliente.productos.some(p => p.estado === 'EN_MORA'),
      tipos: [...new Set(cliente.productos.map(p => p.tipo))]
    }
  });
});

// GET /productos/:numero — cualquier producto por número
app.get('/productos/:numero', (req, res) => {
  const found = porNumeroProducto[req.params.numero];
  if (!found) {
    return res.status(404).json({
      error: 'Producto no encontrado',
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

// GET /estadisticas — dashboard
app.get('/estadisticas', (req, res) => {
  const stats = { total_clientes: CLIENTES.length, total_productos: 0, por_tipo: {}, por_ciudad: {}, creditos_en_mora: 0, volumen_cdts: 0, volumen_inversiones: 0 };
  CLIENTES.forEach(c => {
    stats.por_ciudad[c.ciudad] = (stats.por_ciudad[c.ciudad] || 0) + 1;
    c.productos.forEach(p => {
      stats.total_productos++;
      stats.por_tipo[p.tipo] = (stats.por_tipo[p.tipo] || 0) + 1;
      if (p.estado === 'EN_MORA') stats.creditos_en_mora++;
      if (p.tipo === 'CDT') stats.volumen_cdts += p.monto || 0;
      if (p.tipo === 'INVERSION_INTELIGENTE') stats.volumen_inversiones += p.monto_invertido || 0;
    });
  });
  res.json(stats);
});

// POST /solicitudes/credito
app.post('/solicitudes/credito', (req, res) => {
  const radicado = `SOL-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  res.status(201).json({
    numero_radicado: radicado,
    estado: 'EN_ANALISIS',
    tiempo_respuesta: '24 horas hábiles',
    mensaje: 'Tu solicitud fue recibida exitosamente. Te contactaremos al correo registrado.',
    documentos_requeridos: ['Cédula de ciudadanía', 'Últimos 3 extractos bancarios', 'Carta laboral o RUT vigente'],
    datos_recibidos: req.body
  });
});

// POST /solicitudes/cdt
app.post('/solicitudes/cdt', (req, res) => {
  const numero = `CDT-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  res.status(201).json({
    numero_cdt: numero,
    estado: 'CONSTITUIDO',
    tasa_anual: 12.5,
    mensaje: 'Tu CDT fue constituido exitosamente. Recibirás el certificado en tu correo en 24 horas.',
    datos_recibidos: req.body
  });
});

// POST /pqr
app.post('/pqr', (req, res) => {
  const numero = `PQR-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  res.status(201).json({
    numero_pqr: numero,
    estado: 'RECIBIDA',
    fecha_radicacion: new Date().toISOString().split('T')[0],
    fecha_limite_respuesta: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    mensaje: 'Tu PQR fue radicada exitosamente. Tienes derecho a respuesta en 15 días hábiles según normativa SFC.',
    datos_recibidos: req.body
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado', path: req.path });
});

app.listen(PORT, () => console.log(`✅ FinanzasFácil API corriendo en puerto ${PORT}`));
