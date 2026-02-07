import os
import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
from model import build_model
from tqdm import tqdm

# Constants
IMG_SIZE = (128, 128, 3)
BATCH_SIZE = 32
EPOCHS = 20
DATA_DIR = "preprocessed_frames" # Expected directory structure: preprocessed_frames/real and preprocessed_frames/fake

def load_data(base_dir):
    """
    Loads preprocessed .npy frames from the directory.
    """
    X = []
    y = []

    if not os.path.exists(base_dir):
        print(f"Data directory '{base_dir}' not found. Please extract and preprocess frames first.")
        return np.array([]), np.array([])

    for label_name in ['real', 'fake']:
        label_dir = os.path.join(base_dir, label_name)
        if not os.path.exists(label_dir):
            continue
            
        label_value = 0 if label_name == 'real' else 1
        
        print(f"Loading {label_name} data...")
        for video_folder in tqdm(os.listdir(label_dir)):
            video_path = os.path.join(label_dir, video_folder)
            if not os.path.isdir(video_path):
                continue

            for frame_file in os.listdir(video_path):
                if frame_file.endswith('.npy'):
                    frame_path = os.path.join(video_path, frame_file)
                    try:
                        frame = np.load(frame_path)
                        X.append(frame)
                        y.append(label_value)
                    except Exception as e:
                        print(f"Error loading {frame_path}: {e}")

    return np.array(X), np.array(y)

def data_generator(X, y, batch_size):
    n = len(X)
    idx = np.arange(n)
    while True:
        np.random.shuffle(idx)
        for i in range(0, n, batch_size):
            batch_idx = idx[i:i+batch_size]
            yield X[batch_idx], y[batch_idx]

def train():
    print("Loading data...")
    X, y = load_data(DATA_DIR)
    
    if len(X) == 0:
        print("No data found. Exiting training.")
        return

    print(f"Data loaded: {X.shape[0]} frames")
    
    # Split data
    X_train, X_val, y_train, y_val = train_test_split(
        X, y, test_size=0.2, stratify=y, random_state=42
    )
    
    # Create datasets
    train_ds = tf.data.Dataset.from_generator(
        lambda: data_generator(X_train, y_train, BATCH_SIZE),
        output_types=(tf.float32, tf.float32),
        output_shapes=((None, *IMG_SIZE), (None,))
    ).prefetch(2)
    
    val_ds = tf.data.Dataset.from_generator(
        lambda: data_generator(X_val, y_val, BATCH_SIZE),
        output_types=(tf.float32, tf.float32),
        output_shapes=((None, *IMG_SIZE), (None,))
    ).prefetch(2)

    # Build model
    model = build_model()
    model.summary()

    # Callbacks
    callbacks = [
        ModelCheckpoint("best_model.keras", save_best_only=True, monitor="val_loss"),
        EarlyStopping(patience=5, restore_best_weights=True),
        ReduceLROnPlateau(factor=0.5, patience=2)
    ]

    # Train
    history = model.fit(
        train_ds,
        validation_data=val_ds,
        steps_per_epoch=len(X_train) // BATCH_SIZE,
        validation_steps=len(X_val) // BATCH_SIZE,
        epochs=EPOCHS,
        callbacks=callbacks
    )
    
    print("Training finished. Model saved to best_model.keras")

if __name__ == "__main__":
    train()
