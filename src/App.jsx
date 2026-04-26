import { useState, useCallback } from "react";

/* ─── DATA — San Pedro Garza García, Nuevo León ─────────────────────────── */
const DB = {
  "H.U/60/120/20": {
    name: "Col. Del Valle, San Pedro Garza García",
    type: "Habitacional unifamiliar",
    typeClass: "hab",
    specs: [
      { val: "60%", label: "COS — Ocupación del suelo", w: 60 },
      { val: "1.2", label: "CUS — Utilización del suelo", w: 40 },
      { val: "6 m", label: "Restricción frontal mínima", w: 50 },
      { val: "20%", label: "Área verde mínima", w: 40 },
      { val: "2", label: "Cajones por vivienda", w: 50 },
      { val: "3 m", label: "Restricción lateral", w: 30 },
    ],
    permits: [
      "Licencia de construcción (Dirección de Desarrollo Urbano SPGG)",
      "Dictamen de uso de suelo",
      "Factibilidad de servicios (SADM)",
      "Visto bueno de Protección Civil",
      "Aviso de terminación de obra",
    ],
    compliance: [
      { name: "Restricción frontal", need: "6.0 m", has: "6.3 m", note: "Cumple holgadamente con la norma municipal.", status: "green" },
      { name: "Área verde del predio", need: "20%", has: "19%", note: "A 1% del mínimo. Puede argumentarse con jardín en azotea o cajetes.", status: "yellow" },
      { name: "Cajones de estacionamiento", need: "2", has: "2", note: "Cumple exactamente lo requerido.", status: "green" },
      { name: "COS — Ocupación del suelo", need: "60%", has: "57%", note: "Dentro del límite permitido con margen.", status: "green" },
      { name: "Restricción lateral este", need: "3.0 m", has: "2.1 m", note: "No cumple. Debe retroceder la construcción ~90 cm.", status: "red" },
      { name: "Altura máxima (2 niveles)", need: "9.0 m", has: "8.6 m", note: "Dentro del límite para zona H.U.", status: "green" },
    ],
    ai: "El plano cumple la mayoría de los requisitos para zona habitacional unifamiliar en San Pedro. El incumplimiento crítico es la restricción lateral este (2.1 m vs 3.0 m requeridos por el Plan de Desarrollo Urbano de SPGG) — debe corregirse antes de tramitar en la Dirección de Desarrollo Urbano. El área verde al 19% puede defenderse ante la dependencia con vegetación en azotea con sustrato mínimo de 40 cm según el Reglamento de Construcción Municipal.",
  },
  "C.I/80/240/15": {
    name: "Av. Vasconcelos Ote., San Pedro Garza García",
    type: "Comercial intensivo",
    typeClass: "com",
    specs: [
      { val: "80%", label: "COS", w: 80 },
      { val: "3.0", label: "CUS", w: 100 },
      { val: "5 m", label: "Restricción frontal mínima", w: 40 },
      { val: "15%", label: "Área verde mínima", w: 30 },
      { val: "1 c/25m²", label: "Cajones de estacionamiento", w: 60 },
      { val: "0 m", label: "Restricción lateral", w: 0 },
    ],
    permits: [
      "Licencia de construcción comercial (SPGG)",
      "Estudio de impacto vial (Tránsito y Vialidad NL)",
      "Dictamen de imagen urbana",
      "Dictamen de Protección Civil",
      "Factibilidad de servicios SADM",
      "Registro ante IMSS (si hay empleados en obra)",
    ],
    compliance: [
      { name: "COS — Ocupación del suelo", need: "80%", has: "77%", note: "Cumple, hay margen de 3%.", status: "green" },
      { name: "Cajones de estacionamiento", need: "32", has: "25", note: "Déficit de 7 cajones. Puede tramitarse convenio con estacionamiento público vecino en Vasconcelos.", status: "yellow" },
      { name: "Área verde del predio", need: "15%", has: "8%", note: "No cumple. Requiere cubierta verde o jardines perimetrales.", status: "red" },
      { name: "Altura máxima (norma corredor)", need: "24 m", has: "18 m", note: "Bien dentro del límite del corredor Vasconcelos.", status: "green" },
      { name: "Restricción frontal", need: "5.0 m", has: "5.2 m", note: "Cumple. Alineación con banqueta correcta.", status: "green" },
    ],
    ai: "El proyecto comercial sobre Vasconcelos presenta dos observaciones: el déficit de cajones (25 vs 32) puede resolverse con un convenio ante notario con el estacionamiento público de la zona, práctica aceptada por la Dirección de Desarrollo Urbano de San Pedro. El área verde al 8% (vs 15% requerido) es el obstáculo mayor — se recomienda una azotea verde certificada que aporte el porcentaje faltante antes de ingresar el expediente.",
  },
  "H.M/70/210/25": {
    name: "Col. Fuentes del Valle, San Pedro Garza García",
    type: "Habitacional multifamiliar",
    typeClass: "mix",
    specs: [
      { val: "70%", label: "COS", w: 70 },
      { val: "2.1", label: "CUS", w: 70 },
      { val: "6 m", label: "Restricción frontal mínima", w: 50 },
      { val: "25%", label: "Área verde mínima", w: 50 },
      { val: "1.5 c/depto", label: "Cajones por departamento", w: 50 },
      { val: "3 m", label: "Restricción lateral", w: 30 },
    ],
    permits: [
      "Licencia de construcción multifamiliar (SPGG)",
      "Dictamen de uso de suelo",
      "Estudio de impacto urbano (más de 10 unidades)",
      "Factibilidad de servicios SADM",
      "Visto bueno Protección Civil",
      "Memoria de cálculo estructural",
    ],
    compliance: [
      { name: "Restricción frontal", need: "6.0 m", has: "6.1 m", note: "Cumple por 10 cm — verificar tolerancia en revisión de planos.", status: "green" },
      { name: "Área verde del predio", need: "25%", has: "24%", note: "A 1% del mínimo. Jardín interior con doble altura puede contabilizarse.", status: "yellow" },
      { name: "Cajones de estacionamiento", need: "18", has: "18", note: "Exactamente lo requerido para 12 departamentos.", status: "green" },
      { name: "COS", need: "70%", has: "67%", note: "Dentro del límite con margen.", status: "green" },
      { name: "Restricción lateral norte", need: "3.0 m", has: "2.3 m", note: "No cumple. Requiere ajuste de planta arquitectónica.", status: "red" },
    ],
    ai: "El proyecto multifamiliar en Fuentes del Valle está muy cerca del cumplimiento total. La restricción lateral norte (2.3 m vs 3.0 m exigidos por el Plan de Desarrollo Urbano de SPGG) es la única corrección estructural requerida — implica retirar ~70 cm en la fachada norte. El área verde al 24% puede justificarse si el jardín interior se computa bajo los criterios del IMPLAN Monterrey, criterio que el municipio de San Pedro suele aceptar con dictamen técnico.",
  },
  "U.E/50/100/30": {
    name: "Zona Carretera Nacional, San Pedro Garza García",
    type: "Uso especial / Equipamiento",
    typeClass: "ind",
    specs: [
      { val: "50%", label: "COS", w: 50 },
      { val: "1.0", label: "CUS", w: 33 },
      { val: "10 m", label: "Restricción frontal mínima", w: 80 },
      { val: "30%", label: "Área verde mínima", w: 60 },
      { val: "1 c/40m²", label: "Cajones de estacionamiento", w: 40 },
      { val: "5 m", label: "Restricción lateral", w: 40 },
    ],
    permits: [
      "Licencia de construcción uso especial (SPGG)",
      "Manifestación de Impacto Ambiental (SEMARNAT)",
      "Estudio de impacto vial (Carretera Nacional)",
      "Dictamen Protección Civil NL",
      "Factibilidad de servicios SADM",
      "Autorización de acceso (SCT si colinda con federal)",
    ],
    compliance: [
      { name: "Restricción frontal (Carr. Nacional)", need: "10.0 m", has: "10.5 m", note: "Cumple. Alineación correcta frente a vía primaria.", status: "green" },
      { name: "Cajones de estacionamiento", need: "20", has: "12", note: "Déficit de 8 cajones. Zona de equipamiento — no acepta convenios de cajones externos.", status: "red" },
      { name: "Área verde del predio", need: "30%", has: "31%", note: "Cumple con un punto de margen.", status: "green" },
      { name: "Restricción lateral poniente", need: "5.0 m", has: "4.4 m", note: "A 60 cm del mínimo. Puede negociarse con servidumbre ante notario.", status: "yellow" },
      { name: "COS — Ocupación del suelo", need: "50%", has: "63%", note: "Excede el límite permitido en zona de equipamiento. Requiere reducir huella de construcción.", status: "red" },
      { name: "Altura máxima", need: "12.0 m", has: "11.5 m", note: "Dentro del límite permitido.", status: "green" },
    ],
    ai: "El proyecto en zona de equipamiento sobre Carretera Nacional presenta dos incumplimientos que requieren rediseño: el COS de 63% excede el máximo de 50% (la huella construida debe reducirse significativamente) y el déficit de cajones (12 vs 20) no puede resolverse con convenios en esta clasificación. La restricción lateral poniente de 4.4 m puede argumentarse ante la Dirección de Desarrollo Urbano de San Pedro con una servidumbre voluntaria firmada ante notario público.",
  },
};

