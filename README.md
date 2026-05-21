# CV Ranker & Analysis System

An automated, AI-powered recruitment assistant that parses PDF resumes, compares them against specified job descriptions, and provides deep analytical feedback along with a matching score.

## Features

- **Automated PDF Parsing**: Extracts text cleanly from uploaded resume files.
- **AI-Driven Evaluation**: Leverages advanced Large Language Models (LLM) via Groq to perform semantic screening.
- **Structured Insights**: Instantly generates an overall match rating, core candidate strengths, and critical gap assessments.
- **Localization Ready**: Specially optimized to process resumes and job descriptions while delivering all analysis reports in Azerbaijani.
- **Production-Ready Architecture**: Built with a decoupled design utilizing a modern frontend interface and a high-performance Python backend.

---

## Language & Localization Support

The application features a localized user interface and AI backend configured for regional human resource workflows:
- **UI Language**: Azerbaijani (`Analiz Hesabatı və Reytinq`, `Güclü tərəflər`, `Potensial boşluqlar`).
- **AI Processing**: Full multi-lingual comprehension capability, specifically prompts and fine-tuned structured outputs in Azerbaijani for localized screening alignment.

---

## Architecture Overview

The application consists of two main layers:

1. **Frontend**: A user-friendly web interface where recruiters paste job descriptions, upload candidate CVs, and view real-time analysis reports.
2. **Backend**: A FastAPI server that handles file reception, processes PDF data, coordinates with the AI provider, and structures JSON payloads.

---

## Tech Stack

### Backend
- **Python**: Core runtime environment.
- **FastAPI**: High-performance web framework for building APIs.
- **Uvicorn**: Lightning-fast ASGI server implementation.
- **PyPDF**: Robust PDF serialization and text extraction library.
- **Groq SDK**: Official integration client for fast inference using open-weights LLMs.

### Infrastructure & External Services
- **Groq Cloud API**: Utilizes the highly optimized llama-3.3-70b-versatile model for structured HR diagnostics.

---

## Installation & Setup

### Prerequisites
Ensure you have Python 3.9+ installed on your local machine.

### 1. Clone the Repository
git clone https://github.com/khadijaumud/cv-ranker.git
cd cv-ranker

### 2. Install Required Dependencies
Install all required backend packages using pip:
pip install fastapi uvicorn pypdf groq python-multipart

### 3. Configure Environment Variables
Open the main.py file and place your API key from the Groq Console into the client initialization:
client = Groq(api_key="")

### 4. Start the Backend Server
Launch the local development server using Uvicorn:
python -m uvicorn main:app --reload --port 8000

The backend will now be actively listening for incoming payloads at http://127.0.0.1:8000.

---

## API Documentation

### Analyze Resume
Evaluates a candidate's resume based on specific job criteria.

- **Endpoint**: /analyze
- **Method**: POST
- **Content-Type**: multipart/form-data

#### Request Parameters
| Parameter | Type | Description |
| :--- | :--- | :--- |
| job_description | string (Form field) | The requirements, responsibilities, and stack details of the role. |
| files | file (Binary) | The candidate's resume submitted strictly in PDF format. |

#### Successful Response Payload (200 OK)
{
  "score": 92,
  "strengths": "Namizəd tələb olunan texnologiyaları (React, Python, FastAPI) dərindən bilir. Komanda ilə işləmə bacarığı yüksəkdir.",
  "gaps": "Böyük həcmli verilənlər bazaları (Big Data) və bulud sistemləri (AWS/Azure) istiqamətində təcrübəsi bir qədər azdır."
}

---
