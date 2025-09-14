import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

def load_data(file_path):
    """
    Loads data from a CSV file and prepares it for modeling.
    It drops the first unnamed column which is likely an index.
    """
    try:
        df = pd.read_csv("backend/Jupyter/merged_data.csv")
        if 'Unnamed: 0' in df.columns:
            df = df.drop('Unnamed: 0', axis=1)
        return df
    except FileNotFoundError:
        print(f"Error: The file '{file_path}' was not found. Please make sure it's in the correct directory.")
        return None

def train_evaluate_xgboost(df):
    """
    Trains and evaluates an XGBoost classifier on the provided dataframe.
    """
    if df is None or 'Disease_Label' not in df.columns:
        print("DataFrame is invalid or missing the 'Disease_Label' target column.")
        return None

    # 1. Define Features (X) and Target (y)
    X = df.drop('Disease_Label', axis=1)
    y = df['Disease_Label']

    # 2. Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    print(f"Training data shape: {X_train.shape}")
    print(f"Testing data shape: {X_test.shape}")
    
    # 3. Initialize and train the XGBoost model
    # `use_label_encoder=False` and `eval_metric='logloss'` are set to handle modern XGBoost versions
    print("\nTraining the XGBoost Classifier...")
    model = xgb.XGBClassifier(
        objective='binary:logistic',
        use_label_encoder=False,
        eval_metric='logloss',
        random_state=42
    )
    model.fit(X_train, y_train)
    print("Model training complete.")

    # 4. Make predictions on the test set
    print("\nEvaluating model performance on the test set...")
    y_pred = model.predict(X_test)

    # 5. Evaluate the model
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\nModel Accuracy: {accuracy:.4f}")
    
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    return model

# --- Main Execution Block ---
if __name__ == '__main__':
    # Define the path to your data file
    DATA_FILE = 'merged_data.csv'
    
    # Load the data
    dataframe = load_data(DATA_FILE)
    
    # If data is loaded successfully, train the model
    if dataframe is not None:
        trained_model = train_evaluate_xgboost(dataframe)
        if trained_model:
            print("\nXGBoost classifier has been successfully trained and evaluated.")
