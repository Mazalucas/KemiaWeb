# WebKemiaFTP - Estructura Completa del Sitio Web

Esta carpeta contiene todos los archivos necesarios para desplegar el sitio web de KEMIA.

## 📁 Estructura de Archivos

```
WebKemiaFTP/
├── index.html              # Archivo principal del sitio (versión con Material Design 3 + Watercolor Effects)
├── styles.css              # Estilos CSS del sitio
├── script.js               # JavaScript del sitio
├── robots.txt              # Configuración para buscadores
├── sitemap.xml             # Mapa del sitio para SEO
├── site.webmanifest        # Manifest para PWA
├── .htaccess              # Configuración Apache (control de caché)
└── assets/
    ├── images/            # Imágenes del sitio
    │   ├── KEMIA LOGO (3000x3000).jpg
    │   ├── favicon.ico
    │   ├── favicon-16x16.png
    │   ├── favicon-32x32.png
    │   ├── apple-touch-icon.png
    │   ├── android-chrome-192x192.png
    │   ├── android-chrome-512x512.png
    │   └── site.webmanifest
    ├── audio/             # Carpeta para archivos de audio (vacía)
    └── fonts/             # Carpeta para fuentes personalizadas (vacía)
```

## 🚀 Características del Sitio

- **Material Design 3 Expressive**: Diseño moderno y profesional
- **Efectos de Acuarela**: Animaciones y efectos visuales inspirados en el logo de KEMIA
- **Responsive Design**: Optimizado para móviles y tablets
- **SEO Optimizado**: Meta tags y estructura semántica
- **PWA Ready**: Configuración para Progressive Web App

## 📝 Notas Importantes

- El archivo `index.html` es la versión renombrada de `index3.html` (la versión final del sitio)
- Todos los estilos están embebidos en el HTML (no hay archivos CSS externos adicionales)
- El JavaScript está embebido en el HTML (no hay archivos JS externos adicionales)
- El archivo `.htaccess` configura el servidor para no cachear archivos HTML

## 🔧 Despliegue

Para desplegar estos archivos en un servidor FTP:

1. Sube todos los archivos a la carpeta `public_html` del servidor
2. Asegúrate de que el archivo `index.html` esté en la raíz de `public_html`
3. Verifica que los permisos de `.htaccess` sean correctos (644 o 755)
4. Verifica que las imágenes en `assets/images/` sean accesibles

## 📄 Versión

- **Versión**: 2.0
- **Fecha de Actualización**: 2025-01-08
- **Características**: Material Design 3 + Watercolor Effects

