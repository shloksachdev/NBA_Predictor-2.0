from flask import Flask, render_template, request, jsonify
import pandas as pd
import numpy as np
import joblib

app = Flask(__name__)

# Load Data and Models globally
try:
    df = pd.read_csv('data/final_training_data_engineered.csv')
    model = joblib.load('models/best_logreg_model.pkl')
    scaler = joblib.load('models/scaler.pkl')
except Exception as e:
    print(f"Error loading assets: {e}")
    df, model, scaler = None, None, None

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/predict_date', methods=['POST'])
def predict_date():
    if df is None or model is None or scaler is None:
        return jsonify({'error': 'Server not properly initialized'}), 500
        
    date_str = request.json.get('date')
    if not date_str:
        return jsonify({'error': 'Please provide a date'}), 400
        
    try:
        games = df[df['HOME_GAME_DATE'] == date_str]
        if games.empty:
            return jsonify({'games': []})
            
        feature_cols = [col for col in df.columns if col not in ['HOME_TEAM_ABBREVIATION', 'AWAY_TEAM_ABBREVIATION', 'GAME_ID', 'HOME_GAME_DATE', 'AWAY_GAME_DATE', 'HOME_MATCHUP', 'AWAY_MATCHUP', 'HOME_WL', 'AWAY_WL']]
        
        X = games[feature_cols]
        X_scaled = scaler.transform(X)
        probs = model.predict_proba(X_scaled)
        
        results = []
        for i, (_, row) in enumerate(games.iterrows()):
            home_stats = {}
            away_stats = {}
            for col in feature_cols:
                if col.startswith('HOME_'):
                    base_name = col.replace('HOME_', '')
                    home_stats[base_name] = float(row[col])
                elif col.startswith('AWAY_'):
                    base_name = col.replace('AWAY_', '')
                    away_stats[base_name] = float(row[col])

            results.append({
                'home_team': row['HOME_TEAM_ABBREVIATION'],
                'away_team': row['AWAY_TEAM_ABBREVIATION'],
                'home_prob': float(probs[i][1] * 100),
                'away_prob': float(probs[i][0] * 100),
                'home_stats': home_stats,
                'away_stats': away_stats
            })
            
        return jsonify({'games': results})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
