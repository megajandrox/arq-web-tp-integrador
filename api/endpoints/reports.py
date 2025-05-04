from fastapi import APIRouter, HTTPException, Query, Depends
from sqlalchemy.orm import Session
from api.core.database import get_db
from api.core.services import ReportsService
from api.endpoints.schema import ReportResponse

router = APIRouter(prefix="/api/reports", tags=["reports"])

def get_reports_service(db=Depends(get_db)) -> ReportsService:
    from api.core.repository import ReportsRepository
    repository = ReportsRepository(db)
    return ReportsService(repository)

@router.get("/reports", response_model=ReportResponse)
def get_report(
    report_type: str = Query(..., description="Tipo de reporte"),
    service: ReportsService = Depends(get_reports_service)
):
    try:
        return service.get_report(report_type)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))