// KEMIA Website - Interactive Scripts
// Efectos glitch, animaciones y interactividad

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== NAVEGACIÓN SMOOTH SCROLL =====
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===== NAVEGACIÓN RESPONSIVE =====
    const navToggle = document.querySelector('.nav-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navLinksContainer.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // ===== EFECTO GLITCH EN EL LOGO =====
    const logo = document.querySelector('.logo-text');
    
    function triggerLogoGlitch() {
        if (logo) {
            logo.style.animation = 'none';
            logo.offsetHeight; // Trigger reflow
            logo.style.animation = 'glitchEffect 0.3s ease-in-out';
            
            setTimeout(() => {
                logo.style.animation = '';
            }, 300);
        }
    }

    // Trigger glitch aleatoriamente
    setInterval(() => {
        if (Math.random() < 0.1) { // 10% chance every interval
            triggerLogoGlitch();
        }
    }, 5000);

    // ===== ANIMACIONES AL SCROLL =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observar elementos para animación
    const animateElements = document.querySelectorAll('.universe-card, .bitacora-post, .constellation-node, .obra-item');
    animateElements.forEach(el => observer.observe(el));

    // ===== EFECTOS DE PARTÍCULAS INTERACTIVAS =====
    const particlesBg = document.getElementById('particles-bg');
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: ${Math.random() > 0.5 ? 'var(--primary-neon)' : 'var(--secondary-neon)'};
            border-radius: 50%;
            pointer-events: none;
            opacity: 0.6;
            animation: particleFloat ${3 + Math.random() * 4}s linear infinite;
        `;
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        particlesBg.appendChild(particle);
        
        // Remover partícula después de la animación
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 7000);
    }

    // Crear partículas periódicamente
    setInterval(createParticle, 200);

    // ===== EFECTO GLITCH EN IMÁGENES =====
    const glitchImages = document.querySelectorAll('.image-glitch-effect');
    
    glitchImages.forEach(img => {
        setInterval(() => {
            if (Math.random() < 0.05) { // 5% chance
                img.style.animation = 'none';
                img.offsetHeight;
                img.style.animation = 'glitchOverlay 0.2s ease-in-out';
            }
        }, 3000);
    });

    // ===== INTERACTIVIDAD EN NODOS DE CONSTELACIÓN =====
    const constellationNodes = document.querySelectorAll('.constellation-node');
    
    constellationNodes.forEach(node => {
        node.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
            this.style.zIndex = '10';
        });
        
        node.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
            this.style.zIndex = '1';
        });
        
        node.addEventListener('click', function() {
            const world = this.getAttribute('data-world');
            showWorldModal(world);
        });
    });

    // ===== MODAL PARA MUNDOS =====
    function showWorldModal(world) {
        const modal = document.createElement('div');
        modal.className = 'world-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${world.charAt(0).toUpperCase() + world.slice(1)}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Explorando el mundo de ${world}...</p>
                    <p>Contenido próximo a ser revelado.</p>
                </div>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(5px);
        `;
        
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.cssText = `
            background: var(--darker-bg);
            border: 1px solid var(--primary-neon);
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            position: relative;
            animation: modalSlideIn 0.3s ease-out;
        `;
        
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.style.cssText = `
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            color: var(--primary-neon);
            font-size: 2rem;
            cursor: pointer;
            font-family: var(--font-primary);
        `;
        
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        document.body.appendChild(modal);
    }

    // ===== FORMULARIO DE CONTACTO =====
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            const formData = new FormData(this);
            
            // Validar campos
            const nombre = formData.get('nombre');
            const email = formData.get('email');
            const mensaje = formData.get('mensaje');
            
            if (!nombre || !email || !mensaje) {
                alert('Por favor completa todos los campos');
                return;
            }
            
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            
            // Detectar si estamos en localhost
            const isLocalhost = window.location.hostname === 'localhost' || 
                               window.location.hostname === '127.0.0.1' || 
                               window.location.hostname === '';
            
            if (isLocalhost) {
                // Simular envío para desarrollo local
                console.log('🌐 Ejecutando en localhost - Simulando envío del formulario');
                console.log('📧 Datos del formulario:', {
                    nombre: nombre,
                    email: email,
                    mensaje: mensaje
                });
                
                setTimeout(() => {
                    submitBtn.textContent = '¡Invocación Enviada! ✅ (Local)';
                    submitBtn.style.background = 'var(--organic-green)';
                    submitBtn.style.cursor = 'not-allowed';
                    
                    // Mostrar datos en consola para verificación
                    console.log('✅ Formulario enviado exitosamente (simulado)');
                    console.log('📋 Datos que se enviarían:');
                    console.log('   Nombre:', nombre);
                    console.log('   Email:', email);
                    console.log('   Mensaje:', mensaje);
                    console.log('📧 Email de destino: lucas+kemiacontact@mazalan.com');
                    
                    // Resetear formulario después de un tiempo
                    setTimeout(() => {
                        this.reset();
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.opacity = '1';
                        submitBtn.style.background = 'var(--primary-neon)';
                        submitBtn.style.cursor = 'pointer';
                    }, 3000);
                }, 1500);
                
            } else {
                // Envío real usando EmailJS (alternativa a Formspree)
                const templateParams = {
                    name: nombre,
                    email: email,
                    message: mensaje,
                    time: new Date().toLocaleString('es-ES', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                };
                
                // Intentar EmailJS primero
                if (typeof emailjs !== 'undefined') {
                    emailjs.send('Kemia_Contacto_Web', 'template_5vahywo', templateParams)
                        .then(function(response) {
                            console.log('SUCCESS!', response.status, response.text);
                            submitBtn.textContent = '¡Invocación Enviada! ✅';
                            submitBtn.style.background = 'var(--organic-green)';
                            submitBtn.style.cursor = 'not-allowed';
                            
                            // Resetear formulario después de un tiempo
                            setTimeout(() => {
                                this.reset();
                                submitBtn.textContent = originalText;
                                submitBtn.disabled = false;
                                submitBtn.style.opacity = '1';
                                submitBtn.style.background = 'var(--primary-neon)';
                                submitBtn.style.cursor = 'pointer';
                            }, 3000);
                        }.bind(this), function(error) {
                            console.log('FAILED...', error);
                            // Fallback a Formspree si EmailJS falla
                            sendWithFormspree();
                        });
                } else {
                    // Fallback a Formspree si EmailJS no está disponible
                    sendWithFormspree();
                }
                
                function sendWithFormspree() {
                    fetch(this.action, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    })
                    .then(response => {
                        if (response.ok) {
                            submitBtn.textContent = '¡Invocación Enviada! ✅';
                            submitBtn.style.background = 'var(--organic-green)';
                            submitBtn.style.cursor = 'not-allowed';
                            
                            // Resetear formulario después de un tiempo
                            setTimeout(() => {
                                this.reset();
                                submitBtn.textContent = originalText;
                                submitBtn.disabled = false;
                                submitBtn.style.opacity = '1';
                                submitBtn.style.background = 'var(--primary-neon)';
                                submitBtn.style.cursor = 'pointer';
                            }, 3000);
                        } else {
                            throw new Error('Error en el envío');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        submitBtn.textContent = 'Error - Reintentar';
                        submitBtn.style.background = 'var(--glitch-red)';
                        submitBtn.disabled = false;
                        submitBtn.style.opacity = '1';
                        
                        setTimeout(() => {
                            submitBtn.textContent = originalText;
                            submitBtn.style.background = 'var(--primary-neon)';
                        }, 2000);
                    });
                }
            }
        });
    }

    // ===== EFECTOS DE TEXTO GLITCH =====
    function addTextGlitchEffect(element) {
        const text = element.textContent;
        const glitchText = document.createElement('span');
        glitchText.textContent = text;
        glitchText.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            color: var(--glitch-red);
            clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
            animation: textGlitch 0.3s ease-in-out;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.appendChild(glitchText);
        
        setTimeout(() => {
            glitchText.remove();
        }, 300);
    }

    // Aplicar glitch a títulos aleatoriamente
    const titles = document.querySelectorAll('h1, h2, h3');
    setInterval(() => {
        if (Math.random() < 0.02) { // 2% chance
            const randomTitle = titles[Math.floor(Math.random() * titles.length)];
            addTextGlitchEffect(randomTitle);
        }
    }, 8000);

    // ===== EFECTO DE CURSOR PERSONALIZADO =====
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid var(--primary-neon);
        border-radius: 50%;
        pointer-events: none;
        z-index: 10001;
        transition: all 0.1s ease;
        mix-blend-mode: difference;
    `;
    
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    
    // Efecto hover en elementos interactivos
    const interactiveElements = document.querySelectorAll('a, button, .constellation-node');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            cursor.style.borderColor = 'var(--secondary-neon)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = 'var(--primary-neon)';
        });
    });

    // ===== ANIMACIONES CSS ADICIONALES =====
    const style = document.createElement('style');
    style.textContent = `
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-50px) scale(0.9);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        @keyframes textGlitch {
            0% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(2px, -2px); }
            60% { transform: translate(-2px, -2px); }
            80% { transform: translate(2px, 2px); }
            100% { transform: translate(0); }
        }
        
        @keyframes particleFloat {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 0.6;
            }
            50% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
        
        .animate-in {
            animation: slideInUp 0.6s ease-out forwards;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .nav-links.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: var(--darker-bg);
            padding: 1rem;
            border-top: 1px solid var(--primary-neon);
        }
        
        .nav-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    `;
    
    document.head.appendChild(style);

    // ===== EFECTOS DE SONIDO (OPCIONAL) =====
    function playGlitchSound() {
        // Crear un oscilador de audio para efectos glitch
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }

    // Conectar efectos de sonido a eventos glitch
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('constellation-node') || 
            e.target.closest('.constellation-node')) {
            playGlitchSound();
        }
    });

    // ===== PERFORMANCE OPTIMIZATION =====
    let ticking = false;
    
    function updateOnScroll() {
        // Optimizar animaciones de scroll
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);

    // ===== INICIALIZACIÓN COMPLETA =====
    console.log('🌐 KEMIA Website - Sistema de glitch activado');
    console.log('🧬 Entidad digital inicializada');
    console.log('⚡ Efectos visuales cargados');
    
    // Trigger inicial de animaciones
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// ===== UTILIDADES ADICIONALES =====

// Función para generar texto glitch aleatorio
function generateGlitchText(text) {
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    let glitchedText = '';
    
    for (let i = 0; i < text.length; i++) {
        if (Math.random() < 0.1) { // 10% chance de glitch
            glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
        } else {
            glitchedText += text[i];
        }
    }
    
    return glitchedText;
}

// Función para crear efectos de distorsión
function createDistortionEffect(element) {
    element.style.filter = 'hue-rotate(180deg) saturate(200%)';
    element.style.transform = 'skew(2deg, 1deg)';
    
    setTimeout(() => {
        element.style.filter = '';
        element.style.transform = '';
    }, 200);
}

// Exportar funciones para uso global
window.KEMIA = {
    triggerGlitch: triggerLogoGlitch,
    generateGlitchText: generateGlitchText,
    createDistortion: createDistortionEffect
}; 