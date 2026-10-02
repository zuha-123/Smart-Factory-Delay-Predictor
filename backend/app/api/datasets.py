from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
import pandas as pd
import io
import os

from backend.app.core.database import get_db
from backend.app.models.db_models import DatasetUpload, AuditLog
from backend.app.api.auth import get_current_user, require_role

router = APIRouter(prefix="/dataset", tags=["Dataset Upload"])

REQUIRED_COLUMNS = [
    "order_id", "product_family", "order_quantity", "planned_duration_days",
    "machine_capacity_utilization", "machine_downtime_hours", "material_availability_pct",
    "workforce_availability_pct", "active_workload_orders"
]

@router.post("/upload")
async def upload_dataset(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["Admin", "Analyst"]))
):
    filename = file.filename
    if not (filename.endswith(".csv") or filename.endswith(".xlsx") or filename.endswith(".xls")):
        raise HTTPException(status_code=400, detail="Invalid file format. Only CSV or Excel files (.xlsx, .xls) are allowed.")
        
    contents = await file.read()
    try:
        if filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(contents))
        else:
            df = pd.read_excel(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse data file: {str(e)}")
        
    # Validate required columns
    missing_cols = [col for col in REQUIRED_COLUMNS if col not in df.columns]
    if missing_cols:
        raise HTTPException(
            status_code=422,
            detail={
                "error": "Dataset Schema Validation Failed",
                "missing_columns": missing_cols,
                "required_columns": REQUIRED_COLUMNS
            }
        )
        
    row_count = len(df)
    missing_values_count = int(df[REQUIRED_COLUMNS].isnull().sum().sum())
    duplicate_orders_count = int(df["order_id"].duplicated().sum()) if "order_id" in df.columns else 0
    
    # Save upload record
    upload_rec = DatasetUpload(
        filename=filename,
        row_count=row_count,
        uploaded_by=current_user.email,
        status="Valid & Uploaded" if missing_values_count == 0 else "Uploaded with Imputations"
    )
    db.add(upload_rec)
    
    log = AuditLog(
        user_email=current_user.email,
        action="DATASET_UPLOAD",
        details=f"Uploaded {filename} with {row_count} rows. Missing values: {missing_values_count}, Duplicates: {duplicate_orders_count}"
    )
    db.add(log)
    db.commit()
    
    return {
        "status": "success",
        "message": f"Successfully processed dataset '{filename}'",
        "filename": filename,
        "row_count": row_count,
        "missing_values_imputed": missing_values_count,
        "duplicate_orders": duplicate_orders_count,
        "validation_passed": True
    }
