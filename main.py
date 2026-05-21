import os
from fastapi import FastAPI
from groq import Groq
from dotenv import load_dotenv 

load_dotenv()

app = FastAPI()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_text_from_pdf(file_bytes: bytes) -> str:
    try:
        pdf = PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/analyze")
async def analyze_cvs(job_description: str = Form(...), files: Any = File(...)):
    actual_file = None
    try:
        if isinstance(files, list):
            if len(files) > 0 and isinstance(files[0], list):
                actual_file = files[0][0]
            else:
                actual_file = files[0]
        else:
            actual_file = files
    except Exception:
        raise HTTPException(status_code=400, detail="Fayl oxunarkən xəta yarandı.")

    if not actual_file or not hasattr(actual_file, "read"):
        raise HTTPException(status_code=400, detail="Fayl düzgün ötürülmədi.")

    cv_bytes = await actual_file.read()
    cv_text = extract_text_from_pdf(cv_bytes)

    if not cv_text.strip():
        raise HTTPException(status_code=400, detail="PDF-in daxili boşdur.")

    prompt = f"""
    Sən peşəkar bir HR mütəxəssisisən. CV ilə Vakansiyanı müqayisə et və mütləq yalnız bu JSON formatında cavab qaytar:
    {{
      "score": 85,
      "strengths": "Namizədin uyğun gələn güclü cəhətləri.",
      "gaps": "Namizədin çatışmayan zəif cəhətləri."
    }}

    Vakansiya Tələbləri:
    {job_description}

    CV Mətni:
    {cv_text}
    """

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "Sən yalnız təmiz JSON formatında cavab verən HR asistansan. Cavabında JSON strukturundan kənar heç bir mətn, şərh və ya markdown (```json) olmamalıdır."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2
        )
        
        raw_content = response.choices[0].message.content.strip()
        
        if raw_content.startswith("```"):
            raw_content = raw_content.split("```")[1]
            if raw_content.startswith("json"):
                raw_content = raw_content[4:]
                
        return json.loads(raw_content.strip())
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))