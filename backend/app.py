from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.optimizers import Adam
import os

app = Flask(__name__)
CORS(app)

# Global variables to hold models and vectorizer
vectorizer = None
ml_model = None
dl_model = None

# Sample data to train models if no model exists
# In a real scenario, we would load a large dataset
def train_dummy_models():
    global vectorizer, ml_model, dl_model
    
    print("Training dummy models...")
    
    data = [
        ("The earth is flat and the moon is cheese.", 1), # Fake
        ("Scientists confirm the earth is round.", 0),    # Real
        ("Aliens have landed in New York City today.", 1), # Fake
        ("Aliens have landed in New York City and are distributing free gold bars to everyone! The government has confirmed that these extraterrestrial visitors are friendly and plan to stay for tea. NASA scientists say the gold is made of a special space alloy.", 1), # Fake
        ("Stock market closes higher today.", 0),          # Real
        ("Government announces new tax cuts for the rich.", 0), # Real - plausible
        ("President declares water is now illegal.", 1),   # Fake
        ("New study shows chocolate helps you live forever.", 1), # Fake
        ("Local election results are in.", 0),             # Real
        ("NASA launches new satellite to monitor climate change.", 0), # Real
        ("Doctors recommend eating rocks for better digestion.", 1), # Fake
        ("Government creates new department for time travel regulation.", 1), # Fake
        ("Study finds that drinking water is the leading cause of death.", 1), # Fake
        ("New legislation passes to increase funding for public schools.", 0), # Real
        ("Celebrity chef claims he can cook pasta with his mind.", 1), # Fake
        ("Major city announces plans to become carbon neutral by 2030.", 0), # Real
        ("Tech giant releases new smartphone with holographic display.", 1), # Fake
        ("Researchers develop new vaccine for common cold.", 0) # Real - plausible future/real
    ]
    df = pd.DataFrame(data, columns=['text', 'label'])
    
    # Vectorization
    vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)
    X = vectorizer.fit_transform(df['text']).toarray()
    y = df['label'].values
    
    # Train ML Model (Logistic Regression)
    ml_model = LogisticRegression()
    ml_model.fit(X, y)
    
    # Train DL Model (Simple Neural Network)
    dl_model = Sequential([
        Dense(16, input_dim=X.shape[1], activation='relu'),
        Dropout(0.2),
        Dense(8, activation='relu'),
        Dense(1, activation='sigmoid')
    ])
    dl_model.compile(loss='binary_crossentropy', optimizer=Adam(learning_rate=0.01), metrics=['accuracy'])
    dl_model.fit(X, y, epochs=50, verbose=0, batch_size=2)
    
    print("Models trained successfully on dummy data.")

# Initialize models
train_dummy_models()

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    text = data.get('text', '')
    model_type = data.get('model_type', 'ml') # 'ml' or 'dl'
    
    if not text:
        return jsonify({'error': 'No text provided'}), 400
        
    # Preprocess
    if vectorizer:
        text_vectorized = vectorizer.transform([text]).toarray()
    else:
        return jsonify({'error': 'Models not loaded'}), 500
        
    result = {}
    
    if model_type == 'ml':
        prediction = ml_model.predict(text_vectorized)[0]
        probability = ml_model.predict_proba(text_vectorized)[0][1]
        result['prediction'] = 'Fake' if prediction == 1 else 'Real'
        result['confidence'] = float(probability) if prediction == 1 else float(1 - probability)
        result['model_used'] = 'Machine Learning (Logistic Regression)'
        
    elif model_type == 'dl':
        probability = dl_model.predict(text_vectorized)[0][0]
        prediction = 1 if probability > 0.5 else 0
        result['prediction'] = 'Fake' if prediction == 1 else 'Real'
        result['confidence'] = float(probability) if prediction == 1 else float(1 - probability)
        result['model_used'] = 'Deep Learning (Neural Network)'
        
    return jsonify(result)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
