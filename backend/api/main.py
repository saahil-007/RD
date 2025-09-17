from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
try:
    from .image_processing import process_image
    from .agents import TutorialAgent, CulturalAgent, SuggestionAgent
    from .kolam_design_principles import KolamDesignPrinciples
    from .kolam_recreator import KolamRecreator, generate_traditional_patterns
    from .heritage_data import heritage_data
    from .new_analysis import generate_analysis_report_stream
except ImportError:
    # Handle when running as script (not as package)
    from image_processing import process_image
    from agents import TutorialAgent, CulturalAgent, SuggestionAgent
    from kolam_design_principles import KolamDesignPrinciples
    from kolam_recreator import KolamRecreator, generate_traditional_patterns
    from heritage_data import heritage_data
    from new_analysis import generate_analysis_report_stream

import numpy as np
import cv2
import json
import tempfile
import base64
from io import BytesIO

class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NumpyEncoder, self).default(obj)

from new_analysis import generate_analysis_report_stream
import os

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

import traceback

@app.post("/new_analyze")
async def new_analyze_image(file: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
            tmp.write(await file.read())
            file_path = tmp.name

        async def event_stream():
            try:
                for result in generate_analysis_report_stream(file_path):
                    yield f"data: {json.dumps(result, cls=NumpyEncoder)}\n\n"
            finally:
                os.remove(file_path)
        
        return StreamingResponse(event_stream(), media_type="text/event-stream")
    except Exception as e:
        print(traceback.format_exc())
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

@app.post("/analyze_design_principles")
async def analyze_design_principles(file: UploadFile = File(...)):
    """
    Analyze the mathematical and cultural design principles of a Kolam image.
    """
    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Initialize the design principles analyzer
        analyzer = KolamDesignPrinciples(image_array=img)
        
        # Generate comprehensive analysis
        analysis = analyzer.generate_comprehensive_analysis()
        
        return {
            "status": "success",
            "analysis": analysis,
            "design_principles": {
                "mathematical_properties": {
                    "grid_structure": analysis.get('grid_structure', {}),
                    "symmetry_operations": analysis.get('symmetry_operations', {}),
                    "geometric_patterns": analysis.get('geometric_patterns', {})
                },
                "topological_properties": {
                    "connectivity": analysis.get('path_connectivity', {}),
                    "cultural_constraints": analysis.get('cultural_constraints', {})
                },
                "summary": analysis.get('summary', {})
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/recreate_kolam")
async def recreate_kolam(request: dict):
    """
    Recreate a Kolam design based on provided parameters or analysis.
    """
    try:
        recreator = KolamRecreator(width=600, height=600)
        
        if "pattern_type" in request:
            # Generate predefined pattern
            pattern_type = request["pattern_type"]
            design = recreator.generate_simple_kolam(pattern_type)
        elif "analysis" in request:
            # Recreate from analysis
            analysis = request["analysis"]
            design = recreator.recreate_from_analysis(analysis)
        else:
            # Generate random pattern
            design = recreator.generate_simple_kolam("random")
        
        # Convert to base64 for JSON response
        _, buffer = cv2.imencode('.png', design)
        img_base64 = base64.b64encode(buffer).decode('utf-8')
        
        return {
            "status": "success",
            "design_image": img_base64,
            "design_properties": {
                "width": design.shape[1],
                "height": design.shape[0],
                "pattern_type": request.get("pattern_type", "custom")
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recreation failed: {str(e)}")

@app.get("/generate_traditional_patterns")
async def get_traditional_patterns():
    """
    Generate a collection of traditional Kolam patterns.
    """
    try:
        patterns = generate_traditional_patterns()
        
        # Convert patterns to base64
        pattern_data = {}
        for name, pattern in patterns.items():
            _, buffer = cv2.imencode('.png', pattern)
            img_base64 = base64.b64encode(buffer).decode('utf-8')
            pattern_data[name] = {
                "image": img_base64,
                "description": f"Traditional {name.replace('_', ' ').title()} pattern"
            }
        
        return {
            "status": "success",
            "patterns": pattern_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pattern generation failed: {str(e)}")

@app.post("/compare_designs")
async def compare_designs(file1: UploadFile = File(...), file2: UploadFile = File(...)):
    """
    Compare two Kolam designs and analyze their similarities and differences.
    """
    try:
        # Read both images
        contents1 = await file1.read()
        contents2 = await file2.read()
        
        nparr1 = np.frombuffer(contents1, np.uint8)
        nparr2 = np.frombuffer(contents2, np.uint8)
        
        img1 = cv2.imdecode(nparr1, cv2.IMREAD_COLOR)
        img2 = cv2.imdecode(nparr2, cv2.IMREAD_COLOR)
        
        # Analyze both designs
        analyzer1 = KolamDesignPrinciples(image_array=img1)
        analyzer2 = KolamDesignPrinciples(image_array=img2)
        
        analysis1 = analyzer1.generate_comprehensive_analysis()
        analysis2 = analyzer2.generate_comprehensive_analysis()
        
        # Compare design principles
        comparison = {
            "symmetry_similarity": _compare_symmetry(analysis1, analysis2),
            "grid_similarity": _compare_grid_structure(analysis1, analysis2),
            "complexity_comparison": _compare_complexity(analysis1, analysis2),
            "cultural_authenticity_comparison": _compare_cultural_authenticity(analysis1, analysis2)
        }
        
        return {
            "status": "success",
            "design1_analysis": analysis1,
            "design2_analysis": analysis2,
            "comparison": comparison
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Comparison failed: {str(e)}")

def _compare_symmetry(analysis1: dict, analysis2: dict) -> dict:
    """Compare symmetry properties of two designs."""
    sym1 = analysis1.get('symmetry_operations', {})
    sym2 = analysis2.get('symmetry_operations', {})
    
    return {
        "similarity_score": abs(sym1.get('max_symmetry', 0) - sym2.get('max_symmetry', 0)),
        "type_match": sym1.get('symmetry_type') == sym2.get('symmetry_type')
    }

def _compare_grid_structure(analysis1: dict, analysis2: dict) -> dict:
    """Compare grid structures of two designs."""
    grid1 = analysis1.get('grid_structure', {})
    grid2 = analysis2.get('grid_structure', {})
    
    return {
        "grid_type_match": grid1.get('grid_type') == grid2.get('grid_type'),
        "size_similarity": 1 - abs(grid1.get('num_dots', 0) - grid2.get('num_dots', 0)) / max(grid1.get('num_dots', 1), grid2.get('num_dots', 1))
    }

def _compare_complexity(analysis1: dict, analysis2: dict) -> dict:
    """Compare complexity levels of two designs."""
    summary1 = analysis1.get('summary', {})
    summary2 = analysis2.get('summary', {})
    
    return {
        "complexity_level_match": summary1.get('complexity_level') == summary2.get('complexity_level'),
        "complexity_difference": f"{summary1.get('complexity_level', 'unknown')} vs {summary2.get('complexity_level', 'unknown')}"
    }

def _compare_cultural_authenticity(analysis1: dict, analysis2: dict) -> dict:
    """Compare cultural authenticity of two designs."""
    cultural1 = analysis1.get('cultural_constraints', {})
    cultural2 = analysis2.get('cultural_constraints', {})
    
    score1 = cultural1.get('cultural_authenticity_score', 0)
    score2 = cultural2.get('cultural_authenticity_score', 0)
    
    return {
        "authenticity_difference": abs(score1 - score2),
        "both_authentic": score1 > 0.7 and score2 > 0.7,
        "score_comparison": f"{score1:.2f} vs {score2:.2f}"
    }