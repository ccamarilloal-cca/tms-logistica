# 🚚 ERP NAL — Instrucciones Completas
## Nacional Autotransporte · Torre de Control v3

---

## 📁 ARCHIVOS QUE TIENES

```
erp-nal-app/
├── index.html        ← Página principal (aquí pegas tu URL de Sheets)
├── app.jsx           ← Toda la lógica y pantallas del ERP
├── manifest.json     ← Hace que funcione como app instalable
├── sw.js             ← Permite usar offline (sin internet)
├── apps-script.gs    ← Código para pegar en Google Apps Script
└── INSTRUCCIONES.md  ← Este archivo
```

---

## PASO 1 — CONFIGURAR GOOGLE SHEETS

### 1A. Crear la hoja
1. Ve a sheets.google.com
2. Crea una hoja nueva llamada: `ERP-NAL`
3. Crea 3 pestañas con estos nombres exactos:
   - `Tractos`
   - `Cajas`
   - `Viajes`

### 1B. Agregar encabezados en cada pestaña

**Pestaña Tractos** (fila 1, columnas A–F):
```
unidad | operador | coordinador | estatus | circuito | ubicacion
```

**Pestaña Cajas** (fila 1, columnas A–H):
```
caja | tipo | coordinador | ciudad | ubicEsp | estatus | cliente | comentarios
```

**Pestaña Viajes** (fila 1, columnas A–P):
```
id | semana | fecha | coordinador | unidad | caja | cliente | circuito | estatus | ventaEst | ventaReal | costoOp | diesel | casetas | costoMtto | kmRecorridos | litrosDiesel
```

### 1C. Configurar Apps Script
1. En tu Google Sheet: **Extensiones → Apps Script**
2. Borra TODO el código que aparece
3. Abre el archivo `apps-script.gs` de esta carpeta
4. Copia todo y pégalo en Apps Script
5. Click **💾 Guardar** (ícono de disco)
6. Click **Implementar → Nueva implementación**
7. Tipo: **Aplicación web**
8. Ejecutar como: **Yo (tu email)**
9. Quién tiene acceso: **Cualquier persona**
10. Click **Implementar**
11. Autoriza los permisos que pide Google
12. **COPIA LA URL** que aparece — la necesitas en el siguiente paso

La URL se ve así:
```
https://script.google.com/macros/s/AKfycbXXXXXXXXXXXXXXXXXX/exec
```

---

## PASO 2 — CONECTAR LA APP A TU SHEETS

Abre el archivo `index.html` con cualquier editor de texto (Bloc de notas, VS Code, etc.)

Busca esta línea:
```javascript
window.SHEETS_URL = "PEGA_TU_URL_AQUI";
```

Reemplaza `PEGA_TU_URL_AQUI` con tu URL real:
```javascript
window.SHEETS_URL = "https://script.google.com/macros/s/AKfycb.../exec";
```

Guarda el archivo.

---

## PASO 3 — SUBIR A NETLIFY (app para todos)

1. Ve a https://app.netlify.com
2. Crea cuenta gratuita con tu email
3. Click **"Add new site" → "Deploy manually"**
4. Arrastra la carpeta `erp-nal-app` completa al área gris
5. Espera 30 segundos
6. Netlify te da un link como: `https://nombre-random.netlify.app`

**Para actualizar cuando hagas cambios:**
- Ve a tu sitio en Netlify
- Click en **"Deploys"**
- Arrastra la carpeta de nuevo

**Para personalizar la URL:**
- En tu sitio Netlify → **"Site settings" → "Change site name"**
- Ponle algo como `erp-nal` → queda `erp-nal.netlify.app`

---

## PASO 4 — INSTALAR EN CELULARES DEL EQUIPO

Comparte el link de Netlify con tu equipo.
Cada quien hace esto en su celular:

### Android (Chrome):
1. Abre el link en Chrome
2. Espera que cargue completamente
3. Toca el menú ⋮ (tres puntos arriba a la derecha)
4. Toca **"Agregar a pantalla de inicio"**
5. Confirma → aparece ícono de app 🚚

### iPhone (Safari):
1. Abre el link en Safari (no Chrome)
2. Toca el botón compartir 📤 (abajo al centro)
3. Toca **"Agregar a pantalla de inicio"**
4. Confirma → aparece ícono de app 🚚

---

## CÓMO ACTUALIZAR DATOS DIARIAMENTE

### Opción A — Desde la app (actualización individual):
- Entra a Tractos/Cajas/Viajes
- Botón **📥 Importar Excel**
- Copia desde tu Excel → Pega → Confirmar
- Se guarda en Sheets automáticamente

### Opción B — Directo en Google Sheets:
- Abre tu hoja en sheets.google.com
- Edita los datos directamente en las celdas
- La próxima vez que alguien abra la app, se sincroniza solo
- O toca el botón **🔄 Sincronizar** en la app

### Opción C — Copiar/Pegar masivo:
1. Prepara tu Excel con los encabezados correctos
2. Selecciona todo → Ctrl+C
3. En la app → Importar Excel → Pega → Confirmar
4. Elige "Reemplazar todo" para actualización diaria

---

## FLUJO DIARIO RECOMENDADO

```
Cada mañana:
1. Tú actualizas tu Excel con el estado del día
2. Abres la app → Tractos → 📥 Importar → pegas → confirmas
3. Repites para Cajas y Viajes si cambiaron
4. El equipo abre la app → toca 🔄 Sincronizar → ven los datos del día
```

---

## CÓMO FUNCIONA GOOGLE SHEETS

```
Tu Excel / App  ──►  Apps Script  ──►  Google Sheets
                                            │
                                            ▼
                     Todos los celulares ◄── App (sync)
```

- Cada cambio se guarda en Sheets
- Todos ven los mismos datos
- Funciona offline (con datos de la última sincronización)
- Sin costo mensual

---

## SOLUCIÓN DE PROBLEMAS

**"Error al conectar con Sheets"**
→ Verifica que pegaste la URL correcta en index.html
→ Verifica que en Apps Script pusiste acceso "Cualquier persona"
→ Vuelve a implementar el script y copia la nueva URL

**"Los datos no se actualizan"**
→ Toca el botón 🔄 Sincronizar en la app
→ O cierra y vuelve a abrir la app

**"La app no se instala en el celular"**
→ Android: usa Chrome (no Firefox ni Samsung Browser)
→ iPhone: usa Safari (no Chrome)
→ Asegúrate de que el link sea HTTPS (Netlify lo hace automático)

---

## SOPORTE

Esta app fue desarrollada con asistencia de Claude (Anthropic).
Versión 3 — Abril 2026
