# 🚚 GUÍA COMPLETA v4 — ERP NAL
## Todo lo que necesitas saber para usar la app

---

## ✅ QUÉ HAY NUEVO EN v4

- 📦 Cajas: total por estatus, por patio, permisionarios, perdidas, siniestro
- 🚛 Tracker lineal: ve tus unidades moviéndose en pantalla con cliente y siguiente parada
- 🔔 Alertas automáticas: entregas vencidas, cajas dañadas, sin operador
- 💰 Rentabilidad real por viaje y total de unidad de negocio NACIONALES
- ➡️ Sugerencia de siguiente ruta por circuito
- 📅 Semáforos: 🔴 vencido / 🟡 hoy / 🟠 mañana / 🟢 a tiempo

---

## PASO 1 — SUBIR A GITHUB (reemplazar archivos viejos)

**1.** Descarga este ZIP → extrae la carpeta `erp-v4`

**2.** Ve a github.com → entra a tu repositorio

**3.** Borra los archivos viejos:
   - Click en `index.html` → ícono 🗑️ → "Commit changes"
   - Click en `app.jsx` (si lo tienes) → ícono 🗑️ → "Commit changes"
   - Deja: `manifest.json`, `sw.js` (puedes reemplazarlos también)

**4.** Sube los nuevos archivos:
   - Click en "Add file" → "Upload files"
   - Arrastra los 5 archivos de la carpeta `erp-v4`:
     * `index.html`
     * `app.jsx`
     * `manifest.json`
     * `sw.js`
     * `apps-script.gs`
   - Escribe en el commit: "ERP NAL v4"
   - Click en "Commit changes"

---

## PASO 2 — ACTIVAR GITHUB PAGES (si no lo hiciste)

1. En tu repo → click **"Settings"** (pestaña arriba)
2. Menú izquierdo → **"Pages"**
3. En "Branch" → selecciona **"main"** → carpeta **"/(root)"**
4. Click **"Save"**
5. Espera 3 minutos → recarga → aparece tu URL:
   `https://TU-USUARIO.github.io/TU-REPO/`

---

## PASO 3 — CONECTAR TU GOOGLE SHEETS

### 3A. En tu Sheets (el que ya tienes o uno nuevo):

Asegúrate de tener exactamente estas 3 pestañas con estos nombres:
- `Tractos`
- `Cajas`
- `Viajes`

(Puedes tener más pestañas con otra información — no afecta)

### 3B. Encabezados en cada pestaña (fila 1):

**Pestaña Tractos** (columnas A-F):
```
unidad | operador | coordinador | estatus | circuito | ubicacion
```

**Pestaña Cajas** (columnas A-L):
```
caja | tipo | coordinador | ciudad | patio | ubicEsp | estatus | cliente | comentarios | permisionario | fechaEntregaProg | fechaEntregaReal
```

**Pestaña Viajes** (columnas A-U):
```
id | semana | fecha | coordinador | unidad | caja | cliente | circuito | unidadNegocio | estatus | ventaEst | ventaReal | costoOp | diesel | casetas | costoMtto | kmRecorridos | litrosDiesel | fechaEntregaProg | fechaEntregaReal | entregado
```

### 3C. Pegar el Apps Script:

1. En tu Sheets → **Extensiones → Apps Script**
2. Borra todo → pega el contenido del archivo `apps-script.gs`
3. Guardar → **Implementar → Nueva implementación**
4. Tipo: Aplicación web | Ejecutar: Yo | Acceso: Cualquier persona
5. Click **Implementar** → Autorizar → **Copia la URL /exec**

### 3D. Pegar la URL en index.html:

Abre `index.html` con Bloc de Notas. Busca:
```javascript
window.SHEETS_URL = "PEGA_TU_URL_AQUI";
```
Reemplaza con tu URL:
```javascript
window.SHEETS_URL = "https://script.google.com/macros/s/TUURL/exec";
```
Guarda → sube el `index.html` actualizado a GitHub.

Espera 2 minutos → la app dirá: **☁️ Conectado a Google Sheets**

---

## PASO 4 — INSTALAR EN CELULARES

### Android (Chrome):
1. Abre tu URL de GitHub Pages en Chrome
2. Espera que cargue completamente (puede tardar 10-15 seg la primera vez)
3. Menú **⋮** (tres puntos arriba a la derecha)
4. **"Agregar a pantalla de inicio"**
5. Confirmar → aparece ícono 🚚 en el celular ✅

### iPhone (Safari — DEBE ser Safari, no Chrome):
1. Abre tu URL en **Safari** (no Chrome ni Firefox)
2. Espera que cargue
3. Toca el botón **Compartir** 📤 (abajo al centro de la pantalla)
4. Desplázate hacia abajo en el menú
5. Toca **"Agregar a pantalla de inicio"**
6. Confirmar → aparece ícono 🚚 ✅

