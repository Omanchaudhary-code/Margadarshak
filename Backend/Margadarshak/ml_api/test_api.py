import requests
import json

# Base URL for your Django API
BASE_URL = 'http://localhost:8000/api'

def test_upload_model():
    """Test uploading a PKL file"""
    url = f'{BASE_URL}/models/'
    
    # Example data
    data = {
        'name': 'My ML Model',
        'description': 'A test machine learning model',
        'is_active': True
    }
    
    # Upload your PKL file
    files = {'pkl_file': open('your_model.pkl', 'rb')}
    
    response = requests.post(url, data=data, files=files)
    print(f"Upload response: {response.status_code}")
    print(response.json())
    return response.json()

def test_prediction(model_id):
    """Test making predictions"""
    url = f'{BASE_URL}/models/{model_id}/predict/'
    
    # Example input data (adjust based on your model's requirements)
    data = {
        'data': [
            [1.0, 2.0, 3.0, 4.0],  # First sample
            [2.0, 3.0, 4.0, 5.0],  # Second sample
        ]
    }
    
    response = requests.post(url, json=data)
    print(f"Prediction response: {response.status_code}")
    print(response.json())

def test_model_info(model_id):
    """Test getting model information"""
    url = f'{BASE_URL}/models/{model_id}/model_info/'
    
    response = requests.get(url)
    print(f"Model info response: {response.status_code}")
    print(response.json())

def test_health_check():
    """Test health check endpoint"""
    url = f'{BASE_URL}/models/health_check/'
    
    response = requests.get(url)
    print(f"Health check response: {response.status_code}")
    print(response.json())

if __name__ == '__main__':
    # Run tests
    print("Testing Django PKL Backend...")
    
    # Test health check
    test_health_check()