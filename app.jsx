// ═══════════════════════════════════════════════════════════════════════════
//  NACIONAL AUTOTRANSPORTE — ERP TMS v4
//  + Cajas detallado (patio, permisionarios, perdidas, siniestro)
//  + Utilidad real por viaje y por unidad de negocio NACIONALES
//  + Semáforos y alertas de entrega
//  + Tracker lineal de unidades (timeline horizontal)
//  + Sugerencia de siguiente ruta por circuito
//  + Google Sheets sync
// ═══════════════════════════════════════════════════════════════════════════

const { useState, useEffect, useRef, useCallback } = React;

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const SHEETS_URL = window.SHEETS_URL || "PEGA_TU_URL_AQUI";
const USAR_SHEETS = SHEETS_URL !== "PEGA_TU_URL_AQUI";
const STORAGE_KEY = "nal_erp_v4";

// ─── DATOS SEMILLA ────────────────────────────────────────────────────────────
const TRACTOS_SEED = [
  { unidad:"018-ABC", operador:"VICTOR MANUEL ARAMBULA OLGUIN", coordinador:"JULIO HERNANDEZ", estatus:"Activo", circuito:"Remolacha", ubicacion:"Reynosa" },
  { unidad:"020-ABC", operador:"JESUS GUILLERMO TORRES OCHOA", coordinador:"JULIO HERNANDEZ", estatus:"Activo", circuito:"Adient", ubicacion:"Arteaga" },
  { unidad:"021-ABC", operador:"MTTO", coordinador:"JUAN JOSE TELLO", estatus:"SG - Siniestro", circuito:"Pordefinir", ubicacion:"Taller" },
  { unidad:"023-ABC", operador:"PEDRO ROSALINO RUBIO", coordinador:"CRISTIAN ZUÑIGA", estatus:"Activo", circuito:"Remolacha", ubicacion:"Reynosa" },
  { unidad:"046-ABC", operador:"GILBERTO GUTIERREZ GUTIERREZ", coordinador:"JULIO HERNANDEZ", estatus:"Activo", circuito:"Carrier", ubicacion:"Monterrey" },
  { unidad:"060-ABC", operador:"VACANTE", coordinador:"CRISTIAN ZUÑIGA", estatus:"Sin Operador", circuito:"-", ubicacion:"Patio" },
  { unidad:"084-ABC", operador:"ROBERTO MARTINEZ LEDEZMA", coordinador:"JULIO HERNANDEZ", estatus:"Activo", circuito:"Remolacha", ubicacion:"Reynosa" },
  { unidad:"105-ABC", operador:"FEBRONIO FERNANDEZ RODRIGUEZ", coordinador:"JUAN JOSE TELLO", estatus:"VTA - Facturando", circuito:"Reynosa - Bajio", ubicacion:"En ruta" },
  { unidad:"151-ABC", operador:"JORGE DOMINGUEZ RAMIREZ", coordinador:"JUAN JOSE TELLO", estatus:"VTA - Facturando", circuito:"Reynosa - Bajio", ubicacion:"En ruta" },
  { unidad:"162-ABC", operador:"ALEJANDRO GUADALUPE TORRES PEREZ", coordinador:"CRISTIAN ZUÑIGA", estatus:"Activo", circuito:"DX", ubicacion:"Laredo TX" },
  { unidad:"164-ABC", operador:"MIGUEL ANGEL GUERRERO MORENO", coordinador:"JUAN JOSE TELLO", estatus:"DCO - Disponible", circuito:"Reynosa - Bajio", ubicacion:"Reynosa" },
  { unidad:"173-ABC", operador:"JOSE MANUEL LILA HERNANDEZ", coordinador:"JUAN JOSE TELLO", estatus:"VTA - Facturando", circuito:"Reynosa - Bajio", ubicacion:"En ruta" },
  { unidad:"310-ABC", operador:"ALBERTO MARQUEZ LIMON", coordinador:"JUAN JOSE TELLO", estatus:"VTA - Facturando", circuito:"Reynosa - Bajio", ubicacion:"En ruta" },
  { unidad:"329-ABC", operador:"RAFAEL MORENO BRAVO", coordinador:"JUAN JOSE TELLO", estatus:"VTA - Facturando", circuito:"Reynosa - Bajio", ubicacion:"En ruta" },
  { unidad:"351-ABC", operador:"ALEXANDER TORRES PEÑALOZA", coordinador:"CRISTIAN ZUÑIGA", estatus:"Activo", circuito:"Mty-Bajio", ubicacion:"Monterrey" },
  { unidad:"352-ABC", operador:"NOE ESAU MARTINEZ IBARRA", coordinador:"JULIO HERNANDEZ", estatus:"Activo", circuito:"Remolacha", ubicacion:"Reynosa" },
  { unidad:"437-ABC", operador:"GERMAN TREVIÑO BADILLO", coordinador:"JUAN JOSE TELLO", estatus:"VTA - Facturando", circuito:"Reynosa - Bajio", ubicacion:"En ruta" },
  { unidad:"441-ABC", operador:"SANTOS SANCHEZ RANGEL", coordinador:"CRISTIAN ZUÑIGA", estatus:"Activo", circuito:"Remolacha", ubicacion:"Reynosa" },
  { unidad:"447-ABC", operador:"LUIS MIGUEL VARGAS ZAMORANO", coordinador:"CRISTIAN ZUÑIGA", estatus:"Activo", circuito:"Remolacha", ubicacion:"Reynosa" },
  { unidad:"462-ABC", operador:"ALVARO GALICIA CASTRO", coordinador:"JUAN JOSE TELLO", estatus:"VTA - Facturando", circuito:"Reynosa - Bajio", ubicacion:"En ruta" },
];

const CAJAS_SEED = [
  { caja:"1003-ABC", tipo:"Seca", coordinador:"CRISTIAN ZUÑIGA", ciudad:"JUAREZ, CHIH", patio:"Juárez", ubicEsp:"Patio", estatus:"Dañada", cliente:"PENSKE LOGISTICA", comentarios:"VACIA EN PATIO DAÑADA", permisionario:"-", fechaEntregaProg:"", fechaEntregaReal:"" },
  { caja:"1008-ABC", tipo:"Seca", coordinador:"CRISTIAN ZUÑIGA", ciudad:"NUEVO LAREDO, TAMPS", patio:"-", ubicEsp:"Patio", estatus:"Cargada", cliente:"TRAMUC TRANSPORT LLC", comentarios:"CARGADA CON VIAJE RESAGADO", permisionario:"-", fechaEntregaProg:"2026-04-08", fechaEntregaReal:"" },
  { caja:"1019-ABC", tipo:"Seca", coordinador:"CRISTIAN ZUÑIGA", ciudad:"LAREDO, TX", patio:"-", ubicEsp:"Cliente", estatus:"Cargada", cliente:"GREATWAY TRANSPORTATION INC", comentarios:"CARGADA CON CLIENTE", permisionario:"-", fechaEntregaProg:"2026-04-07", fechaEntregaReal:"" },
  { caja:"1020-ABC", tipo:"Seca", coordinador:"CRISTIAN ZUÑIGA", ciudad:"REYNOSA, TAMPS", patio:"Reynosa", ubicEsp:"Patio", estatus:"En Patio", cliente:"-", comentarios:"VACIA EN PATIO", permisionario:"-", fechaEntregaProg:"", fechaEntregaReal:"" },
  { caja:"1037-ABC", tipo:"Seca", coordinador:"CRISTIAN ZUÑIGA", ciudad:"NUEVO LAREDO, TAMPS", patio:"-", ubicEsp:"Patio", estatus:"Cargada", cliente:"HL FREIGHT INC", comentarios:"CARGADA EN PATIO", permisionario:"-", fechaEntregaProg:"2026-04-09", fechaEntregaReal:"" },
  { caja:"1068-ABC", tipo:"Seca", coordinador:"CRISTIAN ZUÑIGA", ciudad:"JUAREZ, CHIH", patio:"Juárez", ubicEsp:"Patio", estatus:"Dañada", cliente:"-", comentarios:"DAÑADA EN PATIO", permisionario:"-", fechaEntregaProg:"", fechaEntregaReal:"" },
  { caja:"1072-ABC", tipo:"Seca", coordinador:"JUAN JOSE TELLO", ciudad:"QUERETARO, QRO", patio:"-", ubicEsp:"Cliente", estatus:"Cargada", cliente:"PENSKE CORE", comentarios:"CARGADA CON CLIENTE", permisionario:"-", fechaEntregaProg:"2026-04-08", fechaEntregaReal:"" },
  { caja:"1080-ABC", tipo:"Seca", coordinador:"JUAN JOSE TELLO", ciudad:"REYNOSA, TAMPS", patio:"Reynosa", ubicEsp:"Patio", estatus:"Disponible", cliente:"-", comentarios:"DISPONIBLE EN PATIO", permisionario:"-", fechaEntregaProg:"", fechaEntregaReal:"" },
  { caja:"1095-ABC", tipo:"Seca", coordinador:"JUAN JOSE TELLO", ciudad:"TRANSITO", patio:"-", ubicEsp:"En tránsito", estatus:"En Tránsito", cliente:"TRAMUC AUTOLIV", comentarios:"EN TRANSITO QUERETARO", permisionario:"-", fechaEntregaProg:"2026-04-10", fechaEntregaReal:"" },
  { caja:"1115-ABC", tipo:"Seca", coordinador:"JULIO HERNANDEZ", ciudad:"JUAREZ, CHIH", patio:"Juárez", ubicEsp:"Patio", estatus:"Dañada", cliente:"-", comentarios:"DAÑADA", permisionario:"-", fechaEntregaProg:"", fechaEntregaReal:"" },
  { caja:"1120-ABC", tipo:"Seca", coordinador:"JULIO HERNANDEZ", ciudad:"LAREDO TEXAS", patio:"-", ubicEsp:"Cliente", estatus:"Cargada", cliente:"GREATWAY", comentarios:"CARGADA", permisionario:"-", fechaEntregaProg:"2026-04-08", fechaEntregaReal:"" },
  { caja:"TM17213", tipo:"Seca", coordinador:"JUAN JOSE TELLO", ciudad:"QUERETARO", patio:"-", ubicEsp:"Cliente", estatus:"Cargada", cliente:"TRAMUC AUTOLIV", comentarios:"VIAJE REALIZADO", permisionario:"-", fechaEntregaProg:"2026-04-07", fechaEntregaReal:"" },
  { caja:"LH480", tipo:"Seca", coordinador:"JUAN JOSE TELLO", ciudad:"REYNOSA, TAMPS", patio:"Reynosa", ubicEsp:"Patio", estatus:"Revisar", cliente:"-", comentarios:"PENDIENTE REVISAR", permisionario:"-", fechaEntregaProg:"", fechaEntregaReal:"" },
  { caja:"T0719", tipo:"Seca", coordinador:"JUAN JOSE TELLO", ciudad:"REYNOSA, TAMPS", patio:"Reynosa", ubicEsp:"Patio", estatus:"Revisar", cliente:"-", comentarios:"INCIDENCIA ACTIVA", permisionario:"-", fechaEntregaProg:"", fechaEntregaReal:"" },
  { caja:"PERM-001", tipo:"Seca", coordinador:"CRISTIAN ZUÑIGA", ciudad:"MONTERREY", patio:"-", ubicEsp:"Permisionario", estatus:"Permisionario", cliente:"CARRIER", comentarios:"Con permisionario activo", permisionario:"TRANSPORTES GARCIA", fechaEntregaProg:"2026-04-12", fechaEntregaReal:"" },
];

