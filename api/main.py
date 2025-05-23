import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.core.settings import Settings
from api.endpoints.users import router as users_router
from api.endpoints.roles import router as roles_router
from api.endpoints.user_roles import router as user_roles_router
from api.endpoints.permissions import router as permissions_router
from api.endpoints.reports import router as reports_router

settings = Settings()

app = FastAPI(debug=settings.DEBUG)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.ALLOWED_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router)
app.include_router(roles_router)
app.include_router(user_roles_router)
app.include_router(permissions_router)
app.include_router(reports_router)

from fastapi.openapi.utils import get_openapi

@app.get("/debug-openapi")
def debug_openapi():
    openapi_schema = get_openapi(
        title="My API",
        version="1.0.0",
        routes=app.routes,
    )
    print(openapi_schema)
    return openapi_schema

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=settings.API_PORT)