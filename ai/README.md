# Deepfake Detection API

This project converts the Deepfake Detection Jupyter Notebook into a Flask API.

## Project Structure

- `app.py`: The Flask application entry point.
- `model.py`: Defines the MobileNetV2 model architecture.
- `predict.py`: Handles model loading and inference logic.
- `utils.py`: Contains video processing helper functions.
- `requirements.txt`: List of Python dependencies.

## Setup

1.  **Install Python 3.8+** if not already installed.
2.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

## Running the API

1.  **Start the server**:
    ```bash
    python app.py
    ```
    The server will start on `http://localhost:5000`.

2.  **Check Health**:
    Open `http://localhost:5000/health` in your browser. You should see:
    ```json
    {"status": "running"}
    ```

## Usage

Send a POST request to `/predict` with a video file.

### Using curl

```bash
curl -X POST -F "video=@/path/to/your/video.mp4" http://localhost:5000/predict
```

### Using Node.js (Example)

```javascript
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const form = new FormData();
form.append('video', fs.createReadStream('path/to/video.mp4'));

axios.post('http://localhost:5000/predict', form, {
  headers: {
    ...form.getHeaders()
  }
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error(error);
});
```

## Model Weights

The API expects a trained model file named `best_model.keras` in the same directory.
- If the file is found, it will be loaded.
- If not found, the API will use an **untrained** model structure (for testing purposes only). Predictions will be random.

To use the actual detection capabilities, place your trained `best_model.keras` file in this directory.
