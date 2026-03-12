# 🕵️‍♂️ Veritas AI - Fake News Detection System

A modern, full-stack web application designed to detect fake news using advanced Machine Learning and Deep Learning algorithms. Built with a premium **React** frontend and a robust **Flask** backend.

## 🚀 Demo
> **[Insert Your Deployed App Link Here]**
> 

## ✨ Features
*   **Dual AI Engines**: Switch between **Logistic Regression (ML)** and **Neural Networks (DL)** for analysis.
*   **Real-time Analysis**: Get instant "Fake" or "Real" verdicts with precise confidence scores.
*   **Smart Training**: Auto-trains on startup with diverse datasets (Politics, Science, Finance).
*   **Premium UI/UX**: Sleek interface with **Dark/Light Mode** support and smooth animations.
*   **Sample Testing**: Built-in "Real" and "Fake" text generators for instant testing.

## 🛠️ Tech Stack
*   **Frontend**: React.js, Vite, Vanilla CSS (Variables, Gradients, Animations).
*   **Backend**: Python, Flask, Flask-CORS.
*   **AI/ML**: Scikit-Learn, TensorFlow/Keras, Pandas, NumPy.

## 📦 Installation & Setup

Follow these steps to run the project locally.

### 1. Backend Setup (The Brain)
The backend handles the AI models and API requests.

```bash
# Navigate to the backend folder
cd backend

# Install dependencies
pip install -r requirements.txt

# Start the server (Automatic model training on first run)
python app.py
```
*Server runs on:* `http://127.0.0.1:5000`

### 2. Frontend Setup (The Interface)
The frontend provides the user interface.

```bash
# Open a NEW terminal and navigate to the frontend folder
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
*App runs on:* `http://localhost:5173`

##  How to Use
1.  **Select a Model**: Choose between **Machine Learning** (faster) or **Deep Learning** (more complex).
2.  **Input Text**: Paste a news article or use the **"Paste Fake/Real Sample"** buttons to auto-fill.
3.  **Analyze**: Click **"Detect Fake News"**.
4.  **View Results**: See the verdict (Fake/Real) and the confidence percentage.
5.  **Toggle Theme**: Use the Moon/Sun icon to switch themes.

## 📂 Project Structure
```
Fake_News/
├── backend/            # Python Flask API & AI Models
│   ├── app.py          # Main application logic
│   └── requirements.txt # Python dependencies
├── frontend/           # React Frontend
│   ├── src/            # Source code
│   └── public/         # Static assets
└── README.md
```

---
*Created by Veritas AI Team*
