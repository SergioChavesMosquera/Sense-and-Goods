import firebase_admin
from firebase_admin import credentials, firestore, storage # Agregamos storage
import os

def init_firebase():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    ruta_llave = os.path.join(base_dir, "firebase_key.json")

    if not firebase_admin._apps:
        cred = credentials.Certificate(ruta_llave)
        # ⚠️ ASEGÚRATE DE QUE ESTE NOMBRE SEA EL CORRECTO
        # A veces termina en .appspot.com o .firebasestorage.app
        firebase_admin.initialize_app(cred, {
            'storageBucket': 'sense-and-goods.firebasestorage.app' 
        })
    
    return firestore.client()

def get_storage_bucket():
    return storage.bucket()