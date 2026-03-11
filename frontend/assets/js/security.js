// assets/js/security.js

// 1. Ocultamos el cuerpo temporalmente para que no haya parpadeos
document.body.style.display = "none";

// Esperamos a ver si hay un usuario activo
firebase.auth().onAuthStateChanged((user) => {
    
    // 1. Define las páginas que SÍ O SÍ requieren iniciar sesión (Ajusta los nombres según tus archivos)
    const paginasPrivadas = ['admin.html', 'subir-producto.html', 'mi-cuenta.html', 'stock.html'];
    
    // 2. Obtenemos el nombre de la página actual en la que está el usuario
    const rutaActual = window.location.pathname;
    
    // 3. Verificamos si la página actual es privada
    const esPaginaPrivada = paginasPrivadas.some(pagina => rutaActual.includes(pagina));

    if (user) {
        // --- EL USUARIO ESTÁ LOGUEADO ---
        console.log("Sesión activa:", user.email);
        
        // (Opcional) Si un usuario logueado entra al login o register, lo mandamos al index
        if (rutaActual.includes('login.html') || rutaActual.includes('register.html')) {
            window.location.href = 'index.html';
        }

        // Aquí puedes llamar a una función para que tu menú muestre "Mi Cuenta" y "Cerrar sesión"

    } else {
        // --- EL USUARIO ES UN VISITANTE (No logueado) ---
        
        if (esPaginaPrivada) {
            // Solo lo redirigimos al login SI intenta entrar a una página prohibida
            console.log("Acceso denegado. Redirigiendo al login...");
            window.location.href = 'login.html';
        } else {
            // Si está en index.html, ropa.html o perfumes.html, lo dejamos navegar tranquilo
            console.log("Visitante explorando la tienda.");
            
            // Aquí puedes llamar a una función para que tu menú muestre "Iniciar Sesión" y "Registrarse"
        }
    }
});