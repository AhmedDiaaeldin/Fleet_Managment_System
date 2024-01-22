import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import LSTM, Dense
from tensorflow.keras.utils import to_categorical
from keras.preprocessing.sequence import pad_sequences
from sklearn.metrics import confusion_matrix, classification_report
import seaborn as sns
import matplotlib.pyplot as plt

# Load datasets
train_df = pd.read_csv('D:/University/graduation project papers (ideas)/ML_Datasets/dataset_7/UAH-DRIVESET-v1_for testing/gps_data_train.csv')
test_df = pd.read_csv('D:/University/graduation project papers (ideas)/ML_Datasets/dataset_7/UAH-DRIVESET-v1_for testing/gps_data_test.csv')

# Scale the entire dataset
scaler = MinMaxScaler()
scaled_train_df = scaler.fit_transform(train_df[['Latitude', 'Longitude']])
scaled_test_df = scaler.transform(test_df[['Latitude', 'Longitude']])

# Function to identify and split trips based on timestamp jumps
def split_trips(scaled_data, original_df, jump_threshold):
    indices = original_df.index[original_df['Timestamp'].diff() > jump_threshold].tolist()
    trips = np.split(scaled_data, indices)
    labels = np.split(original_df['Label'].values, indices)
    return trips, labels

# Split into individual trips with scaled data
train_trips, train_labels = split_trips(scaled_train_df, train_df, 100)
test_trips, test_labels = split_trips(scaled_test_df, test_df, 100)

# Define a fixed sequence length
fixed_sequence_length = 30  # For example, 100 time steps

# Function to create a dataset for LSTM with padded sequences
def create_sequences(trips, labels, max_length):
    X_all, y_all = [], []
    for trip, label in zip(trips, labels):
        for i in range(1, len(trip)):
            sequence = trip[max(0, i - fixed_sequence_length):i]  # Truncate sequence to fixed length
            sequence_padded = pad_sequences([sequence], maxlen=max_length, padding='pre', dtype='float64')[0]
            X_all.append(sequence_padded)
            y_all.append(label[i])
    return np.array(X_all), to_categorical(y_all)

# Prepare data for LSTM
X_train, y_train = create_sequences(train_trips, train_labels, fixed_sequence_length)
X_test, y_test = create_sequences(test_trips, test_labels, fixed_sequence_length)

# Define LSTM model
model = Sequential()
model.add(LSTM(50, input_shape=(fixed_sequence_length, 2)))
model.add(Dense(2, activation='softmax'))

# Compile model
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Train model
model.fit(X_train, y_train, epochs=10, batch_size=4, verbose=2)

# Predictions and Evaluation
y_pred = model.predict(X_test)
y_pred_classes = np.argmax(y_pred, axis=1)
y_test_classes = np.argmax(y_test, axis=1)

print(classification_report(y_test_classes, y_pred_classes))

cm = confusion_matrix(y_test_classes, y_pred_classes)

plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
plt.title('Confusion Matrix')
plt.xlabel('Predicted Label')
plt.ylabel('True Label')
plt.show()
