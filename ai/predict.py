import numpy as np
import os
import tensorflow as tf
from utils import preprocess_frame, extract_frames_generator
from model import build_model

# Global variable to hold the model instance to avoid reloading it on every request
_MODEL = None

def load_trained_model(model_path):
    """
    Loads the trained model weights. 
    If model_path exists, loads it. Otherwise builds a new model (untrained).
    """
    global _MODEL
    if _MODEL is None:
        # Build structure first
        _MODEL = build_model()
        
        if os.path.exists(model_path):
            print(f"Loading weights from {model_path}...")
            try:
                _MODEL.load_weights(model_path)
                print("Model weights loaded successfully.")
            except Exception as e:
                print(f"Error loading weights: {e}")
                print("Using untrained model.")
        else:
            print(f"Model file not found at {model_path}. Using untrained model.")
    
    return _MODEL

def predict_video(model, video_path, frames_per_second=1):
    """
    Runs prediction on a video file.
    Returns a dictionary with the result and confidence score.
    """
    predictions = []
    
    try:
        for frame in extract_frames_generator(video_path, frames_per_second):
            pre = preprocess_frame(frame)
            pre = np.expand_dims(pre, axis=0)
            
            # Predict
            pred = model.predict(pre, verbose=0)[0][0]
            predictions.append(pred)
    except Exception as e:
        print(f"Error processing video: {e}")
        return {"error": str(e)}

    if not predictions:
        return {"error": "No frames could be extracted from the video."}

    avg_pred = np.mean(predictions)
    
    # Thresholding
    label = "FAKE" if avg_pred > 0.5 else "REAL"
    
    return {
        "result": label,
        "score": float(avg_pred),
        "frames_processed": len(predictions)
    }