/* ─── STYLES ────────────────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=Instrument+Sans:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #0E1117;
    --paper: #F5F2EC;
    --paper2: #EDE9E0;
    --paper3: #E2DDD3;
    --accent: #1B4FD8;
    --muted: #7A7570;
    --border: #C8C3B8;
    --g: #1A6B3C; --g-bg: #EBF5EF; --g-bd: #A3D4B5;
    --y: #7A5800; --y-bg: #FEF9E7; --y-bd: #F0C040;
    --r: #A8200D; --r-bg: #FCEEE9; --r-bd: #F5A090;
    --radius: 4px; --radius-lg: 8px;
  }

  body { font-family: 'Instrument Sans', sans-serif; background: var(--paper); color: var(--ink); font-size: 14px; line-height: 1.5; min-height: 100vh; }

  .nav { display: flex; align-items: center; justify-content: space-between; padding: 14px 32px; border-bottom: 1px solid var(--border); background: var(--paper); position: sticky; top: 0; z-index: 100; }
  .logo { font-family: 'DM Serif Display', serif; font-size: 19px; display: flex; align-items: center; gap: 8px; }
  .logo-dot { width: 7px; height: 7px; border-radius: 50%; background: #D4390A; display: inline-block; }
  .nav-tag { font-family: 'DM Mono', monospace; font-size: 10px; background: var(--accent); color: #fff; padding: 2px 7px; border-radius: 2px; letter-spacing: .05em; }

  .step-bar { display: flex; align-items: center; padding: 14px 32px; border-bottom: 1px solid var(--border); background: var(--paper2); gap: 0; }
  .step-item { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--muted); transition: color .2s; }
  .step-item.active { color: var(--ink); font-weight: 600; }
  .step-item.done { color: var(--g); }
  .step-num { width: 22px; height: 22px; border-radius: 50%; border: 1.5px solid var(--border); display: flex; align-items: center; justify-content: center; font-family: 'DM Mono', monospace; font-size: 10px; transition: all .2s; flex-shrink: 0; }
  .step-item.active .step-num { border-color: var(--accent); background: var(--accent); color: #fff; }
  .step-item.done .step-num { border-color: var(--g); background: var(--g); color: #fff; }
  .step-div { flex: 1; height: 1px; background: var(--border); margin: 0 12px; min-width: 20px; }

  .main { max-width: 860px; margin: 0 auto; padding: 36px 32px; }

  .panel { animation: fadein .25s ease; }
  @keyframes fadein { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

  .section-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
  .section-label::before { content: ''; display: block; width: 20px; height: 1px; background: var(--muted); }

  h1.hero { font-family: 'DM Serif Display', serif; font-size: 30px; line-height: 1.15; letter-spacing: -.5px; margin-bottom: 10px; }
  h1.hero em { font-style: italic; color: var(--accent); }
  .hero-sub { font-size: 13px; color: var(--muted); max-width: 500px; line-height: 1.6; margin-bottom: 28px; }

  .input-row { display: flex; gap: 8px; max-width: 480px; }
  .code-input { flex: 1; font-family: 'DM Mono', monospace; font-size: 15px; padding: 11px 14px; border: 1.5px solid var(--border); border-radius: var(--radius); background: var(--paper); color: var(--ink); letter-spacing: .06em; outline: none; transition: border-color .15s; }
  .code-input:focus { border-color: var(--accent); }
  .code-input::placeholder { color: var(--muted); opacity: .5; }

  .btn { font-family: 'Instrument Sans', sans-serif; font-size: 13px; font-weight: 600; padding: 11px 20px; border: none; border-radius: var(--radius); cursor: pointer; transition: all .15s; letter-spacing: .01em; white-space: nowrap; }
  .btn-primary { background: var(--accent); color: #fff; }
  .btn-primary:hover { background: #1540B0; }
  .btn-primary:active { transform: scale(.98); }
  .btn-outline { background: var(--paper); color: var(--ink); border: 1.5px solid var(--border); }
  .btn-outline:hover { border-color: var(--ink); }
  .btn-ghost { background: transparent; color: var(--muted); border: 1.5px solid var(--border); font-size: 12px; padding: 8px 14px; }
  .btn-ghost:hover { color: var(--ink); border-color: var(--ink); }

  .samples { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px; align-items: center; }
  .samples-label { font-size: 11px; color: var(--muted); }
  .sample-btn { font-family: 'DM Mono', monospace; font-size: 11px; padding: 4px 10px; border: 1px solid var(--border); border-radius: var(--radius); background: var(--paper); cursor: pointer; color: var(--muted); transition: all .15s; }
  .sample-btn:hover { color: var(--accent); border-color: var(--accent); }

  .hint { font-size: 11px; color: var(--muted); margin-top: 6px; }
  .hint code { font-family: 'DM Mono', monospace; background: var(--paper3); padding: 1px 5px; border-radius: 2px; }

  .zone-summary { background: var(--paper2); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 14px 20px; margin-bottom: 24px; display: flex; align-items: center; gap: 16px; }
  .zone-code-badge { font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 500; background: var(--paper); border: 1px solid var(--border); padding: 6px 12px; border-radius: var(--radius); color: var(--accent); flex-shrink: 0; }
  .zone-name { font-size: 13px; font-weight: 600; margin-bottom: 3px; }
  .type-tag { display: inline-block; font-family: 'DM Mono', monospace; font-size: 10px; padding: 2px 8px; border-radius: 2px; text-transform: uppercase; }
  .type-tag.hab { background: #E8F0FE; color: #1B4FD8; border: 1px solid #B3C8F5; }
  .type-tag.com { background: #FEF3E8; color: #9A4A00; border: 1px solid #F5D0A0; }
  .type-tag.mix { background: #EBF5EF; color: #1A6B3C; border: 1px solid #A3D4B5; }
  .type-tag.ind { background: #F5ECFE; color: #6B1A9E; border: 1px solid #D4A3F5; }

  .choice-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; max-width: 640px; margin-top: 24px; }
  .choice-card { border: 1.5px solid var(--border); border-radius: var(--radius-lg); padding: 28px 24px; cursor: pointer; transition: all .2s; background: var(--paper); }
  .choice-card:hover { border-color: var(--accent); background: #EEF2FC; transform: translateY(-2px); }
  .choice-icon { font-size: 28px; margin-bottom: 12px; }
  .choice-title { font-family: 'DM Serif Display', serif; font-size: 18px; margin-bottom: 6px; }
  .choice-sub { font-size: 12px; color: var(--muted); line-height: 1.5; }

  .back-btn { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--muted); background: none; border: none; cursor: pointer; padding: 0; transition: color .15s; display: flex; align-items: center; gap: 4px; margin-bottom: 20px; }
  .back-btn:hover { color: var(--ink); }

  .specs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 24px; }
  .spec-card { background: var(--paper); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px 16px; }
  .spec-val { font-family: 'DM Serif Display', serif; font-size: 24px; letter-spacing: -.3px; line-height: 1; margin-bottom: 4px; }
  .spec-lbl { font-size: 11px; color: var(--muted); line-height: 1.4; }
  .spec-bar { height: 3px; border-radius: 2px; background: var(--paper3); margin-top: 8px; overflow: hidden; }
  .spec-fill { height: 100%; border-radius: 2px; background: var(--accent); transition: width .6s ease; }

  .permits-block { border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; background: var(--paper); }
  .permits-header { padding: 11px 16px; border-bottom: 1px solid var(--border); font-size: 12px; font-weight: 600; display: flex; align-items: center; justify-content: space-between; }
  .permit-count { font-family: 'DM Mono', monospace; font-size: 10px; background: var(--accent); color: #fff; padding: 2px 7px; border-radius: 2px; }
  .permit-row { padding: 10px 16px; border-bottom: 1px solid var(--paper3); display: flex; align-items: center; gap: 10px; font-size: 12px; }
  .permit-row:last-child { border-bottom: none; }
  .permit-dot { width: 5px; height: 5px; border-radius: 50%; background: #D4390A; flex-shrink: 0; }

  .drop-zone { border: 1.5px dashed var(--border); border-radius: var(--radius-lg); background: var(--paper2); padding: 40px 28px; display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; cursor: pointer; transition: all .2s; margin-bottom: 16px; max-width: 520px; }
  .drop-zone:hover, .drop-zone.over { border-color: var(--accent); background: #EEF2FC; }
  .drop-zone.loaded { border-color: var(--g); background: var(--g-bg); border-style: solid; }
  .drop-icon { width: 44px; height: 44px; border: 1.5px solid var(--border); border-radius: var(--radius); background: var(--paper); display: flex; align-items: center; justify-content: center; font-size: 20px; }
  .drop-zone h3 { font-size: 14px; font-weight: 600; }
  .drop-zone p { font-size: 12px; color: var(--muted); }
  .file-tags { display: flex; gap: 6px; }
  .file-tag { font-family: 'DM Mono', monospace; font-size: 10px; padding: 2px 6px; border: 1px solid var(--border); border-radius: 2px; color: var(--muted); }

  .summary-bar { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 24px; }
  .sum-card { border-radius: var(--radius); padding: 14px 16px; text-align: center; border: 1.5px solid; }
  .sum-card.green { border-color: var(--g-bd); background: var(--g-bg); }
  .sum-card.yellow { border-color: var(--y-bd); background: var(--y-bg); }
  .sum-card.red { border-color: var(--r-bd); background: var(--r-bg); }
  .sum-n { font-family: 'DM Serif Display', serif; font-size: 28px; line-height: 1; margin-bottom: 2px; }
  .sum-n.green { color: var(--g); }
  .sum-n.yellow { color: var(--y); }
  .sum-n.red { color: var(--r); }
  .sum-lbl { font-size: 11px; color: var(--muted); }

  .compliance-list { display: flex; flex-direction: column; gap: 8px; }
  .comp-row { border-radius: var(--radius-lg); border: 1.5px solid; padding: 14px 18px; display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 14px; transition: transform .15s; }
  .comp-row:hover { transform: translateX(2px); }
  .comp-row.green { border-color: var(--g-bd); background: var(--g-bg); }
  .comp-row.yellow { border-color: var(--y-bd); background: var(--y-bg); }
  .comp-row.red { border-color: var(--r-bd); background: var(--r-bg); }
  .comp-icon { font-size: 16px; width: 24px; text-align: center; }
  .comp-name { font-size: 13px; font-weight: 600; margin-bottom: 2px; }
  .comp-note { font-size: 12px; color: var(--muted); margin-bottom: 4px; }
  .comp-tag { font-family: 'DM Mono', monospace; font-size: 9px; padding: 2px 6px; border-radius: 2px; display: inline-block; }
  .comp-tag.green { background: var(--g-bg); color: var(--g); border: 1px solid var(--g-bd); }
  .comp-tag.yellow { background: var(--y-bg); color: var(--y); border: 1px solid var(--y-bd); }
  .comp-tag.red { background: var(--r-bg); color: var(--r); border: 1px solid var(--r-bd); }
  .comp-values { text-align: right; }
  .comp-has { font-family: 'DM Serif Display', serif; font-size: 18px; line-height: 1; }
  .comp-has.green { color: var(--g); }
  .comp-has.yellow { color: var(--y); }
  .comp-has.red { color: var(--r); }
  .comp-need { font-size: 11px; color: var(--muted); margin-top: 1px; }

  .ai-card { border: 1.5px solid var(--accent); border-radius: var(--radius-lg); padding: 16px 18px; background: linear-gradient(135deg, #EEF2FC, var(--paper2)); margin-top: 20px; }
  .ai-head { font-size: 11px; font-weight: 600; color: var(--accent); display: flex; align-items: center; gap: 6px; margin-bottom: 8px; }
  .ai-pulse { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); animation: pulse 2s ease-in-out infinite; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .4; } }
  .ai-text { font-family: 'DM Serif Display', serif; font-style: italic; font-size: 13px; line-height: 1.6; }

  .action-row { display: flex; gap: 10px; margin-top: 28px; flex-wrap: wrap; }

  .footer-note { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--muted); border-top: 1px solid var(--border); padding: 16px 32px; text-align: center; letter-spacing: .04em; margin-top: 40px; }
`;

/* ─── STEP BAR ──────────────────────────────────────────────────────────── */
const STEPS = ["Código", "Opción", "Resultado"];
const stepMap = { 1: 0, 2: 1, 3: 1, 4: 1, 5: 2 };

