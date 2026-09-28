from pydantic import BaseModel, ConfigDict
from typing import Optional


# =========================================
# PATIENT SCHEMAS
# =========================================

class PatientBase(BaseModel):
    patient_code: str
    name: str
    age: int
    gender: str
    status: str = "Active"


class PatientCreate(PatientBase):
    pass


class PatientResponse(PatientBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


# =========================================
# SESSION SCHEMAS
# =========================================

class SessionCreate(BaseModel):
    session_code: str
    patient_id: int
    date: str
    duration: str

    average_intensity: Optional[float] = None
    peak_intensity: Optional[float] = None
    minimum_intensity: Optional[float] = None

    dominant_direction: Optional[str] = None
    status: str = "Completed"


class SessionResponse(SessionCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)


# =========================================
# TELEMETRY SCHEMAS
# =========================================

class TelemetryCreate(BaseModel):
    timestamp: str
    intensity: float
    direction: str


class TelemetryResponse(TelemetryCreate):
    id: int
    session_id: int

    model_config = ConfigDict(from_attributes=True)