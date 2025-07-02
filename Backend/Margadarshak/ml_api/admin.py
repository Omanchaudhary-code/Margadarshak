from django.contrib import admin
from .models import MLModel, PredictionLog
# Register your models here.
@admin.register(MLModel)
class MLModelAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_active', 'created_at', 'updated_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(PredictionLog)
class PredictionLogAdmin(admin.ModelAdmin):
    list_display = ['model', 'created_at']
    list_filter = ['model', 'created_at']
    readonly_fields = ['created_at']
    
    def has_add_permission(self, request):
        return False  # Prevent manual creation of prediction logs