### Si sale error al abrir desde pantalla de inicio:
- Abre la URL directamente en el navegador (no desde el ícono)
- Si funciona ahí, el problema es el caché. Solución:
  1. Mantén presionado el ícono → "Eliminar"
  2. Vuelve a la URL en el navegador
  3. Vuelve a agregar a pantalla de inicio

---

## PASO 5 — USAR TU ARCHIVO EXCEL ACTUAL

### Opción A: Conectar tu archivo existente (recomendado)

Tu archivo Excel ya tiene datos. Para que la app los lea:

1. Abre tu Excel existente
2. Asegúrate de tener (o crea) una hoja con columnas que coincidan
   con los encabezados del Paso 3B
3. Selecciona todos los datos (Ctrl+A) → Copiar (Ctrl+C)
4. En la app → Tractos → **📥 Importar Excel**
5. Pega (Ctrl+V) → Vista Previa → Confirmar "Reemplazar todo"
6. Los datos van a Google Sheets automáticamente

### Opción B: Llenar Sheets directamente

1. Abre tu Google Sheets
2. En la pestaña Tractos, copia y pega tus datos de Excel directamente
3. Asegúrate que los encabezados de la fila 1 sean exactos
4. La app los lee al tocar 🔄 Sincronizar

### ¿Qué pasa con las otras pestañas de tu Excel?

No pasa nada. El script solo lee/escribe en las pestañas
`Tractos`, `Cajas` y `Viajes`. Tus otras pestañas con
programación, clientes, etc. quedan intactas.

---

## ACTUALIZACIÓN DIARIA — Flujo recomendado

```
Cada mañana (5 minutos):

1. Tú actualizas tu Excel con el estado del día
   (estatus de tractos, ubicaciones, cajas)

2. Selecciona → Ctrl+C → App → Importar → Pega → Confirmar

3. El equipo abre la app → toca 🔄 Sincronizar
   → ven los datos actualizados en sus celulares
```

---

## PREGUNTAS Y RESPUESTAS

**¿Puede tener más pestañas mi Sheets actual?**
Sí, cuantas quieras. El script solo usa Tractos, Cajas y Viajes.

**¿Dónde está el nombre del operador y coordinador?**
En la pestaña Tractos → columnas `operador` y `coordinador`.
En la app aparecen en la tabla de Tractos y en el Tracker lineal.

**¿Dónde se calcula la utilidad real?**
En Viajes → columna `ventaReal` menos la suma de costos.
En el Dashboard → sección "Rentabilidad NACIONALES".
Por viaje individual en la tabla de Viajes → columna "Utilidad".

**¿Qué es unidadNegocio?**
El campo para separar tus operaciones. Usa "NACIONALES" para
los viajes de tu unidad. Puedes filtrar por eso en la pestaña Viajes.

**¿Cómo funciona el Tracker lineal?**
Muestra todas las unidades con estatus "En Ruta" o "VTA - Facturando".
Dibuja el circuito como una línea con paradas. Muestra cliente,
caja, semáforo de entrega y siguiente ruta sugerida.
(La posición exacta en la ruta requiere GPS — actualmente simula
la posición. Cuando tengas la base GPS te integro los datos reales.)

**¿Qué hace el semáforo de entrega?**
🔴 = entrega vencida / 🟡 = entrega hoy / 🟠 = mañana / 🟢 = días restantes

**¿Cómo agrego GPS real al tracker?**
Cuando tengas acceso a la API de tu sistema GPS,
dime el formato de los datos y lo conecto directamente.

---

## SOLUCIÓN DE PROBLEMAS

**La app dice "Modo local" en vez de Sheets:**
→ Verifica que pegaste la URL correcta en index.html
→ Sube el index.html actualizado a GitHub
→ Espera 2 minutos y recarga

**Error CORS / "Failed to fetch":**
→ Vuelve a Apps Script → Gestionar implementaciones
→ Verifica "Cualquier persona" en acceso
→ Si no, reimplementa y copia la URL nueva

**La app no instala en iPhone:**
→ Debe ser Safari (no Chrome)
→ El botón compartir 📤 está ABAJO al centro

**La app no instala en Android:**
→ Debe ser Chrome (no Firefox)
→ El menú ⋮ está ARRIBA a la derecha
→ Si no aparece "Agregar a pantalla de inicio",
   busca "Instalar aplicación" o "Agregar acceso directo"

**GitHub Pages no muestra la app (página en blanco):**
→ Verifica que subiste los 5 archivos (no solo index.html)
→ app.jsx DEBE estar en la misma carpeta que index.html
→ Espera hasta 5 minutos después de subir

---

## ESTRUCTURA DE ARCHIVOS EN GITHUB

Tu repositorio debe verse así:
```
tu-repo/
├── index.html    ← con tu URL de Sheets pegada
├── app.jsx       ← toda la lógica del ERP
├── manifest.json ← para que sea instalable
├── sw.js         ← para funcionar offline
└── apps-script.gs ← referencia (no lo lee GitHub, solo es para ti)
```

---

v4 — Abril 2026 | Desarrollado con Claude (Anthropic)
