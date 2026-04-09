// ═══════════════════════════════════════════════════════════════════════════
//  NACIONAL AUTOTRANSPORTE — ERP TMS v3
//  Google Sheets sync | Distribución circuito/coordinador | KM/L
// ═══════════════════════════════════════════════════════════════════════════

const { useState, useEffect, useRef, useCallback } = React;

// ─── CONFIG ── PEGA AQUÍ TU URL DE APPS SCRIPT ──────────────────────────────
const SHEETS_URL = window.SHEETS_URL || "PEGA_TU_URL_AQUI";
const USAR_SHEETS = SHEETS_URL !== "PEGA_TU_URL_AQUI";

// ─── DATOS SEMILLA (se usan si no hay Sheets configurado) ────────────────────
const TRACTOS_SEED = [
  { unidad:"018-ABC", operador:"VICTOR MANUEL ARAMBULA OLGUIN", coordinador:"JULIO HERNANDEZ", estatus:"Activo", circuito:"Remolacha", ubicacion:"Reynosa" },
  { unidad:"020-ABC", operador:"JESUS GUILLERMO TORRES OCHOA", coordinador:"JULIO HERNANDEZ", estatus:"Activo", circuito:"Adient", ubicacion:"Arteaga" },
  { unidad:"021-ABC", operador:"MTTO", coordinador:"JUAN JOSE TELLO", estatus:"SG - Siniestro", circuito:"Pordefinir", ubicacion:"Taller" },
  { unidad:"023-ABC", operador:"PEDRO ROSALINO RUBIO", coordinador:"CRISTIAN ZUÑIGA", estatus:"Activo", circuito:"Remolacha", ubicacion:"Reynosa" },
  { unidad:"034-ABC", operador:"MTTO", coordinador:"JUAN JOSE TELLO", estatus:"SG - Siniestro", circuito:"Pordefinir", ubicacion:"Taller" },
  { unidad:"035-ABC", operador:"MTTO", coordinador:"JUAN JOSE TELLO", estatus:"SG - Siniestro", circuito:"Pordefinir", ubicacion:"Taller" },
  { unidad:"046-ABC", operador:"GILBERTO GUTIERREZ GUTIERREZ", coordinador:"JULIO HERNANDEZ", estatus:"Activo", circuito:"Carrier", ubicacion:"Monterrey" },
  { unidad:"060-ABC", operador:"VACANTE", coordinador:"CRISTIAN ZUÑIGA", estatus:"Sin Operador", circuito:"-", ubicacion:"Patio" },
  { unidad:"084-ABC", operador:"ROBERTO MARTINEZ LEDEZMA", coordinador:"JULIO HERNANDEZ", estatus:"Activo", circuito:"Remolacha", ubicacion:"Reynosa" },
  { unidad:"089-ABC", operador:"LUIS RODRIGUEZ BENAVIDES", coordinador:"JULIO HERNANDEZ", estatus:"Activo", circuito:"Remolacha", ubicacion:"Reynosa" },
  { unidad:"090-ABC", operador:"MARCO ANTONIO VALENCIA CAMACHO", coordinador:"JULIO HERNANDEZ", estatus:"Activo", circuito:"Remolacha", ubicacion:"Bajio" },
  { unidad:"097-ABC", operador:"ANTONIO LOZANO GONZALEZ", coordinador:"JULIO HERNANDEZ", estatus:"Activo", circuito:"Carrier", ubicacion:"Monterrey" },
  { unidad:"100-ABC", operador:"MTTO", coordinador:"JULIO HERNANDEZ", estatus:"Mantenimiento", circuito:"-", ubicacion:"Taller" },
  { unidad:"102-ABC", operador:"MTTO", coordinador:"JUAN JOSE TELLO", estatus:"RM - Reparacion Mayor", circuito:"Pordefinir", ubicacion:"Taller" },
  { unidad:"105-ABC", operador:"FEBRONIO FERNANDEZ RODRIGUEZ", coordinador:"JUAN JOSE TELLO", estatus:"VTA - Facturando", circuito:"Reynosa - Bajio", ubicacion:"En ruta" },
  { unidad:"125-ABC", operador:"RENAN ELIU TECO MACIAS", coordinador:"JULIO HERNANDEZ", estatus:"Activo", circuito:"Remolacha", ubicacion:"Reynosa" },
  { unidad:"132-ABC", operador:"OSCAR EMMANUEL ESPINOZA BUSTAMANTE", coordinador:"JULIO HERNANDEZ", estatus:"Activo", circuito:"Remolacha", ubicacion:"Bajio" },
  { unidad:"143-ABC", operador:"EDUARDO CABALLERO CASTILLO", coordinador:"JULIO HERNANDEZ", estatus:"Activo", circuito:"Adient", ubicacion:"Arteaga" },
  { unidad:"144-ABC", operador:"ROGELIO FLORES VAZQUEZ", coordinador:"JULIO HERNANDEZ", estatus:"Activo", circuito:"Adient", ubicacion:"Arteaga" },
  { unidad:"145-ABC", operador:"FRANCISCO JAVIER MARQUEZ", coordinador:"JULIO HERNANDEZ", estatus:"Activo", circuito:"Adient", ubicacion:"Arteaga" },
  { unidad:"151-ABC", operador:"JORGE DOMINGUEZ RAMIREZ", coordinador:"JUAN JOSE TELLO", estatus:"VTA - Facturando", circuito:"Reynosa - Bajio", ubicacion:"En ruta" },
  { unidad:"160-ABC", operador:"JAIME ARRIAGA/VACANTE", coordinador:"CRISTIAN ZUÑIGA", estatus:"Sin Operador", circuito:"-", ubicacion:"Patio" },
  { unidad:"161-ABC", operador:"FEDERICO VELAZQUEZ RAMIREZ", coordinador:"CRISTIAN ZUÑIGA", estatus:"Activo", circuito:"-", ubicacion:"Nuevo Laredo" },
  { unidad:"162-ABC", operador:"ALEJANDRO GUADALUPE TORRES PEREZ", coordinador:"CRISTIAN ZUÑIGA", estatus:"Activo", circuito:"DX", ubicacion:"Laredo TX" },
  { unidad:"163-ABC", operador:"DAVID AMAYA ALDAY", coordinador:"CRISTIAN ZUÑIGA", estatus:"Activo", circuito:"-", ubicacion:"Nuevo Laredo" },
  { unidad:"164-ABC", operador:"MIGUEL ANGEL GUERRERO MORENO", coordinador:"JUAN JOSE TELLO", estatus:"DCO - Disponible", circuito:"Reynosa - Bajio", ubicacion:"Reynosa" },
  { unidad:"165-ABC", operador:"SINIESTRO", coordinador:"CRISTIAN ZUÑIGA", estatus:"Siniestro", circuito:"-", ubicacion:"Taller" },
  { unidad:"166-ABC", operador:"VACANTE", coordinador:"CRISTIAN ZUÑIGA", estatus:"Sin Operador", circuito:"-", ubicacion:"Patio" },
  { unidad:"171-ABC", operador:"JESUS GALLARDO/VACANTE", coordinador:"CRISTIAN ZUÑIGA", estatus:"Sin Operador", circuito:"DX", ubicacion:"Patio" },
  { unidad:"172-ABC", operador:"VACANTE", coordinador:"CRISTIAN ZUÑIGA", estatus:"Sin Operador", circuito:"-", ubicacion:"Patio" },
  { unidad:"173-ABC", operador:"JOSE MANUEL LILA HERNANDEZ", coordinador:"JUAN JOSE TELLO", estatus:"VTA - Facturando", circuito:"Reynosa - Bajio", ubicacion:"En ruta" },
  { unidad:"175-ABC", operador:"FLORENCIO DE LUNA", coordinador:"JUAN JOSE TELLO", estatus:"CP - Correctivo", circuito:"Remolacha", ubicacion:"Taller" },
  { unidad:"176-ABC", operador:"VACANTE", coordinador:"CRISTIAN ZUÑIGA", estatus:"Sin Operador", circuito:"-", ubicacion:"Patio" },
  { unidad:"178-ABC", operador:"LUIS ARMANDO GUAJARDO CAVAZOS", coordinador:"JUAN JOSE TELLO", estatus:"VTA - Facturando", circuito:"Reynosa - Bajio", ubicacion:"En ruta" },
  { unidad:"182-ABC", operador:"VACANTE", coordinador:"JUAN JOSE TELLO", estatus:"Sin Operador", circuito:"Pordefinir", ubicacion:"Patio" },
  { unidad:"307-ABC", operador:"MARTIN AYOMETZI ORDOÑEZ", coordinador:"CRISTIAN ZUÑIGA", estatus:"Activo", circuito:"Mty-Bajio", ubicacion:"Monterrey" },
  { unidad:"308-ABC", operador:"VACANTE", coordinador:"CRISTIAN ZUÑIGA", estatus:"Sin Operador", circuito:"Mty-Bajio", ubicacion:"Patio" },
  { unidad:"309-ABC", operador:"DOMITILO FLORES MONTAÑO", coordinador:"CRISTIAN ZUÑIGA", estatus:"Activo", circuito:"Nld-Bajio", ubicacion:"Nuevo Laredo" },
  { unidad:"310-ABC", operador:"ALBERTO MARQUEZ LIMON", coordinador:"JUAN JOSE TELLO", estatus:"VTA - Facturando", circuito:"Reynosa - Bajio", ubicacion:"En ruta" },
  { unidad:"311-ABC", operador:"ERIK RAMOS SANCHEZ", coordinador:"JUAN JOSE TELLO", estatus:"LIB - Por Liberar", circuito:"Reynosa - Bajio", ubicacion:"Patio" },
  { unidad:"312-ABC", operador:"ARTURO DE SANTIAGO/VACANTE", coordinador:"CRISTIAN ZUÑIGA", estatus:"Sin Operador", circuito:"Remolacha", ubicacion:"Patio" },
  { unidad:"314-ABC", operador:"EMILIO LUNA RAMIREZ", coordinador:"JUAN JOSE TELLO", estatus:"VTA - Facturando", circuito:"Reynosa - Bajio", ubicacion:"En ruta" },
  { unidad:"315-ABC", operador:"SINIESTRO", coordinador:"CRISTIAN ZUÑIGA", estatus:"Siniestro", circuito:"-", ubicacion:"Taller" },
  { unidad:"326-ABC", operador:"JOSE ANTONIO ARREOLA CARO", coordinador:"JUAN JOSE TELLO", estatus:"VTA - Facturando", circuito:"Reynosa - Bajio", ubicacion:"En ruta" },
  { unidad:"328-ABC", operador:"MTTO", coordinador:"JUAN JOSE TELLO", estatus:"SG - Siniestro", circuito:"Pordefinir", ubicacion:"Taller" },
  { unidad:"329-ABC", operador:"RAFAEL MORENO BRAVO", coordinador:"JUAN JOSE TELLO", estatus:"VTA - Facturando", circuito:"Reynosa - Bajio", ubicacion:"En ruta" },
  { unidad:"333-ABC", operador:"JUAN ALMANZA ARREDONDO", coordinador:"JUAN JOSE TELLO", estatus:"DCO - Disponible", circuito:"DX", ubicacion:"Reynosa" },
  { unidad:"346-ABC", operador:"VACANTE", coordinador:"JUAN JOSE TELLO", estatus:"Sin Operador", circuito:"-", ubicacion:"Patio" },
  { unidad:"347-ABC", operador:"ISAIAS ERNESTO HERNAN VALERO", coordinador:"JUAN JOSE TELLO", estatus:"VTA - Facturando", circuito:"DX", ubicacion:"En ruta" },
  { unidad:"349-ABC", operador:"EDWIN HORLANDO PADILLA CERECERO", coordinador:"CRISTIAN ZUÑIGA", estatus:"Activo", circuito:"Mty-Bajio", ubicacion:"Monterrey" },
  { unidad:"350-ABC", operador:"JORGE CONDE GARVALENA", coordinador:"JUAN JOSE TELLO", estatus:"VTA - Facturando", circuito:"Reynosa - Bajio", ubicacion:"En ruta" },
  { unidad:"351-ABC", operador:"ALEXANDER TORRES PEÑALOZA", coordinador:"CRISTIAN ZUÑIGA", estatus:"Activo", circuito:"Mty-Bajio", ubicacion:"Monterrey" },
  { unidad:"352-ABC", operador:"NOE ESAU MARTINEZ IBARRA", coordinador:"JULIO HERNANDEZ", estatus:"Activo", circuito:"Remolacha", ubicacion:"Reynosa" },
  { unidad:"355-ABC", operador:"RUBEN HERNANDEZ SANCHEZ", coordinador:"CRISTIAN ZUÑIGA", estatus:"Activo", circuito:"Mty-Bajio", ubicacion:"Monterrey" },
  { unidad:"368-ABC", operador:"JUAN JESUS HERNANDEZ", coordinador:"JUAN JOSE TELLO", estatus:"VTA - Facturando", circuito:"DX", ubicacion:"En ruta" },
  { unidad:"369-ABC", operador:"OSCAR GONZALEZ CHAVEZ", coordinador:"JUAN JOSE TELLO", estatus:"VTA - Facturando", circuito:"Reynosa - Bajio", ubicacion:"En ruta" },
  { unidad:"370-ABC", operador:"ALEJANDRO BAZAN MOYA", coordinador:"JUAN JOSE TELLO", estatus:"Sin Operador", circuito:"Reynosa - Bajio", ubicacion:"Patio" },
  { unidad:"376-ABC", operador:"JORGE LUNA MORALES", coordinador:"CRISTIAN ZUÑIGA", estatus:"Activo", circuito:"Mty-Bajio", ubicacion:"Monterrey" },
  { unidad:"377-ABC", operador:"VACANTE", coordinador:"CRISTIAN ZUÑIGA", estatus:"Sin Operador", circuito:"Remolacha", ubicacion:"Patio" },
  { unidad:"378-ABC", operador:"JUAN MARTIN AUDELO NUÑEZ", coordinador:"CRISTIAN ZUÑIGA", estatus:"Activo", circuito:"DX", ubicacion:"Laredo TX" },
  { unidad:"379-ABC", operador:"LUIS EDUARDO TORRES SANDOVAL", coordinador:"CRISTIAN ZUÑIGA", estatus:"Activo", circuito:"Nld-Bajio", ubicacion:"Nuevo Laredo" },
  { unidad:"380-ABC", operador:"VACANTE", coordinador:"JUAN JOSE TELLO", estatus:"VTA - Facturando", circuito:"Reynosa - Bajio", ubicacion:"En ruta" },
  { unidad:"382-ABC", operador:"EDGAR LARA DE AQUINO", coordinador:"CRISTIAN ZUÑIGA", estatus:"Activo", circuito:"Remolacha", ubicacion:"Reynosa" },
  { unidad:"384-ABC", operador:"LUIS ALBERTO AVILA HERNANDEZ", coordinador:"CRISTIAN ZUÑIGA", estatus:"Activo", circuito:"Remolacha", ubicacion:"Reynosa" },
  { unidad:"385-ABC", operador:"LUIS MANUEL LOYA/VACANTE", coordinador:"JUAN JOSE TELLO", estatus:"VTA - Facturando", circuito:"DX", ubicacion:"En ruta" },
  { unidad:"422-ABC", operador:"FELIPE JOSUE VERGARA", coordinador:"JUAN JOSE TELLO", estatus:"VTA - Facturando", circuito:"Reynosa - Bajio", ubicacion:"En ruta" },
  { unidad:"424-ABC", operador:"CRUZ ALBERTO SANTIAGO ESQUIVEL", coordinador:"JULIO HERNANDEZ", estatus:"Activo", circuito:"Adient", ubicacion:"Arteaga" },
  { unidad:"436-ABC", operador:"EDDY GUADALUPE PADILLA CERECERO", coordinador:"JUAN JOSE TELLO", estatus:"DCO - Disponible", circuito:"Remolacha", ubicacion:"Reynosa" },
  { unidad:"437-ABC", operador:"GERMAN TREVIÑO BADILLO", coordinador:"JUAN JOSE TELLO", estatus:"VTA - Facturando", circuito:"Reynosa - Bajio", ubicacion:"En ruta" },
  { unidad:"438-ABC", operador:"RENE HERNANDEZ HERNANDEZ", coordinador:"JUAN JOSE TELLO", estatus:"VTA - Facturando", circuito:"Reynosa - Bajio", ubicacion:"En ruta" },
  { unidad:"440-ABC", operador:"JOSE ALBERTO GALVAN GOMEZ", coordinador:"JUAN JOSE TELLO", estatus:"VTA - Facturando", circuito:"Reynosa - Bajio", ubicacion:"En ruta" },
  { unidad:"441-ABC", operador:"SANTOS SANCHEZ RANGEL", coordinador:"CRISTIAN ZUÑIGA", estatus:"Activo", circuito:"Remolacha", ubicacion:"Reynosa" },
  { unidad:"443-ABC", operador:"MANUEL HERNANDEZ ESTRADA", coordinador:"CRISTIAN ZUÑIGA", estatus:"Activo", circuito:"Remolacha", ubicacion:"Reynosa" },
  { unidad:"446-ABC", operador:"DAVID ALBERTO GARZA GONZALEZ", coordinador:"JULIO HERNANDEZ", estatus:"Activo", circuito:"-", ubicacion:"Monterrey" },
  { unidad:"447-ABC", operador:"LUIS MIGUEL VARGAS ZAMORANO", coordinador:"CRISTIAN ZUÑIGA", estatus:"Activo", circuito:"Remolacha", ubicacion:"Reynosa" },
  { unidad:"448-ABC", operador:"ROBERTO HERNANDEZ GARCIA", coordinador:"JULIO HERNANDEZ", estatus:"Activo", circuito:"Adient", ubicacion:"Arteaga" },
  { unidad:"450-ABC", operador:"VACANTE", coordinador:"JULIO HERNANDEZ", estatus:"Sin Operador", circuito:"-", ubicacion:"Patio" },
  { unidad:"462-ABC", operador:"ALVARO GALICIA CASTRO", coordinador:"JUAN JOSE TELLO", estatus:"VTA - Facturando", circuito:"Reynosa - Bajio", ubicacion:"En ruta" },
];

