from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.parsers import JSONParser
import numpy as np
import json
# Create your views here.
from .models import MLModel, PredictionLog
from .serializers import (
    MLModelSerializer, 
    PredictionInputSerializer, 
    PredictionOutputSerializer,
    PredictionLogSerializer
)

class MLModelViewSet(viewsets.ModelViewSet):
    queryset = MLModel.objects.all()
    serializer_class = MLModelSerializer
    parser_classes = (JSONParser, MultiPartParser, FormParser)
    
    def get_queryset(self):
        queryset = MLModel.objects.all()
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        return queryset.order_by('-created_at')
    
    @action(detail=True, methods=['post'])
    def predict(self, request, pk=None):
        """Make predictions using the model"""
        model = get_object_or_404(MLModel, pk=pk, is_active=True)
        
        # Validate input data
        input_serializer = PredictionInputSerializer(data=request.data)
        if not input_serializer.is_valid():
            return Response(
                {'error': 'Invalid input data', 'details': input_serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Convert input to numpy array
            input_data = np.array(input_serializer.validated_data['data'])
            
            # Make predictions
            predictions = model.predict(input_data)
            
            # Log the prediction
            PredictionLog.objects.create(
                model=model,
                input_data=input_serializer.validated_data['data'],
                output_data=predictions
            )
            
            # Return predictions
            output_data = {
                'predictions': predictions,
                'model_id': model.id,
                'timestamp': timezone.now()
            }
            
            output_serializer = PredictionOutputSerializer(output_data)
            return Response(output_serializer.data, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Prediction failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['get'])
    def model_info(self, request, pk=None):
        """Get detailed information about the model"""
        model = get_object_or_404(MLModel, pk=pk)
        
        try:
            loaded_model = model.load_model()
            
            # Try to extract model information
            model_info = {
                'name': model.name,
                'description': model.description,
                'type': type(loaded_model).__name__,
                'module': type(loaded_model).__module__,
                'created_at': model.created_at,
                'file_size': model.pkl_file.size,
            }
            
            # Try to get additional model attributes if available
            if hasattr(loaded_model, 'feature_importances_'):
                model_info['has_feature_importances'] = True
            if hasattr(loaded_model, 'n_features_in_'):
                model_info['n_features'] = loaded_model.n_features_in_
            if hasattr(loaded_model, 'classes_'):
                model_info['classes'] = loaded_model.classes_.tolist()
            
            return Response(model_info, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Could not load model info: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def health_check(self, request):
        """Check if all active models can be loaded"""
        active_models = MLModel.objects.filter(is_active=True)
        results = []
        
        for model in active_models:
            try:
                model.load_model()
                results.append({
                    'id': model.id,
                    'name': model.name,
                    'status': 'healthy'
                })
            except Exception as e:
                results.append({
                    'id': model.id,
                    'name': model.name,
                    'status': 'error',
                    'error': str(e)
                })
        
        return Response({
            'total_models': len(results),
            'healthy_models': len([r for r in results if r['status'] == 'healthy']),
            'models': results
        })

class PredictionLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PredictionLog.objects.all()
    serializer_class = PredictionLogSerializer
    
    def get_queryset(self):
        queryset = PredictionLog.objects.select_related('model')
        model_id = self.request.query_params.get('model_id', None)
        if model_id is not None:
            queryset = queryset.filter(model_id=model_id)
        return queryset.order_by('-created_at')