const VIAJES_SEED = [
  { id:"V-001", semana:10, fecha:"2026-03-02", coordinador:"JUAN JOSE TELLO", unidad:"151-ABC", caja:"1299", cliente:"Tramuc Aguascalientes", circuito:"Reynosa - Bajio", unidadNegocio:"NACIONALES", estatus:"Realizado", ventaEst:28000, ventaReal:28000, costoOp:4500, diesel:3200, casetas:800, costoMtto:0, kmRecorridos:834, litrosDiesel:267, fechaEntregaProg:"2026-03-04", fechaEntregaReal:"2026-03-04", entregado:true },
  { id:"V-002", semana:10, fecha:"2026-03-02", coordinador:"JUAN JOSE TELLO", unidad:"437-ABC", caja:"TM17213", cliente:"Tramuc Autoliv Queretaro", circuito:"Reynosa - Bajio", unidadNegocio:"NACIONALES", estatus:"Realizado", ventaEst:26000, ventaReal:26000, costoOp:4500, diesel:3200, casetas:800, costoMtto:0, kmRecorridos:850, litrosDiesel:270, fechaEntregaProg:"2026-03-04", fechaEntregaReal:"2026-03-05", entregado:true },
  { id:"V-003", semana:10, fecha:"2026-03-02", coordinador:"JUAN JOSE TELLO", unidad:"164-ABC", caja:"536209", cliente:"Tramuc Autoliv Queretaro", circuito:"Reynosa - Bajio", unidadNegocio:"NACIONALES", estatus:"Realizado", ventaEst:26000, ventaReal:26000, costoOp:4500, diesel:3200, casetas:800, costoMtto:0, kmRecorridos:850, litrosDiesel:270, fechaEntregaProg:"2026-03-04", fechaEntregaReal:"2026-03-04", entregado:true },
  { id:"V-004", semana:15, fecha:"2026-04-07", coordinador:"JUAN JOSE TELLO", unidad:"173-ABC", caja:"1162", cliente:"PENSKE-CORE", circuito:"Reynosa - Bajio", unidadNegocio:"NACIONALES", estatus:"En Ruta", ventaEst:29000, ventaReal:null, costoOp:4500, diesel:3200, casetas:800, costoMtto:0, kmRecorridos:0, litrosDiesel:0, fechaEntregaProg:"2026-04-09", fechaEntregaReal:"", entregado:false },
  { id:"V-005", semana:15, fecha:"2026-04-07", coordinador:"JUAN JOSE TELLO", unidad:"310-ABC", caja:"1240", cliente:"PENSKE-CORE", circuito:"Reynosa - Bajio", unidadNegocio:"NACIONALES", estatus:"En Ruta", ventaEst:29000, ventaReal:null, costoOp:4500, diesel:3200, casetas:800, costoMtto:0, kmRecorridos:0, litrosDiesel:0, fechaEntregaProg:"2026-04-09", fechaEntregaReal:"", entregado:false },
  { id:"V-006", semana:15, fecha:"2026-04-08", coordinador:"CRISTIAN ZUÑIGA", unidad:"162-ABC", caja:"1019-ABC", cliente:"GREATWAY", circuito:"DX", unidadNegocio:"NACIONALES", estatus:"Programado", ventaEst:32000, ventaReal:null, costoOp:4500, diesel:3800, casetas:1200, costoMtto:0, kmRecorridos:0, litrosDiesel:0, fechaEntregaProg:"2026-04-10", fechaEntregaReal:"", entregado:false },
];

// ─── CIRCUITOS — PARADAS Y SIGUIENTE RUTA SUGERIDA ───────────────────────────
const CIRCUITOS_CONFIG = {
  "Reynosa - Bajio": {
    paradas: ["Reynosa","Monterrey","Saltillo","San Luis Potosí","Aguascalientes","Querétaro","Bajío"],
    siguiente: "Regreso Reynosa o Adient Saltillo",
    tiempoEst: "18-22 hrs",
    color: "#3b82f6"
  },
  "Remolacha": {
    paradas: ["Reynosa","Pharr TX","McAllen TX","Harlingen TX"],
    siguiente: "Reynosa patio o Carrier Monterrey",
    tiempoEst: "4-6 hrs",
    color: "#10b981"
  },
  "DX": {
    paradas: ["Nuevo Laredo","Laredo TX","Dallas TX"],
    siguiente: "Regreso Nuevo Laredo o Mty-Bajio",
    tiempoEst: "8-10 hrs",
    color: "#f59e0b"
  },
  "Adient": {
    paradas: ["Reynosa","Saltillo","Arteaga"],
    siguiente: "Remolacha o Reynosa-Bajio",
    tiempoEst: "6-8 hrs",
    color: "#a855f7"
  },
  "Mty-Bajio": {
    paradas: ["Monterrey","Saltillo","San Luis Potosí","Bajío"],
    siguiente: "DX Nuevo Laredo o Remolacha",
    tiempoEst: "8-10 hrs",
    color: "#6366f1"
  },
  "Nld-Bajio": {
    paradas: ["Nuevo Laredo","Monterrey","Saltillo","Bajío"],
    siguiente: "DX o Reynosa-Bajio",
    tiempoEst: "10-12 hrs",
    color: "#ef4444"
  },
  "Carrier": {
    paradas: ["Monterrey","Nuevo León"],
    siguiente: "Mty-Bajio o Remolacha",
    tiempoEst: "2-3 hrs",
    color: "#f97316"
  },
};

// ─── STORAGE ──────────────────────────────────────────────────────────────────
const loadLocal = () => { try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch { return null; } };
const saveLocal = (d) => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch {} };
const initData = () => {
  const s = loadLocal();
  if (s) return s;
  const d = { tractos: TRACTOS_SEED, cajas: CAJAS_SEED, viajes: VIAJES_SEED, lastUpdate: new Date().toISOString() };
  saveLocal(d); return d;
};

// ─── SHEETS ───────────────────────────────────────────────────────────────────
const sheetsGet = async (tab) => { const r = await fetch(`${SHEETS_URL}?tab=${tab}`); return r.json(); };
const sheetsPost = async (tab, rows) => {
  await fetch(SHEETS_URL, { method:"POST", mode:"no-cors", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ tab, action:"replace", rows }) });
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const C = { TELLO:"#3b82f6", CRISTIAN:"#10b981", JULIO:"#f59e0b" };
const coordColor = (c="") => {
  const u = c.toUpperCase();
  if (u.includes("TELLO")) return C.TELLO;
  if (u.includes("CRISTIAN")||u.includes("ZUÑIGA")) return C.CRISTIAN;
  if (u.includes("JULIO")||u.includes("HERNANDEZ")) return C.JULIO;
  return "#6366f1";
};
const estatusColor = (e="") => {
  const s = e.toLowerCase();
  if (s.includes("facturando")||s.includes("vta")||s.includes("realizado")||s.includes("activo")) return "#10b981";
  if (s.includes("dco")||s.includes("disponible")) return "#3b82f6";
  if (s.includes("programado")) return "#6366f1";
  if (s.includes("en ruta")) return "#10b981";
  if (s.includes("siniestro")||s.includes("sg")||s.includes("dañada")||s.includes("perdida")) return "#ef4444";
  if (s.includes("reparacion")||s.includes("rm")||s.includes("correctivo")||s.includes("cp")||s.includes("mtto")||s.includes("mantenimiento")) return "#f59e0b";
  if (s.includes("sin operador")||s.includes("vacante")) return "#64748b";
  if (s.includes("liberar")||s.includes("lib")) return "#a855f7";
  if (s.includes("cargada")) return "#10b981";
  if (s.includes("tránsito")||s.includes("transito")) return "#3b82f6";
  if (s.includes("revisar")) return "#f59e0b";
  if (s.includes("permisionario")) return "#f97316";
  if (s.includes("patio")||s.includes("vacia")||s.includes("vacía")) return "#64748b";
  return "#64748b";
};
const Badge = ({ text }) => (
  <span style={{ background:estatusColor(text)+"22", color:estatusColor(text), border:`1px solid ${estatusColor(text)}44`, borderRadius:5, padding:"2px 7px", fontSize:10, fontWeight:700, letterSpacing:.5, textTransform:"uppercase", whiteSpace:"nowrap" }}>{text}</span>
);

// Semáforo de entrega
const semaforoEntrega = (fechaProg, entregado) => {
  if (entregado) return { color:"#10b981", icon:"✅", texto:"Entregado" };
  if (!fechaProg) return { color:"#64748b", icon:"⚪", texto:"Sin fecha" };
  const hoy = new Date(); hoy.setHours(0,0,0,0);
  const prog = new Date(fechaProg); prog.setHours(0,0,0,0);
  const diff = Math.floor((prog - hoy) / 86400000);
  if (diff < 0) return { color:"#ef4444", icon:"🔴", texto:`${Math.abs(diff)}d vencido` };
  if (diff === 0) return { color:"#f59e0b", icon:"🟡", texto:"Hoy" };
  if (diff === 1) return { color:"#f97316", icon:"🟠", texto:"Mañana" };
  return { color:"#10b981", icon:"🟢", texto:`${diff}d restantes` };
};

const toCSV = (rows, cols) => cols.join(",") + "\n" + rows.map(r => cols.map(c=>`"${r[c]??''}"`).join(",")).join("\n");
const downloadCSV = (content, filename) => {
  const blob = new Blob([content], {type:"text/csv;charset=utf-8;"});
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
};
const parseTSV = (text) => {
  const lines = text.trim().split("\n").filter(l=>l.trim());
  if (lines.length < 2) return null;
  const headers = lines[0].split("\t").map(h=>h.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,""));
  return lines.slice(1).map(line => {
    const vals = line.split("\t"); const obj = {};
    headers.forEach((h,i) => { obj[h] = (vals[i]||"").trim(); });
    return obj;
  });
};
const mapTracto = r => ({ unidad:r.unidad||r.tracto||r.economico||"", operador:r.operador||r.conductor||"", coordinador:r.coordinador||r.coord||"", estatus:r.estatus||"", circuito:r.circuito||r.ruta||"", ubicacion:r.ubicacion||r.ciudad||"" });
const mapCaja = r => ({ caja:r.caja||r.remolque||r.trailer||"", tipo:r.tipo||"Seca", coordinador:r.coordinador||"", ciudad:r.ciudad||"", patio:r.patio||"-", ubicEsp:r.ubicacionespecifica||r.ubicacion||"", estatus:r.estatus||"", cliente:r.cliente||"", comentarios:r.comentarios||r.notas||"", permisionario:r.permisionario||"-", fechaEntregaProg:r.fechaentregaprog||r.fechaprog||"", fechaEntregaReal:r.fechaentregareal||r.fechareal||"" });
const mapViaje = (r,i) => ({ id:r.id||`V-IMP-${i+1}`, semana:+r.semana||0, fecha:r.fecha||"", coordinador:r.coordinador||"", unidad:r.unidad||"", caja:r.caja||"", cliente:r.cliente||"", circuito:r.circuito||"", unidadNegocio:r.unidadnegocio||r.negocio||"NACIONALES", estatus:r.estatus||"Realizado", ventaEst:+r.ventaest||+r.ventaestimada||0, ventaReal:+r.ventareal||+r.venta||null, costoOp:+r.costooperador||+r.costoop||0, diesel:+r.diesel||0, casetas:+r.casetas||0, costoMtto:+r.costomtto||0, kmRecorridos:+r.kmrecorridos||0, litrosDiesel:+r.litrosdiesel||0, fechaEntregaProg:r.fechaentregaprog||"", fechaEntregaReal:r.fechaentregareal||"", entregado:r.entregado==="true"||r.entregado===true });

