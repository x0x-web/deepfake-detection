import os
import cv2
import numpy as np
import tensorflow as tf
from tqdm import tqdm

# Configuration
RAW_DATA_DIR = "raw_data" # Create this folder and put 'real' and 'fake' subfolders inside
PROCESSED_DATA_DIR = "preprocessed_frames"
IMG_SIZE = (128, 128)
FRAMES_PER_VIDEO = 20 # Number of frames to extract per video

def preprocess_frame(frame):
    """
    Resizes and normalizes a frame.
    """
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    frame = cv2.resize(frame, IMG_SIZE)
    frame = frame.astype("float32") / 255.0
    return frame

def extract_and_save_frames(video_path, output_dir, video_name):
    """
    Extracts frames from a video and saves them as .npy files.
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Error opening video: {video_path}")
        return

    frames = []
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    # Calculate step to get evenly distributed frames
    step = max(1, total_frames // FRAMES_PER_VIDEO)

    count = 0
    saved_count = 0
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if count % step == 0 and saved_count < FRAMES_PER_VIDEO:
            processed_frame = preprocess_frame(frame)
            save_path = os.path.join(output_dir, f"{video_name}_frame_{saved_count}.npy")
            np.save(save_path, processed_frame)
            saved_count += 1
        
        count += 1

    cap.release()

def main():
    if not os.path.exists(RAW_DATA_DIR):
        print(f"Error: '{RAW_DATA_DIR}' directory not found.")
        print(f"Please create a folder named '{RAW_DATA_DIR}' and verify it contains 'real' and 'fake' subfolders with your videos.")
        return

    for category in ['real', 'fake']:
        input_path = os.path.join(RAW_DATA_DIR, category)
        output_path = os.path.join(PROCESSED_DATA_DIR, category)

        if not os.path.exists(input_path):
            print(f"Warning: '{input_path}' not found. Skipping {category} category.")
            continue

        print(f"Processing {category} videos...")
        videos = [f for f in os.listdir(input_path) if f.lower().endswith(('.mp4', '.avi', '.mov', '.mkv'))]
        
        for video_file in tqdm(videos):
            video_path = os.path.join(input_path, video_file)
            video_name = os.path.splitext(video_file)[0]
            
            # Create a folder for each video's frames to match train.py expectation
            # train.py expects: preprocessed_frames/real/video_folder/frame.npy
            video_output_dir = os.path.join(output_path, video_name)
            
            extract_and_save_frames(video_path, video_output_dir, video_name)

    print("Data preparation complete.")
    print(f"Processed frames saved to '{PROCESSED_DATA_DIR}'")

if __name__ == "__main__":
    main()
