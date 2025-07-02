from django.db import models
import pickle
import joblib
import os
import numpy as np
# Create your models here.

class MLModel(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    pkl_file = models.FileField(upload_to='models/')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.name
    
    def load_model(self):
        """Load the pickled model using joblib"""
        try:
            return joblib.load(self.pkl_file.path)
        except Exception as e:
            raise Exception(f"Error loading model: {str(e)}")
    
    def predict(self, data):
        model = self.load_model()
        try:
            predictions = model.predict(data)
            
            # Define min and max raw predicted values you expect (tune these)
            min_pred = 0     # e.g., minimum raw prediction possible
            max_pred = 20    # e.g., maximum raw prediction possible observed
            
            # Scale predictions linearly to 0-4 range
            scaled = 4 * (predictions - min_pred) / (max_pred - min_pred)
            
            # Clip to ensure bounds
            scaled_clipped = np.clip(scaled, 0, 4)
            
            return scaled_clipped.tolist()
        except Exception as e:
            raise Exception(f"Error making predictions: {str(e)}")

class PredictionLog(models.Model):
    model = models.ForeignKey(MLModel, on_delete=models.CASCADE)
    input_data = models.JSONField()
    output_data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Prediction for {self.model.name} at {self.created_at}"
