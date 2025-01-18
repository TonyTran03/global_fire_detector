import pandas as pd
import os
import random
import matplotlib.pyplot as plt
pd.set_option('display.max_rows', None)

class manipulator():
    """
    A class for manipulating and analyzing data using Pandas DataFrame.
    """

    def __init__(self, folder_path, csv_dataset_name=None):
        """
        Initializes the manipulator object.

        Parameters:
        
        folder_path (str): The path to the folder containing the data files.
        csv_dataset_name (str, optional): The name of the CSV dataset file.
        """

        self.folder_path = folder_path
        self.csv_dataset_name = csv_dataset_name
        self.data = None


    def load_data(self):
        """
        Loads the dataset from the csv file.
        """

        self.data = pd.read_csv(self.folder_path + self.csv_dataset_name)