import os
from flask import Flask, request, jsonify
from predict import load_trained_model, predict_video

app = Flask(__name__)

# Configuration
MODEL_PATH = "best_model.keras" # Path where the trained model is expected
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load model at startup
print("Initializing model...")
model = load_trained_model(MODEL_PATH)
print("Model initialized.")

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "running"})

@app.route('/predict', methods=['POST'])
def predict():
    if 'video' not in request.files:
        return jsonify({"error": "No video file provided"}), 400
    
    video_file = request.files['video']
    if video_file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if video_file:
        # Save file temporarily
        filepath = os.path.join(UPLOAD_FOLDER, video_file.filename)
        video_file.save(filepath)
        
        try:
            # Run prediction
            result = predict_video(model, filepath)
            
            # Cleanup
            if os.path.exists(filepath):
                os.remove(filepath)
                
            return jsonify(result)
            
        except Exception as e:
            # Cleanup in case of error
            if os.path.exists(filepath):
                os.remove(filepath)
            return jsonify({"error": str(e)}), 500

    return jsonify({"error": "Unknown error"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