const CAJAS_SEED = [
  { caja:"1003-ABC", tipo:"Seca", coordinador:"CRISTIAN ZUÑIGA", ciudad:"JUAREZ, CHIH", ubicEsp:"Patio", estatus:"Dañada", cliente:"PENSKE LOGISTICA", comentarios:"VACIA EN PATIO DAÑADA" },
  { caja:"1008-ABC", tipo:"Seca", coordinador:"CRISTIAN ZUÑIGA", ciudad:"NUEVO LAREDO, TAMPS", ubicEsp:"Patio", estatus:"Cargada", cliente:"TRAMUC TRANSPORT LLC", comentarios:"CARGADA CON VIAJE RESAGADO" },
  { caja:"1019-ABC", tipo:"Seca", coordinador:"CRISTIAN ZUÑIGA", ciudad:"LAREDO, TX", ubicEsp:"Cliente", estatus:"Cargada", cliente:"GREATWAY TRANSPORTATION INC", comentarios:"CARGADA CON CLIENTE" },
  { caja:"1020-ABC", tipo:"Seca", coordinador:"CRISTIAN ZUÑIGA", ciudad:"REYNOSA, TAMPS", ubicEsp:"Patio", estatus:"En Patio", cliente:"-", comentarios:"VACIA EN PATIO" },
  { caja:"1037-ABC", tipo:"Seca", coordinador:"CRISTIAN ZUÑIGA", ciudad:"NUEVO LAREDO, TAMPS", ubicEsp:"Patio", estatus:"Cargada", cliente:"HL FREIGHT INC", comentarios:"CARGADA EN PATIO" },
  { caja:"1072-ABC", tipo:"Seca", coordinador:"JUAN JOSE TELLO", ciudad:"QUERETARO, QRO", ubicEsp:"Cliente", estatus:"Cargada", cliente:"PENSKE CORE", comentarios:"CARGADA CON CLIENTE" },
  { caja:"1080-ABC", tipo:"Seca", coordinador:"JUAN JOSE TELLO", ciudad:"REYNOSA, TAMPS", ubicEsp:"Patio", estatus:"Disponible", cliente:"-", comentarios:"DISPONIBLE EN PATIO" },
  { caja:"1115-ABC", tipo:"Seca", coordinador:"JULIO HERNANDEZ", ciudad:"JUAREZ, CHIH", ubicEsp:"Patio", estatus:"Dañada", cliente:"-", comentarios:"DAÑADA" },
  { caja:"TM17213", tipo:"Seca", coordinador:"JUAN JOSE TELLO", ciudad:"QUERETARO", ubicEsp:"Cliente", estatus:"Cargada", cliente:"TRAMUC AUTOLIV", comentarios:"VIAJE REALIZADO" },
  { caja:"LH480", tipo:"Seca", coordinador:"JUAN JOSE TELLO", ciudad:"REYNOSA, TAMPS", ubicEsp:"Patio", estatus:"Revisar", cliente:"-", comentarios:"PENDIENTE REVISAR" },
];

