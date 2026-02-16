import pandas as pd
import re

def clean_text(text):
    if not isinstance(text, str):
        return ""
    # Normalize text
    text = text.lower()
    # Strip whitespace
    text = text.strip()
    return text

def clean_dataset(input_path: str, output_path: str):
    """
    Cleans the dataset by removing duplicates, normalizing text, and dropping empty rows.
    """
    try:
        df = pd.read_csv(input_path)
        
        # Ensure 'prompt' column exists
        if 'prompt' not in df.columns:
            raise ValueError("Dataset must contain a 'prompt' column")
            
        # Clean prompts
        df['prompt'] = df['prompt'].apply(clean_text)
        
        # Remove empty prompts
        df = df[df['prompt'] != ""]
        
        # Remove duplicates
        df = df.drop_duplicates(subset=['prompt'])
        
        # Save cleaned dataset
        df.to_csv(output_path, index=False)
        print(f"Dataset cleaned and saved to {output_path}")
        
    except Exception as e:
        print(f"Error cleaning dataset: {e}")

if __name__ == "__main__":
    # Example usage
    # clean_dataset("raw_data.csv", "cleaned_data.csv")
    pass
