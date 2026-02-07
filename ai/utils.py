import cv2
import numpy as np
import os

def preprocess_frame(frame, img_size=(128, 128)):
    """
    Preprocesses a single frame: resize and normalize.
    """
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    frame = cv2.resize(frame, img_size)
    frame = frame.astype("float32") / 255.0
    return frame

def extract_frames_generator(video_path, frames_per_second=1):
    """
    Yields frames from a video at a specified frame rate.
    """
    if not os.path.exists(video_path):
        raise FileNotFoundError(f"Video file not found: {video_path}")

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
         raise ValueError(f"Could not open video file: {video_path}")

    fps = cap.get(cv2.CAP_PROP_FPS)
    
    # Handle case where fps is 0 or nan (corrupt video metadata)
    if fps <= 0 or np.isnan(fps):
        fps = 30 # Default assumption
        
    step = int(fps / frames_per_second)
    if step < 1:
        step = 1

    frame_index = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if frame_index % step == 0:
            yield frame

        frame_index += 1

    cap.release()
