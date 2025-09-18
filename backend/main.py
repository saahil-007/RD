

from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
import os
import json
from dotenv import load_dotenv

from services import AnalysisService
from config import settings
from utils import validate_image_file, create_safe_filename, cleanup_temp_file

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Create upload directory
settings.create_upload_dir()

# Initialize analysis service
analysis_service = AnalysisService()

@app.route('/analyze', methods=['POST'])
def analyze_image_route():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    image_file = request.files['image']
    
    # Create safe filename and save
    safe_filename = create_safe_filename(image_file.filename)
    image_path = os.path.join(settings.UPLOAD_FOLDER, safe_filename)
    image_file.save(image_path)

    def generate():
        try:
            # Start with immediate response to prevent hanging
            yield f"data: {json.dumps({'progress': 0, 'description': 'Initializing...', 'estimated_remaining_time': 20})}\n\n"
            
            for result_chunk in analysis_service.analyze_image(image_path):
                yield f"data: {json.dumps(result_chunk)}\n\n"
        except Exception as e:
            print(f"Error in analysis route: {e}")
            yield f"data: {json.dumps({'error': f'Error analyzing image: {e}'})}\n\n"
        finally:
            # Clean up the saved image
            cleanup_temp_file(image_path)

    response = Response(stream_with_context(generate()), mimetype='text/event-stream')
    response.headers['Cache-Control'] = 'no-cache'
    response.headers['Connection'] = 'keep-alive'
    return response

if __name__ == '__main__':
    app.run(debug=settings.DEBUG, host=settings.HOST, port=settings.PORT)