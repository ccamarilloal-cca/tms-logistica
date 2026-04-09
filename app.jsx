import { useState, useEffect, useCallback } from "react";

// ─── DATOS SEMILLA ────────────────────────────────────────────────────────────
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
  { caja:"1028-ABC", tipo:"Seca", coordinador:"CRISTIAN ZUÑIGA", ciudad:"-", ubicEsp:"-", estatus:"Disponible", cliente:"-", comentarios:"CAJA VENDIDA" },
  { caja:"1037-ABC", tipo:"Seca", coordinador:"CRISTIAN ZUÑIGA", ciudad:"NUEVO LAREDO, TAMPS", ubicEsp:"Patio", estatus:"Cargada", cliente:"HL FREIGHT INC", comentarios:"CARGADA EN PATIO" },
  { caja:"1038-ABC", tipo:"Seca", coordinador:"CRISTIAN ZUÑIGA", ciudad:"NUEVO LAREDO, TAMPS", ubicEsp:"Patio", estatus:"Cargada", cliente:"APTIV CONTRACT SERVICES", comentarios:"CARGADA RESAGADA EN PATIO" },
  { caja:"1040-ABC", tipo:"Seca", coordinador:"CRISTIAN ZUÑIGA", ciudad:"LAREDO, TX", ubicEsp:"Cliente", estatus:"Cargada", cliente:"EUROPARTNERS MEXICO USD", comentarios:"CARGADA CON CLIENTE" },
  { caja:"1043-ABC", tipo:"Seca", coordinador:"CRISTIAN ZUÑIGA", ciudad:"SALTILLO, COAH", ubicEsp:"Cliente", estatus:"Cargada", cliente:"THE ILS COMPANY LLC", comentarios:"CARGADA CON CLIENTE" },
  { caja:"1057-ABC", tipo:"Seca", coordinador:"CRISTIAN ZUÑIGA", ciudad:"NUEVO LAREDO, TAMPS", ubicEsp:"Patio", estatus:"Cargada", cliente:"EUROPARTNERS MEXICO USD", comentarios:"CARGADA EN PATIO" },
  { caja:"1065-ABC", tipo:"Seca", coordinador:"CRISTIAN ZUÑIGA", ciudad:"LAREDO, TX", ubicEsp:"Cliente", estatus:"Cargada", cliente:"GREATWAY TRANSPORTATION INC", comentarios:"CARGADA CON CLIENTE" },
  { caja:"1068-ABC", tipo:"Seca", coordinador:"CRISTIAN ZUÑIGA", ciudad:"JUAREZ, CHIH", ubicEsp:"Patio", estatus:"Dañada", cliente:"-", comentarios:"DAÑADA EN PATIO" },
  { caja:"1072-ABC", tipo:"Seca", coordinador:"JUAN JOSE TELLO", ciudad:"QUERETARO, QRO", ubicEsp:"Cliente", estatus:"Cargada", cliente:"PENSKE CORE", comentarios:"CARGADA CON CLIENTE" },
  { caja:"1080-ABC", tipo:"Seca", coordinador:"JUAN JOSE TELLO", ciudad:"REYNOSA, TAMPS", ubicEsp:"Patio", estatus:"Disponible", cliente:"-", comentarios:"DISPONIBLE EN PATIO" },
  { caja:"1085-ABC", tipo:"Seca", coordinador:"JUAN JOSE TELLO", ciudad:"QUERETARO, QRO", ubicEsp:"Cliente", estatus:"Cargada", cliente:"PENSKE CORE", comentarios:"CARGADA CON CLIENTE" },
  { caja:"1090-ABC", tipo:"Seca", coordinador:"JUAN JOSE TELLO", ciudad:"QUERETARO, QRO", ubicEsp:"Cliente", estatus:"Cargada", cliente:"PENSKE CORE", comentarios:"CARGADA CON CLIENTE" },
  { caja:"1095-ABC", tipo:"Seca", coordinador:"JUAN JOSE TELLO", ciudad:"TRANSITO", ubicEsp:"En tránsito", estatus:"En Tránsito", cliente:"TRAMUC AUTOLIV", comentarios:"EN TRANSITO QUERETARO" },
  { caja:"1100-ABC", tipo:"Seca", coordinador:"JUAN JOSE TELLO", ciudad:"REYNOSA, TAMPS", ubicEsp:"Patio", estatus:"Disponible", cliente:"-", comentarios:"DISPONIBLE" },
  { caja:"1105-ABC", tipo:"Seca", coordinador:"JUAN JOSE TELLO", ciudad:"QUERETARO, QRO", ubicEsp:"Cliente", estatus:"Cargada", cliente:"PENSKE CORE", comentarios:"CARGADA CON CLIENTE" },
  { caja:"1110-ABC", tipo:"Seca", coordinador:"JUAN JOSE TELLO", ciudad:"TRANSITO", ubicEsp:"En tránsito", estatus:"En Tránsito", cliente:"TRAMUC AUTOLIV", comentarios:"EN TRANSITO" },
  { caja:"1115-ABC", tipo:"Seca", coordinador:"JULIO HERNANDEZ", ciudad:"JUAREZ, CHIH", ubicEsp:"Patio", estatus:"Dañada", cliente:"-", comentarios:"DAÑADA" },
  { caja:"1120-ABC", tipo:"Seca", coordinador:"JULIO HERNANDEZ", ciudad:"LAREDO TEXAS", ubicEsp:"Cliente", estatus:"Cargada", cliente:"GREATWAY", comentarios:"CARGADA" },
  { caja:"1125-ABC", tipo:"Seca", coordinador:"JULIO HERNANDEZ", ciudad:"LAREDO TEXAS", ubicEsp:"Cliente", estatus:"Cargada", cliente:"HL FREIGHT", comentarios:"CARGADA" },
  { caja:"1130-ABC", tipo:"Seca", coordinador:"JULIO HERNANDEZ", ciudad:"QUERETARO", ubicEsp:"Cliente", estatus:"Disponible", cliente:"-", comentarios:"DISPONIBLE" },
  { caja:"1135-ABC", tipo:"Seca", coordinador:"JULIO HERNANDEZ", ciudad:"ARTEAGA", ubicEsp:"Cliente", estatus:"Cargada", cliente:"ADIENT", comentarios:"CARGADA CON CLIENTE" },
  { caja:"TM17213", tipo:"Seca", coordinador:"JUAN JOSE TELLO", ciudad:"QUERETARO", ubicEsp:"Cliente", estatus:"Cargada", cliente:"TRAMUC AUTOLIV", comentarios:"VIAJE REALIZADO" },
  { caja:"TM18210", tipo:"Seca", coordinador:"JUAN JOSE TELLO", ciudad:"BRP Qro", ubicEsp:"Cliente", estatus:"Cargada", cliente:"PENSKE CORE", comentarios:"CARGADA" },
  { caja:"LH480", tipo:"Seca", coordinador:"JUAN JOSE TELLO", ciudad:"REYNOSA, TAMPS", ubicEsp:"Patio", estatus:"Revisar", cliente:"-", comentarios:"PENDIENTE REVISAR" },
  { caja:"T0719", tipo:"Seca", coordinador:"JUAN JOSE TELLO", ciudad:"REYNOSA, TAMPS", ubicEsp:"Patio", estatus:"Revisar", cliente:"-", comentarios:"INCIDENCIA ACTIVA" },
  { caja:"TM14165", tipo:"Seca", coordinador:"JUAN JOSE TELLO", ciudad:"REYNOSA, TAMPS", ubicEsp:"Patio", estatus:"Revisar", cliente:"-", comentarios:"INCIDENCIA ACTIVA" },
];

// ─── STORAGE ──────────────────────────────────────────────────────────────────
const STORAGE_KEY = "nal_erp_v2";

const loadData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
};

const saveData = (data) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
};

