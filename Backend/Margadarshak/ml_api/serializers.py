from rest_framework import serializers
from .models import MLModel, PredictionLog

class MLModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = MLModel
        fields = ['id', 'name', 'description', 'pkl_file', 'created_at', 'updated_at', 'is_active']
        read_only_fields = ['created_at', 'updated_at']

class PredictionInputSerializer(serializers.Serializer):
    data = serializers.ListField(
        child=serializers.ListField(child=serializers.FloatField()),
        help_text="2D array of input features"
    )

class PredictionOutputSerializer(serializers.Serializer):
    predictions = serializers.ListField(child=serializers.FloatField())
    model_id = serializers.IntegerField()
    timestamp = serializers.DateTimeField()

class PredictionLogSerializer(serializers.ModelSerializer):
    model_name = serializers.CharField(source='model.name', read_only=True)
    
    class Meta:
        model = PredictionLog
        fields = ['id', 'model', 'model_name', 'input_data', 'output_data', 'created_at']