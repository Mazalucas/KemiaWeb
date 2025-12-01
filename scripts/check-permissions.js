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

async function checkPermissions() {
    const client = new ftp.Client();
    client.ftp.verbose = false;
    
    try {
        console.log('\n🔍 Verificando permisos actuales...\n');
        await client.access(FTP_CONFIG);
        console.log('✓ Conexión establecida\n');
        
        // Cambiar a public_html
        await client.cd(`/${REMOTE_DIR}`);
        const currentDir = await client.pwd();
        console.log(`📂 Directorio actual: ${currentDir}\n`);
        
        // Listar archivos con detalles
        const files = await client.list();
        
        console.log('📋 Permisos de archivos y carpetas:\n');
        
        // Verificar archivos principales
        const mainFiles = ['index.html', 'styles.css', 'script.js', 'robots.txt', 'sitemap.xml', 'site.webmanifest', '.htaccess', 'favicon.ico'];
        
        for (const fileName of mainFiles) {
            const file = files.find(f => f.name === fileName);
            if (file) {
                const type = file.isDirectory ? '📁 CARPETA' : '📄 ARCHIVO';
                const expected = file.isDirectory ? '0755' : '0644';
                console.log(`✅ ${type}: ${fileName}`);
                console.log(`   Esperado: ${expected}`);
                console.log(`   (Verifica en FileZilla que muestre ${expected})\n`);
            }
        }
        
        // Verificar carpeta assets
        const assetsDir = files.find(f => f.name === 'assets' && f.isDirectory);
        if (assetsDir) {
            console.log(`✅ 📁 CARPETA: assets`);
            console.log(`   Esperado: 0755`);
            console.log(`   (Verifica en FileZilla que muestre 0755)\n`);
            
            // Verificar subcarpetas dentro de assets
            try {
                await client.cd('assets');
                const assetsFiles = await client.list();
                
                for (const item of assetsFiles) {
                    if (item.isDirectory) {
                        const perms = item.permissions ? String(item.permissions) : 'N/A';
                        const permsStr = perms.toString();
                        const status = (permsStr.includes('755') || permsStr.includes('rwx')) ? '✅' : '⚠️';
                        console.log(`${status} 📁 CARPETA: assets/${item.name}`);
                        console.log(`   Permisos: ${perms}`);
                        console.log(`   Esperado: 0755\n`);
                    }
                }
                
                await client.cd('..');
            } catch (error) {
                console.log(`⚠️  No se pudo verificar subcarpetas de assets: ${error.message}\n`);
            }
        }
        
        console.log('\n💡 Nota: 0644 = 644 y 0755 = 755 (notación octal)');
        console.log('   Ambos formatos son equivalentes y correctos.\n');
        
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
    } finally {
        client.close();
    }
}

checkPermissions();