function StepBar({ step }) {
  const active = stepMap[step];
  return (
    <div className="step-bar">
      {STEPS.map((s, i) => (
        <>
          <div key={s} className={`step-item ${i === active ? "active" : i < active ? "done" : ""}`}>
            <div className="step-num">{i < active ? "✓" : i + 1}</div>
            {s}
          </div>
          {i < STEPS.length - 1 && <div key={`div-${i}`} className="step-div" />}
        </>
      ))}
    </div>
  );
}

/* ─── ZONE SUMMARY ──────────────────────────────────────────────────────── */
function ZoneSummary({ code }) {
  const d = DB[code];
  if (!d) return null;
  return (
    <div className="zone-summary">
      <span className="zone-code-badge">{code}</span>
      <div>
        <div className="zone-name">{d.name}</div>
        <span className={`type-tag ${d.typeClass}`}>{d.type}</span>
      </div>
    </div>
  );
}

/* ─── STEP 1: Code Entry ────────────────────────────────────────────────── */
function Step1({ onNext }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  const submit = () => {
    if (DB[code.trim()]) { setError(false); onNext(code.trim()); }
    else setError(true);
  };

  return (
    <div className="panel">
      <div className="section-label">Inicio</div>
      <h1 className="hero">Ingresa la <em>clave</em><br />de tu predio.</h1>
      <p className="hero-sub">Consulta la zonificación, restricciones y trámites de cualquier predio en segundos.</p>
      <div className="input-row">
        <input
          className="code-input"
          value={code}
          onChange={e => { setCode(e.target.value); setError(false); }}
          onKeyDown={e => e.key === "Enter" && submit()}
          placeholder="Ej. H3/100/40/20"
          style={error ? { borderColor: "var(--r)" } : {}}
        />
        <button className="btn btn-primary" onClick={submit}>Buscar →</button>
      </div>
      {error && <div className="hint" style={{ color: "var(--r)", marginTop: 6 }}>Clave no encontrada. Prueba uno de los ejemplos.</div>}
      {!error && <div className="hint">Clave del <code>plan parcial</code> o <code>DENUE</code> de tu municipio</div>}
      <div className="samples">
        <span className="samples-label">Ejemplos:</span>
        {Object.keys(DB).map(k => (
          <button key={k} className="sample-btn" onClick={() => { setCode(k); setError(false); }}>{k}</button>
        ))}
      </div>
    </div>
  );
}

