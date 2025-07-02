#!/usr/bin/env python3
"""
CGPA Prediction Test Script for Django PKL Backend
This script collects user inputs and predicts CGPA using your uploaded model
"""

import requests
import json
import sys

BASE_URL = 'http://127.0.0.1:8000/api'

def check_server():
    """Check if Django server is running"""
    try:
        response = requests.get(f'{BASE_URL}/models/')
        print("✅ Django server is running!")
        return True
    except requests.exceptions.ConnectionError:
        print("❌ Django server is not running.")
        print("Please start it with: python manage.py runserver")
        return False

def get_available_models():
    """Get list of available models"""
    try:
        response = requests.get(f'{BASE_URL}/models/')
        if response.status_code == 200:
            models = response.json()
            active_models = [m for m in models if m['is_active']]
            return active_models
        else:
            print(f"❌ Failed to get models: {response.status_code}")
            return []
    except Exception as e:
        print(f"❌ Error getting models: {str(e)}")
        return []

def get_user_input():
    """Get user input for CGPA prediction"""
    print("\n🎓 CGPA Prediction System")
    print("=" * 40)
    print("Please provide the following information:")
    
    inputs = {}
    
    # Repeated Course (Yes/No)
    while True:
        repeated = input("📚 Have you repeated any course? (yes/no): ").strip().lower()
        if repeated in ['yes', 'y']:
            inputs['repeated_course'] = 1
            break
        elif repeated in ['no', 'n']:
            inputs['repeated_course'] = 0
            break
        else:
            print("Please enter 'yes' or 'no'")
    
    # Attendance Level (Numeric)
    while True:
        try:
            attendance = float(input("📅 Attendance level (0-100): ").strip())
            if 0 <= attendance <= 100:
                inputs['attendance_level'] = attendance
                break
            else:
                print("Please enter a value between 0 and 100")
        except ValueError:
            print("Please enter a valid number")
    
    # Part-time Job (Boolean)
    while True:
        job = input("💼 Do you have a part-time job? (yes/no): ").strip().lower()
        if job in ['yes', 'y']:
            inputs['part_time_job'] = 1
            break
        elif job in ['no', 'n']:
            inputs['part_time_job'] = 0
            break
        else:
            print("Please enter 'yes' or 'no'")
    
    # Motivation Level (Numeric)
    while True:
        try:
            motivation = float(input("🎯 Motivation level (1-10): ").strip())
            if 1 <= motivation <= 10:
                inputs['motivation_level'] = motivation
                break
            else:
                print("Please enter a value between 1 and 10")
        except ValueError:
            print("Please enter a valid number")
    
    # First Generation (Boolean)
    while True:
        first_gen = input("🎓 Are you a first-generation college student? (yes/no): ").strip().lower()
        if first_gen in ['yes', 'y']:
            inputs['first_generation'] = 1
            break
        elif first_gen in ['no', 'n']:
            inputs['first_generation'] = 0
            break
        else:
            print("Please enter 'yes' or 'no'")
    
    # Friend Academic Level (Numeric)
    while True:
        try:
            friend_level = float(input("👥 Friends' academic level (1-10): ").strip())
            if 1 <= friend_level <= 10:
                inputs['friend_academic_level'] = friend_level
                break
            else:
                print("Please enter a value between 1 and 10")
        except ValueError:
            print("Please enter a valid number")
    
    return inputs

def predict_cgpa(model_id, user_inputs):
    """Make CGPA prediction using the model"""
    print("\n🔮 Making CGPA Prediction...")
    
    # Convert inputs to the format expected by the model
    # Order: repeated_course, attendance_level, part_time_job, motivation_level, first_generation, friend_academic_level
    input_data = [
        user_inputs['repeated_course'],
        user_inputs['attendance_level'],
        user_inputs['part_time_job'],
        user_inputs['motivation_level'],
        user_inputs['first_generation'],
        user_inputs['friend_academic_level']
    ]
    
    prediction_payload = {
        "data": [input_data]  # Single prediction
    }
    
    try:
        response = requests.post(
            f'{BASE_URL}/models/{model_id}/predict/',
            json=prediction_payload,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            result = response.json()
            predicted_cgpa = result['predictions'][0]
            
            print("✅ Prediction Successful!")
            print("=" * 40)
            print(f"📊 Predicted CGPA: {predicted_cgpa:.2f}")
            
            # Provide interpretation
            if predicted_cgpa >= 3.5:
                print("🌟 Excellent performance! Keep up the great work!")
            elif predicted_cgpa >= 3.0:
                print("👍 Good performance! You're doing well!")
            elif predicted_cgpa >= 2.5:
                print("📈 Average performance. Consider improving study habits.")
            else:
                print("⚠️  Below average. Consider seeking academic support.")
            
            return predicted_cgpa
            
        else:
            print(f"❌ Prediction failed: {response.status_code}")
            print(f"Error details: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error during prediction: {str(e)}")
        return None

def display_input_summary(inputs):
    """Display a summary of user inputs"""
    print("\n📋 Input Summary:")
    print("=" * 40)
    print(f"📚 Repeated Course: {'Yes' if inputs['repeated_course'] else 'No'}")
    print(f"📅 Attendance Level: {inputs['attendance_level']}%")
    print(f"💼 Part-time Job: {'Yes' if inputs['part_time_job'] else 'No'}")
    print(f"🎯 Motivation Level: {inputs['motivation_level']}/10")
    print(f"🎓 First Generation: {'Yes' if inputs['first_generation'] else 'No'}")
    print(f"👥 Friend Academic Level: {inputs['friend_academic_level']}/10")

def main():
    """Main function"""
    print("🎓 CGPA Prediction System")
    print("=" * 50)
    
    # Check if server is running
    if not check_server():
        input("Press Enter to exit...")
        return
    
    # Get available models
    models = get_available_models()
    if not models:
        print("❌ No active models found. Please upload a model first.")
        input("Press Enter to exit...")
        return
    
    # Select model (use first active model if only one)
    if len(models) == 1:
        selected_model = models[0]
        print(f"✅ Using model: {selected_model['name']}")
    else:
        print("\n📋 Available Models:")
        for i, model in enumerate(models):
            print(f"   {i+1}. {model['name']} (ID: {model['id']})")
        
        while True:
            try:
                choice = int(input(f"\nSelect model (1-{len(models)}): ")) - 1
                if 0 <= choice < len(models):
                    selected_model = models[choice]
                    break
                else:
                    print(f"Please enter a number between 1 and {len(models)}")
            except ValueError:
                print("Please enter a valid number")
    
    model_id = selected_model['id']
    
    # Get user inputs
    user_inputs = get_user_input()
    
    # Display input summary
    display_input_summary(user_inputs)
    
    # Confirm before prediction
    confirm = input("\n🤔 Proceed with prediction? (yes/no): ").strip().lower()
    if confirm not in ['yes', 'y']:
        print("❌ Prediction cancelled.")
        input("Press Enter to exit...")
        return
    
    # Make prediction
    predicted_cgpa = predict_cgpa(model_id, user_inputs)
    
    if predicted_cgpa is not None:
        # Ask if user wants to make another prediction
        print("\n" + "=" * 50)
        another = input("🔄 Would you like to make another prediction? (yes/no): ").strip().lower()
        if another in ['yes', 'y']:
            main()  # Recursive call for another prediction
        else:
            print("👋 Thank you for using the CGPA Prediction System!")
    
    input("Press Enter to exit...")

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Goodbye!")
    except Exception as e:
        print(f"\n❌ Unexpected error: {str(e)}")
        input("Press Enter to exit...")