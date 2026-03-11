from pydantic import BaseModel
from typing import List, Optional

# ==========================================
# 1. MODELO DE PRODUCTOS (El Catálogo)
# ==========================================
class Producto(BaseModel):
    nombre: str
    descripcion: str
    precio: float
    stock: int
    categoria: str  # Debe ser "ropa" o "perfume"
    imagenes: List[str] = [] # Lista de URLs de las fotos
    activo: bool = True
    
    # --- Campos exclusivos de ROPA (Opcionales) ---
    tallas_disponibles: Optional[List[str]] = None
    color: Optional[str] = None
    
    # --- Campos exclusivos de PERFUMES (Opcionales) ---
    volumen_ml: Optional[List[int]] = None
    notas_olfativas: Optional[List[str]] = None

# ==========================================
# 2. MODELO DE USUARIOS
# ==========================================
class Direccion(BaseModel):
    calle: str
    ciudad: str
    detalles: Optional[str] = None # Ej: Apto 301

class Usuario(BaseModel):
    nombre: str
    email: str
    telefono: Optional[str] = None
    direccion: Optional[Direccion] = None
    rol: str = "cliente" # Puede ser 'cliente' o 'admin'

# ==========================================
# 3. MODELO DE PEDIDOS (Facturación)
# ==========================================
class ItemPedido(BaseModel):
    producto_id: str
    cantidad: int
    precio_unitario: float
    variante: str # Ej: "Talla M" o "100ml"

class Pedido(BaseModel):
    usuario_id: str
    fecha: str
    estado: str = "pendiente" # pendiente, pagado, enviado, entregado
    total: float
    items: List[ItemPedido]

# ==========================================
# 4. MODELO DE CUPONES (Marketing)
# ==========================================
class Cupon(BaseModel):
    codigo: str # Ej: "SENSE10"
    descuento_porcentaje: int # Ej: 10
    activo: bool = True

# ==========================================
# 5. MODELO DE RESEÑAS (Estrellitas)
# ==========================================
class Resena(BaseModel):
    producto_id: str
    usuario_id: str
    nombre_usuario: str
    calificacion: int # Del 1 al 5
    comentario: str