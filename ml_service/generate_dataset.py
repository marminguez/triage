import pandas as pd
import numpy as np
import random

def generate_synthetic_data(n_rows=1000):
    # Set seed for reproducibility
    np.random.seed(42)
    random.seed(42)

    # Features
    data = {
        'unanswered_messages_hours': np.random.randint(0, 97, n_rows), # 0-96 hours
        'incidents_last_7d': np.random.randint(0, 6, n_rows),          # 0-5 incidents
        'routine_breaks_last_7d': np.random.randint(0, 6, n_rows),     # 0-5 breaks
        'lives_alone': np.random.randint(0, 2, n_rows),                # 0 or 1
        'mobility_limitations': np.random.randint(0, 2, n_rows),       # 0 or 1
        'cognitive_difficulty_flag': np.random.randint(0, 2, n_rows)   # 0 or 1
    }

    # Incident Severity (Categorical)
    severities = ['none', 'leve', 'moderada', 'grave']
    # Probabilities slightly weighted towards none/leve
    data['incidents_severity_max_7d'] = np.random.choice(severities, n_rows, p=[0.5, 0.3, 0.15, 0.05])
    
    # Adjust severity to match incident count (if 0 incidents, severity must be none)
    df = pd.DataFrame(data)
    df.loc[df['incidents_last_7d'] == 0, 'incidents_severity_max_7d'] = 'none'

    # Calculate Target: High Priority (0 or 1)
    # Rule of thumb for synthetic logic:
    # High risk if:
    # - > 48h unanswered
    # - OR > 2 incidents AND severity is grave
    # - OR > 3 routine breaks AND lives alone
    # - OR mobility + cognitive + lives alone
    
    def calculate_priority(row):
        score = 0
        if row['unanswered_messages_hours'] > 48: score += 50
        if row['unanswered_messages_hours'] > 24: score += 20
        
        if row['incidents_last_7d'] >= 2 and row['incidents_severity_max_7d'] == 'grave': score += 40
        if row['incidents_last_7d'] >= 3: score += 20
        
        if row['routine_breaks_last_7d'] >= 3 and row['lives_alone']: score += 30
        
        if row['mobility_limitations'] and row['cognitive_difficulty_flag'] and row['lives_alone']: score += 40
        
        # Add some noise
        score += np.random.randint(-10, 10)
        
        return 1 if score >= 50 else 0

    df['high_priority'] = df.apply(calculate_priority, axis=1)

    return df

if __name__ == "__main__":
    print("Generating synthetic dataset...")
    df = generate_synthetic_data(1000)
    print(f"Dataset shape: {df.shape}")
    print(f"High Priority distribution:\n{df['high_priority'].value_counts(normalize=True)}")
    
    output_file = "synthetic_cases.csv"
    df.to_csv(output_file, index=False)
    print(f"Saved to {output_file}")
