const ftp = require('basic-ftp');
require('dotenv').config();

const FTP_CONFIG = {
    host: process.env.FTP_HOST || '31.170.160.88',
    user: process.env.FTP_USER || 'u313427363.kemiadev',
    password: process.env.FTP_PASSWORD || 'Kemia214!',
    port: parseInt(process.env.FTP_PORT || '21', 10),
    secure: false
};

async function checkServer() {
    const client = new ftp.Client();
    client.ftp.verbose = false;
    
    try {
        console.log('\n🔍 Verificando servidor FTP...\n');
        await client.access(FTP_CONFIG);
        console.log('✓ Conexión establecida\n');
        
        // Cambiar a public_html
        await client.cd('/public_html');
        const currentDir = await client.pwd();
        console.log(`📂 Directorio actual: ${currentDir}\n`);
        
        // Listar archivos
        const files = await client.list();
        console.log('📋 Archivos en public_html:');
        files.forEach(file => {
            const type = file.isDirectory ? '📁 DIR' : '📄 FILE';
            const size = file.isDirectory ? '' : ` (${file.size} bytes)`;
            console.log(`   ${type} ${file.name}${size}`);
        });
        
        // Verificar index.html
        const indexHtml = files.find(f => f.name === 'index.html');
        if (indexHtml) {
            console.log(`\n✅ index.html encontrado: ${indexHtml.size} bytes`);
            
            // Intentar leer el contenido
            const fs = require('fs');
            const tempFile = 'temp_check.html';
            try {
                await client.downloadTo(tempFile, 'index.html');
                const content = fs.readFileSync(tempFile, 'utf8');
                
                if (content.includes('KEMIA Website v2.0')) {
                    console.log('✅ El archivo contiene la versión correcta');
                } else {
                    console.log('⚠️  El archivo puede ser una versión antigua');
                }
                
                // Verificar permisos básicos
                console.log('\n📝 Primeras líneas del archivo:');
                const lines = content.split('\n').slice(0, 5);
                lines.forEach((line, i) => {
                    if (line.trim()) {
                        console.log(`   ${i + 1}: ${line.substring(0, 80)}`);
                    }
                });
                
                fs.unlinkSync(tempFile);
            } catch (error) {
                console.log(`⚠️  No se pudo leer el archivo: ${error.message}`);
            }
        } else {
            console.log('\n❌ index.html NO encontrado');
        }
        
        // Verificar .htaccess
        const htaccess = files.find(f => f.name === '.htaccess');
        if (htaccess) {
            console.log(`\n✅ .htaccess encontrado: ${htaccess.size} bytes`);
        } else {
            console.log('\n⚠️  .htaccess NO encontrado');
        }
        
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
    } finally {
        client.close();
    }
}

checkServer();

