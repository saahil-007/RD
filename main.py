from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .image_processing import process_image
from .agents import TutorialAgent, CulturalAgent, SuggestionAgent
import numpy as np
import cv2
from .heritage_data import heritage_data

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        analysis_data = process_image(img)
        
        tutorial_agent = TutorialAgent(analysis_data)
        tutorial = tutorial_agent.generate_drawing_steps()
        
        cultural_agent = CulturalAgent(analysis_data)
        insights = cultural_agent.analyze()
        
        return {"drawing_data": analysis_data, "tutorial": tutorial, "insights": insights}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/suggestions")
async def get_suggestions(analysis_report: dict):
    try:
        suggestion_agent = SuggestionAgent(analysis_report)
        suggestions = suggestion_agent.generate_suggestions()
        return {"suggestions": suggestions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/heritage")
async def get_heritage_data():
    return heritage_data