/* ─── STEP 2: Choice ────────────────────────────────────────────────────── */
function Step2({ code, onBack, onInfo, onUpload }) {
  return (
    <div className="panel">
      <button className="back-btn" onClick={onBack}>← Cambiar clave</button>
      <ZoneSummary code={code} />
      <div className="section-label">¿Qué deseas hacer?</div>
      <h1 className="hero" style={{ fontSize: 24, marginBottom: 8 }}>Elige cómo continuar</h1>
      <p className="hero-sub" style={{ marginBottom: 0 }}>Consulta los requisitos del predio, o sube tu plano para analizarlo automáticamente.</p>
      <div className="choice-grid">
        <div className="choice-card" onClick={onInfo}>
          <div className="choice-icon">📋</div>
          <div className="choice-title">Ver requisitos</div>
          <div className="choice-sub">Consulta restricciones de construcción, coeficientes y trámites necesarios para esta zona.</div>
        </div>
        <div className="choice-card" onClick={onUpload}>
          <div className="choice-icon">📐</div>
          <div className="choice-title">Analizar plano</div>
          <div className="choice-sub">Sube tu plano arquitectónico y la IA verificará qué requisitos cumple, cuáles están en riesgo y cuáles faltan.</div>
        </div>
      </div>
    </div>
  );
}