const VIAJES_SEED = [
  { id:"V-001", semana:10, fecha:"2026-03-02", coordinador:"JUAN JOSE TELLO", unidad:"151-ABC", caja:"1299", cliente:"Tramuc Aguascalientes", circuito:"Reynosa - Bajio", estatus:"Realizado", ventaEst:28000, ventaReal:28000, costoOp:4500, diesel:3200, casetas:800, costoMtto:0, kmRecorridos:834, litrosDiesel:267 },
  { id:"V-002", semana:10, fecha:"2026-03-02", coordinador:"JUAN JOSE TELLO", unidad:"437-ABC", caja:"TM17213", cliente:"Tramuc Autoliv Queretaro", circuito:"Reynosa - Bajio", estatus:"Realizado", ventaEst:26000, ventaReal:26000, costoOp:4500, diesel:3200, casetas:800, costoMtto:0, kmRecorridos:850, litrosDiesel:270 },
  { id:"V-003", semana:15, fecha:"2026-04-07", coordinador:"JUAN JOSE TELLO", unidad:"173-ABC", caja:"1162", cliente:"PENSKE-CORE", circuito:"Reynosa - Bajio", estatus:"Programado", ventaEst:29000, ventaReal:null, costoOp:4500, diesel:3200, casetas:800, costoMtto:0, kmRecorridos:0, litrosDiesel:0 },
];

// ─── STORAGE LOCAL ────────────────────────────────────────────────────────────
const STORAGE_KEY = "nal_erp_v3";
const loadLocal = () => { try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch { return null; } };
const saveLocal = (d) => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch {} };
const initData = () => {
  const s = loadLocal();
  if (s) return s;
  const d = { tractos: TRACTOS_SEED, cajas: CAJAS_SEED, viajes: VIAJES_SEED, lastUpdate: new Date().toISOString() };
  saveLocal(d); return d;
};

// ─── GOOGLE SHEETS API ────────────────────────────────────────────────────────
const sheetsGet = async (tab) => {
  const res = await fetch(`${SHEETS_URL}?tab=${tab}`);
  return res.json();
};
const sheetsPost = async (tab, rows) => {
  await fetch(SHEETS_URL, {
    method:"POST", mode:"no-cors",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ tab, action:"replace", rows })
  });
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
  if (s.includes("siniestro")||s.includes("sg")||s.includes("dañada")) return "#ef4444";
  if (s.includes("reparacion")||s.includes("rm")||s.includes("correctivo")||s.includes("cp")||s.includes("mtto")||s.includes("mantenimiento")) return "#f59e0b";
  if (s.includes("sin operador")||s.includes("vacante")) return "#64748b";
  if (s.includes("liberar")||s.includes("lib")) return "#a855f7";
  if (s.includes("cargada")) return "#10b981";
  if (s.includes("tránsito")||s.includes("transito")) return "#3b82f6";
  if (s.includes("revisar")) return "#f59e0b";
  return "#64748b";
};
const Badge = ({ text }) => (
  <span style={{ background:estatusColor(text)+"22", color:estatusColor(text), border:`1px solid ${estatusColor(text)}44`, borderRadius:5, padding:"2px 7px", fontSize:10, fontWeight:700, letterSpacing:.5, textTransform:"uppercase", whiteSpace:"nowrap" }}>{text}</span>
);
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
const mapTracto = r => ({ unidad:r.unidad||r.tracto||r.economico||"", operador:r.operador||r.conductor||"", coordinador:r.coordinador||r.coord||"", estatus:r.estatus||r.status||"", circuito:r.circuito||r.ruta||"", ubicacion:r.ubicacion||r.ciudad||"" });
const mapCaja = r => ({ caja:r.caja||r.remolque||r.trailer||"", tipo:r.tipo||"Seca", coordinador:r.coordinador||"", ciudad:r.ciudad||r.ubicacion||"", ubicEsp:r.ubicacionespecifica||r.ubicacion||"", estatus:r.estatus||"", cliente:r.cliente||"", comentarios:r.comentarios||r.notas||"" });
const mapViaje = (r,i) => ({ id:r.id||`V-IMP-${i+1}`, semana:+r.semana||0, fecha:r.fecha||new Date().toISOString().split("T")[0], coordinador:r.coordinador||"", unidad:r.unidad||r.tracto||"", caja:r.caja||"", cliente:r.cliente||"", circuito:r.circuito||"", estatus:r.estatus||"Realizado", ventaEst:+r.ventaest||+r.ventaestimada||0, ventaReal:+r.ventareal||+r.venta||null, costoOp:+r.costooperador||+r.costoop||0, diesel:+r.diesel||0, casetas:+r.casetas||0, costoMtto:+r.costomtto||0, kmRecorridos:+r.kmrecorridos||+r.km||0, litrosDiesel:+r.litrosdiesel||+r.litros||0 });

// ─── UI COMPONENTS ────────────────────────────────────────────────────────────
const Input = ({ label, value, onChange, type="text", options, required }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
    <label style={{ fontSize:11, color:"#64748b", textTransform:"uppercase", letterSpacing:.8 }}>{label}{required&&<span style={{color:"#ef4444"}}> *</span>}</label>
    {options ? (
      <select value={value} onChange={e=>onChange(e.target.value)} style={{ background:"#0f172a", border:"1px solid #1e293b", borderRadius:7, padding:"8px 10px", color:"#f1f5f9", fontSize:12, outline:"none" }}>
        <option value="">— Seleccionar —</option>
        {options.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
    ) : (
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} style={{ background:"#0f172a", border:"1px solid #1e293b", borderRadius:7, padding:"8px 10px", color:"#f1f5f9", fontSize:12, outline:"none" }} />
    )}
  </div>
);

