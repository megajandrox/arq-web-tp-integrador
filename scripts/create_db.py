import sys
from pathlib import Path
from api.core.database import Base, engine
from api.core.models import User, user_roles, Role, Permission, role_permissions # ¡Este import es crucial!

sys.path.append(str(Path(__file__).parent.parent))

def create_tables():
    print("\n[Debug] Tablas registradas ANTES de create_all:")
    print(list(Base.metadata.tables.keys()))
    
    Base.metadata.create_all(bind=engine)
    
    print("\n[Debug] Tablas registradas DESPUÉS de create_all:")
    print(list(Base.metadata.tables.keys()))

if __name__ == "__main__":
    create_tables()
    print("\n✅ Verifica que existe el archivo user_manager.db")