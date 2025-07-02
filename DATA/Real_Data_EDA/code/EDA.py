# eda_margadarshak.py
# Exploratory Data Analysis (EDA) script for Margadarshak student survey dataset

import argparse
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path
import re

# Helper function to sanitize filenames
def sanitize_filename(name):
    """
    Replace invalid filename characters with underscores
    """
    return re.sub(r'[<>:"/\\|?*]', '_', name)

# 1. Load the dataset

def load_data(path: Path) -> pd.DataFrame:
    """
    Load the CSV data, standardize column names, and return a DataFrame.
    """
    df = pd.read_csv(path)
    # Rename CGPA to GPA for consistency
    if 'CGPA' in df.columns:
        df = df.rename(columns={'CGPA': 'GPA'})
    if 'Your current GPA' in df.columns:
        df = df.rename(columns={'Your current GPA': 'GPA'})
    return df

# 2. Basic overview

def overview(df: pd.DataFrame):
    print("\n===== Data Overview =====")
    print(df.head())
    print("\nData Types:")
    print(df.dtypes)
    print(f"\nShape: {df.shape}")

# 3. Summary statistics

def summary_stats(df: pd.DataFrame):
    print("\n===== Summary Statistics =====")
    print(df.describe(include='all'))

# 4. Missing values

def missing_values(df: pd.DataFrame):
    print("\n===== Missing Values =====")
    missing = df.isnull().sum()
    print(missing[missing > 0] if not missing[missing > 0].empty else "No missing values detected.")

# 5. Distribution plots for numeric features

def plot_numeric_distributions(df: pd.DataFrame, output_dir: Path = None):
    num_cols = df.select_dtypes(include=[np.number]).columns
    for col in num_cols:
        plt.figure(figsize=(6,4))
        sns.histplot(df[col].dropna(), kde=True)
        plt.title(f"Distribution of {col}")
        plt.xlabel(col)
        plt.ylabel('Frequency')
        plt.tight_layout()
        if output_dir:
            safe_col = sanitize_filename(col)
            plt.savefig(output_dir / f"{safe_col}_dist.png")
        plt.show()

# 6. Boxplots for outlier detection

def plot_boxplots(df: pd.DataFrame, output_dir: Path = None):
    num_cols = df.select_dtypes(include=[np.number]).columns
    for col in num_cols:
        plt.figure(figsize=(6,4))
        sns.boxplot(x=df[col].dropna())
        plt.title(f"Boxplot of {col}")
        plt.xlabel(col)
        plt.tight_layout()
        if output_dir:
            safe_col = sanitize_filename(col)
            plt.savefig(output_dir / f"{safe_col}_box.png")
        plt.show()

# 7. Correlation analysis

def correlation_matrix(df: pd.DataFrame, output_dir: Path = None):
    num_df = df.select_dtypes(include=[np.number])
    corr = num_df.corr()
    print("\n===== Correlation with GPA =====")
    if 'GPA' in corr:
        print(corr['GPA'].sort_values(ascending=False))

    # Heatmap
    plt.figure(figsize=(10,8))
    sns.heatmap(corr, annot=True, fmt='.2f', vmin=-1, vmax=1)
    plt.title('Correlation Heatmap')
    plt.tight_layout()
    if output_dir:
        plt.savefig(output_dir / "correlation_heatmap.png")
    plt.show()

# 8. Categorical feature analysis

def analyze_categorical(df: pd.DataFrame, output_dir: Path = None):
    cat_cols = df.select_dtypes(include=['object']).columns
    for col in cat_cols:
        print(f"\n--- {col} ---")
        print(df[col].value_counts())
        if 'GPA' in df.columns:
            try:
                df[col] = df[col].astype(str)
                group = df.groupby(col)['GPA'].mean().sort_values()
                print("\nMean GPA by category:")
                print(group)
                plt.figure(figsize=(8,4))
                group.plot(kind='bar')
                plt.title(f"Average GPA by {col}")
                plt.ylabel('Mean GPA')
                plt.xticks(rotation=45, ha='right')
                plt.tight_layout()
                if output_dir:
                    safe_col = sanitize_filename(col)
                    plt.savefig(output_dir / f"{safe_col}_gpa_bar.png")
                plt.show()
            except Exception as e:
                print(f"Skipping column {col} due to error: {e}")

# 9. Pairwise scatter plots for top features

def pairwise_plots(df: pd.DataFrame, top_n: int = 5, output_dir: Path = None):
    num_df = df.select_dtypes(include=[np.number])
    if 'GPA' not in num_df:
        print("GPA column missing from numeric features. Skipping pairwise plots.")
        return

    corr = num_df.corr()['GPA'].abs().sort_values(ascending=False)
    top_features = list(corr.index[1:top_n+1])
    selected_cols = [col for col in top_features if col in df.columns] + ['GPA']
    clean_df = df[selected_cols].apply(pd.to_numeric, errors='coerce').dropna()

    if len(clean_df.columns) < 2:
        print("Not enough valid numeric columns for pairplot.")
        return

    sns.pairplot(clean_df)
    if output_dir:
        plt.savefig(output_dir / "pairwise_plots.png")
    plt.show()

# 10. Main EDA function

def run_eda(data_path: str, output_dir: str = None):
    path = Path(data_path)
    if not path.exists():
        raise FileNotFoundError(f"Data file not found: {path}")
    out_dir = Path(output_dir) if output_dir else None
    if out_dir and not out_dir.exists():
        out_dir.mkdir(parents=True)

    df = load_data(path)
    overview(df)
    summary_stats(df)
    missing_values(df)
    plot_numeric_distributions(df, out_dir)
    plot_boxplots(df, out_dir)
    correlation_matrix(df, out_dir)
    analyze_categorical(df, out_dir)
    pairwise_plots(df, top_n=5, output_dir=out_dir)

if __name__ == '__main__':
    # Updated file paths
    default_data_path = "C:/Users/Nitro/Downloads/Updated Margadarshak Student Survey – Graduation Prediction (Responses) - Form Responses 1.csv"
    default_output_dir = "C:/Users/Nitro/OneDrive/Desktop/codewave_BBIS_TechForce"

    parser = argparse.ArgumentParser(description='Run EDA on Margadarshak dataset')
    parser.add_argument('data_path', nargs='?', default=default_data_path, help='Path to the CSV file')
    parser.add_argument('--output_dir', '-o', default=default_output_dir, help='Directory to save plots')
    args = parser.parse_args()
    run_eda(args.data_path, args.output_dir)
