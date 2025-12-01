const ftp = require('basic-ftp');
require('dotenv').config();

const FTP_CONFIG = {
    host: process.env.FTP_HOST || '31.170.160.88',
    user: process.env.FTP_USER || 'u313427363.kemiadev',
    password: process.env.FTP_PASSWORD || 'Kemia214!',
    port: parseInt(process.env.FTP_PORT || '21', 10),
    secure: false
};

const REMOTE_DIR = process.env.FTP_REMOTE_DIR || 'public_html';

// Función para establecer permisos usando comando SITE CHMOD
async function setPermissions(client, path, permissions, isDirectory = false) {
    try {
        // Formato: SITE CHMOD 755 /path/to/file
        const command = `SITE CHMOD ${permissions} ${path}`;
        await client.send(command);
        return true;
    } catch (error) {
        // Algunos servidores FTP no soportan CHMOD, intentar con método alternativo
        try {
            // Intentar con comando CHMOD sin SITE
            const command = `CHMOD ${permissions} ${path}`;
            await client.send(command);
            return true;
        } catch (error2) {
            console.log(`⚠ No se pudieron establecer permisos para ${path}: ${error2.message}`);
            return false;
        }
    }
}

// Función recursiva para establecer permisos en archivos y carpetas
async function setPermissionsRecursive(client, remotePath, basePath = '') {
    let processed = 0;
    
    try {
        const items = await client.list(remotePath);
        
        for (const item of items) {
            const itemPath = basePath ? `${basePath}/${item.name}` : item.name;
            const fullPath = remotePath ? `${remotePath}/${item.name}` : item.name;
            
            if (item.isDirectory) {
                // Establecer permisos 755 para carpetas
                console.log(`📁 Estableciendo permisos 755 para carpeta: ${fullPath}`);
                await setPermissions(client, `/${REMOTE_DIR}/${fullPath}`, '755', true);
                processed++;
                
                // Recursivamente procesar subdirectorios
                const subProcessed = await setPermissionsRecursive(client, fullPath, fullPath);
                processed += subProcessed;
            } else {
                // Establecer permisos 644 para archivos
                console.log(`📄 Estableciendo permisos 644 para archivo: ${fullPath}`);
                await setPermissions(client, `/${REMOTE_DIR}/${fullPath}`, '644', false);
                processed++;
            }
        }
    } catch (error) {
        console.log(`⚠ Error procesando ${remotePath}: ${error.message}`);
    }
    
    return processed;
}

async function fixPermissions() {
    const client = new ftp.Client();
    client.ftp.verbose = false;
    
    try {
        console.log('\n🔧 Estableciendo permisos correctos...\n');
        await client.access(FTP_CONFIG);
        console.log('✓ Conexión establecida\n');
        
        // Cambiar a public_html
        await client.cd(`/${REMOTE_DIR}`);
        const currentDir = await client.pwd();
        console.log(`📂 Directorio actual: ${currentDir}\n`);
        
        // Primero establecer permisos en la carpeta public_html
        console.log(`📁 Estableciendo permisos 755 para carpeta: ${REMOTE_DIR}`);
        await setPermissions(client, `/${REMOTE_DIR}`, '755', true);
        
        // Establecer permisos en archivos principales de la raíz
        console.log('\n📄 Estableciendo permisos para archivos principales...\n');
        const rootFiles = ['index.html', 'styles.css', 'script.js', 'robots.txt', 'sitemap.xml', 'site.webmanifest', '.htaccess', 'favicon.ico'];
        
        for (const file of rootFiles) {
            try {
                await setPermissions(client, `/${REMOTE_DIR}/${file}`, '644', false);
            } catch (error) {
                console.log(`⚠ No se pudo establecer permisos para ${file}: ${error.message}`);
            }
        }
        
        // Establecer permisos recursivamente en assets
        console.log('\n📁 Estableciendo permisos recursivamente en assets...\n');
        const processed = await setPermissionsRecursive(client, 'assets');
        
        console.log(`\n✅ Permisos establecidos correctamente`);
        console.log(`📊 Total procesado: ${rootFiles.length + processed + 1} items (1 carpeta raíz + ${rootFiles.length} archivos + ${processed} items en assets)`);
        
    } catch (error) {
        console.error(`\n❌ Error: ${error.message}`);
        console.error('\n💡 Nota: Algunos servidores FTP no permiten cambiar permisos vía FTP.');
        console.error('   En ese caso, deberás establecer los permisos manualmente desde el Administrador de Archivos:');
        console.error('   - Carpetas: 755');
        console.error('   - Archivos: 644');
    } finally {
        client.close();
    }
}

fixPermissions();

