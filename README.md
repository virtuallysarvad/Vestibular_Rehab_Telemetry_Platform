# Vestibular Rehab Telemetry Platform

A software-based telemetry platform MVP for monitoring and analyzing vestibular rehabilitation therapy sessions.

This project is a full-stack MVP with a React + Vite frontend, FastAPI backend, SQLAlchemy ORM, and SQLite database.

> **Important:** This MVP uses simulated/dummy telemetry data. No ESP32, sensors, or physical hardware are required to run the project.

---

## Requirements

Before running the project, install the following software on your laptop:

### 1. Git

Git is required to clone the repository.

Check your installation:

```bash
git --version
```

---

### 2. Python

Python is required for the FastAPI backend.

Python **3.10 or newer** is recommended.

Check your installation:

```bash
python --version
```

On some systems, you may need:

```bash
python3 --version
```

---

### 3. Node.js and npm

Node.js and npm are required for the React + Vite frontend.

This project uses Vite 8, which requires Node.js **20.19+ or 22.12+**.

Check your installation:

```bash
node --version
npm --version
```

---

## Project Structure

```text
Vestibular_Rehab_Telemetry_Platform/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   └── pages/
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
└── README.md
```

The SQLite database file is created automatically by the backend when the application starts.

---

# Installation

## 1. Clone the Repository

Open a terminal or PowerShell window and run:

```bash
git clone https://github.com/virtuallysarvad/Vestibular_Rehab_Telemetry_Platform.git
```

Enter the project directory:

```bash
cd Vestibular_Rehab_Telemetry_Platform
```

---

# 2. Backend Setup

The backend is built using:

- Python
- FastAPI
- Uvicorn
- SQLAlchemy
- SQLite
- Pydantic

All required Python packages are already listed in:

```text
backend/requirements.txt
```

You do **not** need to install these packages individually.

---

## Windows

Open PowerShell in the project directory.

Navigate to the backend:

```powershell
cd backend
```

### Create a virtual environment

```powershell
python -m venv venv
```

### Activate the virtual environment

```powershell
.\venv\Scripts\Activate.ps1
```

After activation, your terminal should show something similar to:

```text
(venv) PS C:\...\Vestibular_Rehab_Telemetry_Platform\backend>
```

### If PowerShell blocks the activation script

Run:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Then activate again:

```powershell
.\venv\Scripts\Activate.ps1
```

### Install all backend packages

```powershell
pip install -r requirements.txt
```

This installs the exact dependency versions specified by the project.

### Start the FastAPI backend

```powershell
uvicorn main:app --reload
```

The backend should now be running at:

```text
http://127.0.0.1:8000
```

Keep this terminal open.

---

## macOS / Linux

Navigate to the backend:

```bash
cd backend
```

Create the virtual environment:

```bash
python3 -m venv venv
```

Activate it:

```bash
source venv/bin/activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

Start the backend:

```bash
uvicorn main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

Keep this terminal open.

---

# 3. Verify the Backend

Open a browser and visit:

```text
http://127.0.0.1:8000/
```

You should see:

```json
{
  "message": "Vestibular Rehab Telemetry API",
  "status": "running"
}
```

You can also open the FastAPI interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 4. Frontend Setup

The frontend is built using:

- React
- Vite
- React Router
- Recharts
- Lucide React

The required packages are already defined in:

```text
frontend/package.json
```

The exact dependency tree is locked in:

```text
frontend/package-lock.json
```

You do **not** need to install the frontend packages individually.

---

## Open a Second Terminal

Keep the backend terminal running.

Open a **new terminal / PowerShell window**.

Navigate to the project:

```powershell
cd Vestibular_Rehab_Telemetry_Platform
```

Then enter the frontend directory:

```powershell
cd frontend
```

### Install all frontend packages

Run:

```powershell
npm install
```

This installs all dependencies and development dependencies listed in `package.json`.

### Start the frontend

Run:

```powershell
npm run dev
```

Vite will start the development server.

The frontend should normally be available at:

```text
http://localhost:5173
```

Open that URL in your browser.

---

# 5. Running the Complete Application

You need **two terminals running at the same time**.

## Terminal 1 - Backend

```powershell
cd Vestibular_Rehab_Telemetry_Platform\backend
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

---

## Terminal 2 - Frontend

```powershell
cd Vestibular_Rehab_Telemetry_Platform\frontend
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 6. Application Workflow

