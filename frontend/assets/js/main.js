// ==========================================
// CARGAR PRODUCTOS (index.html)
// ==========================================
async function cargarProductos() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    if (!firebase.apps.length) { console.error("Firebase no inicializado."); return; }
    const db = firebase.firestore();
    try {
        const snapshot = await db.collection("productos").get();
        grid.innerHTML = "";
        if (snapshot.empty) {
            grid.innerHTML = "<p style='color:var(--sg-text-main);grid-column:1/-1;text-align:center;'>Aún no hay productos en el catálogo.</p>";
            return;
        }
        snapshot.forEach(doc => {
            const p = doc.data();
            const id = doc.id;
            const card = document.createElement('div');
            card.className = 'product-card';
            const detalleExtra = (p.categoria === 'perfume' && p.volumen_ml && p.volumen_ml.length > 0)
                ? `${p.volumen_ml.join('/')} ml`
                : 'Colección Exclusiva';
            const imagenPrincipal = (p.imagenes && p.imagenes.length > 0)
                ? p.imagenes[0]
                : 'https://via.placeholder.com/300x400?text=S%26G+Exclusive';
            card.innerHTML = `
                <img src="${imagenPrincipal}" alt="${p.nombre}">
                <p class="category">${p.categoria.toUpperCase()} • ${detalleExtra}</p>
                <h3>${p.nombre}</h3>
                <p class="price">$${p.precio.toLocaleString()}</p>
                <button onclick="window.location.href='product.html?id=${id}'">VER DETALLE</button>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        console.error("Error al cargar desde Firestore:", error);
        grid.innerHTML = "<p style='color:var(--sg-text-main);grid-column:1/-1;text-align:center;'>Error al cargar el catálogo.</p>";
    }
}

// ==========================================
// LOGIN CON EMAIL Y CONTRASEÑA
// ==========================================
function iniciarSesion() {
    const email    = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        Swal.fire({ title: 'Campos incompletos', text: 'Ingresa tu correo y contraseña.', icon: 'warning', confirmButtonColor: '#d4af37', background: '#1a1a1a', color: '#fff' });
        return;
    }

    Swal.fire({ title: 'Iniciando sesión...', allowOutsideClick: false, background: '#1a1a1a', color: '#fff', didOpen: () => Swal.showLoading() });

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            Swal.fire({ title: '¡Bienvenido!', icon: 'success', confirmButtonColor: '#d4af37', background: '#1a1a1a', color: '#fff', timer: 1800, showConfirmButton: false })
                .then(() => window.location.href = 'index.html');
        })
        .catch((error) => {
            let msg = 'Correo o contraseña incorrectos.';
            if (error.code === 'auth/user-not-found')  msg = 'No hay cuenta registrada con este correo.';
            if (error.code === 'auth/wrong-password')  msg = 'La contraseña es incorrecta.';
            if (error.code === 'auth/invalid-email')   msg = 'El formato del correo no es válido.';
            Swal.fire({ title: 'Error de acceso', text: msg, icon: 'error', confirmButtonColor: '#d4af37', background: '#1a1a1a', color: '#fff' });
        });
}

// ==========================================
// LOGIN CON GOOGLE
// ==========================================
function loginConGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    Swal.fire({ title: 'Conectando con Google...', allowOutsideClick: false, background: '#1a1a1a', color: '#fff', didOpen: () => Swal.showLoading() });

    firebase.auth().signInWithPopup(provider)
        .then(async (result) => {
            const user = result.user;
            const db = firebase.firestore();

            // Si es la primera vez que entra con Google, guardamos sus datos básicos
            const docRef = db.collection("usuarios").doc(user.uid);
            const docSnap = await docRef.get();
            if (!docSnap.exists) {
                await docRef.set({
                    nombre:   user.displayName || '',
                    email:    user.email,
                    telefono: '',
                    ciudad:   '',
                    direccion: '',
                    creadoEn: firebase.firestore.FieldValue.serverTimestamp()
                });
            }

            Swal.fire({ title: '¡Bienvenido!', text: `Hola, ${user.displayName || user.email}`, icon: 'success', confirmButtonColor: '#d4af37', background: '#1a1a1a', color: '#fff', timer: 1800, showConfirmButton: false })
                .then(() => window.location.href = 'index.html');
        })
        .catch((error) => {
            if (error.code === 'auth/popup-closed-by-user') return; // El usuario cerró el popup, no es error
            Swal.fire({ title: 'Error con Google', text: 'No se pudo iniciar sesión con Google. Intenta de nuevo.', icon: 'error', confirmButtonColor: '#d4af37', background: '#1a1a1a', color: '#fff' });
        });
}

// ==========================================
// REGISTRO CON EMAIL
// ==========================================
function crearCuenta() {
    const nombre   = document.getElementById('reg-nombre').value.trim();
    const email    = document.getElementById('reg-email').value.trim();
    const telefono = document.getElementById('reg-telefono').value.trim();
    const genero   = document.getElementById('reg-genero').value;
    const password = document.getElementById('reg-password').value;

    if (!email || !password) {
        Swal.fire({ icon: 'warning', title: 'Faltan datos', text: 'El correo y la contraseña son obligatorios.', confirmButtonColor: '#d4af37', background: '#1a1a1a', color: '#fff' });
        return;
    }

    Swal.fire({ title: 'Creando cuenta...', allowOutsideClick: false, background: '#1a1a1a', color: '#fff', didOpen: () => Swal.showLoading() });

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;
            const db = firebase.firestore();

            // Guardamos los datos del perfil en Firestore desde el registro
            await db.collection("usuarios").doc(user.uid).set({
                nombre, email, telefono, genero,
                ciudad: '', direccion: '',
                creadoEn: firebase.firestore.FieldValue.serverTimestamp()
            });

            Swal.fire({ icon: 'success', title: '¡Bienvenido a S&G!', text: 'Tu cuenta ha sido creada exitosamente.', confirmButtonColor: '#d4af37', background: '#1a1a1a', color: '#fff', timer: 1800, showConfirmButton: false })
                .then(() => window.location.href = 'index.html');
        })
        .catch((error) => {
            let msg = "Hubo un problema al crear tu cuenta.";
            if (error.code === 'auth/email-already-in-use') msg = "Este correo ya está registrado. Intenta iniciar sesión.";
            if (error.code === 'auth/weak-password')        msg = "La contraseña debe tener al menos 6 caracteres.";
            if (error.code === 'auth/invalid-email')        msg = "El formato del correo no es válido.";
            Swal.fire({ icon: 'error', title: 'Oops...', text: msg, confirmButtonColor: '#d4af37', background: '#1a1a1a', color: '#fff' });
        });
}

// ==========================================
// PAGO POR WHATSAPP
// ==========================================
function procederPorWhatsapp(items, total) {
    if (!items || items.length === 0) {
        Swal.fire({ title: 'Carrito vacío', text: 'Agrega productos antes de proceder al pago.', icon: 'warning', confirmButtonColor: '#d4af37', background: '#1a1a1a', color: '#fff' });
        return;
    }

    // Armamos el mensaje línea por línea
    let mensaje = '🛍️ *Hola, quiero realizar un pedido en Sense & Goods:*\n\n';

    items.forEach((item, i) => {
        mensaje += `*${i + 1}. ${item.nombre}*\n`;
        mensaje += `   • Variante: ${item.talla_o_volumen}\n`;
        mensaje += `   • Cantidad: ${item.cantidad}\n`;
        mensaje += `   • Subtotal: $${(item.precio * item.cantidad).toLocaleString('es-CO')}\n\n`;
    });

    mensaje += `━━━━━━━━━━━━━━━━━━\n`;
    mensaje += `💰 *Total: $${total.toLocaleString('es-CO')}*\n\n`;
    mensaje += `Por favor confirmar disponibilidad y método de pago. ¡Gracias!`;

    const numero  = '573128036725';
    const url     = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}

document.addEventListener('DOMContentLoaded', cargarProductos);