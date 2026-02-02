import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, accuracy_score

def train_model():
    # Load Data
    try:
        df = pd.read_csv('synthetic_cases.csv')
    except FileNotFoundError:
        print("Error: synthetic_cases.csv not found. Run generate_dataset.py first.")
        return

    # Prepare specific feature columns match standard input
    numeric_features = ['unanswered_messages_hours', 'incidents_last_7d', 'routine_breaks_last_7d', 
                        'lives_alone', 'mobility_limitations', 'cognitive_difficulty_flag']
    categorical_features = ['incidents_severity_max_7d']
    
    X = df[numeric_features + categorical_features]
    y = df['high_priority']

    # Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Pipeline
    numeric_transformer = StandardScaler()
    categorical_transformer = OneHotEncoder(handle_unknown='ignore')

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ])

    clf = Pipeline(steps=[('preprocessor', preprocessor),
                          ('classifier', LogisticRegression(random_state=42))])

    # Train
    print("Training model...")
    clf.fit(X_train, y_train)

    # Evaluate
    y_pred = clf.predict(X_test)
    print("Model Accuracy:", accuracy_score(y_test, y_pred))
    print("\nClassification Report:\n", classification_report(y_test, y_pred))

    # Save
    with open('model.pkl', 'wb') as f:
        pickle.dump(clf, f)
    print("Model saved to model.pkl")

if __name__ == "__main__":
    train_model()