Once both servers are running, open:

```text
http://localhost:5173
```

The main workflow is:

```text
Dashboard
    ↓
Patients
    ↓
Select Patient
    ↓
Start Live Session
    ↓
Start Session
    ↓
Simulated Telemetry
    ↓
Pause / Resume
    ↓
End Session
    ↓
Save Session + Telemetry
    ↓
Session Summary
    ↓
Patient History
    ↓
Analytics
```

---

# 7. Telemetry Simulation

The current MVP does not require physical telemetry hardware.

The Live Session page generates simulated telemetry values for:

- Intensity
- Direction
- Session duration

The interface displays:

```text
Dummy Telemetry
```

When a session is ended:

1. Session statistics are calculated.
2. The session is sent to the FastAPI backend.
3. Telemetry readings are sent to the backend.
4. The backend stores the data in SQLite.
5. The frontend reloads the patient/session data.
6. The completed session appears in the Session Summary, Patient History, Dashboard, and Analytics.

---

# 8. Database

The backend uses SQLite with SQLAlchemy.

The database is created automatically by the backend.

The main tables are:

```text
patients
sessions
telemetry
```

### patients

Stores patient information.

### sessions

Stores completed therapy session information such as:

- Session ID
- Patient
- Date
- Duration
- Average intensity
- Peak intensity
- Minimum intensity
- Dominant direction
- Status

### telemetry

Stores individual telemetry readings belonging to each therapy session.

---

# 9. API Endpoints

The FastAPI backend provides the following endpoints.

## Patients

```text
GET    /api/patients
POST   /api/patients
GET    /api/patients/{patient_id}
DELETE /api/patients/{patient_id}
```

## Sessions

```text
POST /api/sessions
GET  /api/patients/{patient_id}/sessions
GET  /api/sessions/{session_id}
```

## Telemetry

```text
POST /api/sessions/{session_id}/telemetry
GET  /api/sessions/{session_id}/telemetry
```

Interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 10. Troubleshooting

## Backend cannot start

Make sure the virtual environment is activated.

Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Then reinstall the dependencies if necessary:

```powershell
pip install -r requirements.txt
```

Start the server again:

```powershell
uvicorn main:app --reload
```

---

## Frontend cannot start

Make sure you are inside the `frontend` directory:

```powershell
cd frontend
```

Install the dependencies:

```powershell
npm install
```

Then start Vite:

```powershell
npm run dev
```

---

## Frontend cannot connect to backend

Make sure the backend is running at:

```text
http://127.0.0.1:8000
```

Also make sure the frontend is running at:

```text
http://localhost:5173
```

Both servers must be running for the complete application to work.

---

## Port 5173 is already in use

Vite may automatically select another available port.

Check the URL shown in the terminal after running:

```powershell
npm run dev
```

---

## Port 8000 is already in use

Stop the existing process using port 8000, or start FastAPI on another port:

```powershell
uvicorn main:app --reload --port 8001
```

> If you change the backend port, the frontend API URL in `frontend/src/context/PatientContext.jsx` must also be changed.

---

# 11. Useful Commands

### Start backend

```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload
```

### Start frontend

```powershell
cd frontend
npm run dev
```

### Install backend dependencies

```powershell
cd backend
pip install -r requirements.txt
```

### Install frontend dependencies

```powershell
cd frontend
npm install
```

### Build the frontend

```powershell
cd frontend
npm run build
```

---

# 12. Repository

GitHub repository:

https://github.com/virtuallysarvad/Vestibular_Rehab_Telemetry_Platform

---

## Quick Start Summary

If Git, Python, and Node.js are already installed, the complete setup is:

### Terminal 1

```powershell
git clone https://github.com/virtuallysarvad/Vestibular_Rehab_Telemetry_Platform.git
cd Vestibular_Rehab_Telemetry_Platform\backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload
```

### Terminal 2

```powershell
cd Vestibular_Rehab_Telemetry_Platform\frontend
npm install
npm run dev
```

Then open:

```text
http://localhost:5173
```

The backend API will be available at:

```text
http://127.0.0.1:8000
```

---

## Project Status

This repository contains the software MVP of the Vestibular Rehab Telemetry Platform.

The current version uses simulated telemetry data and does not require physical hardware.