/* ─── STEP 3: Info View ─────────────────────────────────────────────────── */
function Step3({ code, onBack, onUpload }) {
  const d = DB[code];
  return (
    <div className="panel">
      <button className="back-btn" onClick={onBack}>← Regresar</button>
      <ZoneSummary code={code} />
      <div className="section-label">Restricciones de construcción</div>
      <div className="specs-grid">
        {d.specs.map((s, i) => (
          <div key={i} className="spec-card">
            <div className="spec-val">{s.val}</div>
            <div className="spec-lbl">{s.label}</div>
            <div className="spec-bar"><div className="spec-fill" style={{ width: `${s.w}%` }} /></div>
          </div>
        ))}
      </div>
      <div className="section-label">Trámites y permisos requeridos</div>
      <div className="permits-block">
        <div className="permits-header">
          Trámites requeridos
          <span className="permit-count">{d.permits.length} trámites</span>
        </div>
        {d.permits.map((p, i) => (
          <div key={i} className="permit-row">
            <div className="permit-dot" />
            {p}
          </div>
        ))}
      </div>
      <div className="action-row">
        <button className="btn btn-primary" onClick={onUpload}>Analizar mi plano →</button>
        <button className="btn btn-outline" onClick={onBack}>Regresar</button>
      </div>
    </div>
  );
}