const initData = () => {
  const saved = loadData();
  if (saved) return saved;
  const initial = {
    tractos: TRACTOS_SEED,
    cajas: CAJAS_SEED,
    viajes: [
      { id:"V-001", semana:10, fecha:"2026-03-02", coordinador:"JUAN JOSE TELLO", unidad:"151-ABC", caja:"1299", cliente:"Tramuc Aguascalientes", circuito:"Reynosa - Bajio", estatus:"Realizado", ventaEst:28000, ventaReal:28000, costoOp:4500, diesel:3200, casetas:800, costoMtto:0, kmRecorridos:834, litrosDiesel:267 },
      { id:"V-002", semana:10, fecha:"2026-03-02", coordinador:"JUAN JOSE TELLO", unidad:"437-ABC", caja:"TM17213", cliente:"Tramuc Autoliv Queretaro", circuito:"Reynosa - Bajio", estatus:"Realizado", ventaEst:26000, ventaReal:26000, costoOp:4500, diesel:3200, casetas:800, costoMtto:0, kmRecorridos:850, litrosDiesel:270 },
      { id:"V-003", semana:10, fecha:"2026-03-02", coordinador:"JUAN JOSE TELLO", unidad:"164-ABC", caja:"536209", cliente:"Tramuc Autoliv Queretaro", circuito:"Reynosa - Bajio", estatus:"Realizado", ventaEst:26000, ventaReal:26000, costoOp:4500, diesel:3200, casetas:800, costoMtto:0, kmRecorridos:850, litrosDiesel:270 },
      { id:"V-004", semana:10, fecha:"2026-03-02", coordinador:"JUAN JOSE TELLO", unidad:"173-ABC", caja:"TM18210", cliente:"Penske Core Matamoros", circuito:"Reynosa - Bajio", estatus:"Realizado", ventaEst:29000, ventaReal:29000, costoOp:4500, diesel:3200, casetas:800, costoMtto:0, kmRecorridos:840, litrosDiesel:260 },
      { id:"V-005", semana:15, fecha:"2026-04-07", coordinador:"JUAN JOSE TELLO", unidad:"173-ABC", caja:"1162", cliente:"PENSKE-CORE", circuito:"Reynosa - Bajio", estatus:"Programado", ventaEst:29000, ventaReal:null, costoOp:4500, diesel:3200, casetas:800, costoMtto:0, kmRecorridos:0, litrosDiesel:0 },
      { id:"V-006", semana:15, fecha:"2026-04-07", coordinador:"JUAN JOSE TELLO", unidad:"422-ABC", caja:"1240", cliente:"PENSKE-CORE", circuito:"Reynosa - Bajio", estatus:"Programado", ventaEst:29000, ventaReal:null, costoOp:4500, diesel:3200, casetas:800, costoMtto:0, kmRecorridos:0, litrosDiesel:0 },
    ],
    lastUpdate: new Date().toISOString(),
  };
  saveData(initial);
  return initial;
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const C = { TELLO:"#3b82f6", CRISTIAN:"#10b981", JULIO:"#f59e0b" };
const coordColor = (c="") => {
  if (c.toUpperCase().includes("TELLO")) return C.TELLO;
  if (c.toUpperCase().includes("CRISTIAN")||c.toUpperCase().includes("ZUÑIGA")) return C.CRISTIAN;
  if (c.toUpperCase().includes("JULIO")||c.toUpperCase().includes("HERNANDEZ")) return C.JULIO;
  return "#6366f1";
};

const estatusColor = (e="") => {
  const s = e.toLowerCase();
  if (s.includes("facturando")||s.includes("vta")||s.includes("realizado")||s.includes("activo")) return "#10b981";
  if (s.includes("dco")||s.includes("disponible")) return "#3b82f6";
  if (s.includes("programado")) return "#6366f1";
  if (s.includes("siniestro")||s.includes("sg")||s.includes("dañada")) return "#ef4444";
  if (s.includes("reparacion")||s.includes("rm")||s.includes("correctivo")||s.includes("cp")||s.includes("mtto")||s.includes("mantenimiento")) return "#f59e0b";
  if (s.includes("sin operador")||s.includes("vacante")||s.includes("so")) return "#64748b";
  if (s.includes("liberar")||s.includes("lib")) return "#a855f7";
  if (s.includes("cargada")) return "#10b981";
  if (s.includes("tránsito")) return "#3b82f6";
  if (s.includes("revisar")) return "#f59e0b";
  return "#64748b";
};

const Badge = ({ text }) => (
  <span style={{ background:estatusColor(text)+"22", color:estatusColor(text), border:`1px solid ${estatusColor(text)}44`, borderRadius:5, padding:"2px 7px", fontSize:10, fontWeight:700, letterSpacing:.5, textTransform:"uppercase", whiteSpace:"nowrap" }}>{text}</span>
);

const toCSV = (rows, cols) => {
  const header = cols.join(",");
  const body = rows.map(r => cols.map(c => `"${r[c]??''}"`).join(",")).join("\n");
  return header+"\n"+body;
};

const downloadCSV = (content, filename) => {
  const blob = new Blob([content], { type:"text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

// ─── PARSE HELPERS ────────────────────────────────────────────────────────────
// Parsea texto pegado desde Excel/Google Sheets (tab-separated)
const parseTSV = (text) => {
  const lines = text.trim().split("\n").filter(l => l.trim());
  if (lines.length < 2) return null;
  const headers = lines[0].split("\t").map(h => h.trim().toLowerCase().replace(/\s+/g,"").replace(/[áàä]/g,"a").replace(/[éèë]/g,"e").replace(/[íìï]/g,"i").replace(/[óòö]/g,"o").replace(/[úùü]/g,"u").replace(/ñ/g,"n"));
  return lines.slice(1).map(line => {
    const vals = line.split("\t");
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (vals[i]||"").trim(); });
    return obj;
  });
};

// Mapea columnas de Excel a campos internos de tractos
const mapTracto = (row) => ({
  unidad: row.unidad || row.tracto || row.economico || row.eco || "",
  operador: row.operador || row.conductor || row.nombre || "",
  coordinador: row.coordinador || row.coord || "",
  estatus: row.estatus || row.status || row.estado || "",
  circuito: row.circuito || row.ruta || row.cliente || "",
  ubicacion: row.ubicacion || row.ubicacion || row.ciudad || row.lugar || "",
});

// Mapea columnas de Excel a campos internos de cajas
const mapCaja = (row) => ({
  caja: row.caja || row.remolque || row.trailer || row.numero || "",
  tipo: row.tipo || "Seca",
  coordinador: row.coordinador || row.coord || "",
  ciudad: row.ciudad || row.ubicacion || row.lugar || "",
  ubicEsp: row.ubicacionespecifica || row.ubicacion || row.lugar || "",
  estatus: row.estatus || row.status || row.estado || "",
  cliente: row.cliente || "",
  comentarios: row.comentarios || row.notas || row.observaciones || "",
});

// Mapea columnas de Excel a campos internos de viajes
const mapViaje = (row, idx) => ({
  id: row.id || `V-IMP-${idx+1}`,
  semana: parseInt(row.semana||"0")||0,
  fecha: row.fecha || new Date().toISOString().split("T")[0],
  coordinador: row.coordinador || row.coord || "",
  unidad: row.unidad || row.tracto || "",
  caja: row.caja || row.remolque || "",
  cliente: row.cliente || "",
  circuito: row.circuito || row.ruta || "",
  estatus: row.estatus || row.status || "Realizado",
  ventaEst: parseFloat(row.ventaest||row.ventaestimada||row.estimado||"0")||0,
  ventaReal: parseFloat(row.ventareal||row.venta||row.factura||"0")||null,
  costoOp: parseFloat(row.costooperador||row.costoop||row.operador||"0")||0,
  diesel: parseFloat(row.diesel||row.combustible||"0")||0,
  casetas: parseFloat(row.casetas||row.peajes||"0")||0,
  costoMtto: parseFloat(row.costomtto||row.mantenimiento||row.mtto||"0")||0,
  kmRecorridos: parseFloat(row.kmrecorridos||row.km||row.kilometros||"0")||0,
  litrosDiesel: parseFloat(row.litrosdiesel||row.litros||"0")||0,
});

// ─── INPUT ────────────────────────────────────────────────────────────────────
const Input = ({ label, value, onChange, type="text", options, required }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
    <label style={{ fontSize:11, color:"#64748b", textTransform:"uppercase", letterSpacing:.8 }}>{label}{required&&<span style={{color:"#ef4444"}}> *</span>}</label>
    {options ? (
      <select value={value} onChange={e=>onChange(e.target.value)}
        style={{ background:"#0f172a", border:"1px solid #1e293b", borderRadius:7, padding:"8px 10px", color:"#f1f5f9", fontSize:12, outline:"none" }}>
        <option value="">— Seleccionar —</option>
        {options.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
    ) : (
      <input type={type} value={value} onChange={e=>onChange(e.target.value)}
        style={{ background:"#0f172a", border:"1px solid #1e293b", borderRadius:7, padding:"8px 10px", color:"#f1f5f9", fontSize:12, outline:"none" }} />
    )}
  </div>
);

const Modal = ({ title, onClose, children, wide }) => (
  <div style={{ position:"fixed", inset:0, background:"#000c", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
    <div style={{ background:"#0d1829", border:"1px solid #1e293b", borderRadius:14, width:"100%", maxWidth:wide?820:560, maxHeight:"92vh", overflow:"auto" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", borderBottom:"1px solid #1e293b", position:"sticky", top:0, background:"#0d1829", zIndex:1 }}>
        <div style={{ color:"#f1f5f9", fontWeight:700, fontSize:14 }}>{title}</div>
        <button onClick={onClose} style={{ background:"none", border:"none", color:"#64748b", fontSize:22, cursor:"pointer" }}>×</button>
      </div>
      <div style={{ padding:20 }}>{children}</div>
    </div>
  </div>
);

// ─── IMPORTADOR MASIVO ────────────────────────────────────────────────────────
const ImportadorMasivo = ({ tipo, onImportar, onClose }) => {
  const [texto, setTexto] = useState("");
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [modo, setModo] = useState("reemplazar"); // reemplazar | agregar

  const columnasTractos = "unidad\toperador\tcoordinador\testatus\tcircuito\tubicacion";
  const columnasCajas   = "caja\ttipo\tcoordinador\tciudad\tubicEsp\testatus\tcliente\tcomentarios";
  const columnasViajes  = "semana\tfecha\tcoordinador\tunidad\tcaja\tcliente\tcircuito\testatus\tventaEst\tventaReal\tcostoOp\tdiesel\tcasetas\tcostoMtto\tkmRecorridos\tlitrosDiesel";

  const plantilla = tipo==="tractos" ? columnasTractos : tipo==="cajas" ? columnasCajas : columnasViajes;
  const ejemplo = tipo==="tractos"
    ? "018-ABC\tVICTOR ARAMBULA\tJULIO HERNANDEZ\tActivo\tRemolacha\tReynosa"
    : tipo==="cajas"
    ? "1003-ABC\tSeca\tCRISTIAN ZUÑIGA\tJUAREZ, CHIH\tPatio\tDañada\tPENSKE\tVACIA DAÑADA"
    : "15\t2026-04-07\tJUAN JOSE TELLO\t151-ABC\t1299\tTramuc\tReynosa - Bajio\tRealizado\t28000\t28000\t4500\t3200\t800\t0\t834\t267";

  const parsear = () => {
    setError("");
    if (!texto.trim()) { setError("Pega datos primero."); return; }
    const rows = parseTSV(texto);
    if (!rows || rows.length === 0) { setError("No se detectaron filas. Asegúrate de copiar desde Excel con encabezados."); return; }
    const mapped = tipo==="tractos" ? rows.map(mapTracto) : tipo==="cajas" ? rows.map(mapCaja) : rows.map(mapViaje);
    const validos = mapped.filter(r => {
      if (tipo==="tractos") return r.unidad;
      if (tipo==="cajas") return r.caja;
      return r.coordinador || r.unidad;
    });
    if (validos.length === 0) { setError("No se encontraron datos válidos. Revisa que los encabezados coincidan con la plantilla."); return; }
    setPreview({ filas: validos, total: rows.length });
  };

  const confirmar = () => {
    onImportar(preview.filas, modo);
    onClose();
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      {/* INSTRUCCIONES */}
      <div style={{ background:"#0a1628", border:"1px solid #1e3a5f", borderRadius:10, padding:14 }}>
        <div style={{ color:"#3b82f6", fontWeight:700, fontSize:12, marginBottom:8 }}>📋 ¿CÓMO USAR ESTA PANTALLA?</div>
        <div style={{ color:"#94a3b8", fontSize:11, lineHeight:1.7 }}>
          <b style={{color:"#f1f5f9"}}>Paso 1:</b> Abre tu Excel y pon los encabezados exactos de la plantilla en la fila 1<br/>
          <b style={{color:"#f1f5f9"}}>Paso 2:</b> Llena tus datos debajo de los encabezados<br/>
          <b style={{color:"#f1f5f9"}}>Paso 3:</b> Selecciona TODO (Ctrl+A o Cmd+A) → Copia (Ctrl+C)<br/>
          <b style={{color:"#f1f5f9"}}>Paso 4:</b> Pega aquí abajo (Ctrl+V) → Click en "Vista Previa"<br/>
          <b style={{color:"#f1f5f9"}}>Paso 5:</b> Revisa el resumen → Click en "Confirmar Importación"<br/>
          <div style={{marginTop:6, color:"#475569"}}>💡 Los encabezados NO son sensibles a mayúsculas ni acentos</div>
        </div>
      </div>

      {/* PLANTILLA */}
      <div style={{ background:"#0a1628", border:"1px solid #1e293b", borderRadius:10, padding:12 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
          <div style={{ color:"#64748b", fontSize:11, textTransform:"uppercase", letterSpacing:.8 }}>📄 Plantilla Excel (encabezados)</div>
          <button onClick={()=>{
            const content = plantilla+"\n"+ejemplo;
            const blob = new Blob([content], {type:"text/plain"});
            const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
            a.download = `plantilla_${tipo}.txt`; a.click();
          }} style={{ background:"#1e3a2f", border:"1px solid #10b98140", borderRadius:6, padding:"4px 10px", color:"#10b981", fontSize:10, cursor:"pointer", fontWeight:700 }}>
            ⬇️ Descargar plantilla
          </button>
        </div>
        <code style={{ display:"block", background:"#060d1a", borderRadius:6, padding:10, color:"#10b981", fontSize:10, fontFamily:"monospace", overflowX:"auto", whiteSpace:"pre" }}>{plantilla}{"\n"}<span style={{color:"#475569"}}>{ejemplo}</span></code>
      </div>

      {/* MODO */}
      <div style={{ display:"flex", gap:10 }}>
        {["reemplazar","agregar"].map(m=>(
          <button key={m} onClick={()=>setModo(m)}
            style={{ flex:1, padding:"9px", borderRadius:8, border:`1px solid ${modo===m?"#3b82f6":"#1e293b"}`, background:modo===m?"#1e3a5f":"#0a1628", color:modo===m?"#f1f5f9":"#64748b", fontSize:12, cursor:"pointer", fontWeight:700 }}>
            {m==="reemplazar"?"🔄 Reemplazar todo (actualización diaria)":"➕ Agregar a lo existente"}
          </button>
        ))}
      </div>

      {/* ÁREA DE PEGADO */}
      <div>
        <label style={{ fontSize:11, color:"#64748b", textTransform:"uppercase", letterSpacing:.8, marginBottom:6, display:"block" }}>📥 Pega aquí tus datos de Excel</label>
        <textarea
          value={texto}
          onChange={e=>{setTexto(e.target.value); setPreview(null); setError("");}}
          placeholder={"Copia desde Excel y pega aquí...\n\nEjemplo:\nunidad\toperador\tcoordinador\testatus\tcircuito\tubicacion\n018-ABC\tVICTOR ARAMBULA\tJULIO HERNANDEZ\tActivo\tRemolacha\tReynosa"}
          style={{ width:"100%", height:160, background:"#060d1a", border:"1px solid #1e3a5f", borderRadius:8, padding:12, color:"#f1f5f9", fontSize:11, fontFamily:"monospace", resize:"vertical", outline:"none", boxSizing:"border-box" }}
        />
      </div>

      {error && <div style={{ background:"#2d0a0a", border:"1px solid #ef444440", borderRadius:8, padding:12, color:"#ef4444", fontSize:12 }}>⚠️ {error}</div>}

      {/* PREVIEW */}
      {preview && (
        <div style={{ background:"#0a1c10", border:"1px solid #10b98140", borderRadius:10, padding:14 }}>
          <div style={{ color:"#10b981", fontWeight:700, fontSize:13, marginBottom:8 }}>✅ Vista previa — {preview.filas.length} registros válidos de {preview.total} filas</div>
          <div style={{ overflowX:"auto", maxHeight:200 }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:10 }}>
              <thead>
                <tr>{Object.keys(preview.filas[0]).map(k=>(
                  <th key={k} style={{ textAlign:"left", padding:"4px 8px", color:"#475569", borderBottom:"1px solid #1e293b", whiteSpace:"nowrap" }}>{k}</th>
                ))}</tr>
              </thead>
              <tbody>
                {preview.filas.slice(0,8).map((r,i)=>(
                  <tr key={i} style={{ borderBottom:"1px solid #0d1626" }}>
                    {Object.values(r).map((v,j)=>(
                      <td key={j} style={{ padding:"4px 8px", color:"#94a3b8", whiteSpace:"nowrap", maxWidth:120, overflow:"hidden", textOverflow:"ellipsis" }}>{String(v)}</td>
                    ))}
                  </tr>
                ))}
                {preview.filas.length > 8 && (
                  <tr><td colSpan={Object.keys(preview.filas[0]).length} style={{ padding:"6px 8px", color:"#475569", fontSize:10 }}>... y {preview.filas.length-8} más</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div style={{ display:"flex", gap:10 }}>
        <button onClick={parsear}
          style={{ flex:1, background:"#1e293b", border:"1px solid #334155", borderRadius:8, padding:"11px", color:"#f1f5f9", fontWeight:700, cursor:"pointer", fontSize:13 }}>
          🔍 Vista Previa
        </button>
        {preview && (
          <button onClick={confirmar}
            style={{ flex:2, background:"#10b981", border:"none", borderRadius:8, padding:"11px", color:"#fff", fontWeight:700, cursor:"pointer", fontSize:13 }}>
            ✅ Confirmar Importación ({preview.filas.length} registros)
          </button>
        )}
      </div>
    </div>
  );
};

// ─── DISTRIBUCIÓN POR CIRCUITO / COORDINADOR ─────────────────────────────────
const DistribucionView = ({ data }) => {
  const { tractos, viajes } = data;

  // Por circuito
  const circuitoMap = {};
  tractos.forEach(t => {
    const c = t.circuito || "-";
    if (!circuitoMap[c]) circuitoMap[c] = { total:0, activos:0, enRuta:0, mtto:0, sinOp:0 };
    circuitoMap[c].total++;
    if (t.estatus.includes("VTA")||t.estatus.includes("Facturando")) circuitoMap[c].enRuta++;
    else if (t.estatus.includes("Activo")) circuitoMap[c].activos++;
    else if (["SG","RM","CP","Mantenimiento","Correctivo","Siniestro"].some(x=>t.estatus.includes(x))) circuitoMap[c].mtto++;
    else if (t.estatus.includes("Sin Operador")||t.estatus.includes("LIB")||t.estatus.includes("DCO")) circuitoMap[c].sinOp++;
  });
  const circuitos = Object.entries(circuitoMap).sort((a,b)=>b[1].total-a[1].total);

  // Por coordinador
  const coords = [
    { nombre:"Juan José Tello", key:"TELLO", color:"#3b82f6" },
    { nombre:"Cristian Zuñiga", key:"CRISTIAN", color:"#10b981" },
    { nombre:"Julio Hernandez", key:"JULIO", color:"#f59e0b" },
  ].map(coord => {
    const ts = tractos.filter(t=>t.coordinador.toUpperCase().includes(coord.key));
    const enRuta = ts.filter(t=>t.estatus.includes("VTA")||t.estatus.includes("Facturando")).length;
    const activos = ts.filter(t=>t.estatus.includes("Activo")).length;
    const mtto = ts.filter(t=>["SG","RM","CP","Mantenimiento","Correctivo","Siniestro"].some(x=>t.estatus.includes(x))).length;
    const sinOp = ts.filter(t=>t.estatus.includes("Sin Operador")||t.estatus.includes("LIB")).length;
    // KM/L promedio de viajes
    const vCoord = viajes.filter(v=>v.coordinador.toUpperCase().includes(coord.key)&&v.kmRecorridos>0&&v.litrosDiesel>0);
    const kml = vCoord.length > 0 ? (vCoord.reduce((s,v)=>s+(v.kmRecorridos/v.litrosDiesel),0)/vCoord.length).toFixed(2) : "—";
    return { ...coord, total:ts.length, enRuta, activos, mtto, sinOp, kml, circuitos:[...new Set(ts.map(t=>t.circuito).filter(c=>c&&c!=="-"))] };
  });

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {/* POR COORDINADOR */}
      <div>
        <div style={{ color:"#475569", fontSize:11, textTransform:"uppercase", letterSpacing:1.5, marginBottom:10 }}>👥 Distribución por Coordinador</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:10 }}>
          {coords.map(c=>(
            <div key={c.key} style={{ background:"#0a1628", border:`1px solid ${c.color}30`, borderRadius:12, padding:16 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:c.color, boxShadow:`0 0 8px ${c.color}` }} />
                <div style={{ color:"#f1f5f9", fontWeight:800, fontSize:14 }}>{c.nombre}</div>
                <div style={{ marginLeft:"auto", background:c.color+"20", color:c.color, borderRadius:6, padding:"2px 8px", fontSize:12, fontWeight:700 }}>{c.total} tractos</div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6, textAlign:"center", marginBottom:12 }}>
                {[["En Ruta",c.enRuta,"#10b981"],["Activos",c.activos,"#3b82f6"],["Mtto",c.mtto,"#f59e0b"],["Sin Op",c.sinOp,"#64748b"]].map(([l,v,col])=>(
                  <div key={l} style={{ background:col+"15", borderRadius:7, padding:"6px 4px" }}>
                    <div style={{ color:col, fontWeight:900, fontSize:18 }}>{v}</div>
                    <div style={{ color:"#475569", fontSize:9, textTransform:"uppercase" }}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:"1px solid #1e293b", paddingTop:10 }}>
                <div style={{ color:"#64748b", fontSize:10 }}>Circuitos: <span style={{color:"#94a3b8"}}>{c.circuitos.slice(0,3).join(", ")}{c.circuitos.length>3?` +${c.circuitos.length-3}`:""}</span></div>
                <div style={{ background:"#0d1626", borderRadius:7, padding:"4px 10px", textAlign:"center" }}>
                  <div style={{ color:c.color, fontWeight:900, fontSize:16 }}>{c.kml}</div>
                  <div style={{ color:"#475569", fontSize:9 }}>KM/L prom</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* POR CIRCUITO */}
      <div>
        <div style={{ color:"#475569", fontSize:11, textTransform:"uppercase", letterSpacing:1.5, marginBottom:10 }}>🔁 Distribución por Circuito</div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
            <thead>
              <tr style={{ borderBottom:"2px solid #1e293b" }}>
                {["Circuito","Total","En Ruta","Activos","Mtto","Sin Op","% Operando"].map(h=>(
                  <th key={h} style={{ textAlign:"left", padding:"8px 12px", color:"#475569", fontSize:10, textTransform:"uppercase", letterSpacing:.8, whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {circuitos.map(([circ, vals], i)=>{
                const pct = vals.total>0 ? (((vals.enRuta+vals.activos)/vals.total)*100).toFixed(0) : 0;
                return (
                  <tr key={circ} style={{ borderBottom:"1px solid #0d1626", background:i%2===0?"#080e1c":"transparent" }}>
                    <td style={{ padding:"10px 12px", color:"#f1f5f9", fontWeight:700 }}>{circ}</td>
                    <td style={{ padding:"10px 12px", color:"#94a3b8", fontWeight:700 }}>{vals.total}</td>
                    <td style={{ padding:"10px 12px" }}><span style={{ color:"#10b981", fontWeight:700 }}>{vals.enRuta}</span></td>
                    <td style={{ padding:"10px 12px" }}><span style={{ color:"#3b82f6", fontWeight:700 }}>{vals.activos}</span></td>
                    <td style={{ padding:"10px 12px" }}><span style={{ color:"#f59e0b", fontWeight:700 }}>{vals.mtto}</span></td>
                    <td style={{ padding:"10px 12px" }}><span style={{ color:"#64748b", fontWeight:700 }}>{vals.sinOp}</span></td>
                    <td style={{ padding:"10px 12px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ flex:1, height:6, background:"#1e293b", borderRadius:3, overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${pct}%`, background:pct>=70?"#10b981":pct>=40?"#f59e0b":"#ef4444", borderRadius:3, transition:"width .4s" }} />
                        </div>
                        <span style={{ color:pct>=70?"#10b981":pct>=40?"#f59e0b":"#ef4444", fontWeight:700, fontSize:11, minWidth:30 }}>{pct}%</span>
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

// ─── SCREENS ──────────────────────────────────────────────────────────────────
const Dashboard = ({ data }) => {
  const { tractos, cajas, viajes } = data;
  const enRuta = tractos.filter(t=>t.estatus.includes("VTA")||t.estatus.includes("Facturando")).length;
  const disponibles = tractos.filter(t=>t.estatus.includes("DCO")||t.estatus.includes("Disponible")).length;
  const enMtto = tractos.filter(t=>["SG","RM","CP","Mantenimiento","Correctivo","Siniestro"].some(x=>t.estatus.includes(x))).length;
  const sinOp = tractos.filter(t=>t.estatus.includes("Sin Operador")||t.estatus.includes("LIB")).length;
  const cajasCargadas = cajas.filter(c=>c.estatus==="Cargada").length;
  const cajasDisponibles = cajas.filter(c=>c.estatus==="Disponible").length;
  const cajasDañadas = cajas.filter(c=>c.estatus==="Dañada").length;
  const cajasTransito = cajas.filter(c=>c.estatus==="En Tránsito").length;
  const viajesRealizados = viajes.filter(v=>v.estatus==="Realizado");
  const ventaReal = viajesRealizados.reduce((s,v)=>s+(v.ventaReal||0),0);
  const costoTotal = viajesRealizados.reduce((s,v)=>s+(v.costoOp||0)+(v.diesel||0)+(v.casetas||0)+(v.costoMtto||0),0);
  const utilidad = ventaReal - costoTotal;
  const margen = ventaReal>0 ? ((utilidad/ventaReal)*100).toFixed(1) : 0;

  // KM/L global
  const vKml = viajesRealizados.filter(v=>v.kmRecorridos>0&&v.litrosDiesel>0);
  const kmlGlobal = vKml.length>0 ? (vKml.reduce((s,v)=>s+(v.kmRecorridos/v.litrosDiesel),0)/vKml.length).toFixed(2) : "—";

  const KPI = ({label,val,color,icon,sub}) => (
    <div style={{ background:"#0a1628", border:`1px solid ${color}30`, borderRadius:11, padding:"14px 16px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:color }} />
      <div style={{ fontSize:18 }}>{icon}</div>
      <div style={{ fontSize:26, fontWeight:900, color, lineHeight:1.1, marginTop:4 }}>{val}</div>
      <div style={{ fontSize:10, color:"#64748b", textTransform:"uppercase", letterSpacing:.8, marginTop:2 }}>{label}</div>
      {sub&&<div style={{ fontSize:10, color:"#334155", marginTop:2 }}>{sub}</div>}
    </div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div>
        <div style={{ color:"#475569", fontSize:11, letterSpacing:2, textTransform:"uppercase" }}>Torre de Control · {new Date().toLocaleDateString("es-MX",{day:"2-digit",month:"short",year:"numeric"})}</div>
        <div style={{ color:"#f1f5f9", fontSize:20, fontWeight:900, marginTop:2 }}>Nacional Autotransporte</div>
      </div>
      <div style={{ color:"#475569", fontSize:11, textTransform:"uppercase", letterSpacing:1 }}>🚛 {tractos.length} Tractos</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:8 }}>
        <KPI label="En Ruta / VTA" val={enRuta} color="#10b981" icon="🟢" sub="Facturando" />
        <KPI label="Disponibles" val={disponibles} color="#3b82f6" icon="🔵" sub="DCO listo" />
        <KPI label="Mantenimiento" val={enMtto} color="#f59e0b" icon="🔧" sub="SG/RM/CP" />
        <KPI label="Sin Operador" val={sinOp} color="#64748b" icon="⚠️" sub="Vacantes" />
      </div>
      <div style={{ color:"#475569", fontSize:11, textTransform:"uppercase", letterSpacing:1 }}>📦 {cajas.length} Cajas</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:8 }}>
        <KPI label="Cargadas" val={cajasCargadas} color="#10b981" icon="📦" />
        <KPI label="Disponibles" val={cajasDisponibles} color="#3b82f6" icon="🆓" />
        <KPI label="Dañadas" val={cajasDañadas} color="#ef4444" icon="🔴" />
        <KPI label="En Tránsito" val={cajasTransito} color="#6366f1" icon="🔄" />
      </div>
      <div style={{ color:"#475569", fontSize:11, textTransform:"uppercase", letterSpacing:1 }}>💰 Financiero</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:8 }}>
        <KPI label="Venta Real" val={`$${(ventaReal/1000).toFixed(0)}K`} color="#10b981" icon="💵" />
        <KPI label="Costo Total" val={`$${(costoTotal/1000).toFixed(0)}K`} color="#f59e0b" icon="📉" />
        <KPI label="Utilidad" val={`$${(utilidad/1000).toFixed(0)}K`} color={utilidad>=0?"#10b981":"#ef4444"} icon="📊" />
        <KPI label="Margen" val={`${margen}%`} color={margen>=20?"#10b981":"#f59e0b"} icon="%" sub="Meta >20%" />
        <KPI label="KM/L Global" val={kmlGlobal} color="#6366f1" icon="⛽" sub="Promedio flota" />
        <KPI label="Viajes Reg." val={viajes.length} color="#a855f7" icon="✅" />
      </div>
      <div style={{ color:"#475569", fontSize:11, textTransform:"uppercase", letterSpacing:1 }}>👥 Por Coordinador</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:10 }}>
        {[
          { n:"Juan José Tello", k:"TELLO" },
          { n:"Cristian Zuñiga", k:"CRISTIAN" },
          { n:"Julio Hernandez", k:"JULIO" },
        ].map(c=>{
          const vCoord = viajes.filter(v=>v.coordinador.toUpperCase().includes(c.k)&&v.estatus==="Realizado");
          const venta = vCoord.reduce((s,v)=>s+(v.ventaReal||0),0);
          const costo = vCoord.reduce((s,v)=>s+(v.costoOp||0)+(v.diesel||0)+(v.casetas||0)+(v.costoMtto||0),0);
          const util = venta-costo;
          const col = coordColor(c.k);
          const vKml = vCoord.filter(v=>v.kmRecorridos>0&&v.litrosDiesel>0);
          const kml = vKml.length>0 ? (vKml.reduce((s,v)=>s+(v.kmRecorridos/v.litrosDiesel),0)/vKml.length).toFixed(2) : "—";
          const tCount = tractos.filter(t=>t.coordinador.toUpperCase().includes(c.k)).length;
          const cCount = []; // cajas no tienen key fácil, skip
          return (
            <div key={c.n} style={{ background:"#0a1628", border:`1px solid ${col}30`, borderRadius:11, padding:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                <div style={{ width:9, height:9, borderRadius:"50%", background:col }} />
                <div style={{ color:"#f1f5f9", fontWeight:700, fontSize:13 }}>{c.n}</div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:6, textAlign:"center" }}>
                {[["Tractos",tCount],["Utilidad",`$${(util/1000).toFixed(0)}K`],["KM/L",kml]].map(([l,v])=>(
                  <div key={l}>
                    <div style={{ color:col, fontWeight:900, fontSize:17 }}>{v}</div>
                    <div style={{ color:"#475569", fontSize:10 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Tractos = ({ data, setData }) => {
  const [q, setQ] = useState("");
  const [coord, setCoord] = useState("");
  const [estatusFil, setEstatusFil] = useState("");
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({});
  const [showImport, setShowImport] = useState(false);

  const lista = data.tractos.filter(t => {
    const texto = q.toLowerCase();
    const matchQ = !q || t.unidad.toLowerCase().includes(texto) || t.operador.toLowerCase().includes(texto) || t.circuito.toLowerCase().includes(texto) || t.ubicacion.toLowerCase().includes(texto);
    const matchC = !coord || t.coordinador.toUpperCase().includes(coord);
    const matchE = !estatusFil || t.estatus.includes(estatusFil);
    return matchQ && matchC && matchE;
  });

  const abrir = (t) => { setEditando(t.unidad); setForm({...t}); };
  const guardar = () => {
    const updated = { ...data, tractos: data.tractos.map(t=>t.unidad===editando?{...t,...form}:t), lastUpdate: new Date().toISOString() };
    setData(updated); saveData(updated); setEditando(null);
  };

  const importar = (filas, modo) => {
    const nuevos = modo==="reemplazar" ? filas : [...data.tractos, ...filas.filter(f=>!data.tractos.find(t=>t.unidad===f.unidad))];
    const updated = { ...data, tractos: nuevos, lastUpdate: new Date().toISOString() };
    setData(updated); saveData(updated);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      {editando && (
        <Modal title={`Editar Tracto ${editando}`} onClose={()=>setEditando(null)}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <Input label="Estatus" value={form.estatus||""} onChange={v=>setForm(f=>({...f,estatus:v}))}
              options={["VTA - Facturando","DCO - Disponible","Activo","Sin Operador","SG - Siniestro","RM - Reparacion Mayor","CP - Correctivo","Mantenimiento","LIB - Por Liberar","Siniestro"]} />
            <Input label="Ubicación Actual" value={form.ubicacion||""} onChange={v=>setForm(f=>({...f,ubicacion:v}))} />
            <Input label="Operador" value={form.operador||""} onChange={v=>setForm(f=>({...f,operador:v}))} />
            <Input label="Circuito" value={form.circuito||""} onChange={v=>setForm(f=>({...f,circuito:v}))}
              options={["Reynosa - Bajio","Remolacha","DX","Adient","Mty-Bajio","Nld-Bajio","Carrier","Pordefinir","-"]} />
          </div>
          <button onClick={guardar} style={{ marginTop:16, width:"100%", background:"#3b82f6", border:"none", borderRadius:8, padding:"10px", color:"#fff", fontWeight:700, cursor:"pointer", fontSize:13 }}>
            💾 Guardar Cambios
          </button>
        </Modal>
      )}
      {showImport && (
        <Modal title="📥 Importar Tractos desde Excel" onClose={()=>setShowImport(false)} wide>
          <ImportadorMasivo tipo="tractos" onImportar={importar} onClose={()=>setShowImport(false)} />
        </Modal>
      )}

      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        <input placeholder="🔍 Buscar unidad, operador, ubicación..." value={q} onChange={e=>setQ(e.target.value)}
          style={{ flex:1, minWidth:200, background:"#0a1628", border:"1px solid #1e293b", borderRadius:8, padding:"8px 12px", color:"#f1f5f9", fontSize:12, outline:"none" }} />
        <select value={coord} onChange={e=>setCoord(e.target.value)}
          style={{ background:"#0a1628", border:"1px solid #1e293b", borderRadius:8, padding:"8px 10px", color:"#f1f5f9", fontSize:12, outline:"none" }}>
          <option value="">Todos</option>
          <option value="TELLO">Tello</option>
          <option value="CRISTIAN">Cristian</option>
          <option value="JULIO">Julio</option>
        </select>
        <select value={estatusFil} onChange={e=>setEstatusFil(e.target.value)}
          style={{ background:"#0a1628", border:"1px solid #1e293b", borderRadius:8, padding:"8px 10px", color:"#f1f5f9", fontSize:12, outline:"none" }}>
          <option value="">Todos los estatus</option>
          <option value="VTA">En Ruta (VTA)</option>
          <option value="DCO">Disponible (DCO)</option>
          <option value="Sin Operador">Sin Operador</option>
          <option value="SG">Siniestro/Garantia</option>
          <option value="Mantenimiento">Mantenimiento</option>
        </select>
        <button onClick={()=>setShowImport(true)}
          style={{ background:"#1e3a5f", border:"1px solid #3b82f640", borderRadius:8, padding:"8px 12px", color:"#3b82f6", fontSize:11, cursor:"pointer", fontWeight:700 }}>
          📥 Importar Excel
        </button>
        <button onClick={()=>downloadCSV(toCSV(data.tractos,["unidad","operador","coordinador","estatus","circuito","ubicacion"]),"tractos_NAL.csv")}
          style={{ background:"#1e3a2f", border:"1px solid #10b98144", borderRadius:8, padding:"8px 12px", color:"#10b981", fontSize:11, cursor:"pointer", fontWeight:700 }}>
          ⬇️ CSV Power BI
        </button>
      </div>
      <div style={{ color:"#475569", fontSize:11 }}>{lista.length} de {data.tractos.length} tractos</div>
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
          <thead>
            <tr style={{ borderBottom:"2px solid #1e293b" }}>
              {["Unidad","Operador","Coordinador","Estatus","Circuito","Ubicación",""].map(h=>(
                <th key={h} style={{ textAlign:"left", padding:"8px 10px", color:"#475569", fontSize:10, textTransform:"uppercase", letterSpacing:.8 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lista.map((t,i)=>(
              <tr key={t.unidad} style={{ borderBottom:"1px solid #0d1626", background:i%2===0?"#080e1c":"transparent" }}>
                <td style={{ padding:"9px 10px", color:"#f1f5f9", fontWeight:800, fontFamily:"monospace" }}>{t.unidad}</td>
                <td style={{ padding:"9px 10px", color:"#94a3b8", maxWidth:160, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.operador}</td>
                <td style={{ padding:"9px 10px" }}><span style={{ color:coordColor(t.coordinador), fontWeight:700, fontSize:11 }}>{t.coordinador.split(" ")[0]}</span></td>
                <td style={{ padding:"9px 10px" }}><Badge text={t.estatus} /></td>
                <td style={{ padding:"9px 10px", color:"#64748b" }}>{t.circuito}</td>
                <td style={{ padding:"9px 10px", color:"#94a3b8" }}>{t.ubicacion}</td>
                <td style={{ padding:"9px 10px" }}>
                  <button onClick={()=>abrir(t)} style={{ background:"#1e293b", border:"none", borderRadius:6, padding:"4px 10px", color:"#94a3b8", cursor:"pointer", fontSize:11 }}>✏️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Cajas = ({ data, setData }) => {
  const [q, setQ] = useState("");
  const [coord, setCoord] = useState("");
  const [estatusFil, setEstatusFil] = useState("");
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({});
  const [showImport, setShowImport] = useState(false);

  const resumen = {};
  data.cajas.forEach(c=>{ resumen[c.estatus]=(resumen[c.estatus]||0)+1; });

  const lista = data.cajas.filter(c => {
    const texto = q.toLowerCase();
    const matchQ = !q || c.caja.toLowerCase().includes(texto) || c.cliente.toLowerCase().includes(texto) || c.ciudad.toLowerCase().includes(texto);
    const matchC = !coord || c.coordinador.toUpperCase().includes(coord);
    const matchE = !estatusFil || c.estatus===estatusFil;
    return matchQ && matchC && matchE;
  });

  const abrir = (c) => { setEditando(c.caja); setForm({...c}); };
  const guardar = () => {
    const updated = { ...data, cajas: data.cajas.map(c=>c.caja===editando?{...c,...form}:c), lastUpdate: new Date().toISOString() };
    setData(updated); saveData(updated); setEditando(null);
  };

  const importar = (filas, modo) => {
    const nuevas = modo==="reemplazar" ? filas : [...data.cajas, ...filas.filter(f=>!data.cajas.find(c=>c.caja===f.caja))];
    const updated = { ...data, cajas: nuevas, lastUpdate: new Date().toISOString() };
    setData(updated); saveData(updated);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      {editando && (
        <Modal title={`Editar Caja ${editando}`} onClose={()=>setEditando(null)}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <Input label="Estatus" value={form.estatus||""} onChange={v=>setForm(f=>({...f,estatus:v}))}
              options={["Cargada","Disponible","En Patio","En Tránsito","Dañada","Revisar"]} />
            <Input label="Ciudad" value={form.ciudad||""} onChange={v=>setForm(f=>({...f,ciudad:v}))} />
            <Input label="Ubicación Esp." value={form.ubicEsp||""} onChange={v=>setForm(f=>({...f,ubicEsp:v}))} />
            <Input label="Cliente" value={form.cliente||""} onChange={v=>setForm(f=>({...f,cliente:v}))} />
            <Input label="Comentarios" value={form.comentarios||""} onChange={v=>setForm(f=>({...f,comentarios:v}))} />
            <Input label="Coordinador" value={form.coordinador||""} onChange={v=>setForm(f=>({...f,coordinador:v}))}
              options={["JUAN JOSE TELLO","CRISTIAN ZUÑIGA","JULIO HERNANDEZ"]} />
          </div>
          <button onClick={guardar} style={{ marginTop:16, width:"100%", background:"#3b82f6", border:"none", borderRadius:8, padding:"10px", color:"#fff", fontWeight:700, cursor:"pointer", fontSize:13 }}>
            💾 Guardar Cambios
          </button>
        </Modal>
      )}
      {showImport && (
        <Modal title="📥 Importar Cajas desde Excel" onClose={()=>setShowImport(false)} wide>
          <ImportadorMasivo tipo="cajas" onImportar={importar} onClose={()=>setShowImport(false)} />
        </Modal>
      )}

      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        <input placeholder="🔍 Buscar caja, cliente, ciudad..." value={q} onChange={e=>setQ(e.target.value)}
          style={{ flex:1, minWidth:200, background:"#0a1628", border:"1px solid #1e293b", borderRadius:8, padding:"8px 12px", color:"#f1f5f9", fontSize:12, outline:"none" }} />
        <select value={coord} onChange={e=>setCoord(e.target.value)}
          style={{ background:"#0a1628", border:"1px solid #1e293b", borderRadius:8, padding:"8px 10px", color:"#f1f5f9", fontSize:12, outline:"none" }}>
          <option value="">Todos</option>
          <option value="TELLO">Tello</option>
          <option value="CRISTIAN">Cristian</option>
          <option value="JULIO">Julio</option>
        </select>
        <select value={estatusFil} onChange={e=>setEstatusFil(e.target.value)}
          style={{ background:"#0a1628", border:"1px solid #1e293b", borderRadius:8, padding:"8px 10px", color:"#f1f5f9", fontSize:12, outline:"none" }}>
          <option value="">Todos</option>
          {Object.keys(resumen).map(s=><option key={s} value={s}>{s} ({resumen[s]})</option>)}
        </select>
        <button onClick={()=>setShowImport(true)}
          style={{ background:"#1e3a5f", border:"1px solid #3b82f640", borderRadius:8, padding:"8px 12px", color:"#3b82f6", fontSize:11, cursor:"pointer", fontWeight:700 }}>
          📥 Importar Excel
        </button>
        <button onClick={()=>downloadCSV(toCSV(data.cajas,["caja","tipo","coordinador","ciudad","ubicEsp","estatus","cliente","comentarios"]),"cajas_NAL.csv")}
          style={{ background:"#1e3a2f", border:"1px solid #10b98144", borderRadius:8, padding:"8px 12px", color:"#10b981", fontSize:11, cursor:"pointer", fontWeight:700 }}>
          ⬇️ CSV Power BI
        </button>
      </div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {Object.entries(resumen).map(([k,v])=>(
          <div key={k} style={{ background:estatusColor(k)+"18", border:`1px solid ${estatusColor(k)}33`, borderRadius:7, padding:"5px 10px", fontSize:11 }}>
            <span style={{ color:estatusColor(k), fontWeight:700 }}>{v}</span>
            <span style={{ color:"#475569", marginLeft:4 }}>{k}</span>
          </div>
        ))}
      </div>
      <div style={{ color:"#475569", fontSize:11 }}>{lista.length} de {data.cajas.length} cajas</div>
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
          <thead>
            <tr style={{ borderBottom:"2px solid #1e293b" }}>
              {["Caja","Tipo","Coordinador","Ciudad","Ubicación","Estatus","Cliente","Comentarios",""].map(h=>(
                <th key={h} style={{ textAlign:"left", padding:"8px 10px", color:"#475569", fontSize:10, textTransform:"uppercase", letterSpacing:.8 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lista.map((c,i)=>(
              <tr key={c.caja} style={{ borderBottom:"1px solid #0d1626", background:i%2===0?"#080e1c":"transparent" }}>
                <td style={{ padding:"9px 10px", color:"#f1f5f9", fontWeight:800, fontFamily:"monospace" }}>{c.caja}</td>
                <td style={{ padding:"9px 10px", color:"#64748b" }}>{c.tipo}</td>
                <td style={{ padding:"9px 10px" }}><span style={{ color:coordColor(c.coordinador), fontWeight:700, fontSize:11 }}>{c.coordinador.split(" ")[0]}</span></td>
                <td style={{ padding:"9px 10px", color:"#94a3b8" }}>{c.ciudad}</td>
                <td style={{ padding:"9px 10px", color:"#64748b" }}>{c.ubicEsp}</td>
                <td style={{ padding:"9px 10px" }}><Badge text={c.estatus} /></td>
                <td style={{ padding:"9px 10px", color:"#94a3b8", maxWidth:140, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.cliente}</td>
                <td style={{ padding:"9px 10px", color:"#334155", fontSize:11, maxWidth:160, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.comentarios}</td>
                <td style={{ padding:"9px 10px" }}>
                  <button onClick={()=>abrir(c)} style={{ background:"#1e293b", border:"none", borderRadius:6, padding:"4px 10px", color:"#94a3b8", cursor:"pointer", fontSize:11 }}>✏️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Viajes = ({ data, setData }) => {
  const [modo, setModo] = useState("lista");
  const [q, setQ] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [form, setForm] = useState({ semana:"15", fecha:new Date().toISOString().split("T")[0], coordinador:"", unidad:"", caja:"", cliente:"", circuito:"", estatus:"Programado", ventaEst:"", ventaReal:"", costoOp:"4500", diesel:"3200", casetas:"800", costoMtto:"0", kmRecorridos:"", litrosDiesel:"" });

  const viajes = data.viajes.filter(v => {
    const t = q.toLowerCase();
    return !q || v.unidad.toLowerCase().includes(t) || v.cliente.toLowerCase().includes(t) || v.coordinador.toLowerCase().includes(t);
  });

  const guardarViaje = () => {
    const id = `V-${String(data.viajes.length+1).padStart(3,"0")}`;
    const nuevo = { ...form, id, semana:+form.semana, ventaEst:+form.ventaEst, ventaReal:form.ventaReal?+form.ventaReal:null, costoOp:+form.costoOp, diesel:+form.diesel, casetas:+form.casetas, costoMtto:+form.costoMtto, kmRecorridos:+form.kmRecorridos, litrosDiesel:+form.litrosDiesel };
    const updated = { ...data, viajes:[...data.viajes, nuevo], lastUpdate: new Date().toISOString() };
    setData(updated); saveData(updated); setModo("lista");
  };

  const importar = (filas, modo) => {
    const nuevos = modo==="reemplazar" ? filas : [...data.viajes, ...filas];
    const updated = { ...data, viajes: nuevos, lastUpdate: new Date().toISOString() };
    setData(updated); saveData(updated);
  };

  const utilidad = (v) => {
    if (!v.ventaReal) return null;
    return v.ventaReal - (v.costoOp||0) - (v.diesel||0) - (v.casetas||0) - (v.costoMtto||0);
  };

  const kml = (v) => {
    if (!v.kmRecorridos||!v.litrosDiesel||v.litrosDiesel===0) return null;
    return (v.kmRecorridos/v.litrosDiesel).toFixed(2);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      {modo === "nuevo" && (
        <Modal title="Registrar Nuevo Viaje" onClose={()=>setModo("lista")}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <Input label="Semana" value={form.semana} onChange={v=>setForm(f=>({...f,semana:v}))} />
            <Input label="Fecha" value={form.fecha} onChange={v=>setForm(f=>({...f,fecha:v}))} type="date" />
            <Input label="Coordinador" value={form.coordinador} onChange={v=>setForm(f=>({...f,coordinador:v}))} options={["JUAN JOSE TELLO","CRISTIAN ZUÑIGA","JULIO HERNANDEZ"]} required />
            <Input label="Unidad (Tracto)" value={form.unidad} onChange={v=>setForm(f=>({...f,unidad:v}))} options={data.tractos.map(t=>t.unidad)} required />
            <Input label="Caja" value={form.caja} onChange={v=>setForm(f=>({...f,caja:v}))} options={data.cajas.map(c=>c.caja)} required />
            <Input label="Cliente" value={form.cliente} onChange={v=>setForm(f=>({...f,cliente:v}))} required />
            <Input label="Circuito" value={form.circuito} onChange={v=>setForm(f=>({...f,circuito:v}))} options={["Reynosa - Bajio","Remolacha","DX","Adient","Mty-Bajio","Nld-Bajio","Carrier"]} />
            <Input label="Estatus" value={form.estatus} onChange={v=>setForm(f=>({...f,estatus:v}))} options={["Programado","En Ruta","Realizado","Cancelado"]} />
            <Input label="Venta Estimada $" value={form.ventaEst} onChange={v=>setForm(f=>({...f,ventaEst:v}))} type="number" />
            <Input label="Venta Real $" value={form.ventaReal} onChange={v=>setForm(f=>({...f,ventaReal:v}))} type="number" />
            <Input label="Costo Operador $" value={form.costoOp} onChange={v=>setForm(f=>({...f,costoOp:v}))} type="number" />
            <Input label="Diesel $" value={form.diesel} onChange={v=>setForm(f=>({...f,diesel:v}))} type="number" />
            <Input label="Casetas $" value={form.casetas} onChange={v=>setForm(f=>({...f,casetas:v}))} type="number" />
            <Input label="Costo Mtto $" value={form.costoMtto} onChange={v=>setForm(f=>({...f,costoMtto:v}))} type="number" />
            <Input label="Km Recorridos" value={form.kmRecorridos} onChange={v=>setForm(f=>({...f,kmRecorridos:v}))} type="number" />
            <Input label="Litros Diesel" value={form.litrosDiesel} onChange={v=>setForm(f=>({...f,litrosDiesel:v}))} type="number" />
          </div>
          {form.kmRecorridos && form.litrosDiesel && +form.litrosDiesel>0 && (
            <div style={{ marginTop:10, background:"#0a1628", borderRadius:8, padding:10, border:"1px solid #6366f140", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ color:"#64748b", fontSize:11 }}>⛽ KM/L estimado</span>
              <span style={{ color:"#6366f1", fontWeight:900, fontSize:20 }}>{(+form.kmRecorridos/+form.litrosDiesel).toFixed(2)}</span>
            </div>
          )}
          {form.ventaEst && form.costoOp && (
            <div style={{ marginTop:10, background:"#0a1628", borderRadius:8, padding:12, border:"1px solid #1e293b" }}>
              <div style={{ fontSize:11, color:"#64748b", marginBottom:4 }}>UTILIDAD ESTIMADA</div>
              <div style={{ fontSize:22, fontWeight:900, color:"#10b981" }}>
                ${(+form.ventaEst - (+form.costoOp) - (+form.diesel) - (+form.casetas) - (+form.costoMtto)).toLocaleString()}
              </div>
              <div style={{ fontSize:11, color:"#475569" }}>
                Margen: {((( +form.ventaEst - (+form.costoOp) - (+form.diesel) - (+form.casetas) - (+form.costoMtto)) / +form.ventaEst)*100).toFixed(1)}%
              </div>
            </div>
          )}
          <button onClick={guardarViaje} style={{ marginTop:14, width:"100%", background:"#6366f1", border:"none", borderRadius:8, padding:"11px", color:"#fff", fontWeight:700, cursor:"pointer", fontSize:13 }}>
            ✅ Registrar Viaje
          </button>
        </Modal>
      )}
      {showImport && (
        <Modal title="📥 Importar Viajes desde Excel" onClose={()=>setShowImport(false)} wide>
          <ImportadorMasivo tipo="viajes" onImportar={importar} onClose={()=>setShowImport(false)} />
        </Modal>
      )}

      <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
        <input placeholder="🔍 Buscar viaje..." value={q} onChange={e=>setQ(e.target.value)}
          style={{ flex:1, minWidth:180, background:"#0a1628", border:"1px solid #1e293b", borderRadius:8, padding:"8px 12px", color:"#f1f5f9", fontSize:12, outline:"none" }} />
        <button onClick={()=>setModo("nuevo")}
          style={{ background:"#6366f1", border:"none", borderRadius:8, padding:"8px 14px", color:"#fff", fontWeight:700, cursor:"pointer", fontSize:12 }}>
          ＋ Nuevo Viaje
        </button>
        <button onClick={()=>setShowImport(true)}
          style={{ background:"#1e3a5f", border:"1px solid #3b82f640", borderRadius:8, padding:"8px 12px", color:"#3b82f6", fontSize:11, cursor:"pointer", fontWeight:700 }}>
          📥 Importar Excel
        </button>
        <button onClick={()=>downloadCSV(toCSV(data.viajes,["id","semana","fecha","coordinador","unidad","caja","cliente","circuito","estatus","ventaEst","ventaReal","costoOp","diesel","casetas","costoMtto","kmRecorridos","litrosDiesel"]),"viajes_NAL.csv")}
          style={{ background:"#1e3a2f", border:"1px solid #10b98144", borderRadius:8, padding:"8px 12px", color:"#10b981", fontSize:11, cursor:"pointer", fontWeight:700 }}>
          ⬇️ CSV Power BI
        </button>
      </div>

      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
          <thead>
            <tr style={{ borderBottom:"2px solid #1e293b" }}>
              {["Sem","Fecha","Coord","Unidad","Caja","Cliente","Estatus","Venta Est","Venta Real","Costo","Utilidad","Margen","Km","KM/L"].map(h=>(
                <th key={h} style={{ textAlign:"left", padding:"8px 10px", color:"#475569", fontSize:10, textTransform:"uppercase", letterSpacing:.8, whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {viajes.map((v,i)=>{
              const util = utilidad(v);
              const margen = v.ventaReal&&v.ventaReal>0 ? ((util/v.ventaReal)*100).toFixed(1) : null;
              const kmL = kml(v);
              return (
                <tr key={v.id} style={{ borderBottom:"1px solid #0d1626", background:i%2===0?"#080e1c":"transparent" }}>
                  <td style={{ padding:"9px 10px", color:"#64748b" }}>{v.semana}</td>
                  <td style={{ padding:"9px 10px", color:"#64748b", whiteSpace:"nowrap" }}>{v.fecha}</td>
                  <td style={{ padding:"9px 10px" }}><span style={{ color:coordColor(v.coordinador), fontWeight:700, fontSize:11 }}>{v.coordinador.split(" ")[0]}</span></td>
                  <td style={{ padding:"9px 10px", color:"#f1f5f9", fontFamily:"monospace", fontWeight:700 }}>{v.unidad}</td>
                  <td style={{ padding:"9px 10px", color:"#94a3b8", fontFamily:"monospace" }}>{v.caja}</td>
                  <td style={{ padding:"9px 10px", color:"#94a3b8", maxWidth:130, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{v.cliente}</td>
                  <td style={{ padding:"9px 10px" }}><Badge text={v.estatus} /></td>
                  <td style={{ padding:"9px 10px", color:"#475569" }}>${(v.ventaEst||0).toLocaleString()}</td>
                  <td style={{ padding:"9px 10px", color:v.ventaReal?"#10b981":"#334155", fontWeight:v.ventaReal?700:400 }}>{v.ventaReal?`$${v.ventaReal.toLocaleString()}`:"—"}</td>
                  <td style={{ padding:"9px 10px", color:"#f59e0b" }}>${((v.costoOp||0)+(v.diesel||0)+(v.casetas||0)+(v.costoMtto||0)).toLocaleString()}</td>
                  <td style={{ padding:"9px 10px", color:util!=null?(util>=0?"#10b981":"#ef4444"):"#334155", fontWeight:700 }}>{util!=null?`$${util.toLocaleString()}`:"—"}</td>
                  <td style={{ padding:"9px 10px", color:margen?(+margen>=20?"#10b981":"#f59e0b"):"#334155" }}>{margen?`${margen}%`:"—"}</td>
                  <td style={{ padding:"9px 10px", color:"#64748b" }}>{v.kmRecorridos||"—"}</td>
                  <td style={{ padding:"9px 10px", color:kmL?(+kmL>=3?"#10b981":+kmL>=2.5?"#f59e0b":"#ef4444"):"#334155", fontWeight:kmL?700:400 }}>
                    {kmL ? `${kmL}` : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Alertas = ({ data }) => {
  const alertas = [
    { tipo:"Incidencia Activa", unidad:"440-ABC", caja:"T0719", op:"José Alberto Galvan Gomez", coord:"TELLO", desc:"Incidencia activa registrada", fecha:"2026-04-06" },
    { tipo:"Incidencia Activa", unidad:"347-ABC", caja:"LH480", op:"Isaías Valero Esquivel", coord:"TELLO", desc:"Incidencia activa", fecha:"2026-04-06" },
    { tipo:"Incidencia Activa", unidad:"438-ABC", caja:"TM14165", op:"René Hernandez Hernández", coord:"TELLO", desc:"Incidencia activa", fecha:"2026-04-06" },
    { tipo:"Sin Operador", unidad:"060-ABC", caja:"-", op:"VACANTE", coord:"CRISTIAN", desc:"Unidad sin operador asignado", fecha:"2026-04-07" },
    { tipo:"Sin Operador", unidad:"166-ABC", caja:"-", op:"VACANTE", coord:"CRISTIAN", desc:"Unidad sin operador asignado", fecha:"2026-04-07" },
    { tipo:"Sin Operador", unidad:"172-ABC", caja:"-", op:"VACANTE", coord:"CRISTIAN", desc:"Unidad sin operador asignado", fecha:"2026-04-07" },
    { tipo:"Seguridad $", unidad:"-", caja:"-", op:"ALVARO GALICIA CASTRO", coord:"TELLO", desc:"Circulación Prohibida — $3,000 pendiente cobro", fecha:"2026-03-06" },
    { tipo:"Seguridad $", unidad:"-", caja:"-", op:"JORGE DOMINGUEZ RAMIREZ", coord:"TELLO", desc:"Alcance — $8,000 pendiente cobro", fecha:"2026-03-03" },
    { tipo:"Caja Dañada", unidad:"-", caja:"1003-ABC", op:"-", coord:"CRISTIAN", desc:"Vacía en patio dañada — Juárez, Chih", fecha:"2026-03-17" },
    { tipo:"Caja Dañada", unidad:"-", caja:"1068-ABC", op:"-", coord:"CRISTIAN", desc:"Dañada en patio — Juárez, Chih", fecha:"2026-03-17" },
    { tipo:"Caja Revisar", unidad:"-", caja:"T0719", op:"-", coord:"TELLO", desc:"Pendiente de revisión", fecha:"2026-04-06" },
  ];
  const colores = { "Incidencia Activa":"#ef4444", "Sin Operador":"#64748b", "Seguridad $":"#f59e0b", "Caja Dañada":"#f97316", "Caja Revisar":"#a855f7" };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      <div style={{ color:"#475569", fontSize:11 }}>{alertas.length} alertas activas</div>
      {alertas.map((a,i)=>{
        const col = colores[a.tipo]||"#6366f1";
        return (
          <div key={i} style={{ background:"#0a1628", border:`1px solid ${col}25`, borderLeft:`3px solid ${col}`, borderRadius:8, padding:"12px 14px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:4 }}>
                  <Badge text={a.tipo} />
                  <span style={{ color:"#334155", fontSize:10 }}>{a.fecha}</span>
                </div>
                <div style={{ color:"#cbd5e1", fontSize:12, fontWeight:600 }}>{a.op}</div>
                <div style={{ color:"#475569", fontSize:11, marginTop:2 }}>
                  {a.unidad!=="-"&&<span>🚛 {a.unidad} </span>}
                  {a.caja!=="-"&&<span>📦 {a.caja} </span>}
                  — {a.desc}
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
const TABS = [
  { id:"dashboard", label:"Dashboard", icon:"📊" },
  { id:"distribucion", label:"Distribución", icon:"🗂️" },
  { id:"tractos", label:"Tractos", icon:"🚛" },
  { id:"cajas", label:"Cajas", icon:"📦" },
  { id:"viajes", label:"Viajes & KM/L", icon:"💰" },
  { id:"alertas", label:"Alertas", icon:"🔔" },
];

export default function App() {
  const [data, setData] = useState(()=>initData());
  const [tab, setTab] = useState("dashboard");
  useEffect(()=>{ saveData(data); }, [data]);

  return (
    <div style={{ minHeight:"100vh", background:"#060d1a", color:"#e2e8f0", fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>
      <div style={{ background:"#08111f", borderBottom:"1px solid #0f1e33", padding:"12px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <div>
          <div style={{ fontSize:15, fontWeight:900, color:"#f1f5f9", letterSpacing:-.5 }}>🚚 Nacional Autotransporte</div>
          <div style={{ fontSize:9, color:"#334155", letterSpacing:1.5, textTransform:"uppercase" }}>ERP · TMS · Torre de Control v2</div>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <div style={{ width:7, height:7, borderRadius:"50%", background:"#10b981", boxShadow:"0 0 8px #10b981" }} />
          <span style={{ color:"#10b981", fontSize:10, fontWeight:700 }}>OPERATIVO</span>
        </div>
      </div>

      <div style={{ background:"#08111f", borderBottom:"1px solid #0f1e33", display:"flex", overflowX:"auto", padding:"0 14px" }}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{ background:"none", border:"none", borderBottom:tab===t.id?"2px solid #3b82f6":"2px solid transparent", color:tab===t.id?"#f1f5f9":"#475569", padding:"11px 14px", cursor:"pointer", fontSize:12, fontWeight:tab===t.id?700:400, whiteSpace:"nowrap", display:"flex", gap:6, alignItems:"center", transition:"all .15s" }}>
            <span>{t.icon}</span><span>{t.label}</span>
          </button>
        ))}
      </div>

      <div style={{ padding:18, maxWidth:1400, margin:"0 auto" }}>
        {tab==="dashboard"    && <Dashboard data={data} />}
        {tab==="distribucion" && <DistribucionView data={data} />}
        {tab==="tractos"      && <Tractos data={data} setData={setData} />}
        {tab==="cajas"        && <Cajas data={data} setData={setData} />}
        {tab==="viajes"       && <Viajes data={data} setData={setData} />}
        {tab==="alertas"      && <Alertas data={data} />}
      </div>

      <div style={{ padding:"14px 18px", borderTop:"1px solid #0f1e33", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ color:"#1e3a5f", fontSize:10 }}>{data.tractos.length} Tractos · {data.cajas.length} Cajas · 3 Coordinadores · v2 con Importación Masiva</span>
        <button onClick={()=>{ if(window.confirm("¿Resetear todos los datos a los originales?")){ localStorage.removeItem(STORAGE_KEY); window.location.reload(); }}}
          style={{ background:"none", border:"1px solid #1e293b", borderRadius:6, padding:"4px 10px", color:"#334155", fontSize:10, cursor:"pointer" }}>
          🔄 Reset datos
        </button>
      </div>
    </div>
  );
}
