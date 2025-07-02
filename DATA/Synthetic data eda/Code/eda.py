import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import os

# Set the file path directly
FILE_PATH = "/Users/omanchaudhary/Margadarshak Updates/synthetic_student_survey_data.csv"

def load_data(file_path):
    """Load CSV data with robust error handling."""
    try:
        return pd.read_csv(file_path, encoding='utf-8')
    except UnicodeDecodeError:
        try:
            return pd.read_csv(file_path, encoding='latin1')
        except Exception as e:
            print(f"Error loading file with latin1 encoding: {e}")
            raise
    except pd.errors.ParserError:
        for delimiter in [',', ';', '\t', '|']:
            try:
                return pd.read_csv(file_path, delimiter=delimiter)
            except:
                continue
        print("Failed to parse CSV with common delimiters")
        raise

def basic_info(df):
    """Display basic info about the dataframe."""
    print("\n" + "="*50)
    print("DATASET BASIC INFORMATION")
    print("="*50)
    print(f"\nDataset dimensions: {df.shape[0]} rows, {df.shape[1]} columns\n")
    print("First 5 rows:")
    print(df.head())
    print("\nColumns and data types:")
    for col in df.columns:
        print(f"- {col}: {df[col].dtype}")
    print(f"\nMemory usage: {df.memory_usage(deep=True).sum() / 1024**2:.2f} MB")

def summary_statistics(df):
    """Generate summary statistics."""
    print("\n" + "="*50)
    print("SUMMARY STATISTICS")
    print("="*50)
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    categorical_cols = df.select_dtypes(exclude=[np.number]).columns
    if numeric_cols.any():
        print("\nNumerical columns summary:")
        print(df[numeric_cols].describe().T)
    if categorical_cols.any():
        print("\nCategorical columns summary:")
        for col in categorical_cols:
            print(f"\n{col}:")
            print(df[col].value_counts().head(10))
            print(f"Unique values: {df[col].nunique()}")

def check_missing_values(df):
    """Analyze missing values."""
    print("\n" + "="*50)
    print("MISSING VALUES ANALYSIS")
    print("="*50)
    missing = df.isnull().sum()
    missing_percent = (missing / len(df)) * 100
    missing_data = pd.DataFrame({'Missing Values': missing, 'Percentage (%)': missing_percent})
    missing_data = missing_data[missing_data['Missing Values'] > 0].sort_values('Missing Values', ascending=False)
    if not missing_data.empty:
        print("\nColumns with missing values:")
        print(missing_data)
    else:
        print("\nNo missing values found in the dataset.")

def analyze_correlations(df):
    """Analyze and plot correlations."""
    numeric_df = df.select_dtypes(include=[np.number])
    if numeric_df.shape[1] < 2:
        print("\nNot enough numerical columns for correlation analysis.")
        return
    print("\n" + "="*50)
    print("CORRELATION ANALYSIS")
    print("="*50)
    corr_matrix = numeric_df.corr()
    print("\nHighest correlations (>|0.5|):")
    corr_pairs = [(corr_matrix.columns[i], corr_matrix.columns[j], corr_matrix.iloc[i, j])
                  for i in range(len(corr_matrix.columns)) for j in range(i)
                  if abs(corr_matrix.iloc[i, j]) > 0.5]
    if corr_pairs:
        for col1, col2, val in sorted(corr_pairs, key=lambda x: abs(x[2]), reverse=True):
            print(f"- {col1} and {col2}: {val:.4f}")
    else:
        print("No strong correlations found.")
    plt.figure(figsize=(10, 8))
    sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', vmin=-1, vmax=1, fmt='.2f')
    plt.title('Correlation Heatmap')
    plt.tight_layout()
    plt.savefig('correlation_heatmap.png')
    plt.show()
    print("\nCorrelation heatmap saved as 'correlation_heatmap.png'")

def analyze_survey_responses(df):
    """Analyze distributions of potential Likert/rating scale columns."""
    print("\n" + "="*50)
    print("SURVEY RESPONSE ANALYSIS")
    print("="*50)
    potential_likert_cols = []
    for col in df.columns:
        if df[col].dtype in ['int64', 'float64']:
            unique_vals = sorted(df[col].dropna().unique())
            if len(unique_vals) > 0:
                numeric_vals = [val for val in unique_vals if isinstance(val, (int, float))]
                if 0 < len(numeric_vals) <= 10:
                    if min(numeric_vals) >= 1 and max(numeric_vals) <= 10:
                        potential_likert_cols.append(col)
    if potential_likert_cols:
        print("\nPotential rating/Likert scale columns identified:")
        for col in potential_likert_cols:
            print(f"\n- {col}:")
            value_counts = df[col].value_counts().sort_index()
            print(value_counts)
            plt.figure(figsize=(10, 6))
            ax = sns.countplot(x=df[col], palette='viridis')
            plt.title(f'Distribution of Responses - {col}')
            plt.xlabel(col)
            plt.ylabel('Count')
            for p in ax.patches:
                ax.annotate(f'{int(p.get_height())}', 
                            (p.get_x() + p.get_width() / 2., p.get_height()), 
                            ha='center', va='bottom')
            plt.tight_layout()
            plt.savefig(f'survey_response_{col}.png')
            plt.show()
            print(f"Response distribution plot saved as 'survey_response_{col}.png'")
    # Open-ended text columns
    text_cols = []
    for col in df.select_dtypes(include=['object']).columns:
        if df[col].str.len().mean() > 20:
            text_cols.append(col)
    if text_cols:
        print("\nPotential open-ended response columns:")
        for col in text_cols:
            print(f"\n- {col}:")
            print(f"  Non-null responses: {df[col].count()}")
            print(f"  Average response length: {df[col].str.len().mean():.2f} characters")
            print(f"  Shortest response: {df[col].str.len().min()} characters")
            print(f"  Longest response: {df[col].str.len().max()} characters")