/* ─── STEP 4: Upload ────────────────────────────────────────────────────── */
function Step4({ code, onBack, onAnalyze }) {
  const [loaded, setLoaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setLoaded(true);
  }, []);

  const analyze = () => {
    setAnalyzing(true);
    setTimeout(() => onAnalyze(), 900);
  };

  return (
    <div className="panel">
      <button className="back-btn" onClick={onBack}>← Regresar</button>
      <ZoneSummary code={code} />
      <div className="section-label">Análisis de plano</div>
      <h1 className="hero" style={{ fontSize: 24, marginBottom: 8 }}>Sube tu <em>plano</em></h1>
      <p className="hero-sub">La IA verificará cada requisito y te dirá qué cumples, qué casi cumples y qué necesitas corregir.</p>
      <div
        className={`drop-zone${loaded ? " loaded" : ""}`}
        onClick={() => setLoaded(true)}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
      >
        <div className="drop-icon">{loaded ? "✅" : "📂"}</div>
        <h3>{loaded ? "plano_proyecto.pdf cargado" : "Arrastra tu plano aquí"}</h3>
        <p>{loaded ? "Archivo listo para analizar" : "o haz clic para seleccionar un archivo"}</p>
        {!loaded && (
          <div className="file-tags">
            {["PDF", "PNG", "JPG", "DWG"].map(t => <span key={t} className="file-tag">{t}</span>)}
          </div>
        )}
      </div>
      {loaded && (
        <button className="btn btn-primary" onClick={analyze} disabled={analyzing} style={{ width: "100%", maxWidth: 520 }}>
          {analyzing ? "Analizando…" : "Analizar plano con IA →"}
        </button>
      )}
      <button className="btn btn-ghost" onClick={analyze} disabled={analyzing} style={{ marginTop: 8, display: "block" }}>
        Continuar con demo sin archivo →
      </button>
    </div>
  );
}

