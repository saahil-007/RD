import pandas as pd
import numpy as np
import joblib
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, f1_score, classification_report, confusion_matrix


def load_data(path: str) -> pd.DataFrame:
    df = pd.read_csv(path)
    if "Unnamed: 0" in df.columns:
        df = df.drop(columns=["Unnamed: 0"])
    return df


def train_model(X, y):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, stratify=y, random_state=42
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    model = xgb.XGBClassifier(
        objective="multi:softmax",
        num_class=len(np.unique(y)),
        eval_metric="mlogloss",
        learning_rate=0.1,
        n_estimators=300,
        max_depth=6,
        subsample=0.8,
        colsample_bytree=0.8,
        gamma=1,
        reg_alpha=0.1,
        reg_lambda=1,
        random_state=42,
        use_label_encoder=False,
        verbosity=0
    )

    model.fit(X_train_scaled, y_train)
    y_pred = model.predict(X_test_scaled)

    print("✅ Accuracy:", round(accuracy_score(y_test, y_pred) * 100, 2), "%")
    print("F1 Score (macro):", round(f1_score(y_test, y_pred, average="macro"), 4))
    print("F1 Score (weighted):", round(f1_score(y_test, y_pred, average="weighted"), 4))
    print("\nClassification Report:\n", classification_report(y_test, y_pred))
    print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred))

    return model, scaler


def main():
    df = load_data("Jupyter/merged_data.csv")  # path to your dataset
    target = "Disease_Label"

    X = df.drop(columns=[target])
    y = df[target].astype(int)  # already numeric

    # Dynamically create mapping from labels
    unique_labels = sorted(y.unique())
    disease_mapping = {int(label): f"Disease_{label}" for label in unique_labels}

    print("📌 Disease Mapping:", disease_mapping)

    model, scaler = train_model(X, y)

    # Save artifacts
    joblib.dump(model, "xgb_model.pkl")
    joblib.dump(scaler, "scaler.pkl")
    joblib.dump(disease_mapping, "disease_mapping.pkl")

    print("✅ Model, Scaler, and Disease Mapping saved!")


if __name__ == "__main__":
    main()