// ─── COMPONENTES UI ───────────────────────────────────────────────────────────
const Input = ({ label, value, onChange, type="text", options, required }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
    <label style={{ fontSize:11, color:"#64748b", textTransform:"uppercase", letterSpacing:.8 }}>{label}{required&&<span style={{color:"#ef4444"}}> *</span>}</label>
    {options ? (
      <select value={value} onChange={e=>onChange(e.target.value)} style={{ background:"#0f172a", border:"1px solid #1e293b", borderRadius:7, padding:"8px 10px", color:"#f1f5f9", fontSize:12, outline:"none" }}>
        <option value="">— Seleccionar —</option>
        {options.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
    ) : (
      <input type={type} value={value||""} onChange={e=>onChange(e.target.value)} style={{ background:"#0f172a", border:"1px solid #1e293b", borderRadius:7, padding:"8px 10px", color:"#f1f5f9", fontSize:12, outline:"none" }} />
    )}
  </div>
);

const Modal = ({ title, onClose, children, wide }) => (
  <div style={{ position:"fixed", inset:0, background:"#000d", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
    <div style={{ background:"#0d1829", border:"1px solid #1e293b", borderRadius:14, width:"100%", maxWidth:wide?860:560, maxHeight:"92vh", overflow:"auto" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", borderBottom:"1px solid #1e293b", position:"sticky", top:0, background:"#0d1829", zIndex:1 }}>
        <div style={{ color:"#f1f5f9", fontWeight:700, fontSize:14 }}>{title}</div>
        <button onClick={onClose} style={{ background:"none", border:"none", color:"#64748b", fontSize:22, cursor:"pointer" }}>×</button>
      </div>
      <div style={{ padding:20 }}>{children}</div>
    </div>
  </div>
);

const SyncBanner = ({ syncState, onSync }) => {
  const cfg = {
    idle:    { bg:"#0a1628", border:"#1e3a5f", color:"#3b82f6",  text: USAR_SHEETS ? "☁️ Conectado a Google Sheets" : "💾 Modo local — configura tu URL de Sheets en index.html" },
    syncing: { bg:"#0a1f0f", border:"#10b98140", color:"#10b981", text:"🔄 Sincronizando..." },
    ok:      { bg:"#0a1f0f", border:"#10b98140", color:"#10b981", text:"✅ Sincronizado correctamente" },
    error:   { bg:"#1f0a0a", border:"#ef444440", color:"#ef4444", text:"⚠️ Error Sheets — usando datos locales" },
  };
  const c = cfg[syncState]||cfg.idle;
  return (
    <div style={{ background:c.bg, border:`1px solid ${c.border}`, borderRadius:9, padding:"8px 14px", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
      <span style={{ color:c.color, fontSize:12 }}>{c.text}</span>
      {USAR_SHEETS && <button onClick={onSync} disabled={syncState==="syncing"} style={{ background:"#1e293b", border:"none", borderRadius:6, padding:"4px 12px", color:"#94a3b8", fontSize:11, cursor:"pointer" }}>🔄 Sincronizar</button>}
    </div>
  );
};

// ─── TRACKER LINEAL ── Timeline horizontal de unidades en ruta ────────────────
const TrackerLineal = ({ data }) => {
  const enRuta = data.viajes.filter(v => v.estatus==="En Ruta" || v.estatus==="VTA - Facturando" || (v.estatus==="Realizado" && !v.entregado));
  const programados = data.viajes.filter(v => v.estatus==="Programado").slice(0,5);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <div style={{ color:"#475569", fontSize:11, textTransform:"uppercase", letterSpacing:1.5 }}>🚛 Unidades en Movimiento — Vista Lineal</div>

      {enRuta.length === 0 && (
        <div style={{ color:"#334155", fontSize:13, textAlign:"center", padding:24 }}>No hay unidades en ruta registradas actualmente</div>
      )}

      {enRuta.map((v, idx) => {
        const cfg = CIRCUITOS_CONFIG[v.circuito] || { paradas:["Origen","Destino"], siguiente:"—", tiempoEst:"—", color:"#6366f1" };
        const sem = semaforoEntrega(v.fechaEntregaProg, v.entregado);
        const tracto = data.tractos.find(t=>t.unidad===v.unidad);
        const operador = tracto ? tracto.operador.split(" ").slice(0,2).join(" ") : "—";
        // Simula posición en el circuito (0 a paradas.length-1)
        const posIdx = Math.min(Math.floor((Date.now()/1000 + idx*3600) % cfg.paradas.length), cfg.paradas.length-1);

        return (
          <div key={v.id} style={{ background:"#0a1628", border:`1px solid ${cfg.color}30`, borderRadius:12, padding:14, overflow:"hidden" }}>
            {/* Header */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                <span style={{ color:"#f1f5f9", fontWeight:900, fontFamily:"monospace", fontSize:14 }}>{v.unidad}</span>
                <span style={{ color:"#64748b", fontSize:11 }}>{operador}</span>
                <Badge text={v.estatus}/>
              </div>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <span style={{ color:sem.color, fontSize:11, fontWeight:700 }}>{sem.icon} {sem.texto}</span>
                <span style={{ color:coordColor(v.coordinador), fontSize:10, fontWeight:700 }}>{v.coordinador.split(" ")[0]}</span>
              </div>
            </div>

            {/* Info cliente */}
            <div style={{ display:"flex", gap:16, marginBottom:12, flexWrap:"wrap" }}>
              <span style={{ color:"#94a3b8", fontSize:11 }}>📦 {v.caja}</span>
              <span style={{ color:"#94a3b8", fontSize:11 }}>🏢 {v.cliente}</span>
              <span style={{ color:"#94a3b8", fontSize:11 }}>⏱ {cfg.tiempoEst}</span>
              {v.fechaEntregaProg && <span style={{ color:"#64748b", fontSize:11 }}>📅 Entrega: {v.fechaEntregaProg}</span>}
            </div>

            {/* TIMELINE LINEAL */}
            <div style={{ position:"relative", overflowX:"auto" }}>
              <div style={{ display:"flex", alignItems:"center", gap:0, minWidth:cfg.paradas.length*90, paddingBottom:8 }}>
                {cfg.paradas.map((parada, pi) => {
                  const esActual = pi === posIdx;
                  const esAnterior = pi < posIdx;
                  const esProximo = pi === posIdx + 1;
                  return (
                    <React.Fragment key={pi}>
                      {/* Nodo */}
                      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", minWidth:80, position:"relative", zIndex:2 }}>
                        <div style={{
                          width: esActual ? 22 : 14,
                          height: esActual ? 22 : 14,
                          borderRadius:"50%",
                          background: esActual ? cfg.color : esAnterior ? cfg.color+"80" : "#1e293b",
                          border: esActual ? `3px solid ${cfg.color}` : esProximo ? `2px dashed ${cfg.color}60` : "2px solid #1e293b",
                          boxShadow: esActual ? `0 0 12px ${cfg.color}` : "none",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          transition:"all .3s",
                          flexShrink:0,
                        }}>
                          {esActual && <span style={{ fontSize:8 }}>🚛</span>}
                          {esAnterior && <span style={{ color:"#fff", fontSize:8, fontWeight:900 }}>✓</span>}
                        </div>
                        <div style={{ color: esActual ? "#f1f5f9" : esAnterior ? "#475569" : "#334155", fontSize:9, marginTop:5, textAlign:"center", fontWeight: esActual ? 700 : 400, whiteSpace:"nowrap", maxWidth:80, overflow:"hidden", textOverflow:"ellipsis" }}>{parada}</div>
                        {esActual && <div style={{ color:cfg.color, fontSize:8, fontWeight:700, marginTop:2 }}>← AQUÍ</div>}
                      </div>
                      {/* Línea conectora */}
                      {pi < cfg.paradas.length - 1 && (
                        <div style={{ flex:1, height:3, background: pi < posIdx ? cfg.color+"80" : "#1e293b", minWidth:20, position:"relative", top:-14, flexShrink:0 }}>
                          {pi === posIdx && (
                            <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, background:`linear-gradient(90deg, ${cfg.color}80, transparent)`, animation:"pulse 1.5s infinite" }}/>
                          )}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Siguiente ruta sugerida */}
            <div style={{ background:"#060d1a", borderRadius:8, padding:"8px 12px", marginTop:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ color:"#475569", fontSize:10 }}>➡️ Siguiente ruta sugerida:</span>
              <span style={{ color:cfg.color, fontSize:11, fontWeight:700 }}>{cfg.siguiente}</span>
            </div>
          </div>
        );
      })}

      {/* Próximas salidas */}
      {programados.length > 0 && (
        <div>
          <div style={{ color:"#475569", fontSize:10, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>📋 Próximas salidas programadas</div>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {programados.map(v => (
              <div key={v.id} style={{ background:"#0a1628", border:"1px solid #6366f130", borderRadius:8, padding:"10px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <span style={{ color:"#f1f5f9", fontFamily:"monospace", fontWeight:700, fontSize:12 }}>{v.unidad}</span>
                  <span style={{ color:"#64748b", fontSize:11 }}>{v.circuito}</span>
                  <span style={{ color:"#94a3b8", fontSize:11 }}>{v.cliente}</span>
                </div>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  {v.fechaEntregaProg && <span style={{ color:"#475569", fontSize:10 }}>📅 {v.fechaEntregaProg}</span>}
                  <Badge text="Programado"/>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── IMPORTADOR MASIVO ────────────────────────────────────────────────────────
const ImportadorMasivo = ({ tipo, onImportar, onClose }) => {
  const [texto, setTexto] = useState(""); const [preview, setPreview] = useState(null); const [error, setError] = useState(""); const [modo, setModo] = useState("reemplazar");
  const plantillas = {
    tractos: { cols:"unidad\toperador\tcoordinador\testatus\tcircuito\tubicacion", ej:"018-ABC\tVICTOR ARAMBULA\tJULIO HERNANDEZ\tActivo\tRemolacha\tReynosa" },
    cajas:   { cols:"caja\ttipo\tcoordinador\tciudad\tpatio\tubicEsp\testatus\tcliente\tcomentarios\tpermisionario\tfechaEntregaProg\tfechaEntregaReal", ej:"1003-ABC\tSeca\tCRISTIAN ZUÑIGA\tJUAREZ\tJuárez\tPatio\tDañada\tPENSKE\tVACIA DAÑADA\t-\t\t" },
    viajes:  { cols:"semana\tfecha\tcoordinador\tunidad\tcaja\tcliente\tcircuito\tunidadNegocio\testatus\tventaEst\tventaReal\tcostoOp\tdiesel\tcasetas\tcostoMtto\tkmRecorridos\tlitrosDiesel\tfechaEntregaProg\tfechaEntregaReal\tentregado", ej:"15\t2026-04-07\tJUAN JOSE TELLO\t151-ABC\t1299\tTramuc\tReynosa - Bajio\tNACIONALES\tRealizado\t28000\t28000\t4500\t3200\t800\t0\t834\t267\t2026-04-09\t2026-04-09\ttrue" },
  };
  const p = plantillas[tipo];
  const parsear = () => {
    setError("");
    if (!texto.trim()) { setError("Pega datos primero."); return; }
    const rows = parseTSV(texto);
    if (!rows||rows.length===0) { setError("No se detectaron filas. Incluye la fila de encabezados."); return; }
    const mapped = tipo==="tractos"?rows.map(mapTracto):tipo==="cajas"?rows.map(mapCaja):rows.map(mapViaje);
    const validos = mapped.filter(r=>tipo==="tractos"?r.unidad:tipo==="cajas"?r.caja:r.unidad||r.coordinador);
    if (validos.length===0) { setError("No se encontraron datos válidos."); return; }
    setPreview({ filas:validos, total:rows.length });
  };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <div style={{ background:"#0a1628", border:"1px solid #1e3a5f", borderRadius:10, padding:12 }}>
        <div style={{ color:"#3b82f6", fontWeight:700, fontSize:11, marginBottom:6 }}>📋 Plantilla — copia estos encabezados en tu Excel fila 1</div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <code style={{ color:"#10b981", fontSize:9, fontFamily:"monospace", overflowX:"auto", display:"block", whiteSpace:"pre" }}>{p.cols}</code>
          <button onClick={()=>{ const b=new Blob([p.cols+"\n"+p.ej],{type:"text/plain"}); const a=document.createElement("a"); a.href=URL.createObjectURL(b); a.download=`plantilla_${tipo}.txt`; a.click(); }}
            style={{ background:"#1e3a2f", border:"1px solid #10b98140", borderRadius:6, padding:"4px 10px", color:"#10b981", fontSize:10, cursor:"pointer", fontWeight:700, whiteSpace:"nowrap", marginLeft:10 }}>⬇️ Plantilla</button>
        </div>
      </div>
      <div style={{ display:"flex", gap:8 }}>
        {["reemplazar","agregar"].map(m=>(
          <button key={m} onClick={()=>setModo(m)} style={{ flex:1, padding:"8px", borderRadius:8, border:`1px solid ${modo===m?"#3b82f6":"#1e293b"}`, background:modo===m?"#1e3a5f":"#0a1628", color:modo===m?"#f1f5f9":"#64748b", fontSize:11, cursor:"pointer", fontWeight:700 }}>
            {m==="reemplazar"?"🔄 Reemplazar todo":"➕ Agregar"}
          </button>
        ))}
      </div>
      <textarea value={texto} onChange={e=>{setTexto(e.target.value);setPreview(null);setError("");}}
        placeholder="Copia desde Excel y pega aquí (incluye encabezados en fila 1)..."
        style={{ width:"100%", height:140, background:"#060d1a", border:"1px solid #1e3a5f", borderRadius:8, padding:10, color:"#f1f5f9", fontSize:11, fontFamily:"monospace", resize:"vertical", outline:"none", boxSizing:"border-box" }}/>
      {error && <div style={{ background:"#2d0a0a", border:"1px solid #ef444440", borderRadius:8, padding:10, color:"#ef4444", fontSize:11 }}>⚠️ {error}</div>}
      {preview && (
        <div style={{ background:"#0a1c10", border:"1px solid #10b98140", borderRadius:10, padding:12 }}>
          <div style={{ color:"#10b981", fontWeight:700, fontSize:12, marginBottom:6 }}>✅ {preview.filas.length} registros listos</div>
        </div>
      )}
      <div style={{ display:"flex", gap:8 }}>
        <button onClick={parsear} style={{ flex:1, background:"#1e293b", border:"1px solid #334155", borderRadius:8, padding:"10px", color:"#f1f5f9", fontWeight:700, cursor:"pointer", fontSize:12 }}>🔍 Vista Previa</button>
        {preview && <button onClick={()=>{ onImportar(preview.filas, modo); onClose(); }} style={{ flex:2, background:"#10b981", border:"none", borderRadius:8, padding:"10px", color:"#fff", fontWeight:700, cursor:"pointer", fontSize:12 }}>✅ Confirmar ({preview.filas.length})</button>}
      </div>
    </div>
  );
};

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const Dashboard = ({ data }) => {
  const { tractos, cajas, viajes } = data;
  const enRuta = tractos.filter(t=>t.estatus.includes("VTA")||t.estatus.includes("Facturando")).length;
  const disponibles = tractos.filter(t=>t.estatus.includes("DCO")||t.estatus.includes("Disponible")).length;
  const enMtto = tractos.filter(t=>["SG","RM","CP","Mantenimiento","Correctivo","Siniestro"].some(x=>t.estatus.includes(x))).length;
  const sinOp = tractos.filter(t=>t.estatus.includes("Sin Operador")||t.estatus.includes("LIB")).length;

  // Cajas resumen
  const cargadas = cajas.filter(c=>c.estatus==="Cargada").length;
  const dispCajas = cajas.filter(c=>c.estatus==="Disponible"||c.estatus==="En Patio").length;
  const dañadas = cajas.filter(c=>c.estatus==="Dañada").length;
  const transito = cajas.filter(c=>c.estatus==="En Tránsito"||c.estatus==="En Transito").length;
  const siniestro = cajas.filter(c=>c.estatus==="Siniestro").length;
  const permis = cajas.filter(c=>c.estatus==="Permisionario").length;
  const revisar = cajas.filter(c=>c.estatus==="Revisar").length;
  const perdida = cajas.filter(c=>c.estatus==="Perdida").length;

  // Financiero — NACIONALES
  const nacionales = viajes.filter(v=>(v.unidadNegocio||"NACIONALES").toUpperCase().includes("NACIONALES"));
  const realizados = nacionales.filter(v=>v.estatus==="Realizado");
  const ventaTotal = realizados.reduce((s,v)=>s+(+v.ventaReal||0),0);
  const costoTotal = realizados.reduce((s,v)=>s+(+v.costoOp||0)+(+v.diesel||0)+(+v.casetas||0)+(+v.costoMtto||0),0);
  const utilidad = ventaTotal - costoTotal;
  const margen = ventaTotal>0?((utilidad/ventaTotal)*100).toFixed(1):0;
  const vKml = realizados.filter(v=>+v.kmRecorridos>0&&+v.litrosDiesel>0);
  const kmlG = vKml.length>0?(vKml.reduce((s,v)=>s+(+v.kmRecorridos/+v.litrosDiesel),0)/vKml.length).toFixed(2):"—";

  // Alertas entrega
  const hoy = new Date(); hoy.setHours(0,0,0,0);
  const vencidas = viajes.filter(v=>!v.entregado&&v.fechaEntregaProg&&new Date(v.fechaEntregaProg)<hoy);
  const hoyEntrega = viajes.filter(v=>!v.entregado&&v.fechaEntregaProg&&new Date(v.fechaEntregaProg).toDateString()===hoy.toDateString());

  const KPI = ({label,val,color,icon,sub}) => (
    <div style={{ background:"#0a1628", border:`1px solid ${color}30`, borderRadius:11, padding:"14px 16px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:color }}/>
      <div style={{ fontSize:16 }}>{icon}</div>
      <div style={{ fontSize:24, fontWeight:900, color, lineHeight:1.1, marginTop:4 }}>{val}</div>
      <div style={{ fontSize:10, color:"#64748b", textTransform:"uppercase", letterSpacing:.8, marginTop:2 }}>{label}</div>
      {sub&&<div style={{ fontSize:10, color:"#334155", marginTop:2 }}>{sub}</div>}
    </div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
      <div>
        <div style={{ color:"#475569", fontSize:11, letterSpacing:2, textTransform:"uppercase" }}>Torre de Control · {new Date().toLocaleDateString("es-MX",{day:"2-digit",month:"short",year:"numeric"})}</div>
        <div style={{ color:"#f1f5f9", fontSize:20, fontWeight:900, marginTop:2 }}>Nacional Autotransporte</div>
      </div>

      {/* Alertas de entrega */}
      {(vencidas.length>0||hoyEntrega.length>0) && (
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {vencidas.length>0 && (
            <div style={{ background:"#1f0a0a", border:"1px solid #ef444450", borderLeft:"4px solid #ef4444", borderRadius:9, padding:"10px 14px" }}>
              <span style={{ color:"#ef4444", fontWeight:700, fontSize:12 }}>🔴 {vencidas.length} entrega(s) VENCIDA(S) — {vencidas.map(v=>v.unidad).join(", ")}</span>
            </div>
          )}
          {hoyEntrega.length>0 && (
            <div style={{ background:"#1f1200", border:"1px solid #f59e0b50", borderLeft:"4px solid #f59e0b", borderRadius:9, padding:"10px 14px" }}>
              <span style={{ color:"#f59e0b", fontWeight:700, fontSize:12 }}>🟡 {hoyEntrega.length} entrega(s) HOY — {hoyEntrega.map(v=>v.unidad).join(", ")}</span>
            </div>
          )}
        </div>
      )}

      <div style={{ color:"#475569", fontSize:11, textTransform:"uppercase", letterSpacing:1 }}>🚛 {tractos.length} Tractos</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:8 }}>
        <KPI label="En Ruta" val={enRuta} color="#10b981" icon="🟢" sub="Facturando"/>
        <KPI label="Disponibles" val={disponibles} color="#3b82f6" icon="🔵" sub="DCO"/>
        <KPI label="Mantenimiento" val={enMtto} color="#f59e0b" icon="🔧" sub="SG/RM/CP"/>
        <KPI label="Sin Operador" val={sinOp} color="#64748b" icon="⚠️" sub="Vacantes"/>
      </div>

      <div style={{ color:"#475569", fontSize:11, textTransform:"uppercase", letterSpacing:1 }}>📦 {cajas.length} Cajas</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))", gap:8 }}>
        <KPI label="Cargadas" val={cargadas} color="#10b981" icon="📦"/>
        <KPI label="Disponibles" val={dispCajas} color="#3b82f6" icon="🆓"/>
        <KPI label="En Tránsito" val={transito} color="#6366f1" icon="🔄"/>
        <KPI label="Dañadas" val={dañadas} color="#ef4444" icon="🔴"/>
        <KPI label="Siniestro" val={siniestro} color="#ef4444" icon="💥"/>
        <KPI label="Permisionario" val={permis} color="#f97316" icon="🤝"/>
        <KPI label="Revisar" val={revisar} color="#f59e0b" icon="🔍"/>
        <KPI label="Perdida" val={perdida} color="#ef4444" icon="❓"/>
      </div>

      <div style={{ color:"#475569", fontSize:11, textTransform:"uppercase", letterSpacing:1 }}>💰 Rentabilidad — Unidad NACIONALES</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:8 }}>
        <KPI label="Venta Real" val={`$${(ventaTotal/1000).toFixed(0)}K`} color="#10b981" icon="💵"/>
        <KPI label="Costo Total" val={`$${(costoTotal/1000).toFixed(0)}K`} color="#f59e0b" icon="📉"/>
        <KPI label="Utilidad" val={`$${(utilidad/1000).toFixed(0)}K`} color={utilidad>=0?"#10b981":"#ef4444"} icon="📊"/>
        <KPI label="Margen" val={`${margen}%`} color={margen>=20?"#10b981":"#f59e0b"} icon="%" sub="Meta >20%"/>
        <KPI label="KM/L Flota" val={kmlG} color="#6366f1" icon="⛽"/>
        <KPI label="Viajes" val={nacionales.length} color="#a855f7" icon="✅" sub="NACIONALES"/>
      </div>

      <div style={{ color:"#475569", fontSize:11, textTransform:"uppercase", letterSpacing:1 }}>👥 Por Coordinador</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:10 }}>
        {[{n:"Juan José Tello",k:"TELLO"},{n:"Cristian Zuñiga",k:"CRISTIAN"},{n:"Julio Hernandez",k:"JULIO"}].map(c=>{
          const vC=nacionales.filter(v=>v.coordinador.toUpperCase().includes(c.k)&&v.estatus==="Realizado");
          const venta=vC.reduce((s,v)=>s+(+v.ventaReal||0),0);
          const costo=vC.reduce((s,v)=>s+(+v.costoOp||0)+(+v.diesel||0)+(+v.casetas||0)+(+v.costoMtto||0),0);
          const util=venta-costo;
          const vKc=vC.filter(v=>+v.kmRecorridos>0&&+v.litrosDiesel>0);
          const kml=vKc.length>0?(vKc.reduce((s,v)=>s+(+v.kmRecorridos/+v.litrosDiesel),0)/vKc.length).toFixed(2):"—";
          const col=coordColor(c.k);
          return (
            <div key={c.k} style={{ background:"#0a1628", border:`1px solid ${col}30`, borderRadius:11, padding:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                <div style={{ width:9, height:9, borderRadius:"50%", background:col }}/>
                <div style={{ color:"#f1f5f9", fontWeight:700, fontSize:13 }}>{c.n}</div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:6, textAlign:"center" }}>
                {[["Tractos",tractos.filter(t=>t.coordinador.toUpperCase().includes(c.k)).length],["Utilidad",`$${(util/1000).toFixed(0)}K`],["KM/L",kml]].map(([l,v])=>(
                  <div key={l}><div style={{ color:col, fontWeight:900, fontSize:16 }}>{v}</div><div style={{ color:"#475569", fontSize:10 }}>{l}</div></div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── CAJAS DETALLADO ──────────────────────────────────────────────────────────
const Cajas = ({ data, setData }) => {
  const [q,setQ]=useState(""); const [coord,setCoord]=useState(""); const [efil,setEfil]=useState(""); const [patioFil,setPatioFil]=useState("");
  const [editando,setEditando]=useState(null); const [form,setForm]=useState({});
  const [showImport,setShowImport]=useState(false);

  const resumen={};
  data.cajas.forEach(c=>{resumen[c.estatus]=(resumen[c.estatus]||0)+1;});

  const patios = [...new Set(data.cajas.map(c=>c.patio).filter(p=>p&&p!=="-"))];

  const lista=data.cajas.filter(c=>{
    const tx=q.toLowerCase();
    return (!q||(c.caja+c.cliente+c.ciudad+c.permisionario).toLowerCase().includes(tx))
      &&(!coord||c.coordinador.toUpperCase().includes(coord))
      &&(!efil||c.estatus===efil)
      &&(!patioFil||c.patio===patioFil);
  });

  const guardar=()=>{
    const updated={...data,cajas:data.cajas.map(c=>c.caja===editando?{...c,...form}:c),lastUpdate:new Date().toISOString()};
    setData(updated);saveLocal(updated);setEditando(null);
    if(USAR_SHEETS) sheetsPost("Cajas",updated.cajas);
  };
  const importar=(filas,modo)=>{
    const nuevas=modo==="reemplazar"?filas:[...data.cajas,...filas.filter(f=>!data.cajas.find(c=>c.caja===f.caja))];
    const updated={...data,cajas:nuevas,lastUpdate:new Date().toISOString()};
    setData(updated);saveLocal(updated);
    if(USAR_SHEETS) sheetsPost("Cajas",nuevas);
  };

  // Alertas de cajas no entregadas
  const hoy=new Date(); hoy.setHours(0,0,0,0);
  const cajaVencidas=data.cajas.filter(c=>c.fechaEntregaProg&&!c.fechaEntregaReal&&new Date(c.fechaEntregaProg)<hoy);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      {editando&&<Modal title={`Editar Caja ${editando}`} onClose={()=>setEditando(null)}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <Input label="Estatus" value={form.estatus||""} onChange={v=>setForm(f=>({...f,estatus:v}))} options={["Cargada","Disponible","En Patio","En Tránsito","Dañada","Siniestro","Permisionario","Revisar","Perdida","Vacía"]}/>
          <Input label="Ciudad" value={form.ciudad||""} onChange={v=>setForm(f=>({...f,ciudad:v}))}/>
          <Input label="Patio (si aplica)" value={form.patio||""} onChange={v=>setForm(f=>({...f,patio:v}))} options={["Reynosa","Monterrey","Nuevo Laredo","Juárez","Laredo TX","Arteaga","-"]}/>
          <Input label="Ubicación Específica" value={form.ubicEsp||""} onChange={v=>setForm(f=>({...f,ubicEsp:v}))}/>
          <Input label="Cliente" value={form.cliente||""} onChange={v=>setForm(f=>({...f,cliente:v}))}/>
          <Input label="Permisionario" value={form.permisionario||""} onChange={v=>setForm(f=>({...f,permisionario:v}))}/>
          <Input label="Fecha Entrega Prog." value={form.fechaEntregaProg||""} onChange={v=>setForm(f=>({...f,fechaEntregaProg:v}))} type="date"/>
          <Input label="Fecha Entrega Real" value={form.fechaEntregaReal||""} onChange={v=>setForm(f=>({...f,fechaEntregaReal:v}))} type="date"/>
          <Input label="Coordinador" value={form.coordinador||""} onChange={v=>setForm(f=>({...f,coordinador:v}))} options={["JUAN JOSE TELLO","CRISTIAN ZUÑIGA","JULIO HERNANDEZ"]}/>
          <Input label="Comentarios" value={form.comentarios||""} onChange={v=>setForm(f=>({...f,comentarios:v}))}/>
        </div>
        <button onClick={guardar} style={{ marginTop:14,width:"100%",background:"#3b82f6",border:"none",borderRadius:8,padding:"10px",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13 }}>💾 Guardar</button>
      </Modal>}
      {showImport&&<Modal title="📥 Importar Cajas" onClose={()=>setShowImport(false)} wide><ImportadorMasivo tipo="cajas" onImportar={importar} onClose={()=>setShowImport(false)}/></Modal>}

      {/* Alertas cajas vencidas */}
      {cajaVencidas.length>0 && (
        <div style={{ background:"#1f0a0a", border:"1px solid #ef444450", borderLeft:"4px solid #ef4444", borderRadius:9, padding:"10px 14px" }}>
          <span style={{ color:"#ef4444", fontWeight:700, fontSize:12 }}>🔴 {cajaVencidas.length} caja(s) con entrega VENCIDA: {cajaVencidas.map(c=>c.caja).join(", ")}</span>
        </div>
      )}

      {/* Resumen por estatus */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))", gap:6 }}>
        {Object.entries(resumen).map(([k,v])=>(
          <div key={k} onClick={()=>setEfil(efil===k?"":k)} style={{ background:efil===k?estatusColor(k)+"30":estatusColor(k)+"15", border:`1px solid ${estatusColor(k)}${efil===k?"80":"33"}`, borderRadius:8, padding:"8px 10px", cursor:"pointer", textAlign:"center" }}>
            <div style={{ color:estatusColor(k), fontWeight:900, fontSize:20 }}>{v}</div>
            <div style={{ color:"#475569", fontSize:9, textTransform:"uppercase", marginTop:2 }}>{k}</div>
          </div>
        ))}
      </div>

      {/* Resumen por patio */}
      {patios.length>0 && (
        <div>
          <div style={{ color:"#475569", fontSize:10, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>📍 Por Patio</div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {patios.map(p=>{
              const cnt=data.cajas.filter(c=>c.patio===p).length;
              return (
                <div key={p} onClick={()=>setPatioFil(patioFil===p?"":p)} style={{ background:patioFil===p?"#1e3a5f":"#0a1628", border:`1px solid ${patioFil===p?"#3b82f6":"#1e293b"}`, borderRadius:7, padding:"6px 12px", cursor:"pointer" }}>
                  <span style={{ color:"#3b82f6", fontWeight:700 }}>{cnt}</span><span style={{ color:"#475569", fontSize:10, marginLeft:6 }}>{p}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        <input placeholder="🔍 Buscar caja, cliente, permisionario..." value={q} onChange={e=>setQ(e.target.value)} style={{ flex:1, minWidth:200, background:"#0a1628", border:"1px solid #1e293b", borderRadius:8, padding:"8px 12px", color:"#f1f5f9", fontSize:12, outline:"none" }}/>
        <select value={coord} onChange={e=>setCoord(e.target.value)} style={{ background:"#0a1628", border:"1px solid #1e293b", borderRadius:8, padding:"8px 10px", color:"#f1f5f9", fontSize:12, outline:"none" }}>
          <option value="">Todos</option><option value="TELLO">Tello</option><option value="CRISTIAN">Cristian</option><option value="JULIO">Julio</option>
        </select>
        <button onClick={()=>setShowImport(true)} style={{ background:"#1e3a5f", border:"1px solid #3b82f640", borderRadius:8, padding:"8px 12px", color:"#3b82f6", fontSize:11, cursor:"pointer", fontWeight:700 }}>📥 Importar</button>
        <button onClick={()=>downloadCSV(toCSV(data.cajas,["caja","tipo","coordinador","ciudad","patio","ubicEsp","estatus","cliente","comentarios","permisionario","fechaEntregaProg","fechaEntregaReal"]),"cajas.csv")} style={{ background:"#1e3a2f", border:"1px solid #10b98144", borderRadius:8, padding:"8px 12px", color:"#10b981", fontSize:11, cursor:"pointer", fontWeight:700 }}>⬇️ CSV</button>
      </div>

      <div style={{ color:"#475569", fontSize:11 }}>{lista.length} de {data.cajas.length} cajas {patioFil&&`· Patio: ${patioFil}`}</div>
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
          <thead><tr style={{ borderBottom:"2px solid #1e293b" }}>{["Caja","Tipo","Coord","Ciudad","Patio","Estatus","Cliente","Permisionario","Entrega","",""].map(h=><th key={h} style={{ textAlign:"left", padding:"8px 10px", color:"#475569", fontSize:10, textTransform:"uppercase", letterSpacing:.8, whiteSpace:"nowrap" }}>{h}</th>)}</tr></thead>
          <tbody>{lista.map((c,i)=>{
            const sem=semaforoEntrega(c.fechaEntregaProg, !!c.fechaEntregaReal);
            return (
              <tr key={c.caja} style={{ borderBottom:"1px solid #0d1626", background:i%2===0?"#080e1c":"transparent" }}>
                <td style={{ padding:"9px 10px", color:"#f1f5f9", fontWeight:800, fontFamily:"monospace" }}>{c.caja}</td>
                <td style={{ padding:"9px 10px", color:"#64748b" }}>{c.tipo}</td>
                <td style={{ padding:"9px 10px" }}><span style={{ color:coordColor(c.coordinador), fontWeight:700, fontSize:11 }}>{c.coordinador.split(" ")[0]}</span></td>
                <td style={{ padding:"9px 10px", color:"#94a3b8", maxWidth:110, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.ciudad}</td>
                <td style={{ padding:"9px 10px", color:"#64748b" }}>{c.patio&&c.patio!=="-"?c.patio:"—"}</td>
                <td style={{ padding:"9px 10px" }}><Badge text={c.estatus}/></td>
                <td style={{ padding:"9px 10px", color:"#94a3b8", maxWidth:120, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.cliente}</td>
                <td style={{ padding:"9px 10px", color:c.permisionario&&c.permisionario!=="-"?"#f97316":"#334155", fontSize:11 }}>{c.permisionario&&c.permisionario!=="-"?c.permisionario:"—"}</td>
                <td style={{ padding:"9px 10px", whiteSpace:"nowrap" }}><span style={{ color:sem.color, fontSize:11, fontWeight:700 }}>{sem.icon} {sem.texto}</span></td>
                <td style={{ padding:"9px 10px", color:"#334155", fontSize:10, maxWidth:120, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.comentarios}</td>
                <td style={{ padding:"9px 10px" }}><button onClick={()=>{setEditando(c.caja);setForm({...c});}} style={{ background:"#1e293b", border:"none", borderRadius:6, padding:"4px 10px", color:"#94a3b8", cursor:"pointer", fontSize:11 }}>✏️</button></td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>
    </div>
  );
};

// ─── TRACTOS ──────────────────────────────────────────────────────────────────
const Tractos = ({ data, setData }) => {
  const [q,setQ]=useState(""); const [coord,setCoord]=useState(""); const [efil,setEfil]=useState("");
  const [editando,setEditando]=useState(null); const [form,setForm]=useState({});
  const [showImport,setShowImport]=useState(false);

  const lista=data.tractos.filter(t=>{
    const tx=q.toLowerCase();
    return (!q||(t.unidad+t.operador+t.circuito+t.ubicacion).toLowerCase().includes(tx))
      &&(!coord||t.coordinador.toUpperCase().includes(coord))
      &&(!efil||t.estatus.includes(efil));
  });
  const guardar=()=>{
    const updated={...data,tractos:data.tractos.map(t=>t.unidad===editando?{...t,...form}:t),lastUpdate:new Date().toISOString()};
    setData(updated);saveLocal(updated);setEditando(null);
    if(USAR_SHEETS) sheetsPost("Tractos",updated.tractos);
  };
  const importar=(filas,modo)=>{
    const nuevos=modo==="reemplazar"?filas:[...data.tractos,...filas.filter(f=>!data.tractos.find(t=>t.unidad===f.unidad))];
    const updated={...data,tractos:nuevos,lastUpdate:new Date().toISOString()};
    setData(updated);saveLocal(updated);
    if(USAR_SHEETS) sheetsPost("Tractos",nuevos);
  };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      {editando&&<Modal title={`Editar ${editando}`} onClose={()=>setEditando(null)}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1f", gap:12 }}>
          <Input label="Estatus" value={form.estatus||""} onChange={v=>setForm(f=>({...f,estatus:v}))} options={["VTA - Facturando","DCO - Disponible","Activo","Sin Operador","SG - Siniestro","RM - Reparacion Mayor","CP - Correctivo","Mantenimiento","LIB - Por Liberar","Siniestro"]}/>
          <Input label="Ubicación" value={form.ubicacion||""} onChange={v=>setForm(f=>({...f,ubicacion:v}))}/>
          <Input label="Operador" value={form.operador||""} onChange={v=>setForm(f=>({...f,operador:v}))}/>
          <Input label="Circuito" value={form.circuito||""} onChange={v=>setForm(f=>({...f,circuito:v}))} options={["Reynosa - Bajio","Remolacha","DX","Adient","Mty-Bajio","Nld-Bajio","Carrier","Pordefinir","-"]}/>
          <Input label="Coordinador" value={form.coordinador||""} onChange={v=>setForm(f=>({...f,coordinador:v}))} options={["JULIO HERNANDEZ","JUAN JOSE TELLO","CRISTIAN ZUÑIGA"]}/>
        </div>
        <button onClick={guardar} style={{ marginTop:14,width:"100%",background:"#3b82f6",border:"none",borderRadius:8,padding:"10px",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13 }}>💾 Guardar</button>
      </Modal>}
      {showImport&&<Modal title="📥 Importar Tractos" onClose={()=>setShowImport(false)} wide><ImportadorMasivo tipo="tractos" onImportar={importar} onClose={()=>setShowImport(false)}/></Modal>}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        <input placeholder="🔍 Buscar unidad, operador..." value={q} onChange={e=>setQ(e.target.value)} style={{ flex:1, minWidth:180, background:"#0a1628", border:"1px solid #1e293b", borderRadius:8, padding:"8px 12px", color:"#f1f5f9", fontSize:12, outline:"none" }}/>
        <select value={coord} onChange={e=>setCoord(e.target.value)} style={{ background:"#0a1628", border:"1px solid #1e293b", borderRadius:8, padding:"8px 10px", color:"#f1f5f9", fontSize:12, outline:"none" }}>
          <option value="">Todos</option><option value="TELLO">Tello</option><option value="CRISTIAN">Cristian</option><option value="JULIO">Julio</option>
        </select>
        <select value={efil} onChange={e=>setEfil(e.target.value)} style={{ background:"#0a1628", border:"1px solid #1e293b", borderRadius:8, padding:"8px 10px", color:"#f1f5f9", fontSize:12, outline:"none" }}>
          <option value="">Todos</option><option value="VTA">En Ruta</option><option value="DCO">Disponible</option><option value="Sin Operador">Sin Op</option><option value="SG">Siniestro</option><option value="Mantenimiento">Mtto</option>
        </select>
        <button onClick={()=>setShowImport(true)} style={{ background:"#1e3a5f", border:"1px solid #3b82f640", borderRadius:8, padding:"8px 12px", color:"#3b82f6", fontSize:11, cursor:"pointer", fontWeight:700 }}>📥 Importar</button>
        <button onClick={()=>downloadCSV(toCSV(data.tractos,["unidad","operador","coordinador","estatus","circuito","ubicacion"]),"tractos.csv")} style={{ background:"#1e3a2f", border:"1px solid #10b98144", borderRadius:8, padding:"8px 12px", color:"#10b981", fontSize:11, cursor:"pointer", fontWeight:700 }}>⬇️ CSV</button>
      </div>
      <div style={{ color:"#475569", fontSize:11 }}>{lista.length} de {data.tractos.length} tractos</div>
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
          <thead><tr style={{ borderBottom:"2px solid #1e293b" }}>{["Unidad","Operador","Coordinador","Estatus","Circuito","Ubicación",""].map(h=><th key={h} style={{ textAlign:"left", padding:"8px 10px", color:"#475569", fontSize:10, textTransform:"uppercase" }}>{h}</th>)}</tr></thead>
          <tbody>{lista.map((t,i)=>(
            <tr key={t.unidad} style={{ borderBottom:"1px solid #0d1626", background:i%2===0?"#080e1c":"transparent" }}>
              <td style={{ padding:"9px 10px", color:"#f1f5f9", fontWeight:800, fontFamily:"monospace" }}>{t.unidad}</td>
              <td style={{ padding:"9px 10px", color:"#94a3b8", maxWidth:160, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.operador}</td>
              <td style={{ padding:"9px 10px" }}><span style={{ color:coordColor(t.coordinador), fontWeight:700, fontSize:11 }}>{t.coordinador.split(" ")[0]}</span></td>
              <td style={{ padding:"9px 10px" }}><Badge text={t.estatus}/></td>
              <td style={{ padding:"9px 10px", color:"#64748b" }}>{t.circuito}</td>
              <td style={{ padding:"9px 10px", color:"#94a3b8" }}>{t.ubicacion}</td>
              <td style={{ padding:"9px 10px" }}><button onClick={()=>{setEditando(t.unidad);setForm({...t});}} style={{ background:"#1e293b", border:"none", borderRadius:6, padding:"4px 10px", color:"#94a3b8", cursor:"pointer", fontSize:11 }}>✏️</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
};

// ─── VIAJES & RENTABILIDAD ────────────────────────────────────────────────────
const Viajes = ({ data, setData }) => {
  const [modo,setModo]=useState("lista"); const [q,setQ]=useState(""); const [showImport,setShowImport]=useState(false);
  const [unNeg,setUnNeg]=useState("NACIONALES");
  const [form,setForm]=useState({ semana:"15", fecha:new Date().toISOString().split("T")[0], coordinador:"", unidad:"", caja:"", cliente:"", circuito:"", unidadNegocio:"NACIONALES", estatus:"Programado", ventaEst:"", ventaReal:"", costoOp:"4500", diesel:"3200", casetas:"800", costoMtto:"0", kmRecorridos:"", litrosDiesel:"", fechaEntregaProg:"", fechaEntregaReal:"", entregado:"false" });

  const viajes=data.viajes.filter(v=>{
    const t=q.toLowerCase();
    const matchQ=!q||(v.unidad+v.cliente+v.coordinador).toLowerCase().includes(t);
    const matchN=!unNeg||((v.unidadNegocio||"NACIONALES").toUpperCase()===unNeg);
    return matchQ&&matchN;
  });

  const guardarViaje=()=>{
    const id=`V-${String(data.viajes.length+1).padStart(3,"0")}`;
    const n={...form,id,semana:+form.semana,ventaEst:+form.ventaEst,ventaReal:form.ventaReal?+form.ventaReal:null,costoOp:+form.costoOp,diesel:+form.diesel,casetas:+form.casetas,costoMtto:+form.costoMtto,kmRecorridos:+form.kmRecorridos,litrosDiesel:+form.litrosDiesel,entregado:form.entregado==="true"};
    const updated={...data,viajes:[...data.viajes,n],lastUpdate:new Date().toISOString()};
    setData(updated);saveLocal(updated);setModo("lista");
    if(USAR_SHEETS) sheetsPost("Viajes",updated.viajes);
  };
  const importar=(filas,modo)=>{
    const nuevos=modo==="reemplazar"?filas:[...data.viajes,...filas];
    const updated={...data,viajes:nuevos,lastUpdate:new Date().toISOString()};
    setData(updated);saveLocal(updated);
    if(USAR_SHEETS) sheetsPost("Viajes",nuevos);
  };
  const util=(v)=>v.ventaReal?+v.ventaReal-(+v.costoOp||0)-(+v.diesel||0)-(+v.casetas||0)-(+v.costoMtto||0):null;
  const kml=(v)=>(+v.kmRecorridos>0&&+v.litrosDiesel>0)?(+v.kmRecorridos/+v.litrosDiesel).toFixed(2):null;

  // Totales
  const realizados=viajes.filter(v=>v.estatus==="Realizado");
  const totVenta=realizados.reduce((s,v)=>s+(+v.ventaReal||0),0);
  const totCosto=realizados.reduce((s,v)=>s+(+v.costoOp||0)+(+v.diesel||0)+(+v.casetas||0)+(+v.costoMtto||0),0);
  const totUtil=totVenta-totCosto;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      {modo==="nuevo"&&<Modal title="➕ Registrar Viaje" onClose={()=>setModo("lista")}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          <Input label="Semana" value={form.semana} onChange={v=>setForm(f=>({...f,semana:v}))}/>
          <Input label="Fecha" value={form.fecha} onChange={v=>setForm(f=>({...f,fecha:v}))} type="date"/>
          <Input label="Coordinador" value={form.coordinador} onChange={v=>setForm(f=>({...f,coordinador:v}))} options={["JUAN JOSE TELLO","CRISTIAN ZUÑIGA","JULIO HERNANDEZ"]} required/>
          <Input label="Unidad" value={form.unidad} onChange={v=>setForm(f=>({...f,unidad:v}))} options={data.tractos.map(t=>t.unidad)} required/>
          <Input label="Caja" value={form.caja} onChange={v=>setForm(f=>({...f,caja:v}))} options={data.cajas.map(c=>c.caja)} required/>
          <Input label="Cliente" value={form.cliente} onChange={v=>setForm(f=>({...f,cliente:v}))} required/>
          <Input label="Circuito" value={form.circuito} onChange={v=>setForm(f=>({...f,circuito:v}))} options={Object.keys(CIRCUITOS_CONFIG)}/>
          <Input label="Unidad Negocio" value={form.unidadNegocio} onChange={v=>setForm(f=>({...f,unidadNegocio:v}))} options={["NACIONALES","INTERNACIONAL","DX","SPOT"]}/>
          <Input label="Estatus" value={form.estatus} onChange={v=>setForm(f=>({...f,estatus:v}))} options={["Programado","En Ruta","Realizado","Cancelado"]}/>
          <Input label="Entregado" value={form.entregado} onChange={v=>setForm(f=>({...f,entregado:v}))} options={["false","true"]}/>
          <Input label="Venta Estimada $" value={form.ventaEst} onChange={v=>setForm(f=>({...f,ventaEst:v}))} type="number"/>
          <Input label="Venta Real $" value={form.ventaReal} onChange={v=>setForm(f=>({...f,ventaReal:v}))} type="number"/>
          <Input label="Costo Operador $" value={form.costoOp} onChange={v=>setForm(f=>({...f,costoOp:v}))} type="number"/>
          <Input label="Diesel $" value={form.diesel} onChange={v=>setForm(f=>({...f,diesel:v}))} type="number"/>
          <Input label="Casetas $" value={form.casetas} onChange={v=>setForm(f=>({...f,casetas:v}))} type="number"/>
          <Input label="Costo Mtto $" value={form.costoMtto} onChange={v=>setForm(f=>({...f,costoMtto:v}))} type="number"/>
          <Input label="Km Recorridos" value={form.kmRecorridos} onChange={v=>setForm(f=>({...f,kmRecorridos:v}))} type="number"/>
          <Input label="Litros Diesel" value={form.litrosDiesel} onChange={v=>setForm(f=>({...f,litrosDiesel:v}))} type="number"/>
          <Input label="Fecha Entrega Prog." value={form.fechaEntregaProg} onChange={v=>setForm(f=>({...f,fechaEntregaProg:v}))} type="date"/>
          <Input label="Fecha Entrega Real" value={form.fechaEntregaReal} onChange={v=>setForm(f=>({...f,fechaEntregaReal:v}))} type="date"/>
        </div>
        {form.ventaEst&&+form.ventaEst>0&&(
          <div style={{ marginTop:10, background:"#0a1628", borderRadius:8, padding:12, border:"1px solid #1e293b", display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            <div>
              <div style={{ fontSize:10, color:"#64748b" }}>UTILIDAD EST.</div>
              <div style={{ fontSize:20, fontWeight:900, color:"#10b981" }}>${(+form.ventaEst-(+form.costoOp)-(+form.diesel)-(+form.casetas)-(+form.costoMtto)).toLocaleString()}</div>
            </div>
            {form.kmRecorridos&&+form.litrosDiesel>0&&(
              <div>
                <div style={{ fontSize:10, color:"#64748b" }}>KM/L EST.</div>
                <div style={{ fontSize:20, fontWeight:900, color:"#6366f1" }}>{(+form.kmRecorridos/+form.litrosDiesel).toFixed(2)}</div>
              </div>
            )}
          </div>
        )}
        <button onClick={guardarViaje} style={{ marginTop:12, width:"100%", background:"#6366f1", border:"none", borderRadius:8, padding:"11px", color:"#fff", fontWeight:700, cursor:"pointer", fontSize:13 }}>✅ Registrar</button>
      </Modal>}
      {showImport&&<Modal title="📥 Importar Viajes" onClose={()=>setShowImport(false)} wide><ImportadorMasivo tipo="viajes" onImportar={importar} onClose={()=>setShowImport(false)}/></Modal>}

      {/* Totales */}
      {realizados.length>0&&(
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
          {[["💵 Venta Total",`$${(totVenta/1000).toFixed(1)}K`,"#10b981"],["📉 Costo Total",`$${(totCosto/1000).toFixed(1)}K`,"#f59e0b"],["📊 Utilidad",`$${(totUtil/1000).toFixed(1)}K`,totUtil>=0?"#10b981":"#ef4444"]].map(([l,v,c])=>(
            <div key={l} style={{ background:"#0a1628", border:`1px solid ${c}30`, borderRadius:10, padding:"12px 14px" }}>
              <div style={{ color:c, fontWeight:900, fontSize:20 }}>{v}</div>
              <div style={{ color:"#475569", fontSize:10 }}>{l}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
        <input placeholder="🔍 Buscar..." value={q} onChange={e=>setQ(e.target.value)} style={{ flex:1, minWidth:160, background:"#0a1628", border:"1px solid #1e293b", borderRadius:8, padding:"8px 12px", color:"#f1f5f9", fontSize:12, outline:"none" }}/>
        <select value={unNeg} onChange={e=>setUnNeg(e.target.value)} style={{ background:"#0a1628", border:"1px solid #1e293b", borderRadius:8, padding:"8px 10px", color:"#f1f5f9", fontSize:12, outline:"none" }}>
          <option value="">Todos</option><option value="NACIONALES">NACIONALES</option><option value="INTERNACIONAL">INTERNACIONAL</option><option value="DX">DX</option><option value="SPOT">SPOT</option>
        </select>
        <button onClick={()=>setModo("nuevo")} style={{ background:"#6366f1", border:"none", borderRadius:8, padding:"8px 14px", color:"#fff", fontWeight:700, cursor:"pointer", fontSize:12 }}>＋ Nuevo</button>
        <button onClick={()=>setShowImport(true)} style={{ background:"#1e3a5f", border:"1px solid #3b82f640", borderRadius:8, padding:"8px 12px", color:"#3b82f6", fontSize:11, cursor:"pointer", fontWeight:700 }}>📥 Importar</button>
        <button onClick={()=>downloadCSV(toCSV(data.viajes,["id","semana","fecha","coordinador","unidad","caja","cliente","circuito","unidadNegocio","estatus","ventaEst","ventaReal","costoOp","diesel","casetas","costoMtto","kmRecorridos","litrosDiesel","fechaEntregaProg","fechaEntregaReal","entregado"]),"viajes.csv")} style={{ background:"#1e3a2f", border:"1px solid #10b98144", borderRadius:8, padding:"8px 12px", color:"#10b981", fontSize:11, cursor:"pointer", fontWeight:700 }}>⬇️ CSV</button>
      </div>

      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
          <thead><tr style={{ borderBottom:"2px solid #1e293b" }}>{["Sem","Coord","Unidad","Caja","Cliente","Negocio","Estatus","Venta Real","Costo","Utilidad","Margen","KM/L","Entrega"].map(h=><th key={h} style={{ textAlign:"left", padding:"8px 10px", color:"#475569", fontSize:10, textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>)}</tr></thead>
          <tbody>{viajes.map((v,i)=>{
            const u=util(v); const m=v.ventaReal&&+v.ventaReal>0?((u/+v.ventaReal)*100).toFixed(1):null; const k=kml(v);
            const sem=semaforoEntrega(v.fechaEntregaProg,v.entregado);
            return (
              <tr key={v.id} style={{ borderBottom:"1px solid #0d1626", background:i%2===0?"#080e1c":"transparent" }}>
                <td style={{ padding:"9px 10px", color:"#64748b" }}>{v.semana}</td>
                <td style={{ padding:"9px 10px" }}><span style={{ color:coordColor(v.coordinador), fontWeight:700, fontSize:11 }}>{v.coordinador.split(" ")[0]}</span></td>
                <td style={{ padding:"9px 10px", color:"#f1f5f9", fontFamily:"monospace", fontWeight:700 }}>{v.unidad}</td>
                <td style={{ padding:"9px 10px", color:"#94a3b8", fontFamily:"monospace" }}>{v.caja}</td>
                <td style={{ padding:"9px 10px", color:"#94a3b8", maxWidth:110, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{v.cliente}</td>
                <td style={{ padding:"9px 10px" }}><span style={{ color:"#6366f1", fontSize:10, fontWeight:700 }}>{v.unidadNegocio||"NAC"}</span></td>
                <td style={{ padding:"9px 10px" }}><Badge text={v.estatus}/></td>
                <td style={{ padding:"9px 10px", color:v.ventaReal?"#10b981":"#334155", fontWeight:700 }}>{v.ventaReal?`$${(+v.ventaReal).toLocaleString()}`:"—"}</td>
                <td style={{ padding:"9px 10px", color:"#f59e0b" }}>${((+v.costoOp||0)+(+v.diesel||0)+(+v.casetas||0)+(+v.costoMtto||0)).toLocaleString()}</td>
                <td style={{ padding:"9px 10px", color:u!=null?(u>=0?"#10b981":"#ef4444"):"#334155", fontWeight:700 }}>{u!=null?`$${u.toLocaleString()}`:"—"}</td>
                <td style={{ padding:"9px 10px", color:m?(+m>=20?"#10b981":"#f59e0b"):"#334155" }}>{m?`${m}%`:"—"}</td>
                <td style={{ padding:"9px 10px", color:k?(+k>=3?"#10b981":+k>=2.5?"#f59e0b":"#ef4444"):"#334155", fontWeight:k?700:400 }}>{k||"—"}</td>
                <td style={{ padding:"9px 10px", whiteSpace:"nowrap" }}><span style={{ color:sem.color, fontSize:11, fontWeight:700 }}>{sem.icon} {sem.texto}</span></td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>
    </div>
  );
};

// ─── DISTRIBUCIÓN ─────────────────────────────────────────────────────────────
const Distribucion = ({ data }) => {
  const { tractos, viajes } = data;
  const circMap = {};
  tractos.forEach(t => {
    const c=t.circuito||"-";
    if(!circMap[c]) circMap[c]={total:0,enRuta:0,activos:0,mtto:0,sinOp:0};
    circMap[c].total++;
    if(t.estatus.includes("VTA")||t.estatus.includes("Facturando")) circMap[c].enRuta++;
    else if(t.estatus.includes("Activo")) circMap[c].activos++;
    else if(["SG","RM","CP","Mantenimiento","Correctivo","Siniestro"].some(x=>t.estatus.includes(x))) circMap[c].mtto++;
    else circMap[c].sinOp++;
  });
  const coords=[{n:"Juan José Tello",k:"TELLO",col:"#3b82f6"},{n:"Cristian Zuñiga",k:"CRISTIAN",col:"#10b981"},{n:"Julio Hernandez",k:"JULIO",col:"#f59e0b"}].map(coord=>{
    const ts=tractos.filter(t=>t.coordinador.toUpperCase().includes(coord.k));
    const enRuta=ts.filter(t=>t.estatus.includes("VTA")||t.estatus.includes("Facturando")).length;
    const activos=ts.filter(t=>t.estatus.includes("Activo")).length;
    const mtto=ts.filter(t=>["SG","RM","CP","Mantenimiento","Correctivo","Siniestro"].some(x=>t.estatus.includes(x))).length;
    const sinOp=ts.length-enRuta-activos-mtto;
    const vK=viajes.filter(v=>v.coordinador.toUpperCase().includes(coord.k)&&+v.kmRecorridos>0&&+v.litrosDiesel>0);
    const kml=vK.length>0?(vK.reduce((s,v)=>s+(+v.kmRecorridos/+v.litrosDiesel),0)/vK.length).toFixed(2):"—";
    return {...coord,total:ts.length,enRuta,activos,mtto,sinOp,kml};
  });
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div>
        <div style={{ color:"#475569", fontSize:11, textTransform:"uppercase", letterSpacing:1.5, marginBottom:10 }}>👥 Por Coordinador</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:10 }}>
          {coords.map(c=>(
            <div key={c.k} style={{ background:"#0a1628", border:`1px solid ${c.col}30`, borderRadius:12, padding:16 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:c.col, boxShadow:`0 0 8px ${c.col}` }}/>
                <div style={{ color:"#f1f5f9", fontWeight:800, fontSize:14 }}>{c.n}</div>
                <div style={{ marginLeft:"auto", background:c.col+"20", color:c.col, borderRadius:6, padding:"2px 8px", fontSize:12, fontWeight:700 }}>{c.total}</div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6, textAlign:"center", marginBottom:12 }}>
                {[["En Ruta",c.enRuta,"#10b981"],["Activos",c.activos,"#3b82f6"],["Mtto",c.mtto,"#f59e0b"],["Sin Op",c.sinOp,"#64748b"]].map(([l,v,col])=>(
                  <div key={l} style={{ background:col+"15", borderRadius:7, padding:"6px 4px" }}>
                    <div style={{ color:col, fontWeight:900, fontSize:18 }}>{v}</div>
                    <div style={{ color:"#475569", fontSize:9, textTransform:"uppercase" }}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", justifyContent:"flex-end", borderTop:"1px solid #1e293b", paddingTop:10 }}>
                <div style={{ background:"#0d1626", borderRadius:7, padding:"4px 10px", textAlign:"center" }}>
                  <div style={{ color:c.col, fontWeight:900, fontSize:16 }}>{c.kml}</div>
                  <div style={{ color:"#475569", fontSize:9 }}>KM/L</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={{ color:"#475569", fontSize:11, textTransform:"uppercase", letterSpacing:1.5, marginBottom:10 }}>🔁 Por Circuito</div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
            <thead><tr style={{ borderBottom:"2px solid #1e293b" }}>{["Circuito","Total","En Ruta","Activos","Mtto","Sin Op","% Operando","Siguiente Ruta"].map(h=><th key={h} style={{ textAlign:"left", padding:"8px 12px", color:"#475569", fontSize:10, textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>)}</tr></thead>
            <tbody>{Object.entries(circMap).sort((a,b)=>b[1].total-a[1].total).map(([circ,v],i)=>{
              const pct=v.total>0?(((v.enRuta+v.activos)/v.total)*100).toFixed(0):0;
              const cfg=CIRCUITOS_CONFIG[circ];
              return (
                <tr key={circ} style={{ borderBottom:"1px solid #0d1626", background:i%2===0?"#080e1c":"transparent" }}>
                  <td style={{ padding:"10px 12px", color:"#f1f5f9", fontWeight:700 }}>{circ}</td>
                  <td style={{ padding:"10px 12px", color:"#94a3b8", fontWeight:700 }}>{v.total}</td>
                  <td style={{ padding:"10px 12px" }}><span style={{ color:"#10b981", fontWeight:700 }}>{v.enRuta}</span></td>
                  <td style={{ padding:"10px 12px" }}><span style={{ color:"#3b82f6", fontWeight:700 }}>{v.activos}</span></td>
                  <td style={{ padding:"10px 12px" }}><span style={{ color:"#f59e0b", fontWeight:700 }}>{v.mtto}</span></td>
                  <td style={{ padding:"10px 12px" }}><span style={{ color:"#64748b", fontWeight:700 }}>{v.sinOp}</span></td>
                  <td style={{ padding:"10px 12px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <div style={{ flex:1, height:5, background:"#1e293b", borderRadius:3, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${pct}%`, background:pct>=70?"#10b981":pct>=40?"#f59e0b":"#ef4444", borderRadius:3 }}/>
                      </div>
                      <span style={{ color:pct>=70?"#10b981":pct>=40?"#f59e0b":"#ef4444", fontWeight:700, fontSize:11, minWidth:28 }}>{pct}%</span>
                    </div>
                  </td>
                  <td style={{ padding:"10px 12px", color:cfg?cfg.color:"#475569", fontSize:10, fontWeight:cfg?700:400 }}>{cfg?`➡️ ${cfg.siguiente}`:"—"}</td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── ALERTAS ──────────────────────────────────────────────────────────────────
const Alertas = ({ data }) => {
  const hoy = new Date(); hoy.setHours(0,0,0,0);
  const alertasDinamicas = [];

  // Cajas no entregadas a tiempo
  data.viajes.filter(v=>!v.entregado&&v.fechaEntregaProg).forEach(v=>{
    const prog=new Date(v.fechaEntregaProg); prog.setHours(0,0,0,0);
    const diff=Math.floor((prog-hoy)/86400000);
    if(diff<0) alertasDinamicas.push({ tipo:"Entrega Vencida", unidad:v.unidad, caja:v.caja, op:v.cliente, coord:v.coordinador.split(" ")[0], desc:`Entrega vencida hace ${Math.abs(diff)} día(s) — ${v.circuito}`, fecha:v.fechaEntregaProg });
    else if(diff===0) alertasDinamicas.push({ tipo:"Entrega Hoy", unidad:v.unidad, caja:v.caja, op:v.cliente, coord:v.coordinador.split(" ")[0], desc:`Entrega programada HOY — ${v.circuito}`, fecha:v.fechaEntregaProg });
  });

  // Cajas dañadas
  data.cajas.filter(c=>c.estatus==="Dañada").forEach(c=>{
    alertasDinamicas.push({ tipo:"Caja Dañada", unidad:"-", caja:c.caja, op:"-", coord:c.coordinador.split(" ")[0], desc:`Dañada en ${c.ciudad||c.patio||"patio"}`, fecha:"" });
  });

  // Sin operador
  data.tractos.filter(t=>t.estatus.includes("Sin Operador")).slice(0,5).forEach(t=>{
    alertasDinamicas.push({ tipo:"Sin Operador", unidad:t.unidad, caja:"-", op:"VACANTE", coord:t.coordinador.split(" ")[0], desc:"Unidad sin operador asignado", fecha:"" });
  });

  // Siniestros
  data.tractos.filter(t=>t.estatus.includes("Siniestro")||t.estatus.includes("SG")).slice(0,3).forEach(t=>{
    alertasDinamicas.push({ tipo:"Siniestro", unidad:t.unidad, caja:"-", op:t.operador, coord:t.coordinador.split(" ")[0], desc:`${t.estatus} — ${t.ubicacion}`, fecha:"" });
  });

  // Cajas a revisar
  data.cajas.filter(c=>c.estatus==="Revisar").forEach(c=>{
    alertasDinamicas.push({ tipo:"Caja Revisar", unidad:"-", caja:c.caja, op:"-", coord:c.coordinador.split(" ")[0], desc:c.comentarios||"Pendiente revisión", fecha:"" });
  });

  const colores={"Entrega Vencida":"#ef4444","Entrega Hoy":"#f59e0b","Sin Operador":"#64748b","Siniestro":"#ef4444","Caja Dañada":"#f97316","Caja Revisar":"#a855f7","Seguridad $":"#f59e0b"};

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      <div style={{ color:"#475569", fontSize:11 }}>{alertasDinamicas.length} alertas activas (generadas automáticamente)</div>
      {alertasDinamicas.length===0&&<div style={{ color:"#334155", textAlign:"center", padding:24, fontSize:13 }}>✅ Sin alertas activas</div>}
      {alertasDinamicas.map((a,i)=>{
        const col=colores[a.tipo]||"#6366f1";
        return (
          <div key={i} style={{ background:"#0a1628", border:`1px solid ${col}25`, borderLeft:`3px solid ${col}`, borderRadius:8, padding:"12px 14px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:4 }}><Badge text={a.tipo}/>{a.fecha&&<span style={{ color:"#334155", fontSize:10 }}>{a.fecha}</span>}</div>
                <div style={{ color:"#cbd5e1", fontSize:12, fontWeight:600 }}>{a.op}</div>
                <div style={{ color:"#475569", fontSize:11, marginTop:2 }}>
                  {a.unidad!=="-"&&<span>🚛 {a.unidad} </span>}{a.caja!=="-"&&<span>📦 {a.caja} </span>}— {a.desc}
                </div>
              </div>
              <span style={{ color:coordColor(a.coord), fontSize:10, fontWeight:700 }}>{a.coord}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── APP ──────────────────────────────────────────────────────────────────────
const TABS=[
  {id:"dashboard",label:"Dashboard",icon:"📊"},
  {id:"tracker",label:"Tracker",icon:"🛣️"},
  {id:"distribucion",label:"Distribución",icon:"🗂️"},
  {id:"tractos",label:"Tractos",icon:"🚛"},
  {id:"cajas",label:"Cajas",icon:"📦"},
  {id:"viajes",label:"Viajes",icon:"💰"},
  {id:"alertas",label:"Alertas",icon:"🔔"},
];

function App() {
  const [data,setData]=useState(()=>initData());
  const [tab,setTab]=useState("dashboard");
  const [syncState,setSyncState]=useState("idle");
  useEffect(()=>{saveLocal(data);},[data]);
  useEffect(()=>{ if(!USAR_SHEETS) return; syncFromSheets(); },[]);

  const syncFromSheets=async()=>{
    setSyncState("syncing");
    try {
      const [tractos,cajas,viajes]=await Promise.all([sheetsGet("Tractos"),sheetsGet("Cajas"),sheetsGet("Viajes")]);
      const updated={
        tractos:tractos.length?tractos:data.tractos,
        cajas:cajas.length?cajas.map(mapCaja):data.cajas,
        viajes:viajes.length?viajes.map(mapViaje):data.viajes,
        lastUpdate:new Date().toISOString(),
      };
      setData(updated);saveLocal(updated);setSyncState("ok");
      setTimeout(()=>setSyncState("idle"),3000);
    } catch(e){ setSyncState("error"); setTimeout(()=>setSyncState("idle"),5000); }
  };

  // Alertas en tab
  const hoy=new Date(); hoy.setHours(0,0,0,0);
  const alertCount=data.viajes.filter(v=>!v.entregado&&v.fechaEntregaProg&&new Date(v.fechaEntregaProg)<=hoy).length
    +data.cajas.filter(c=>c.estatus==="Dañada").length;

  return (
    <div style={{ minHeight:"100vh", background:"#060d1a", color:"#e2e8f0", fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>
      <div style={{ background:"#08111f", borderBottom:"1px solid #0f1e33", padding:"12px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <div>
          <div style={{ fontSize:15, fontWeight:900, color:"#f1f5f9", letterSpacing:-.5 }}>🚚 Nacional Autotransporte</div>
          <div style={{ fontSize:9, color:"#334155", letterSpacing:1.5, textTransform:"uppercase" }}>ERP TMS v4 {USAR_SHEETS?"· ☁️ Sheets":"· 💾 Local"}</div>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <div style={{ width:7, height:7, borderRadius:"50%", background:"#10b981", boxShadow:"0 0 8px #10b981" }}/>
          <span style={{ color:"#10b981", fontSize:10, fontWeight:700 }}>OPERATIVO</span>
        </div>
      </div>
      <div style={{ background:"#08111f", borderBottom:"1px solid #0f1e33", display:"flex", overflowX:"auto", padding:"0 14px" }}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{ background:"none", border:"none", borderBottom:tab===t.id?"2px solid #3b82f6":"2px solid transparent", color:tab===t.id?"#f1f5f9":"#475569", padding:"11px 12px", cursor:"pointer", fontSize:11, fontWeight:tab===t.id?700:400, whiteSpace:"nowrap", display:"flex", gap:4, alignItems:"center", position:"relative" }}>
            {t.icon} {t.label}
            {t.id==="alertas"&&alertCount>0&&<span style={{ background:"#ef4444", color:"#fff", borderRadius:"50%", width:16, height:16, fontSize:9, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center", marginLeft:2 }}>{alertCount}</span>}
          </button>
        ))}
      </div>
      <div style={{ padding:16, maxWidth:1400, margin:"0 auto" }}>
        <SyncBanner syncState={syncState} onSync={syncFromSheets}/>
        {tab==="dashboard"    && <Dashboard data={data}/>}
        {tab==="tracker"      && <TrackerLineal data={data}/>}
        {tab==="distribucion" && <Distribucion data={data}/>}
        {tab==="tractos"      && <Tractos data={data} setData={setData}/>}
        {tab==="cajas"        && <Cajas data={data} setData={setData}/>}
        {tab==="viajes"       && <Viajes data={data} setData={setData}/>}
        {tab==="alertas"      && <Alertas data={data}/>}
      </div>
      <div style={{ padding:"12px 18px", borderTop:"1px solid #0f1e33", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ color:"#1e3a5f", fontSize:10 }}>{data.tractos.length} Tractos · {data.cajas.length} Cajas · v4</span>
        <button onClick={()=>{ if(window.confirm("¿Resetear datos locales a los originales?")){ localStorage.removeItem(STORAGE_KEY); window.location.reload(); }}} style={{ background:"none", border:"1px solid #1e293b", borderRadius:6, padding:"4px 10px", color:"#334155", fontSize:10, cursor:"pointer" }}>🔄 Reset</button>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
