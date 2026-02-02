from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable CORS for Frontend access

MODEL_PATH = 'model.pkl'
model = None

def load_model():
    global model
    try:
        with open(MODEL_PATH, 'rb') as f:
            model = pickle.load(f)
        print("Model loaded successfully.")
    except Exception as e:
        print(f"Error loading model: {e}")

@app.route('/ml_score', methods=['POST'])
def ml_score():
    global model
    print(f"DEBUG: ml_score called. model is {model}")
    if not model:
        print("DEBUG: Model is None, attempting to load...")
        load_model()
        if not model:
             return jsonify({'error': 'Model not loaded'}), 500

    try:
        data = request.json
        
        # Expected features structure
        # Ensure we map incoming JSON keys to the DataFrame columns expected by the model
        input_data = {
            'unanswered_messages_hours': [data.get('unanswered_messages_hours', 0)],
            'incidents_last_7d': [data.get('incidents_last_7d', 0)],
            'routine_breaks_last_7d': [data.get('routine_breaks_last_7d', 0)],
            'lives_alone': [1 if data.get('lives_alone') else 0],
            'mobility_limitations': [1 if data.get('mobility_limitations') else 0],
            'cognitive_difficulty_flag': [1 if data.get('cognitive_difficulty_flag') else 0],
            'incidents_severity_max_7d': [data.get('incidents_severity_max_7d', 'none') or 'none']
        }
        
        df = pd.DataFrame(input_data)
        
        # Predict Probability
        probability = model.predict_proba(df)[0][1] # Probability of Class 1 (High Priority)
        
        # Determine Risk Level
        risk_level = 'BAJA'
        if probability > 0.7:
            risk_level = 'ALTA'
        elif probability > 0.4:
            risk_level = 'MEDIA'
            
        # Extract Top Contributors (Simplified Proxy)
        # Since we use a pipeline, extracting exact feature importance per instance is complex.
        # We will use a heuristic based on the global coefficients and the input values.
        
        # 1. Access Classifier Coefficients
        classifier = model.named_steps['classifier']
        preprocessor = model.named_steps['preprocessor']
        
        # Get feature names after one-hot encoding
        ohe_features = preprocessor.named_transformers_['cat'].get_feature_names_out(input_features=['incidents_severity_max_7d'])
        all_features = ['unanswered_messages_hours', 'incidents_last_7d', 'routine_breaks_last_7d', 
                        'lives_alone', 'mobility_limitations', 'cognitive_difficulty_flag'] + list(ohe_features)
        
        coefs = classifier.coef_[0]
        
        # For simplicity in this prototype, we'll just return static "Top Contributors" 
        # based on what variables are non-zero/high in the input, 
        # weighted loosely by general logic (in a real prod app, use SHAP).
        contributors = []
        if input_data['unanswered_messages_hours'][0] > 12:
            contributors.append('Horas sin respuesta')
        if input_data['incidents_last_7d'][0] > 0:
            contributors.append('Incidencias recientes')
        if input_data['routine_breaks_last_7d'][0] > 0:
            contributors.append('Rupturas de rutina')
        if input_data['lives_alone'][0] == 1:
            contributors.append('Vive solo/a')
        
        top_contributors = contributors[:3] # Take top 3
        
        return jsonify({
            'risk_score': round(probability, 2),
            'risk_level': risk_level,
            'top_contributors': top_contributors
        })

    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    load_model()
    app.run(port=5001, debug=True)
