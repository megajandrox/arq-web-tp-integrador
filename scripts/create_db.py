import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from api.core.database import Base, engine

# Importa EXPLÍCITAMENTE todos los modelos
from api.core.models import User  # ¡Este import es crucial!

def create_tables():
    print("\n[Debug] Tablas registradas ANTES de create_all:")
    print(list(Base.metadata.tables.keys()))  # Forma correcta de ver tablas
    
    Base.metadata.create_all(bind=engine)
    
    print("\n[Debug] Tablas registradas DESPUÉS de create_all:")
    print(list(Base.metadata.tables.keys()))

if __name__ == "__main__":
    create_tables()
    print("\n✅ Verifica que existe el archivo user_manager.db")