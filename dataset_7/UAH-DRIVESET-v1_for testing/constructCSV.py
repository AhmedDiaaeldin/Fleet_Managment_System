import pandas as pd
import os
import glob

# Define the base directory where the files are located
base_dir = 'D:/University/graduation project papers (ideas)/ML_Datasets/dataset_7/UAH-DRIVESET-v1_for testing/Collected'

# Create a pattern to match all .txt files
file_pattern = os.path.join(base_dir, 'RAW_GPS_*.txt')

# Create a list to hold all the dataframes
df_list = []

# Loop through all matching files
for file in glob.glob(file_pattern):
    # Extract the label from the file name
    if 'DROWSY' in file.upper():
        label = 2
    elif 'AGG' in file.upper():
        label = 1
    elif 'NORMAL' in file.upper():
        label = 0
    else:
        label = -1  # Default label if no match is found

    # Read the file content into a dataframe
    # Assuming the order of columns is: Timestamp, Speed, Latitude, Longitude, and other columns we don't need
    temp_df = pd.read_csv(file, header=None, delim_whitespace=True, usecols=[0, 1, 2, 3], 
                          names=['Timestamp', 'Speed', 'Latitude', 'Longitude'])

    # Assign label
    temp_df['Label'] = label
    
    # Append the dataframe to the list
    df_list.append(temp_df)

# Concatenate all dataframes into one
final_df = pd.concat(df_list, ignore_index=True)

# Save the concatenated dataframe to a CSV file
final_csv_path = 'gps_data_train.csv'
final_df.to_csv(final_csv_path, index=False)

print(f"Data saved to {final_csv_path}")
