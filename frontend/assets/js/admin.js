// URL de tu API en FastAPI
const API_URL_ADMIN = "http://127.0.0.1:8000/api/admin/subir-producto";

// 1. Mostrar/Ocultar campos según categoría
function adaptarFormulario() {
    const categoria = document.getElementById('categoria').value;
    const secPerfume = document.getElementById('section-perfume');
    const secRopa = document.getElementById('section-ropa');

    secPerfume.style.display = (categoria === 'perfume') ? 'block' : 'none';
    secRopa.style.display = (categoria === 'ropa') ? 'block' : 'none';
}

// 2. Manejar el envío del formulario
document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = document.getElementById('btnPublicar');
    const categoria = document.getElementById('categoria').value;
    
    btn.innerText = "SUBIENDO PRODUCTO Y FOTOS...";
    btn.disabled = true;

    // Usamos FormData para enviar archivos y texto mezclados
    const formData = new FormData();
    
    // Campos Base
    formData.append('nombre', document.getElementById('nombre').value);
    formData.append('descripcion', document.getElementById('descripcion').value);
    formData.append('precio', document.getElementById('precio').value);
    formData.append('categoria', categoria);

    // Campos Específicos según categoría
    if (categoria === 'perfume') {
        formData.append('volumen_ml', document.getElementById('volumen_ml').value);
        formData.append('notas', document.getElementById('notas').value);
    } else if (categoria === 'ropa') {
        const tallas = {
            S: document.getElementById('talla_s').value || 0,
            M: document.getElementById('talla_m').value || 0,
            L: document.getElementById('talla_l').value || 0,
            XL: document.getElementById('talla_xl').value || 0
        };
        formData.append('stock_tallas', JSON.stringify(tallas));
    }

    // Manejo de Múltiples Imágenes
    const inputImagenes = document.getElementById('imagenes');
    for (let i = 0; i < inputImagenes.files.length; i++) {
        formData.append('imagenes', inputImagenes.files[i]); 
    }

    try {
        const response = await fetch(API_URL_ADMIN, {
            method: 'POST',
            body: formData // No lleva Headers de Content-Type, el navegador lo pone solo
        });

        const result = await response.json();

        if (response.ok) {
            alert("✨ ¡Éxito! Producto publicado con " + inputImagenes.files.length + " fotos.");
            location.reload(); // Limpiar formulario
        } else {
            throw new Error(result.detail || "Error desconocido");
        }
    } catch (error) {
        alert("❌ Error: " + error.message);
    } finally {
        btn.disabled = false;
        btn.innerText = "PUBLICAR PRODUCTO";
    }
});