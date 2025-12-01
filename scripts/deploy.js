const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuración FTP
const FTP_CONFIG = {
    host: process.env.FTP_HOST || '31.170.160.88',
    user: process.env.FTP_USER || 'u313427363.kemiadev',
    password: process.env.FTP_PASSWORD || 'Kemia214!',
    port: parseInt(process.env.FTP_PORT || '21'),
    secure: false // FTP estándar, no SFTP
};

const REMOTE_DIR = process.env.FTP_REMOTE_DIR || 'public_html';
const SOURCE_DIR = 'WebKemiaFTP'; // Carpeta fuente local

// Archivos y carpetas a subir
// Mapeo: archivo local -> archivo remoto
const FILES_TO_UPLOAD = [
    { local: `${SOURCE_DIR}/index.html`, remote: 'index.html' },
    { local: `${SOURCE_DIR}/styles.css`, remote: 'styles.css' },
    { local: `${SOURCE_DIR}/script.js`, remote: 'script.js' },
    { local: `${SOURCE_DIR}/robots.txt`, remote: 'robots.txt' },
    { local: `${SOURCE_DIR}/sitemap.xml`, remote: 'sitemap.xml' },
    { local: `${SOURCE_DIR}/site.webmanifest`, remote: 'site.webmanifest' },
    { local: `${SOURCE_DIR}/.htaccess`, remote: '.htaccess' }, // Restaurado con versión básica para HTML estático
    { local: `${SOURCE_DIR}/assets/images/favicon.ico`, remote: 'favicon.ico' } // Favicon en la raíz
];

const DIRS_TO_UPLOAD = [
    `${SOURCE_DIR}/assets`
];

// Archivos a ignorar (no subir)
const IGNORE_PATTERNS = [
    /^\.(?!htaccess)/, // Ignorar archivos ocultos excepto .htaccess
    /node_modules/,
    /\.git/,
    /\.env/,
    /\.DS_Store/,
    /Thumbs\.db/,
    /\.log$/,
    /deploy\.js/,
    /package\.json/,
    /package-lock\.json/,
    /README\.md/,
    /\.md$/,
    /index\.html$/,
    /plan-contenidos-kemia\.html$/,
    /kemia_sitio_web\.html$/,
    /KEMIA-EMAIL-TEMPLATE\.html$/,
    /documentation/,
    /testing/,
    /agents/,
    /web2/,
    /ConceptosyEsteticaKemia\.md/
];

// Colores para la consola
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

function shouldIgnore(filePath) {
    const fileName = path.basename(filePath);
    // No ignorar .htaccess
    if (fileName === '.htaccess') {
        return false;
    }
    // No ignorar index.html si está en WebKemiaFTP
    if (filePath.includes(`${SOURCE_DIR}${path.sep}index.html`) || filePath.includes(`${SOURCE_DIR}/index.html`)) {
        return false;
    }
    return IGNORE_PATTERNS.some(pattern => pattern.test(fileName) || pattern.test(filePath));
}

async function deleteRemoteFile(client, remotePath) {
    try {
        await client.remove(remotePath);
        log(`🗑️  Eliminado archivo remoto: ${remotePath}`, colors.yellow);
        return true;
    } catch (error) {
        // Si el archivo no existe, no es un error crítico
        if (error.code === 550) {
            // No loguear si el archivo no existe, es normal
            return false;
        } else {
            log(`⚠ No se pudo eliminar ${remotePath}: ${error.message}`, colors.yellow);
        }
        return false;
    }
}

async function uploadFile(client, localPath, remotePath) {
    try {
        // Verificar que estamos en el directorio correcto antes de subir
        const currentDir = await client.pwd();
        if (!currentDir.includes(REMOTE_DIR)) {
            log(`⚠ Ajustando directorio antes de subir...`, colors.yellow);
            await client.cd(`/${REMOTE_DIR}`);
        }
        
        // Eliminar el archivo remoto primero para asegurar que se sobrescribe
        await deleteRemoteFile(client, remotePath);
        
        // Asegurar que estamos en public_html antes de subir
        try {
            await client.cd(`/${REMOTE_DIR}`);
        } catch (cdError) {
            // Continuar de todas formas
        }
        
        // Subir el nuevo archivo
        await client.uploadFrom(localPath, remotePath);
        log(`✓ Subido: ${localPath} → ${remotePath}`, colors.green);
        return true;
    } catch (error) {
        log(`✗ Error subiendo ${localPath}: ${error.message}`, colors.red);
        return false;
    }
}

