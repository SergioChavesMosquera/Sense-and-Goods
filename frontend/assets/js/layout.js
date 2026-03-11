// assets/js/layout.js

const ADMIN_EMAIL = "sergiochavesbt@gmail.com";

// 1. FUNCIÓN PARA PINTAR EL ENCABEZADO DEPENDIENDO DEL USUARIO
function cargarHeader(user) {
    const paginaActual = window.location.pathname;
    const esPaginaPublica = paginaActual.includes("login.html") || paginaActual.includes("register.html");

    let enlacesMenu = "";

    if (user) {
        enlacesMenu = `
            <li><a href="index.html">Inicio</a></li>
            <li><a href="ropa.html">Ropa</a></li>
            <li><a href="perfumes.html">Perfumes</a></li>
            <li><a href="cuenta.html">Mi Cuenta</a></li>
            <li><a href="carrito.html">🛒 Carrito (0)</a></li>
        `;

        if (user.email === ADMIN_EMAIL) {
            enlacesMenu += `
                <li><a href="admin.html" style="color: #D4AF37; font-weight: bold;">⭐ Subir Producto</a></li>
                <li><a href="stock.html" style="color: #D4AF37; font-weight: bold;">📊 Control de Stock</a></li>
            `;
        }
    } else {
        if (esPaginaPublica) {
            enlacesMenu = `
                <li><a href="login.html">Iniciar Sesión</a></li>
                <li><a href="register.html">Registrarse</a></li>
            `;
        } else {
            enlacesMenu = `
                <li><a href="index.html">Inicio</a></li>
                <li><a href="login.html">Iniciar Sesión</a></li>
                <li><a href="register.html">Registrarse</a></li>
            `;
        }
    }

    const headerHTML = `
        <header>
            <nav class="navbar">
                <div class="logo-container">
                    <a href="index.html" class="logo-link">
                        <img src="assets/img/logo_nombre.png" alt="Sense & Goods Logo" class="brand-logo-img">
                    </a>
                </div>
                <ul class="nav-links">
                    ${enlacesMenu}
                </ul>
            </nav>
        </header>
    `;

    const headerContainer = document.getElementById('header-container');
    if (headerContainer) headerContainer.innerHTML = headerHTML;
}

// 2. FUNCIÓN PARA PINTAR EL FOOTER
function cargarFooter() {
    const footerHTML = `
        <footer class="sg-footer">
            <div class="sg-footer-inner">

                <div class="sg-footer-brand">
                    <img src="assets/img/logo_nombre.png" alt="Sense & Goods" class="sg-footer-logo">
                </div>

                <div class="sg-footer-cols">

                    <div class="sg-footer-col">
                        <h4 class="sg-footer-heading">Explorar</h4>
                        <ul class="sg-footer-links">
                            <li><a href="index.html">Inicio</a></li>
                            <li><a href="ropa.html">Ropa</a></li>
                            <li><a href="perfumes.html">Perfumes</a></li>
                            <li><a href="carrito.html">Carrito</a></li>
                        </ul>
                    </div>

                    <div class="sg-footer-col">
                        <h4 class="sg-footer-heading">Contacto</h4>
                        <ul class="sg-footer-links">
                            <li>
                                <a href="mailto:sergiochavesbt@gmail.com">
                                    <span class="sg-footer-icon">✉</span>
                                    sergiochavesbt@gmail.com
                                </a>
                            </li>
                            <li>
                                <a href="https://wa.me/573128036725" target="_blank">
                                    <span class="sg-footer-icon">💬</span>
                                    +57 312 803 6725
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div class="sg-footer-col">
                        <h4 class="sg-footer-heading">Síguenos</h4>
                        <div class="sg-footer-socials">
                            <a href="https://instagram.com/sense_and_goods" target="_blank" class="sg-social-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                                </svg>
                                @sense_and_goods
                            </a>
                            <a href="https://wa.me/573128036725" target="_blank" class="sg-social-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                                </svg>
                                WhatsApp
                            </a>
                        </div>
                    </div>

                </div>
            </div>

            <div class="sg-footer-bottom">
                <span>&copy; 2026 Sense & Goods. Todos los derechos reservados.</span>
                <span class="sg-footer-bottom-slogan">— Sense the finest —</span>
            </div>
        </footer>
    `;

    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) footerContainer.innerHTML = footerHTML;
}

// 3. INICIALIZACIÓN AUTOMÁTICA AL CARGAR LA PÁGINA
document.addEventListener('DOMContentLoaded', () => {
    cargarFooter();

    const checkFirebase = setInterval(() => {
        if (typeof firebase !== 'undefined' && firebase.auth) {
            clearInterval(checkFirebase);
            firebase.auth().onAuthStateChanged((user) => {
                cargarHeader(user);
            });
        }
    }, 100);
});

// Escuchar el carrito en tiempo real
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        if (typeof firebase !== 'undefined' && firebase.auth) {
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    const db = firebase.firestore();
                    db.collection("usuarios").doc(user.uid).collection("carrito")
                      .onSnapshot((snapshot) => {
                          const cantidadProductos = snapshot.size;
                          const navLinks = document.querySelectorAll('nav a, header a');
                          navLinks.forEach(link => {
                              if (link.innerText.includes("Carrito")) {
                                  link.innerHTML = `🛒 Carrito (${cantidadProductos})`;
                                  if (cantidadProductos > 0) link.style.color = "#D4AF37";
                                  else link.style.color = "";
                              }
                          });
                      });
                }
            });
        }
    }, 1000);
});