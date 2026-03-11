from services.firebase_service import init_firebase, get_storage_bucket

# Inicializamos
db = init_firebase()
bucket = get_storage_bucket()

def subir_prueba():
    try:
        # Esto creará un archivo de texto vacío en tu Storage para probar la conexión
        blob = bucket.blob("pruebas/conexion_exitosa.txt")
        blob.upload_from_string("¡La bodega de Sense & Goods funciona!")
        print("✅ ¡Conexión con Storage exitosa! Revisa tu consola de Firebase.")
    except Exception as e:
        print(f"❌ Error de conexión: {e}")

if __name__ == "__main__":
    subir_prueba()