async function uploadDirectory(client, localDir, remoteDir) {
    let uploadedCount = 0;
    try {
        // CRÍTICO: Asegurar que estamos SIEMPRE en public_html (nunca crear public_html dentro de public_html)
        try {
            const currentDir = await client.pwd();
            if (!currentDir.includes(REMOTE_DIR) || currentDir.includes(`${REMOTE_DIR}/${REMOTE_DIR}`)) {
                await client.cd(`/${REMOTE_DIR}`);
            }
        } catch (error) {
            await client.cd(`/${REMOTE_DIR}`);
        }
        
        // Ajustar remoteDir para eliminar el prefijo SOURCE_DIR y cualquier referencia a REMOTE_DIR
        let adjustedRemoteDir = remoteDir
            .replace(`${SOURCE_DIR}/`, '')
            .replace(`${SOURCE_DIR}\\`, '')
            .replace(`/${REMOTE_DIR}/`, '')
            .replace(`${REMOTE_DIR}/`, '')
            .replace(`${REMOTE_DIR}\\`, '');
        
        // Asegurar que no empiece con / o contenga public_html
        if (adjustedRemoteDir.startsWith('/')) {
            adjustedRemoteDir = adjustedRemoteDir.substring(1);
        }
        if (adjustedRemoteDir.includes(REMOTE_DIR)) {
            adjustedRemoteDir = adjustedRemoteDir.replace(new RegExp(`${REMOTE_DIR}/?`, 'g'), '');
        }
        
        // Solo crear el directorio si no está vacío y no es public_html
        if (adjustedRemoteDir && adjustedRemoteDir !== REMOTE_DIR) {
            try {
                await client.ensureDir(adjustedRemoteDir);
            } catch (error) {
                log(`⚠ Advertencia al crear directorio ${adjustedRemoteDir}: ${error.message}`, colors.yellow);
            }
        }
        
        const items = fs.readdirSync(localDir, { withFileTypes: true });
        
        for (const item of items) {
            const localPath = path.join(localDir, item.name);
            const relativePath = path.relative(SOURCE_DIR, localPath).replace(/\\/g, '/');
            
            // Limpiar la ruta remota para evitar rutas absolutas o referencias a public_html
            let remotePath = relativePath;
            if (remotePath.startsWith('/')) {
                remotePath = remotePath.substring(1);
            }
            if (remotePath.includes(REMOTE_DIR)) {
                remotePath = remotePath.replace(new RegExp(`${REMOTE_DIR}/?`, 'g'), '');
            }
            
            if (shouldIgnore(localPath)) {
                log(`⊘ Ignorado: ${localPath}`, colors.yellow);
                continue;
            }
            
            if (item.isDirectory()) {
                try {
                    // Asegurar que estamos en public_html (nunca crear public_html dentro)
                    await client.cd(`/${REMOTE_DIR}`);
                    
                    // Crear el subdirectorio usando ensureDir con ruta relativa
                    if (remotePath && remotePath !== REMOTE_DIR) {
                        await client.ensureDir(remotePath);
                    }
                    const subCount = await uploadDirectory(client, localPath, remotePath);
                    uploadedCount += subCount;
                } catch (error) {
                    log(`✗ Error procesando directorio ${remotePath}: ${error.message}`, colors.red);
                }
            } else if (item.isFile()) {
                // Asegurar que estamos en public_html antes de subir
                try {
                    await client.cd(`/${REMOTE_DIR}`);
                } catch (error) {
                    // Continuar de todas formas
                }
                
                // Asegurar que el directorio padre existe (sin crear public_html dentro)
                const parentDir = remotePath.substring(0, remotePath.lastIndexOf('/'));
                if (parentDir && parentDir !== REMOTE_DIR && !parentDir.includes(REMOTE_DIR)) {
                    try {
                        await client.ensureDir(parentDir);
                    } catch (error) {
                        // Continuar aunque falle
                    }
                }
                
                const result = await uploadFile(client, localPath, remotePath);
                if (result) {
                    uploadedCount++;
                }
            }
        }
    } catch (error) {
        log(`✗ Error leyendo directorio ${localDir}: ${error.message}`, colors.red);
    }
    return uploadedCount;
}