def data_distributions(df):
    """Analyze and plot distributions of variables."""
    print("\n" + "="*50)
    print("DATA DISTRIBUTIONS")
    print("="*50)
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    for col in numeric_cols[:5]:
        plt.figure(figsize=(12, 5))
        plt.subplot(1, 2, 1)
        sns.histplot(df[col].dropna(), kde=True)
        plt.title(f'Distribution of {col}')
        plt.xlabel(col)
        plt.ylabel('Frequency')
        plt.subplot(1, 2, 2)
        sns.boxplot(x=df[col].dropna())
        plt.title(f'Box Plot of {col}')
        plt.xlabel(col)
        plt.tight_layout()
        plt.savefig(f'distribution_{col}.png')
        plt.show()
        print(f"\nDistribution plots for '{col}' saved as 'distribution_{col}.png'")
    cat_cols = df.select_dtypes(include=['object', 'category']).columns
    for col in cat_cols[:3]:
        if df[col].nunique() <= 20:
            plt.figure(figsize=(10, 6))
            counts = df[col].value_counts().sort_values(ascending=False).head(10)
            sns.barplot(x=counts.index, y=counts.values)
            plt.title(f'Top 10 Values in {col}')
            plt.xticks(rotation=45, ha='right')
            plt.tight_layout()
            plt.savefig(f'categorical_{col}.png')
            plt.show()
            print(f"\nBar plot for '{col}' saved as 'categorical_{col}.png'")

def analyze_demographic_patterns(df):
    """Analyze demographic patterns in survey data."""
    print("\n" + "="*50)
    print("DEMOGRAPHIC PATTERNS ANALYSIS")
    print("="*50)
    demographic_keywords = ['gender', 'age', 'grade', 'class', 'year', 'major', 'department', 
                           'program', 'ethnicity', 'race', 'nationality', 'country']
    demographic_cols = [col for col in df.columns if any(k in col.lower() for k in demographic_keywords)]
    if not demographic_cols:
        print("\nNo clear demographic columns identified.")
        return
    print("\nIdentified demographic columns:")
    for col in demographic_cols:
        print(f"- {col}")
    rating_cols = [col for col in df.select_dtypes(include=[np.number]).columns if col not in demographic_cols]
    if rating_cols and demographic_cols:
        print("\nAnalyzing response patterns by demographic groups...")
        demo_col = demographic_cols[0]
        rating_col = rating_cols[0]
        if df[demo_col].nunique() <= 10:
            plt.figure(figsize=(12, 8))
            sns.boxplot(x=demo_col, y=rating_col, data=df)
            plt.title(f'{rating_col} by {demo_col}')
            plt.xticks(rotation=45, ha='right')
            plt.tight_layout()
            plt.savefig(f'demographic_pattern_{demo_col}_{rating_col}.png')
            plt.show()
            print(f"\nDemographic pattern analysis saved as 'demographic_pattern_{demo_col}_{rating_col}.png'")
            avg_by_group = df.groupby(demo_col)[rating_col].mean().sort_values(ascending=False)
            print(f"\nAverage {rating_col} by {demo_col}:")
            print(avg_by_group)

def detect_outliers(df):
    """Detect outliers using the IQR method for numeric columns."""
    print("\n" + "="*50)
    print("OUTLIER DETECTION")
    print("="*50)
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    for col in numeric_cols:
        q1 = df[col].quantile(0.25)
        q3 = df[col].quantile(0.75)
        iqr = q3 - q1
        lower_bound = q1 - 1.5 * iqr
        upper_bound = q3 + 1.5 * iqr
        outliers = df[(df[col] < lower_bound) | (df[col] > upper_bound)][col]
        print(f"\n{col}: {len(outliers)} outliers detected.")
        if len(outliers) > 0:
            print(f"Outliers range from {outliers.min()} to {outliers.max()}")
            plt.figure(figsize=(8, 4))
            sns.boxplot(x=df[col])
            plt.title(f'Boxplot of {col} with Outliers')
            plt.tight_layout()
            plt.savefig(f'outliers_{col}.png')
            plt.show()
            print(f"Boxplot with outliers saved as 'outliers_{col}.png'")

def generate_report(df):
    """Run all analysis functions and save outputs."""
    print("Starting exploratory data analysis...")
    basic_info(df)
    summary_statistics(df)
    check_missing_values(df)
    analyze_correlations(df)
    analyze_survey_responses(df)
    data_distributions(df)
    analyze_demographic_patterns(df)
    detect_outliers(df)
    print("\nEDA completed.")

def main():
    if not os.path.exists(FILE_PATH):
        print(f"File not found at path: {FILE_PATH}")
        return
    df = load_data(FILE_PATH)
    generate_report(df)

if __name__ == "__main__":
    main()
