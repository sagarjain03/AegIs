import pandas as pd

class DatasetLoader:
    def __init__(self, dataset_path: str):
        self.dataset_path = dataset_path

    def load_data(self):
        """
        Loads the dataset from the CSV file.
        """
        try:
            df = pd.read_csv(self.dataset_path)
            return df
        except Exception as e:
            print(f"Error loading dataset: {e}")
            return None