/* ─── STEP 5: Compliance Results ────────────────────────────────────────── */
const STATUS_ICON = { green: "✅", yellow: "⚠️", red: "❌" };
const STATUS_LABEL = { green: "CUMPLE", yellow: "EN RIESGO", red: "NO CUMPLE" };

function Step5({ code, onBack, onReset, onInfo }) {
  const d = DB[code];
  const counts = d.compliance.reduce((acc, c) => { acc[c.status]++; return acc; }, { green: 0, yellow: 0, red: 0 });

  return (
    <div className="panel">
      <button className="back-btn" onClick={onBack}>← Subir otro plano</button>
      <ZoneSummary code={code} />
      <div className="section-label">Resultado del análisis</div>

      <div className="summary-bar">
        {[["green", "Cumple ✓"], ["yellow", "En riesgo ≈"], ["red", "No cumple ✗"]].map(([s, label]) => (
          <div key={s} className={`sum-card ${s}`}>
            <div className={`sum-n ${s}`}>{counts[s]}</div>
            <div className="sum-lbl">{label}</div>
          </div>
        ))}
      </div>

      <div className="compliance-list">
        {d.compliance.map((item, i) => (
          <div key={i} className={`comp-row ${item.status}`}>
            <div className="comp-icon">{STATUS_ICON[item.status]}</div>
            <div>
              <div className="comp-name">{item.name}</div>
              <div className="comp-note">{item.note}</div>
              <span className={`comp-tag ${item.status}`}>{STATUS_LABEL[item.status]}</span>
            </div>
            <div className="comp-values">
              <div className={`comp-has ${item.status}`}>{item.has}</div>
              <div className="comp-need">req. {item.need}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="ai-card">
        <div className="ai-head">
          <div className="ai-pulse" />
          Resumen de IA
        </div>
        <p className="ai-text">"{d.ai}"</p>
      </div>

      <div className="action-row">
        <button className="btn btn-primary" onClick={onReset}>Nueva consulta</button>
        <button className="btn btn-outline" onClick={onInfo}>Ver todos los requisitos</button>
      </div>
    </div>
  );
}

/* ─── ROOT APP ──────────────────────────────────────────────────────────── */
export default function App() {
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");

  const go = (n) => { setStep(n); window.scrollTo(0, 0); };

  return (
    <>
      <style>{css}</style>
      <nav className="nav">
        <div className="logo">
          <span className="logo-dot" />
          ZonaClara
          <span className="nav-tag">PROTOTIPO</span>
        </div>
      </nav>

      <StepBar step={step} />

      <div className="main">
        {step === 1 && <Step1 onNext={c => { setCode(c); go(2); }} />}
        {step === 2 && <Step2 code={code} onBack={() => go(1)} onInfo={() => go(3)} onUpload={() => go(4)} />}
        {step === 3 && <Step3 code={code} onBack={() => go(2)} onUpload={() => go(4)} />}
        {step === 4 && <Step4 code={code} onBack={() => go(2)} onAnalyze={() => go(5)} />}
        {step === 5 && <Step5 code={code} onBack={() => go(4)} onReset={() => { setCode(""); go(1); }} onInfo={() => go(3)} />}
      </div>

      <div className="footer-note">DATOS BASADOS EN PLANES PARCIALES MUNICIPALES · VERSIÓN PROTOTIPO</div>
    </>
  );
}