async function deploy() {
    // Verificar que existe la carpeta fuente
    if (!fs.existsSync(SOURCE_DIR)) {
        log(`\n❌ Error: La carpeta ${SOURCE_DIR} no existe`, colors.red);
        log(`   Por favor, asegúrate de que la carpeta WebKemiaFTP existe antes de ejecutar el deployment.`, colors.yellow);
        process.exit(1);
    }
    
    const client = new ftp.Client();
    client.ftp.verbose = false; // Cambiar a true para ver logs detallados
    
    let success = true;
    const uploadedFiles = [];
    const failedFiles = [];
    
    try {
        log('\n🚀 Iniciando deployment a FTP...', colors.cyan);
        log(`📦 Carpeta fuente: ${SOURCE_DIR}`, colors.cyan);
        log(`📡 Conectando a ${FTP_CONFIG.host}:${FTP_CONFIG.port}`, colors.blue);
        
        await client.access(FTP_CONFIG);
        log('✓ Conexión establecida', colors.green);
        
        // Obtener directorio actual
        let currentDir = '';
        try {
            currentDir = await client.pwd();
            log(`📂 Directorio actual inicial: ${currentDir}`, colors.cyan);
        } catch (error) {
            log(`⚠ No se pudo obtener el directorio actual`, colors.yellow);
        }
        
        // CRÍTICO: Cambiar explícitamente al directorio public_html
        log(`\n📁 Cambiando a directorio: /${REMOTE_DIR}`, colors.blue);
        try {
            await client.cd(`/${REMOTE_DIR}`);
            const verifyDir = await client.pwd();
            log(`✓ Cambiado correctamente a: ${verifyDir}`, colors.green);
            
            // Verificar que estamos en el lugar correcto
            if (!verifyDir.includes(REMOTE_DIR)) {
                log(`⚠ ADVERTENCIA: El directorio no parece ser ${REMOTE_DIR}`, colors.yellow);
                log(`   Directorio actual: ${verifyDir}`, colors.yellow);
            }
        } catch (error) {
            log(`❌ ERROR: No se pudo cambiar al directorio /${REMOTE_DIR}`, colors.red);
            log(`   Error: ${error.message}`, colors.red);
            log(`   Intentando crear el directorio...`, colors.yellow);
            
            try {
                await client.ensureDir(`/${REMOTE_DIR}`);
                await client.cd(`/${REMOTE_DIR}`);
                log(`✓ Directorio ${REMOTE_DIR} creado y acceso exitoso`, colors.green);
            } catch (createError) {
                log(`❌ ERROR CRÍTICO: No se pudo crear/acceder al directorio ${REMOTE_DIR}`, colors.red);
                log(`   Error: ${createError.message}`, colors.red);
                throw new Error(`No se pudo acceder al directorio ${REMOTE_DIR}`);
            }
        }
        
        // Verificar directorio final antes de subir
        const finalDir = await client.pwd();
        log(`\n✅ Listo para subir archivos en: ${finalDir}`, colors.green);
        
        // Subir archivos individuales
        log('\n📤 Subiendo archivos...', colors.cyan);
        for (const fileConfig of FILES_TO_UPLOAD) {
            const localFile = typeof fileConfig === 'string' ? fileConfig : fileConfig.local;
            const remoteFile = typeof fileConfig === 'string' ? fileConfig : fileConfig.remote;
            
            if (!fs.existsSync(localFile)) {
                log(`⚠ Archivo no encontrado: ${localFile}`, colors.yellow);
                continue;
            }
            
            if (shouldIgnore(localFile)) {
                log(`⊘ Ignorado: ${localFile}`, colors.yellow);
                continue;
            }
            
            const result = await uploadFile(client, localFile, remoteFile);
            if (result) {
                uploadedFiles.push(`${localFile} → ${remoteFile}`);
            } else {
                failedFiles.push(localFile);
                success = false;
            }
        }
        
        // Subir directorios
        log('\n📁 Subiendo directorios...', colors.cyan);
        let directoriesUploadedCount = 0;
        for (const dir of DIRS_TO_UPLOAD) {
            if (!fs.existsSync(dir)) {
                log(`⚠ Directorio no encontrado: ${dir}`, colors.yellow);
                continue;
            }
            
            if (shouldIgnore(dir)) {
                log(`⊘ Ignorado: ${dir}`, colors.yellow);
                continue;
            }
            
            // Calcular la ruta remota eliminando el prefijo SOURCE_DIR y cualquier referencia a REMOTE_DIR
            let remoteDir = dir.replace(`${SOURCE_DIR}/`, '').replace(`${SOURCE_DIR}\\`, '');
            // Asegurar que no contenga public_html en la ruta
            if (remoteDir.includes(REMOTE_DIR)) {
                remoteDir = remoteDir.replace(new RegExp(`${REMOTE_DIR}/?`, 'g'), '');
            }
            const count = await uploadDirectory(client, dir, remoteDir);
            directoriesUploadedCount += count;
            uploadedFiles.push(`${dir}/ (${count} archivos)`);
        }
        
        const totalFiles = uploadedFiles.length + directoriesUploadedCount;
        log('\n✅ Deployment completado!', colors.green);
        log(`📊 Archivos subidos: ${totalFiles} (${uploadedFiles.length - DIRS_TO_UPLOAD.length} archivos principales + ${directoriesUploadedCount} archivos de directorios)`, colors.cyan);
        
        if (failedFiles.length > 0) {
            log(`⚠ Archivos con errores: ${failedFiles.length}`, colors.yellow);
            failedFiles.forEach(file => log(`   - ${file}`, colors.red));
        }
        
    } catch (error) {
        log(`\n❌ Error durante el deployment: ${error.message}`, colors.red);
        success = false;
    } finally {
        client.close();
        log('\n🔌 Conexión cerrada', colors.blue);
    }
    
    process.exit(success ? 0 : 1);
}

// Manejo de errores no capturados
process.on('unhandledRejection', (error) => {
    log(`\n❌ Error no manejado: ${error.message}`, colors.red);
    process.exit(1);
});

// Ejecutar deployment
deploy();

