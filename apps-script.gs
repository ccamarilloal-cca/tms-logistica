// ═══════════════════════════════════════════════════════════════════
//  GOOGLE APPS SCRIPT v4 — ERP NAL
//  INSTRUCCIONES:
//  1. Abre tu Google Sheets
//  2. Extensiones → Apps Script
//  3. Borra TODO el código existente
//  4. Pega este código completo
//  5. Guardar (Ctrl+S)
//  6. Implementar → Nueva implementación
//  7. Tipo: Aplicación web
//  8. Ejecutar como: Yo
//  9. Acceso: Cualquier persona
//  10. Implementar → Autorizar → Copiar URL /exec
// ═══════════════════════════════════════════════════════════════════

function doGet(e) {
  try {
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

    const headers = data[0].map(h => String(h).trim());
    const rows = data.slice(1)
      .filter(r => r.some(cell => cell !== "" && cell !== null && cell !== undefined))
      .map(r => {
        const obj = {};
        headers.forEach((h, i) => {
          let val = r[i];
          if (val === null || val === undefined) val = "";
          if (val instanceof Date) val = Utilities.formatDate(val, Session.getScriptTimeZone(), "yyyy-MM-dd");
          obj[h] = String(val).trim();
        });
        return obj;
      });

    return ContentService
      .createTextOutput(JSON.stringify(rows))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet();
    const payload = JSON.parse(e.postData.contents);
    const ws = sheet.getSheetByName(payload.tab);

    if (!ws) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: "Pestaña no encontrada: " + payload.tab }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (payload.action === "replace" && Array.isArray(payload.rows) && payload.rows.length > 0) {
      const lastCol = ws.getLastColumn();
      const headers = ws.getRange(1, 1, 1, lastCol).getValues()[0].map(h => String(h).trim());

      // Limpiar datos existentes (fila 2 en adelante)
      const lastRow = ws.getLastRow();
      if (lastRow > 1) {
        ws.getRange(2, 1, lastRow - 1, lastCol).clearContent();
      }

      // Escribir nuevos datos
      const newData = payload.rows.map(row =>
        headers.map(h => {
          const val = row[h];
          return (val === null || val === undefined) ? "" : val;
        })
      );

      if (newData.length > 0) {
        ws.getRange(2, 1, newData.length, headers.length).setValues(newData);
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, written: payload.rows ? payload.rows.length : 0 }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
