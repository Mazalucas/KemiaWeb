const ftp = require('basic-ftp');
require('dotenv').config();

const FTP_CONFIG = {
    host: process.env.FTP_HOST || '31.170.160.88',
    user: process.env.FTP_USER || 'u313427363.kemiadev',
    password: process.env.FTP_PASSWORD || 'Kemia214!',
    port: parseInt(process.env.FTP_PORT || '21', 10),
    secure: false
};

async function diagnose() {
    const client = new ftp.Client();
    client.ftp.verbose = false;
    
    try {
        console.log('\n🔍 Diagnóstico del servidor FTP...\n');
        await client.access(FTP_CONFIG);
        console.log('✓ Conexión establecida\n');
        
        // Verificar directorio actual
        const currentDir = await client.pwd();
        console.log(`📂 Directorio actual: ${currentDir}\n`);
        
        // Listar todos los archivos
        const files = await client.list();
        console.log('📋 Archivos en el servidor:');
        
        const htmlFiles = files.filter(f => f.name.includes('.html') || f.name.includes('index'));
        htmlFiles.forEach(file => {
            console.log(`   📄 ${file.name} (${file.size} bytes) - Tipo: ${file.isDirectory ? 'DIR' : 'FILE'}`);
        });
        
        // Verificar si hay index.html
        const indexHtml = files.find(f => f.name === 'index.html');
        if (indexHtml) {
            console.log(`\n✅ index.html encontrado: ${indexHtml.size} bytes`);
            
            // Intentar leer el contenido del archivo remoto
            try {
                const fs = require('fs');
                const tempFile = 'temp_index_check.html';
                await client.downloadTo(tempFile, 'index.html');
                
                const content = fs.readFileSync(tempFile, 'utf8');
                if (content.includes('KEMIA Website v2.0')) {
                    console.log('✅ El archivo index.html contiene el comentario de versión v2.0');
                } else if (content.includes('Bitácora')) {
                    console.log('❌ El archivo index.html todavía contiene "Bitácora" - es la versión antigua');
                } else {
                    console.log('⚠️  No se pudo determinar la versión del archivo');
                }
                
                // Mostrar primeras líneas
                const lines = content.split('\n').slice(0, 5);
                console.log('\n📝 Primeras líneas del archivo:');
                lines.forEach((line, i) => {
                    if (line.trim()) {
                        console.log(`   ${i + 1}: ${line.substring(0, 80)}`);
                    }
                });
                
                fs.unlinkSync(tempFile);
            } catch (error) {
                console.log(`⚠️  No se pudo leer el contenido: ${error.message}`);
            }
        } else {
            console.log('\n❌ index.html NO encontrado en el directorio actual');
        }
        
        // Verificar otros directorios posibles
        console.log('\n🔍 Buscando en otros directorios...');
        try {
            await client.cd('/');
            const rootFiles = await client.list();
            const rootHtml = rootFiles.filter(f => f.name.includes('index') || f.name.includes('.html'));
            if (rootHtml.length > 0) {
                console.log('📋 Archivos HTML en la raíz:');
                rootHtml.forEach(file => {
                    console.log(`   📄 ${file.name} (${file.size} bytes)`);
                });
            }
        } catch (error) {
            console.log(`⚠️  No se pudo acceder a la raíz: ${error.message}`);
        }
        
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
    } finally {
        client.close();
    }
}

diagnose();

