# 📁 Análisis de Estructura del Proyecto KemiaWeb

## Situación Actual

### ✅ **WebKemiaFTP/** - Versión de PRODUCCIÓN
Esta es la carpeta que contiene la **versión final y actualizada** del sitio web (v2.0 con Material Design 3 + Watercolor Effects). El script `deploy.js` usa esta carpeta como fuente para desplegar al servidor FTP.

**Archivos en WebKemiaFTP:**
- `index.html` (2313 líneas) - Versión completa v2.0
- `styles.css` - Estilos completos
- `script.js` - JavaScript completo
- `robots.txt`, `sitemap.xml`, `site.webmanifest` - SEO y PWA
- `.htaccess` - Configuración del servidor
- `assets/` - Recursos multimedia (imágenes, audio, fonts)

### ⚠️ **Raíz del Proyecto** - Archivos Duplicados/Obsoletos
Los archivos en la raíz parecen ser **versiones anteriores o de desarrollo**:

**Archivos duplicados (versiones antiguas):**
- `index.html` (407 líneas) - Versión anterior, más simple
- `styles.css` - Posiblemente versión anterior
- `script.js` - Posiblemente versión anterior
- `robots.txt`, `sitemap.xml`, `site.webmanifest` - Duplicados

**Archivos únicos en la raíz (necesarios):**
- `package.json`, `package-lock.json` - Configuración Node.js
- `deploy.js` - Script de despliegue (usa WebKemiaFTP como fuente)
- `check-permissions.js`, `check-server.js`, `diagnose.js`, `fix-permissions.js` - Scripts de utilidad
- `README.md` - Documentación principal
- `.gitignore` - Configuración Git
- `LICENSE` - Licencia del proyecto
- `FTP_CONFIG.txt` - Configuración FTP (NO debe subirse a Git)

**Carpetas de documentación/desarrollo:**
- `agents/` - Documentación de agentes AI
- `documentation/` - Documentación del proyecto
- `testing/` - Documentación de testing
- `web2/` - Versión antigua del sitio
- `assets/` - Recursos (duplicado de WebKemiaFTP/assets)

**Archivos obsoletos:**
- `index3.html` - Versión intermedia (ya migrada a WebKemiaFTP/index.html)
- `plan-contenidos-kemia.html` - Archivo de planificación
- `kemia_sitio_web.html` - Versión antigua
- `KEMIA-EMAIL-TEMPLATE.html` - Template de email
- `ConceptosyEsteticaKemia.md` - Documentación antigua

## 🎯 Recomendación de Estructura

### Estructura Ideal:

```
KemiaWeb/
├── WebKemiaFTP/              # ✅ PRODUCCIÓN - Única fuente de verdad
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── site.webmanifest
│   ├── .htaccess
│   └── assets/
│
├── src/                      # 🔧 DESARROLLO (opcional, para futuras mejoras)
│   └── (archivos de desarrollo si se migra a build process)
│
├── scripts/                  # 🛠️ SCRIPTS DE UTILIDAD
│   ├── deploy.js
│   ├── check-permissions.js
│   ├── check-server.js
│   ├── diagnose.js
│   └── fix-permissions.js
│
├── docs/                     # 📚 DOCUMENTACIÓN
│   ├── agents/
│   ├── documentation/
│   └── testing/
│
├── package.json              # 📦 Configuración Node.js
├── package-lock.json
├── .gitignore
├── README.md
├── LICENSE
└── .env.example              # 🔐 Template de configuración (sin credenciales)
```

## ✅ Acciones Recomendadas

### 1. **Limpiar archivos duplicados de la raíz:**
   - ❌ Eliminar: `index.html`, `styles.css`, `script.js` de la raíz (son versiones antiguas)
   - ❌ Eliminar: `robots.txt`, `sitemap.xml`, `site.webmanifest` de la raíz (duplicados)
   - ❌ Mover o eliminar: `index3.html`, `plan-contenidos-kemia.html`, `kemia_sitio_web.html`
   - ✅ Mantener: Solo archivos de configuración y scripts en la raíz

### 2. **Organizar carpetas:**
   - ✅ Mover scripts a carpeta `scripts/` (opcional pero recomendado)
   - ✅ Mantener `WebKemiaFTP/` como única fuente de producción
   - ✅ Mantener `assets/` en la raíz solo si se usa para desarrollo, sino eliminar (ya está en WebKemiaFTP)

### 3. **Actualizar .gitignore:**
   - ✅ Ya incluye `FTP_CONFIG.txt` ✓
   - ✅ Considerar ignorar archivos HTML antiguos si no se necesitan

### 4. **Actualizar README.md:**
   - ✅ Ya actualizado con estructura correcta ✓

## 🔍 Conclusión

**WebKemiaFTP es la única fuente de verdad para producción.** Los archivos en la raíz son duplicados/obsoletos y pueden eliminarse o moverse a una carpeta de archivos antiguos si quieres mantenerlos como referencia histórica.

