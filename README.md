# 📈 HOOPCAST | NBA Predictor 2.0

**Live Demo:** [https://hoopcast-otf0.onrender.com](https://hoopcast-otf0.onrender.com)

![HOOPCAST Prediction Engine](screenshot.png)

*A production-ready full-stack Machine Learning Web Application that predicts the outcome of NBA games using a custom-trained algorithm and real-time Exponential Moving Averages.*

---

## 🚀 Features

- **Machine Learning Core**: Achieves a mathematically proven **65.4% engineered accuracy rate** (outperforming the 62.6% baseline) across a robust 5-year backtest.
- **Dynamic Calendar Engine**: Select any date to instantly retrieve the historical/live match schedule and calculate head-to-head win probabilities.
- **Deep Team Stats Drilldown**: Analyzes over 40 variables, including Offensive Rating, Pace, True Shooting Percentage (TS%), and Turnover Rates, dynamically highlighting statistical edges in a "Tale of the Tape" format.
- **No Target Leakage**: Utilizes rolling 10-game Exponential Moving Averages (EMA) to ensure that predictions are made strictly on historical data available *before* tip-off.
- **Glassmorphism UI**: A stunning, modern frontend utilizing deep space aesthetics, neon accents, and smooth Javascript probability bar animations.

## 🛠️ Tech Stack

- **Backend**: Python, Flask, Pandas, Scikit-Learn, XGBoost
- **Model Architecture**: Logistic Regression (GridSearchCV Optimized)
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (No heavy frameworks)
- **Deployment-Ready**: Configured for Gunicorn WSGI servers

## 💻 Local Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/NBA-Predictor.git
   cd NBA-Predictor
   ```

2. **Install Dependencies**
   It is recommended to use a virtual environment.
   ```bash
   pip install -r requirements.txt
   ```

3. **Launch the Server**
   ```bash
   python server.py
   ```

4. **Access the Application**
   Open your browser and navigate to [http://127.0.0.1:5000](http://127.0.0.1:5000).

## 🧠 The Pipeline

The machine learning pipeline is documented within the `notebooks/` directory. The engine calculates the **Four Factors** of basketball success on a rolling average basis to simulate real-time team momentum without bleeding future data into the training set. We evaluated Random Forest, XGBoost, and SVMs before finalizing an optimized Logistic Regression model for its superior handling of scaled statistical variance.

## 🌐 Deployment (Free)

This application is fully optimized for free hosting on platforms like [Render.com](https://render.com). 
1. Connect your GitHub repository to Render as a **Web Service**.
2. Set the Build Command: `pip install -r requirements.txt`
3. Set the Start Command: `gunicorn server:app`
4. Deploy!

---
*Disclaimer: This project was built for educational and entertainment purposes only.*