const Modal = ({ title, onClose, children, wide }) => (
  <div style={{ position:"fixed", inset:0, background:"#000d", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
    <div style={{ background:"#0d1829", border:"1px solid #1e293b", borderRadius:14, width:"100%", maxWidth:wide?840:560, maxHeight:"92vh", overflow:"auto" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", borderBottom:"1px solid #1e293b", position:"sticky", top:0, background:"#0d1829", zIndex:1 }}>
        <div style={{ color:"#f1f5f9", fontWeight:700, fontSize:14 }}>{title}</div>
        <button onClick={onClose} style={{ background:"none", border:"none", color:"#64748b", fontSize:22, cursor:"pointer" }}>×</button>
      </div>
      <div style={{ padding:20 }}>{children}</div>
    </div>
  </div>
);

// ─── SYNC BANNER ──────────────────────────────────────────────────────────────
const SyncBanner = ({ syncState, onSync }) => {
  const cfg = {
    idle:    { bg:"#0a1628", border:"#1e3a5f", color:"#3b82f6",  icon:"☁️",  text: USAR_SHEETS ? "Conectado a Google Sheets" : "Modo local (sin Sheets)" },
    syncing: { bg:"#0a1f0f", border:"#10b98140", color:"#10b981", icon:"🔄",  text:"Sincronizando con Google Sheets..." },
    ok:      { bg:"#0a1f0f", border:"#10b98140", color:"#10b981", icon:"✅",  text:"Sincronizado correctamente" },
    error:   { bg:"#1f0a0a", border:"#ef444440", color:"#ef4444", icon:"⚠️",  text:"Error al conectar con Sheets — usando datos locales" },
  };
  const c = cfg[syncState] || cfg.idle;
  return (
    <div style={{ background:c.bg, border:`1px solid ${c.border}`, borderRadius:9, padding:"8px 14px", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
      <span style={{ color:c.color, fontSize:12 }}>{c.icon} {c.text}</span>
      {USAR_SHEETS && (
        <button onClick={onSync} disabled={syncState==="syncing"}
          style={{ background:"#1e293b", border:"none", borderRadius:6, padding:"4px 12px", color:"#94a3b8", fontSize:11, cursor:"pointer" }}>
          {syncState==="syncing" ? "..." : "🔄 Sincronizar"}
        </button>
      )}
    </div>
  );
};

// ─── IMPORTADOR MASIVO ────────────────────────────────────────────────────────
const ImportadorMasivo = ({ tipo, onImportar, onClose }) => {
  const [texto, setTexto] = useState("");
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [modo, setModo] = useState("reemplazar");

  const plantillas = {
    tractos: { cols:"unidad\toperador\tcoordinador\testatus\tcircuito\tubicacion", ej:"018-ABC\tVICTOR ARAMBULA\tJULIO HERNANDEZ\tActivo\tRemolacha\tReynosa" },
    cajas:   { cols:"caja\ttipo\tcoordinador\tciudad\tubicEsp\testatus\tcliente\tcomentarios", ej:"1003-ABC\tSeca\tCRISTIAN ZUÑIGA\tJUAREZ\tPatio\tDañada\tPENSKE\tVACIA DAÑADA" },
    viajes:  { cols:"semana\tfecha\tcoordinador\tunidad\tcaja\tcliente\tcircuito\testatus\tventaEst\tventaReal\tcostoOp\tdiesel\tcasetas\tcostoMtto\tkmRecorridos\tlitrosDiesel", ej:"15\t2026-04-07\tJUAN JOSE TELLO\t151-ABC\t1299\tTramuc\tReynosa - Bajio\tRealizado\t28000\t28000\t4500\t3200\t800\t0\t834\t267" },
  };
  const p = plantillas[tipo];

  const parsear = () => {
    setError("");
    if (!texto.trim()) { setError("Pega datos primero."); return; }
    const rows = parseTSV(texto);
    if (!rows||rows.length===0) { setError("No se detectaron filas. Asegúrate de copiar desde Excel incluyendo la fila de encabezados."); return; }
    const mapped = tipo==="tractos" ? rows.map(mapTracto) : tipo==="cajas" ? rows.map(mapCaja) : rows.map(mapViaje);
    const validos = mapped.filter(r => tipo==="tractos"?r.unidad : tipo==="cajas"?r.caja : r.unidad||r.coordinador);
    if (validos.length===0) { setError("No se encontraron datos válidos. Revisa que los encabezados coincidan con la plantilla."); return; }
    setPreview({ filas:validos, total:rows.length });
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <div style={{ background:"#0a1628", border:"1px solid #1e3a5f", borderRadius:10, padding:14 }}>
        <div style={{ color:"#3b82f6", fontWeight:700, fontSize:12, marginBottom:8 }}>📋 INSTRUCCIONES — Copiar desde Excel</div>
        <div style={{ color:"#94a3b8", fontSize:11, lineHeight:1.8 }}>
          <b style={{color:"#f1f5f9"}}>1.</b> En tu Excel, pon los encabezados de la plantilla en la fila 1<br/>
          <b style={{color:"#f1f5f9"}}>2.</b> Llena tus datos debajo<br/>
          <b style={{color:"#f1f5f9"}}>3.</b> Selecciona todo → Ctrl+A → Copiar Ctrl+C<br/>
          <b style={{color:"#f1f5f9"}}>4.</b> Pega aquí abajo → Vista Previa → Confirmar<br/>
          {USAR_SHEETS && <span style={{color:"#10b981"}}>☁️ Los datos se guardarán automáticamente en Google Sheets</span>}
        </div>
      </div>

      <div style={{ background:"#0a1628", border:"1px solid #1e293b", borderRadius:10, padding:12 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
          <div style={{ color:"#64748b", fontSize:11, textTransform:"uppercase" }}>Plantilla (encabezados para tu Excel)</div>
          <button onClick={()=>{ const b=new Blob([p.cols+"\n"+p.ej],{type:"text/plain"}); const a=document.createElement("a"); a.href=URL.createObjectURL(b); a.download=`plantilla_${tipo}.txt`; a.click(); }}
            style={{ background:"#1e3a2f", border:"1px solid #10b98140", borderRadius:6, padding:"4px 10px", color:"#10b981", fontSize:10, cursor:"pointer", fontWeight:700 }}>
            ⬇️ Descargar plantilla
          </button>
        </div>
        <code style={{ display:"block", background:"#060d1a", borderRadius:6, padding:10, color:"#10b981", fontSize:10, fontFamily:"monospace", overflowX:"auto", whiteSpace:"pre" }}>{p.cols}{"\n"}<span style={{color:"#334155"}}>{p.ej}</span></code>
      </div>

      <div style={{ display:"flex", gap:10 }}>
        {["reemplazar","agregar"].map(m=>(
          <button key={m} onClick={()=>setModo(m)}
            style={{ flex:1, padding:"9px", borderRadius:8, border:`1px solid ${modo===m?"#3b82f6":"#1e293b"}`, background:modo===m?"#1e3a5f":"#0a1628", color:modo===m?"#f1f5f9":"#64748b", fontSize:12, cursor:"pointer", fontWeight:700 }}>
            {m==="reemplazar"?"🔄 Reemplazar todo (hoy)":"➕ Agregar a existentes"}
          </button>
        ))}
      </div>

      <div>
        <label style={{ fontSize:11, color:"#64748b", textTransform:"uppercase", letterSpacing:.8, marginBottom:6, display:"block" }}>📥 Pega aquí tus datos de Excel</label>
        <textarea value={texto} onChange={e=>{setTexto(e.target.value);setPreview(null);setError("");}}
          placeholder={"Copia desde Excel y pega aquí (incluye la fila de encabezados)..."}
          style={{ width:"100%", height:150, background:"#060d1a", border:"1px solid #1e3a5f", borderRadius:8, padding:12, color:"#f1f5f9", fontSize:11, fontFamily:"monospace", resize:"vertical", outline:"none", boxSizing:"border-box" }} />
      </div>

      {error && <div style={{ background:"#2d0a0a", border:"1px solid #ef444440", borderRadius:8, padding:12, color:"#ef4444", fontSize:12 }}>⚠️ {error}</div>}

      {preview && (
        <div style={{ background:"#0a1c10", border:"1px solid #10b98140", borderRadius:10, padding:14 }}>
          <div style={{ color:"#10b981", fontWeight:700, fontSize:13, marginBottom:8 }}>✅ {preview.filas.length} registros listos para importar</div>
          <div style={{ overflowX:"auto", maxHeight:180 }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:10 }}>
              <thead><tr>{Object.keys(preview.filas[0]).slice(0,6).map(k=><th key={k} style={{ textAlign:"left", padding:"4px 8px", color:"#475569", borderBottom:"1px solid #1e293b", whiteSpace:"nowrap" }}>{k}</th>)}</tr></thead>
              <tbody>{preview.filas.slice(0,6).map((r,i)=><tr key={i} style={{borderBottom:"1px solid #0d1626"}}>{Object.values(r).slice(0,6).map((v,j)=><td key={j} style={{padding:"4px 8px",color:"#94a3b8",whiteSpace:"nowrap",maxWidth:100,overflow:"hidden",textOverflow:"ellipsis"}}>{String(v)}</td>)}</tr>)}</tbody>
            </table>
          </div>
          {preview.filas.length>6 && <div style={{color:"#475569",fontSize:10,marginTop:6}}>... y {preview.filas.length-6} registros más</div>}
        </div>
      )}

      <div style={{ display:"flex", gap:10 }}>
        <button onClick={parsear} style={{ flex:1, background:"#1e293b", border:"1px solid #334155", borderRadius:8, padding:"11px", color:"#f1f5f9", fontWeight:700, cursor:"pointer", fontSize:13 }}>🔍 Vista Previa</button>
        {preview && <button onClick={()=>{ onImportar(preview.filas, modo); onClose(); }}
          style={{ flex:2, background:"#10b981", border:"none", borderRadius:8, padding:"11px", color:"#fff", fontWeight:700, cursor:"pointer", fontSize:13 }}>
          ✅ Confirmar — {preview.filas.length} registros {USAR_SHEETS?"→ Sheets":"→ Local"}
        </button>}
      </div>
    </div>
  );
};

// ─── DISTRIBUCIÓN ─────────────────────────────────────────────────────────────
const DistribucionView = ({ data }) => {
  const { tractos, viajes } = data;
  const circMap = {};
  tractos.forEach(t => {
    const c = t.circuito||"-";
    if (!circMap[c]) circMap[c]={total:0,enRuta:0,activos:0,mtto:0,sinOp:0};
    circMap[c].total++;
    if (t.estatus.includes("VTA")||t.estatus.includes("Facturando")) circMap[c].enRuta++;
    else if (t.estatus.includes("Activo")) circMap[c].activos++;
    else if (["SG","RM","CP","Mantenimiento","Correctivo","Siniestro"].some(x=>t.estatus.includes(x))) circMap[c].mtto++;
    else circMap[c].sinOp++;
  });
  const coords = [
    {n:"Juan José Tello",k:"TELLO",col:"#3b82f6"},
    {n:"Cristian Zuñiga",k:"CRISTIAN",col:"#10b981"},
    {n:"Julio Hernandez",k:"JULIO",col:"#f59e0b"},
  ].map(coord => {
    const ts = tractos.filter(t=>t.coordinador.toUpperCase().includes(coord.k));
    const enRuta = ts.filter(t=>t.estatus.includes("VTA")||t.estatus.includes("Facturando")).length;
    const activos = ts.filter(t=>t.estatus.includes("Activo")).length;
    const mtto = ts.filter(t=>["SG","RM","CP","Mantenimiento","Correctivo","Siniestro"].some(x=>t.estatus.includes(x))).length;
    const sinOp = ts.filter(t=>t.estatus.includes("Sin Operador")||t.estatus.includes("LIB")).length;
    const vK = viajes.filter(v=>v.coordinador.toUpperCase().includes(coord.k)&&v.kmRecorridos>0&&v.litrosDiesel>0);
    const kml = vK.length>0 ? (vK.reduce((s,v)=>s+v.kmRecorridos/v.litrosDiesel,0)/vK.length).toFixed(2) : "—";
    const circs = [...new Set(ts.map(t=>t.circuito).filter(c=>c&&c!=="-"))];
    return {...coord, total:ts.length, enRuta, activos, mtto, sinOp, kml, circs};
  });

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div>
        <div style={{color:"#475569",fontSize:11,textTransform:"uppercase",letterSpacing:1.5,marginBottom:10}}>👥 Por Coordinador</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:10}}>
          {coords.map(c=>(
            <div key={c.k} style={{background:"#0a1628",border:`1px solid ${c.col}30`,borderRadius:12,padding:16}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:c.col,boxShadow:`0 0 8px ${c.col}`}}/>
                <div style={{color:"#f1f5f9",fontWeight:800,fontSize:14}}>{c.n}</div>
                <div style={{marginLeft:"auto",background:c.col+"20",color:c.col,borderRadius:6,padding:"2px 8px",fontSize:12,fontWeight:700}}>{c.total}</div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,textAlign:"center",marginBottom:12}}>
                {[["En Ruta",c.enRuta,"#10b981"],["Activos",c.activos,"#3b82f6"],["Mtto",c.mtto,"#f59e0b"],["Sin Op",c.sinOp,"#64748b"]].map(([l,v,col])=>(
                  <div key={l} style={{background:col+"15",borderRadius:7,padding:"6px 4px"}}>
                    <div style={{color:col,fontWeight:900,fontSize:18}}>{v}</div>
                    <div style={{color:"#475569",fontSize:9,textTransform:"uppercase"}}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"1px solid #1e293b",paddingTop:10}}>
                <div style={{color:"#64748b",fontSize:10}}>Circuitos: <span style={{color:"#94a3b8"}}>{c.circs.slice(0,3).join(", ")}{c.circs.length>3?` +${c.circs.length-3}`:""}</span></div>
                <div style={{background:"#0d1626",borderRadius:7,padding:"4px 10px",textAlign:"center"}}>
                  <div style={{color:c.col,fontWeight:900,fontSize:16}}>{c.kml}</div>
                  <div style={{color:"#475569",fontSize:9}}>KM/L</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={{color:"#475569",fontSize:11,textTransform:"uppercase",letterSpacing:1.5,marginBottom:10}}>🔁 Por Circuito</div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr style={{borderBottom:"2px solid #1e293b"}}>{["Circuito","Total","En Ruta","Activos","Mtto","Sin Op","% Operando"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"#475569",fontSize:10,textTransform:"uppercase",letterSpacing:.8,whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
            <tbody>
              {Object.entries(circMap).sort((a,b)=>b[1].total-a[1].total).map(([circ,v],i)=>{
                const pct = v.total>0?(((v.enRuta+v.activos)/v.total)*100).toFixed(0):0;
                return (
                  <tr key={circ} style={{borderBottom:"1px solid #0d1626",background:i%2===0?"#080e1c":"transparent"}}>
                    <td style={{padding:"10px 12px",color:"#f1f5f9",fontWeight:700}}>{circ}</td>
                    <td style={{padding:"10px 12px",color:"#94a3b8",fontWeight:700}}>{v.total}</td>
                    <td style={{padding:"10px 12px"}}><span style={{color:"#10b981",fontWeight:700}}>{v.enRuta}</span></td>
                    <td style={{padding:"10px 12px"}}><span style={{color:"#3b82f6",fontWeight:700}}>{v.activos}</span></td>
                    <td style={{padding:"10px 12px"}}><span style={{color:"#f59e0b",fontWeight:700}}>{v.mtto}</span></td>
                    <td style={{padding:"10px 12px"}}><span style={{color:"#64748b",fontWeight:700}}>{v.sinOp}</span></td>
                    <td style={{padding:"10px 12px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{flex:1,height:6,background:"#1e293b",borderRadius:3,overflow:"hidden"}}>
                          <div style={{height:"100%",width:`${pct}%`,background:pct>=70?"#10b981":pct>=40?"#f59e0b":"#ef4444",borderRadius:3}}/>
                        </div>
                        <span style={{color:pct>=70?"#10b981":pct>=40?"#f59e0b":"#ef4444",fontWeight:700,fontSize:11,minWidth:30}}>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
  const cajasCargadas = cajas.filter(c=>c.estatus==="Cargada").length;
  const cajasDisp = cajas.filter(c=>c.estatus==="Disponible").length;
  const cajasDan = cajas.filter(c=>c.estatus==="Dañada").length;
  const cajasT = cajas.filter(c=>c.estatus==="En Tránsito"||c.estatus==="En Transito").length;
  const vR = viajes.filter(v=>v.estatus==="Realizado");
  const ventaReal = vR.reduce((s,v)=>s+(+v.ventaReal||0),0);
  const costoTotal = vR.reduce((s,v)=>s+(+v.costoOp||0)+(+v.diesel||0)+(+v.casetas||0)+(+v.costoMtto||0),0);
  const util = ventaReal-costoTotal;
  const margen = ventaReal>0?((util/ventaReal)*100).toFixed(1):0;
  const vKml = vR.filter(v=>+v.kmRecorridos>0&&+v.litrosDiesel>0);
  const kmlG = vKml.length>0?(vKml.reduce((s,v)=>s+(+v.kmRecorridos/+v.litrosDiesel),0)/vKml.length).toFixed(2):"—";

  const KPI = ({label,val,color,icon,sub}) => (
    <div style={{background:"#0a1628",border:`1px solid ${color}30`,borderRadius:11,padding:"14px 16px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:color}}/>
      <div style={{fontSize:18}}>{icon}</div>
      <div style={{fontSize:26,fontWeight:900,color,lineHeight:1.1,marginTop:4}}>{val}</div>
      <div style={{fontSize:10,color:"#64748b",textTransform:"uppercase",letterSpacing:.8,marginTop:2}}>{label}</div>
      {sub&&<div style={{fontSize:10,color:"#334155",marginTop:2}}>{sub}</div>}
    </div>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div>
        <div style={{color:"#475569",fontSize:11,letterSpacing:2,textTransform:"uppercase"}}>Torre de Control · {new Date().toLocaleDateString("es-MX",{day:"2-digit",month:"short",year:"numeric"})}</div>
        <div style={{color:"#f1f5f9",fontSize:20,fontWeight:900,marginTop:2}}>Nacional Autotransporte</div>
      </div>
      <div style={{color:"#475569",fontSize:11,textTransform:"uppercase",letterSpacing:1}}>🚛 {tractos.length} Tractos</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:8}}>
        <KPI label="En Ruta" val={enRuta} color="#10b981" icon="🟢" sub="Facturando"/>
        <KPI label="Disponibles" val={disponibles} color="#3b82f6" icon="🔵" sub="DCO"/>
        <KPI label="Mantenimiento" val={enMtto} color="#f59e0b" icon="🔧" sub="SG/RM/CP"/>
        <KPI label="Sin Operador" val={sinOp} color="#64748b" icon="⚠️" sub="Vacantes"/>
      </div>
      <div style={{color:"#475569",fontSize:11,textTransform:"uppercase",letterSpacing:1}}>📦 {cajas.length} Cajas</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:8}}>
        <KPI label="Cargadas" val={cajasCargadas} color="#10b981" icon="📦"/>
        <KPI label="Disponibles" val={cajasDisp} color="#3b82f6" icon="🆓"/>
        <KPI label="Dañadas" val={cajasDan} color="#ef4444" icon="🔴"/>
        <KPI label="En Tránsito" val={cajasT} color="#6366f1" icon="🔄"/>
      </div>
      <div style={{color:"#475569",fontSize:11,textTransform:"uppercase",letterSpacing:1}}>💰 Financiero</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:8}}>
        <KPI label="Venta Real" val={`$${(ventaReal/1000).toFixed(0)}K`} color="#10b981" icon="💵"/>
        <KPI label="Costo Total" val={`$${(costoTotal/1000).toFixed(0)}K`} color="#f59e0b" icon="📉"/>
        <KPI label="Utilidad" val={`$${(util/1000).toFixed(0)}K`} color={util>=0?"#10b981":"#ef4444"} icon="📊"/>
        <KPI label="Margen" val={`${margen}%`} color={margen>=20?"#10b981":"#f59e0b"} icon="%" sub="Meta >20%"/>
        <KPI label="KM/L Flota" val={kmlG} color="#6366f1" icon="⛽" sub="Promedio"/>
        <KPI label="Viajes" val={viajes.length} color="#a855f7" icon="✅"/>
      </div>
      <div style={{color:"#475569",fontSize:11,textTransform:"uppercase",letterSpacing:1}}>👥 Por Coordinador</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
        {[{n:"Juan José Tello",k:"TELLO"},{n:"Cristian Zuñiga",k:"CRISTIAN"},{n:"Julio Hernandez",k:"JULIO"}].map(c=>{
          const vC=viajes.filter(v=>v.coordinador.toUpperCase().includes(c.k)&&v.estatus==="Realizado");
          const venta=vC.reduce((s,v)=>s+(+v.ventaReal||0),0);
          const costo=vC.reduce((s,v)=>s+(+v.costoOp||0)+(+v.diesel||0)+(+v.casetas||0)+(+v.costoMtto||0),0);
          const vKc=vC.filter(v=>+v.kmRecorridos>0&&+v.litrosDiesel>0);
          const kml=vKc.length>0?(vKc.reduce((s,v)=>s+(+v.kmRecorridos/+v.litrosDiesel),0)/vKc.length).toFixed(2):"—";
          const col=coordColor(c.k);
          const tCount=tractos.filter(t=>t.coordinador.toUpperCase().includes(c.k)).length;
          return (
            <div key={c.k} style={{background:"#0a1628",border:`1px solid ${col}30`,borderRadius:11,padding:14}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <div style={{width:9,height:9,borderRadius:"50%",background:col}}/>
                <div style={{color:"#f1f5f9",fontWeight:700,fontSize:13}}>{c.n}</div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,textAlign:"center"}}>
                {[["Tractos",tCount],["Utilidad",`$${((venta-costo)/1000).toFixed(0)}K`],["KM/L",kml]].map(([l,v])=>(
                  <div key={l}><div style={{color:col,fontWeight:900,fontSize:17}}>{v}</div><div style={{color:"#475569",fontSize:10}}>{l}</div></div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── TRACTOS ──────────────────────────────────────────────────────────────────
const Tractos = ({ data, setData, onSyncTab }) => {
  const [q,setQ]=useState(""); const [coord,setCoord]=useState(""); const [efil,setEfil]=useState("");
  const [editando,setEditando]=useState(null); const [form,setForm]=useState({});
  const [showImport,setShowImport]=useState(false);

  const lista = data.tractos.filter(t=>{
    const tx=q.toLowerCase();
    return (!q||(t.unidad+t.operador+t.circuito+t.ubicacion).toLowerCase().includes(tx))
      &&(!coord||t.coordinador.toUpperCase().includes(coord))
      &&(!efil||t.estatus.includes(efil));
  });

  const guardar = () => {
    const updated={...data,tractos:data.tractos.map(t=>t.unidad===editando?{...t,...form}:t),lastUpdate:new Date().toISOString()};
    setData(updated); saveLocal(updated); setEditando(null);
    if(USAR_SHEETS) sheetsPost("Tractos",updated.tractos);
  };

  const importar = (filas,modo) => {
    const nuevos=modo==="reemplazar"?filas:[...data.tractos,...filas.filter(f=>!data.tractos.find(t=>t.unidad===f.unidad))];
    const updated={...data,tractos:nuevos,lastUpdate:new Date().toISOString()};
    setData(updated); saveLocal(updated);
    if(USAR_SHEETS) sheetsPost("Tractos",nuevos);
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {editando&&<Modal title={`Editar Tracto ${editando}`} onClose={()=>setEditando(null)}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Input label="Estatus" value={form.estatus||""} onChange={v=>setForm(f=>({...f,estatus:v}))} options={["VTA - Facturando","DCO - Disponible","Activo","Sin Operador","SG - Siniestro","RM - Reparacion Mayor","CP - Correctivo","Mantenimiento","LIB - Por Liberar","Siniestro"]}/>
          <Input label="Ubicación" value={form.ubicacion||""} onChange={v=>setForm(f=>({...f,ubicacion:v}))}/>
          <Input label="Operador" value={form.operador||""} onChange={v=>setForm(f=>({...f,operador:v}))}/>
          <Input label="Circuito" value={form.circuito||""} onChange={v=>setForm(f=>({...f,circuito:v}))} options={["Reynosa - Bajio","Remolacha","DX","Adient","Mty-Bajio","Nld-Bajio","Carrier","Pordefinir","-"]}/>
        </div>
        <button onClick={guardar} style={{marginTop:16,width:"100%",background:"#3b82f6",border:"none",borderRadius:8,padding:"10px",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13}}>💾 Guardar {USAR_SHEETS?"+ Sync Sheets":""}</button>
      </Modal>}
      {showImport&&<Modal title="📥 Importar Tractos" onClose={()=>setShowImport(false)} wide><ImportadorMasivo tipo="tractos" onImportar={importar} onClose={()=>setShowImport(false)}/></Modal>}

      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        <input placeholder="🔍 Buscar..." value={q} onChange={e=>setQ(e.target.value)} style={{flex:1,minWidth:200,background:"#0a1628",border:"1px solid #1e293b",borderRadius:8,padding:"8px 12px",color:"#f1f5f9",fontSize:12,outline:"none"}}/>
        <select value={coord} onChange={e=>setCoord(e.target.value)} style={{background:"#0a1628",border:"1px solid #1e293b",borderRadius:8,padding:"8px 10px",color:"#f1f5f9",fontSize:12,outline:"none"}}>
          <option value="">Todos</option><option value="TELLO">Tello</option><option value="CRISTIAN">Cristian</option><option value="JULIO">Julio</option>
        </select>
        <select value={efil} onChange={e=>setEfil(e.target.value)} style={{background:"#0a1628",border:"1px solid #1e293b",borderRadius:8,padding:"8px 10px",color:"#f1f5f9",fontSize:12,outline:"none"}}>
          <option value="">Todos</option><option value="VTA">En Ruta</option><option value="DCO">Disponible</option><option value="Sin Operador">Sin Operador</option><option value="SG">Siniestro</option><option value="Mantenimiento">Mtto</option>
        </select>
        <button onClick={()=>setShowImport(true)} style={{background:"#1e3a5f",border:"1px solid #3b82f640",borderRadius:8,padding:"8px 12px",color:"#3b82f6",fontSize:11,cursor:"pointer",fontWeight:700}}>📥 Importar Excel</button>
        <button onClick={()=>downloadCSV(toCSV(data.tractos,["unidad","operador","coordinador","estatus","circuito","ubicacion"]),"tractos.csv")} style={{background:"#1e3a2f",border:"1px solid #10b98144",borderRadius:8,padding:"8px 12px",color:"#10b981",fontSize:11,cursor:"pointer",fontWeight:700}}>⬇️ CSV</button>
      </div>
      <div style={{color:"#475569",fontSize:11}}>{lista.length} de {data.tractos.length} tractos</div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:"2px solid #1e293b"}}>{["Unidad","Operador","Coordinador","Estatus","Circuito","Ubicación",""].map(h=><th key={h} style={{textAlign:"left",padding:"8px 10px",color:"#475569",fontSize:10,textTransform:"uppercase",letterSpacing:.8}}>{h}</th>)}</tr></thead>
          <tbody>{lista.map((t,i)=>(
            <tr key={t.unidad} style={{borderBottom:"1px solid #0d1626",background:i%2===0?"#080e1c":"transparent"}}>
              <td style={{padding:"9px 10px",color:"#f1f5f9",fontWeight:800,fontFamily:"monospace"}}>{t.unidad}</td>
              <td style={{padding:"9px 10px",color:"#94a3b8",maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.operador}</td>
              <td style={{padding:"9px 10px"}}><span style={{color:coordColor(t.coordinador),fontWeight:700,fontSize:11}}>{t.coordinador.split(" ")[0]}</span></td>
              <td style={{padding:"9px 10px"}}><Badge text={t.estatus}/></td>
              <td style={{padding:"9px 10px",color:"#64748b"}}>{t.circuito}</td>
              <td style={{padding:"9px 10px",color:"#94a3b8"}}>{t.ubicacion}</td>
              <td style={{padding:"9px 10px"}}><button onClick={()=>{setEditando(t.unidad);setForm({...t});}} style={{background:"#1e293b",border:"none",borderRadius:6,padding:"4px 10px",color:"#94a3b8",cursor:"pointer",fontSize:11}}>✏️</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
};

// ─── CAJAS ────────────────────────────────────────────────────────────────────
const Cajas = ({ data, setData }) => {
  const [q,setQ]=useState(""); const [coord,setCoord]=useState(""); const [efil,setEfil]=useState("");
  const [editando,setEditando]=useState(null); const [form,setForm]=useState({});
  const [showImport,setShowImport]=useState(false);
  const resumen={};
  data.cajas.forEach(c=>{resumen[c.estatus]=(resumen[c.estatus]||0)+1;});
  const lista=data.cajas.filter(c=>{
    const tx=q.toLowerCase();
    return (!q||(c.caja+c.cliente+c.ciudad).toLowerCase().includes(tx))&&(!coord||c.coordinador.toUpperCase().includes(coord))&&(!efil||c.estatus===efil);
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
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {editando&&<Modal title={`Editar Caja ${editando}`} onClose={()=>setEditando(null)}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Input label="Estatus" value={form.estatus||""} onChange={v=>setForm(f=>({...f,estatus:v}))} options={["Cargada","Disponible","En Patio","En Tránsito","Dañada","Revisar"]}/>
          <Input label="Ciudad" value={form.ciudad||""} onChange={v=>setForm(f=>({...f,ciudad:v}))}/>
          <Input label="Ubicación Esp." value={form.ubicEsp||""} onChange={v=>setForm(f=>({...f,ubicEsp:v}))}/>
          <Input label="Cliente" value={form.cliente||""} onChange={v=>setForm(f=>({...f,cliente:v}))}/>
          <Input label="Comentarios" value={form.comentarios||""} onChange={v=>setForm(f=>({...f,comentarios:v}))}/>
          <Input label="Coordinador" value={form.coordinador||""} onChange={v=>setForm(f=>({...f,coordinador:v}))} options={["JUAN JOSE TELLO","CRISTIAN ZUÑIGA","JULIO HERNANDEZ"]}/>
        </div>
        <button onClick={guardar} style={{marginTop:16,width:"100%",background:"#3b82f6",border:"none",borderRadius:8,padding:"10px",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13}}>💾 Guardar {USAR_SHEETS?"+ Sync Sheets":""}</button>
      </Modal>}
      {showImport&&<Modal title="📥 Importar Cajas" onClose={()=>setShowImport(false)} wide><ImportadorMasivo tipo="cajas" onImportar={importar} onClose={()=>setShowImport(false)}/></Modal>}
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        <input placeholder="🔍 Buscar caja, cliente..." value={q} onChange={e=>setQ(e.target.value)} style={{flex:1,minWidth:200,background:"#0a1628",border:"1px solid #1e293b",borderRadius:8,padding:"8px 12px",color:"#f1f5f9",fontSize:12,outline:"none"}}/>
        <select value={coord} onChange={e=>setCoord(e.target.value)} style={{background:"#0a1628",border:"1px solid #1e293b",borderRadius:8,padding:"8px 10px",color:"#f1f5f9",fontSize:12,outline:"none"}}>
          <option value="">Todos</option><option value="TELLO">Tello</option><option value="CRISTIAN">Cristian</option><option value="JULIO">Julio</option>
        </select>
        <select value={efil} onChange={e=>setEfil(e.target.value)} style={{background:"#0a1628",border:"1px solid #1e293b",borderRadius:8,padding:"8px 10px",color:"#f1f5f9",fontSize:12,outline:"none"}}>
          <option value="">Todos</option>{Object.keys(resumen).map(s=><option key={s} value={s}>{s} ({resumen[s]})</option>)}
        </select>
        <button onClick={()=>setShowImport(true)} style={{background:"#1e3a5f",border:"1px solid #3b82f640",borderRadius:8,padding:"8px 12px",color:"#3b82f6",fontSize:11,cursor:"pointer",fontWeight:700}}>📥 Importar Excel</button>
        <button onClick={()=>downloadCSV(toCSV(data.cajas,["caja","tipo","coordinador","ciudad","ubicEsp","estatus","cliente","comentarios"]),"cajas.csv")} style={{background:"#1e3a2f",border:"1px solid #10b98144",borderRadius:8,padding:"8px 12px",color:"#10b981",fontSize:11,cursor:"pointer",fontWeight:700}}>⬇️ CSV</button>
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {Object.entries(resumen).map(([k,v])=>(
          <div key={k} style={{background:estatusColor(k)+"18",border:`1px solid ${estatusColor(k)}33`,borderRadius:7,padding:"5px 10px",fontSize:11}}>
            <span style={{color:estatusColor(k),fontWeight:700}}>{v}</span><span style={{color:"#475569",marginLeft:4}}>{k}</span>
          </div>
        ))}
      </div>
      <div style={{color:"#475569",fontSize:11}}>{lista.length} de {data.cajas.length} cajas</div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:"2px solid #1e293b"}}>{["Caja","Tipo","Coord","Ciudad","Ubicación","Estatus","Cliente","Comentarios",""].map(h=><th key={h} style={{textAlign:"left",padding:"8px 10px",color:"#475569",fontSize:10,textTransform:"uppercase",letterSpacing:.8}}>{h}</th>)}</tr></thead>
          <tbody>{lista.map((c,i)=>(
            <tr key={c.caja} style={{borderBottom:"1px solid #0d1626",background:i%2===0?"#080e1c":"transparent"}}>
              <td style={{padding:"9px 10px",color:"#f1f5f9",fontWeight:800,fontFamily:"monospace"}}>{c.caja}</td>
              <td style={{padding:"9px 10px",color:"#64748b"}}>{c.tipo}</td>
              <td style={{padding:"9px 10px"}}><span style={{color:coordColor(c.coordinador),fontWeight:700,fontSize:11}}>{c.coordinador.split(" ")[0]}</span></td>
              <td style={{padding:"9px 10px",color:"#94a3b8"}}>{c.ciudad}</td>
              <td style={{padding:"9px 10px",color:"#64748b"}}>{c.ubicEsp}</td>
              <td style={{padding:"9px 10px"}}><Badge text={c.estatus}/></td>
              <td style={{padding:"9px 10px",color:"#94a3b8",maxWidth:130,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.cliente}</td>
              <td style={{padding:"9px 10px",color:"#334155",fontSize:11,maxWidth:150,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.comentarios}</td>
              <td style={{padding:"9px 10px"}}><button onClick={()=>{setEditando(c.caja);setForm({...c});}} style={{background:"#1e293b",border:"none",borderRadius:6,padding:"4px 10px",color:"#94a3b8",cursor:"pointer",fontSize:11}}>✏️</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
};

// ─── VIAJES ───────────────────────────────────────────────────────────────────
const Viajes = ({ data, setData }) => {
  const [modo,setModo]=useState("lista"); const [q,setQ]=useState(""); const [showImport,setShowImport]=useState(false);
  const [form,setForm]=useState({semana:"15",fecha:new Date().toISOString().split("T")[0],coordinador:"",unidad:"",caja:"",cliente:"",circuito:"",estatus:"Programado",ventaEst:"",ventaReal:"",costoOp:"4500",diesel:"3200",casetas:"800",costoMtto:"0",kmRecorridos:"",litrosDiesel:""});
  const viajes=data.viajes.filter(v=>{const t=q.toLowerCase();return !q||(v.unidad+v.cliente+v.coordinador).toLowerCase().includes(t);});
  const guardarViaje=()=>{
    const id=`V-${String(data.viajes.length+1).padStart(3,"0")}`;
    const n={...form,id,semana:+form.semana,ventaEst:+form.ventaEst,ventaReal:form.ventaReal?+form.ventaReal:null,costoOp:+form.costoOp,diesel:+form.diesel,casetas:+form.casetas,costoMtto:+form.costoMtto,kmRecorridos:+form.kmRecorridos,litrosDiesel:+form.litrosDiesel};
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
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {modo==="nuevo"&&<Modal title="Registrar Nuevo Viaje" onClose={()=>setModo("lista")}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Input label="Semana" value={form.semana} onChange={v=>setForm(f=>({...f,semana:v}))}/>
          <Input label="Fecha" value={form.fecha} onChange={v=>setForm(f=>({...f,fecha:v}))} type="date"/>
          <Input label="Coordinador" value={form.coordinador} onChange={v=>setForm(f=>({...f,coordinador:v}))} options={["JUAN JOSE TELLO","CRISTIAN ZUÑIGA","JULIO HERNANDEZ"]} required/>
          <Input label="Unidad" value={form.unidad} onChange={v=>setForm(f=>({...f,unidad:v}))} options={data.tractos.map(t=>t.unidad)} required/>
          <Input label="Caja" value={form.caja} onChange={v=>setForm(f=>({...f,caja:v}))} options={data.cajas.map(c=>c.caja)} required/>
          <Input label="Cliente" value={form.cliente} onChange={v=>setForm(f=>({...f,cliente:v}))} required/>
          <Input label="Circuito" value={form.circuito} onChange={v=>setForm(f=>({...f,circuito:v}))} options={["Reynosa - Bajio","Remolacha","DX","Adient","Mty-Bajio","Nld-Bajio","Carrier"]}/>
          <Input label="Estatus" value={form.estatus} onChange={v=>setForm(f=>({...f,estatus:v}))} options={["Programado","En Ruta","Realizado","Cancelado"]}/>
          <Input label="Venta Est $" value={form.ventaEst} onChange={v=>setForm(f=>({...f,ventaEst:v}))} type="number"/>
          <Input label="Venta Real $" value={form.ventaReal} onChange={v=>setForm(f=>({...f,ventaReal:v}))} type="number"/>
          <Input label="Costo Operador $" value={form.costoOp} onChange={v=>setForm(f=>({...f,costoOp:v}))} type="number"/>
          <Input label="Diesel $" value={form.diesel} onChange={v=>setForm(f=>({...f,diesel:v}))} type="number"/>
          <Input label="Casetas $" value={form.casetas} onChange={v=>setForm(f=>({...f,casetas:v}))} type="number"/>
          <Input label="Costo Mtto $" value={form.costoMtto} onChange={v=>setForm(f=>({...f,costoMtto:v}))} type="number"/>
          <Input label="Km Recorridos" value={form.kmRecorridos} onChange={v=>setForm(f=>({...f,kmRecorridos:v}))} type="number"/>
          <Input label="Litros Diesel" value={form.litrosDiesel} onChange={v=>setForm(f=>({...f,litrosDiesel:v}))} type="number"/>
        </div>
        {form.kmRecorridos&&form.litrosDiesel&&+form.litrosDiesel>0&&(
          <div style={{marginTop:10,background:"#0a1628",borderRadius:8,padding:10,border:"1px solid #6366f140",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{color:"#64748b",fontSize:11}}>⛽ KM/L estimado</span>
            <span style={{color:"#6366f1",fontWeight:900,fontSize:20}}>{(+form.kmRecorridos/+form.litrosDiesel).toFixed(2)}</span>
          </div>
        )}
        {form.ventaEst&&+form.ventaEst>0&&(
          <div style={{marginTop:10,background:"#0a1628",borderRadius:8,padding:12,border:"1px solid #1e293b"}}>
            <div style={{fontSize:11,color:"#64748b",marginBottom:4}}>UTILIDAD ESTIMADA</div>
            <div style={{fontSize:22,fontWeight:900,color:"#10b981"}}>${(+form.ventaEst-(+form.costoOp)-(+form.diesel)-(+form.casetas)-(+form.costoMtto)).toLocaleString()}</div>
            <div style={{fontSize:11,color:"#475569"}}>Margen: {(((+form.ventaEst-(+form.costoOp)-(+form.diesel)-(+form.casetas)-(+form.costoMtto))/+form.ventaEst)*100).toFixed(1)}%</div>
          </div>
        )}
        <button onClick={guardarViaje} style={{marginTop:14,width:"100%",background:"#6366f1",border:"none",borderRadius:8,padding:"11px",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13}}>✅ Registrar Viaje {USAR_SHEETS?"+ Sync":""}</button>
      </Modal>}
      {showImport&&<Modal title="📥 Importar Viajes" onClose={()=>setShowImport(false)} wide><ImportadorMasivo tipo="viajes" onImportar={importar} onClose={()=>setShowImport(false)}/></Modal>}
      <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
        <input placeholder="🔍 Buscar..." value={q} onChange={e=>setQ(e.target.value)} style={{flex:1,minWidth:180,background:"#0a1628",border:"1px solid #1e293b",borderRadius:8,padding:"8px 12px",color:"#f1f5f9",fontSize:12,outline:"none"}}/>
        <button onClick={()=>setModo("nuevo")} style={{background:"#6366f1",border:"none",borderRadius:8,padding:"8px 14px",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:12}}>＋ Nuevo</button>
        <button onClick={()=>setShowImport(true)} style={{background:"#1e3a5f",border:"1px solid #3b82f640",borderRadius:8,padding:"8px 12px",color:"#3b82f6",fontSize:11,cursor:"pointer",fontWeight:700}}>📥 Importar Excel</button>
        <button onClick={()=>downloadCSV(toCSV(data.viajes,["id","semana","fecha","coordinador","unidad","caja","cliente","circuito","estatus","ventaEst","ventaReal","costoOp","diesel","casetas","costoMtto","kmRecorridos","litrosDiesel"]),"viajes.csv")} style={{background:"#1e3a2f",border:"1px solid #10b98144",borderRadius:8,padding:"8px 12px",color:"#10b981",fontSize:11,cursor:"pointer",fontWeight:700}}>⬇️ CSV</button>
      </div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:"2px solid #1e293b"}}>{["Sem","Fecha","Coord","Unidad","Caja","Cliente","Estatus","Venta Est","Venta Real","Costo","Utilidad","Margen","Km","KM/L"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 10px",color:"#475569",fontSize:10,textTransform:"uppercase",letterSpacing:.8,whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
          <tbody>{viajes.map((v,i)=>{
            const u=util(v); const m=v.ventaReal&&+v.ventaReal>0?((u/+v.ventaReal)*100).toFixed(1):null; const k=kml(v);
            return (
              <tr key={v.id} style={{borderBottom:"1px solid #0d1626",background:i%2===0?"#080e1c":"transparent"}}>
                <td style={{padding:"9px 10px",color:"#64748b"}}>{v.semana}</td>
                <td style={{padding:"9px 10px",color:"#64748b",whiteSpace:"nowrap"}}>{v.fecha}</td>
                <td style={{padding:"9px 10px"}}><span style={{color:coordColor(v.coordinador),fontWeight:700,fontSize:11}}>{v.coordinador.split(" ")[0]}</span></td>
                <td style={{padding:"9px 10px",color:"#f1f5f9",fontFamily:"monospace",fontWeight:700}}>{v.unidad}</td>
                <td style={{padding:"9px 10px",color:"#94a3b8",fontFamily:"monospace"}}>{v.caja}</td>
                <td style={{padding:"9px 10px",color:"#94a3b8",maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v.cliente}</td>
                <td style={{padding:"9px 10px"}}><Badge text={v.estatus}/></td>
                <td style={{padding:"9px 10px",color:"#475569"}}>${(+v.ventaEst||0).toLocaleString()}</td>
                <td style={{padding:"9px 10px",color:v.ventaReal?"#10b981":"#334155",fontWeight:v.ventaReal?700:400}}>{v.ventaReal?`$${(+v.ventaReal).toLocaleString()}`:"—"}</td>
                <td style={{padding:"9px 10px",color:"#f59e0b"}}>${((+v.costoOp||0)+(+v.diesel||0)+(+v.casetas||0)+(+v.costoMtto||0)).toLocaleString()}</td>
                <td style={{padding:"9px 10px",color:u!=null?(u>=0?"#10b981":"#ef4444"):"#334155",fontWeight:700}}>{u!=null?`$${u.toLocaleString()}`:"—"}</td>
                <td style={{padding:"9px 10px",color:m?(+m>=20?"#10b981":"#f59e0b"):"#334155"}}>{m?`${m}%`:"—"}</td>
                <td style={{padding:"9px 10px",color:"#64748b"}}>{v.kmRecorridos||"—"}</td>
                <td style={{padding:"9px 10px",color:k?(+k>=3?"#10b981":+k>=2.5?"#f59e0b":"#ef4444"):"#334155",fontWeight:k?700:400}}>{k||"—"}</td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>
    </div>
  );
};

// ─── ALERTAS ──────────────────────────────────────────────────────────────────
const Alertas = ({ data }) => {
  const alertas = [
    {tipo:"Incidencia Activa",unidad:"440-ABC",caja:"T0719",op:"José Alberto Galvan Gomez",coord:"TELLO",desc:"Incidencia activa registrada",fecha:"2026-04-06"},
    {tipo:"Incidencia Activa",unidad:"347-ABC",caja:"LH480",op:"Isaías Valero Esquivel",coord:"TELLO",desc:"Incidencia activa",fecha:"2026-04-06"},
    {tipo:"Incidencia Activa",unidad:"438-ABC",caja:"TM14165",op:"René Hernandez Hernández",coord:"TELLO",desc:"Incidencia activa",fecha:"2026-04-06"},
    {tipo:"Sin Operador",unidad:"060-ABC",caja:"-",op:"VACANTE",coord:"CRISTIAN",desc:"Unidad sin operador asignado",fecha:"2026-04-07"},
    {tipo:"Sin Operador",unidad:"166-ABC",caja:"-",op:"VACANTE",coord:"CRISTIAN",desc:"Unidad sin operador asignado",fecha:"2026-04-07"},
    {tipo:"Sin Operador",unidad:"172-ABC",caja:"-",op:"VACANTE",coord:"CRISTIAN",desc:"Unidad sin operador asignado",fecha:"2026-04-07"},
    {tipo:"Seguridad $",unidad:"-",caja:"-",op:"ALVARO GALICIA CASTRO",coord:"TELLO",desc:"Circulación Prohibida — $3,000 pendiente",fecha:"2026-03-06"},
    {tipo:"Seguridad $",unidad:"-",caja:"-",op:"JORGE DOMINGUEZ RAMIREZ",coord:"TELLO",desc:"Alcance — $8,000 pendiente",fecha:"2026-03-03"},
    {tipo:"Caja Dañada",unidad:"-",caja:"1003-ABC",op:"-",coord:"CRISTIAN",desc:"Vacía en patio dañada — Juárez",fecha:"2026-03-17"},
    {tipo:"Caja Revisar",unidad:"-",caja:"T0719",op:"-",coord:"TELLO",desc:"Pendiente de revisión",fecha:"2026-04-06"},
  ];
  const cols={"Incidencia Activa":"#ef4444","Sin Operador":"#64748b","Seguridad $":"#f59e0b","Caja Dañada":"#f97316","Caja Revisar":"#a855f7"};
  return (
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      <div style={{color:"#475569",fontSize:11}}>{alertas.length} alertas activas</div>
      {alertas.map((a,i)=>{
        const col=cols[a.tipo]||"#6366f1";
        return (
          <div key={i} style={{background:"#0a1628",border:`1px solid ${col}25`,borderLeft:`3px solid ${col}`,borderRadius:8,padding:"12px 14px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}><Badge text={a.tipo}/><span style={{color:"#334155",fontSize:10}}>{a.fecha}</span></div>
                <div style={{color:"#cbd5e1",fontSize:12,fontWeight:600}}>{a.op}</div>
                <div style={{color:"#475569",fontSize:11,marginTop:2}}>
                  {a.unidad!=="-"&&<span>🚛 {a.unidad} </span>}{a.caja!=="-"&&<span>📦 {a.caja} </span>}— {a.desc}
                </div>
              </div>
              <span style={{color:coordColor(a.coord),fontSize:10,fontWeight:700}}>{a.coord}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
const TABS = [
  {id:"dashboard",label:"Dashboard",icon:"📊"},
  {id:"distribucion",label:"Distribución",icon:"🗂️"},
  {id:"tractos",label:"Tractos",icon:"🚛"},
  {id:"cajas",label:"Cajas",icon:"📦"},
  {id:"viajes",label:"Viajes & KM/L",icon:"💰"},
  {id:"alertas",label:"Alertas",icon:"🔔"},
];

function App() {
  const [data, setData] = useState(() => initData());
  const [tab, setTab] = useState("dashboard");
  const [syncState, setSyncState] = useState("idle");

  useEffect(() => { saveLocal(data); }, [data]);

  // Auto-sync desde Sheets al abrir
  useEffect(() => {
    if (!USAR_SHEETS) return;
    syncFromSheets();
  }, []);

  const syncFromSheets = async () => {
    setSyncState("syncing");
    try {
      const [tractos, cajas, viajes] = await Promise.all([
        sheetsGet("Tractos"), sheetsGet("Cajas"), sheetsGet("Viajes")
      ]);
      const updated = {
        tractos: tractos.length ? tractos : data.tractos,
        cajas:   cajas.length   ? cajas   : data.cajas,
        viajes:  viajes.length  ? viajes.map((v,i)=>mapViaje(v,i)) : data.viajes,
        lastUpdate: new Date().toISOString(),
      };
      setData(updated); saveLocal(updated);
      setSyncState("ok");
      setTimeout(() => setSyncState("idle"), 3000);
    } catch(e) {
      setSyncState("error");
      setTimeout(() => setSyncState("idle"), 5000);
    }
  };

  return (
    <div style={{minHeight:"100vh",background:"#060d1a",color:"#e2e8f0",fontFamily:"'DM Sans','Segoe UI',sans-serif"}}>
      {/* HEADER */}
      <div style={{background:"#08111f",borderBottom:"1px solid #0f1e33",padding:"12px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
        <div>
          <div style={{fontSize:15,fontWeight:900,color:"#f1f5f9",letterSpacing:-.5}}>🚚 Nacional Autotransporte</div>
          <div style={{fontSize:9,color:"#334155",letterSpacing:1.5,textTransform:"uppercase"}}>ERP · TMS · Torre de Control v3 {USAR_SHEETS?"· ☁️ Google Sheets":"· 💾 Local"}</div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:"#10b981",boxShadow:"0 0 8px #10b981"}}/>
          <span style={{color:"#10b981",fontSize:10,fontWeight:700}}>OPERATIVO</span>
        </div>
      </div>

      {/* TABS */}
      <div style={{background:"#08111f",borderBottom:"1px solid #0f1e33",display:"flex",overflowX:"auto",padding:"0 14px"}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{background:"none",border:"none",borderBottom:tab===t.id?"2px solid #3b82f6":"2px solid transparent",color:tab===t.id?"#f1f5f9":"#475569",padding:"11px 14px",cursor:"pointer",fontSize:12,fontWeight:tab===t.id?700:400,whiteSpace:"nowrap",display:"flex",gap:6,alignItems:"center",transition:"all .15s"}}>
            <span>{t.icon}</span><span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div style={{padding:18,maxWidth:1400,margin:"0 auto"}}>
        <SyncBanner syncState={syncState} onSync={syncFromSheets}/>
        {tab==="dashboard"    && <Dashboard data={data}/>}
        {tab==="distribucion" && <DistribucionView data={data}/>}
        {tab==="tractos"      && <Tractos data={data} setData={setData}/>}
        {tab==="cajas"        && <Cajas data={data} setData={setData}/>}
        {tab==="viajes"       && <Viajes data={data} setData={setData}/>}
        {tab==="alertas"      && <Alertas data={data}/>}
      </div>

      {/* FOOTER */}
      <div style={{padding:"14px 18px",borderTop:"1px solid #0f1e33",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{color:"#1e3a5f",fontSize:10}}>{data.tractos.length} Tractos · {data.cajas.length} Cajas · v3 {USAR_SHEETS?"☁️ Sheets":"💾 Local"}</span>
        <button onClick={()=>{ if(window.confirm("¿Resetear datos locales?")){ localStorage.removeItem(STORAGE_KEY); window.location.reload(); }}}
          style={{background:"none",border:"1px solid #1e293b",borderRadius:6,padding:"4px 10px",color:"#334155",fontSize:10,cursor:"pointer"}}>
          🔄 Reset
        </button>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
