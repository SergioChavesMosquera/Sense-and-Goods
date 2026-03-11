from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import json # Importamos json al inicio para evitar errores
from services.firebase_service import init_firebase, get_storage_bucket 
from models.models import Producto
import firebase_admin
from firebase_admin import credentials, firestore, storage


def init_firebase():
    # Evita inicializar Firebase más de una vez
    if not firebase_admin._apps:
        # Aquí cargas la llave privada que descargaste
        cred = credentials.Certificate("firebase-credentials.json")
        firebase_admin.initialize_app(cred, {
            'storageBucket': 'sense-and-goods.firebasestorage.app' # Cambia esto por tu bucket real
        })
    return firestore.client()

def get_storage_bucket():
    return storage.bucket()

app = FastAPI(title="Sense & Goods API")

# --- CONFIGURACIÓN DE SEGURIDAD (CORS) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db = init_firebase()

@app.get("/")
def home():
    return {"mensaje": "API de Sense & Goods en línea 🚀"}

# ==========================================
# RUTAS DE PRODUCTOS
# ==========================================

@app.get("/api/productos", response_model=List[dict])
def obtener_productos():
    try:
        productos = []
        docs = db.collection("productos").stream()
        for doc in docs:
            item = doc.to_dict()
            item["id"] = doc.id
            productos.append(item)
        return productos
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/carrito/agregar")
async def agregar_al_carrito_db(user_id: str = Form(...), producto_id: str = Form(...), talla: str = Form(None)):
    try:
        # Referencia al carrito del usuario específico
        cart_ref = db.collection("carritos").document(user_id)
        doc = cart_ref.get()

        nuevo_item = {"id": producto_id, "talla": talla, "cantidad": 1}

        if doc.exists:
            # Si ya tiene carrito, actualizamos el array (lógica simplificada)
            productos = doc.to_dict().get("productos", [])
            # Aquí podrías buscar si el producto ya existe para sumar cantidad
            productos.append(nuevo_item)
            cart_ref.update({"productos": productos})
        else:
            # Si es su primer item, creamos el documento
            cart_ref.set({"productos": [nuevo_item]})
        
        return {"status": "Añadido a Firebase"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
@app.post("/api/admin/subir-producto")
async def crear_producto_detallado(
    nombre: str = Form(...),
    precio: float = Form(...),
    categoria: str = Form(...),
    descripcion: str = Form(...),
    volumen_ml: str = Form(None), 
    notas: str = Form(None),      
    stock_tallas: str = Form(None), 
    imagenes: List[UploadFile] = File(...) 
):
    try: # <--- FALTABA ESTE TRY PARA EL EXCEPT DE ABAJO
        bucket = get_storage_bucket()
        urls_finales = []

        # Subida de múltiples imágenes
        for img in imagenes:
            blob = bucket.blob(f"productos/{img.filename}")
            contenido = await img.read()
            blob.upload_from_string(contenido, content_type=img.content_type)
            blob.make_public()
            urls_finales.append(blob.public_url)

        # Diccionario base del producto
        nuevo_producto = {
            "nombre": nombre,
            "precio": precio,
            "categoria": categoria,
            "descripcion": descripcion,
            "imagenes": urls_finales,
            "activo": True
        }

        # Lógica dinámica según categoría
        if categoria == "perfume":
            if volumen_ml:
                nuevo_producto["volumen_ml"] = [v.strip() for v in volumen_ml.split(",")]
            if notas:
                nuevo_producto["notas"] = notas
        elif categoria == "ropa":
            if stock_tallas:
                nuevo_producto["stock_tallas"] = json.loads(stock_tallas)

        # Guardar en Firestore
        db.collection("productos").add(nuevo_producto)
        
        return {"status": "Éxito", "urls": urls_finales}

    except Exception as e: # <--- AHORA SÍ TIENE SU TRY CORRESPONDIENTE
        print(f"Error detectado: {e}")
        raise HTTPException(status_code=500, detail=f"Error en el servidor: {str(e)}")