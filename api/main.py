from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.endpoints import users
from api.core.settings import Settings

settings = Settings()

app = FastAPI(debug=settings.DEBUG)

# Configurar CORS (para conectar con React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.ALLOWED_ORIGINS],  # URL del frontend
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rutas
app.include_router(users.router, prefix="/api/users")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=settings.API_PORT)