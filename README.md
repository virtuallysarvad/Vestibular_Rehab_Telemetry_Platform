## Quick Start Summary

If Git, Python, and Node.js are already installed, the complete setup is:

### Terminal 1

```
git clone https://github.com/virtuallysarvad/Vestibular_Rehab_Telemetry_Platform.git
cd Vestibular_Rehab_Telemetry_Platform\backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload
```

### Terminal 2

```
cd Vestibular_Rehab_Telemetry_Platform\frontend
npm install
npm run dev
```

Then open:

```
http://localhost:5173

```

The backend API will be available at:

```
http://127.0.0.1:8000

```
