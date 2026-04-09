// ═══════════════════════════════════════════════════════════════════
//  GOOGLE APPS SCRIPT — ERP NAL
//  Pega este código en: Extensions → Apps Script → reemplaza todo
// ═══════════════════════════════════════════════════════════════════

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const tab = e.parameter.tab || "Tractos";
  const ws = sheet.getSheetByName(tab);

  if (!ws) {
    return ContentService
      .createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const data = ws.getDataRange().getValues();
  if (data.length < 2) {
    return ContentService
      .createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const headers = data[0];
  const rows = data.slice(1)
    .filter(r => r.some(cell => cell !== ""))  // ignora filas vacías
    .map(r => {
      const obj = {};
      headers.forEach((h, i) => {
        obj[String(h).trim()] = r[i] !== undefined ? String(r[i]).trim() : "";
      });
      return obj;
    });

  return ContentService
    .createTextOutput(JSON.stringify(rows))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet();
    const payload = JSON.parse(e.postData.contents);
    const ws = sheet.getSheetByName(payload.tab);

    if (!ws) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: "Tab no encontrado: " + payload.tab }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (payload.action === "replace" && payload.rows && payload.rows.length > 0) {
      // Obtener encabezados de la fila 1
      const headers = ws.getRange(1, 1, 1, ws.getLastColumn()).getValues()[0];

      // Borrar datos (fila 2 en adelante)
      if (ws.getLastRow() > 1) {
        ws.getRange(2, 1, ws.getLastRow() - 1, ws.getLastColumn()).clearContent();
      }

      // Escribir nuevos datos
      payload.rows.forEach((row, i) => {
        headers.forEach((h, j) => {
          const val = row[h] !== undefined ? row[h] : "";
          ws.getRange(i + 2, j + 1).setValue(val);
        });
      });
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, written: payload.rows ? payload.rows.length : 0 }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
