import os
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.callbacks import EarlyStopping
from tensorflow.keras.preprocessing.image import load_img, img_to_array

# ===================== CONFIG =====================

# Use raw string and keep exactly your master dataset path
MASTER_DATASET_DIR = r"D:\food_app_local_train\Master_Dataset"  # each subfolder = class

IMAGE_HEIGHT, IMAGE_WIDTH = 64, 64
BATCH_SIZE = 32
VALIDATION_SPLIT = 0.2  # 20% for validation

# Where to save model + label encoder
OUTPUT_DIR = r"D:\food_app_local_train\models_master_dataset"
os.makedirs(OUTPUT_DIR, exist_ok=True)

MODEL_PATH = os.path.join(OUTPUT_DIR, "master_best_model.keras")
LABELS_PATH = os.path.join(OUTPUT_DIR, "master_label_encoder_classes.npy")

# ===================== LOAD IMAGES =====================

images = []
labels = []

for label_dir in os.listdir(MASTER_DATASET_DIR):
    label_path = os.path.join(MASTER_DATASET_DIR, label_dir)
    if not os.path.isdir(label_path):
        continue

    for img_file in os.listdir(label_path):
        img_path = os.path.join(label_path, img_file)
        # basic image file filter
        if not os.path.isfile(img_path):
            continue
        if not img_file.lower().endswith((".jpg", ".jpeg", ".png", ".bmp", ".gif", ".webp")):
            continue

        try:
            img = load_img(img_path, target_size=(IMAGE_HEIGHT, IMAGE_WIDTH))
            img_array = img_to_array(img)
            images.append(img_array)
            labels.append(label_dir)
        except Exception as e:
            print(f"Skipping file (load error): {img_path} → {e}")

images = np.array(images, dtype="float32") / 255.0
labels = np.array(labels)

print(f"Loaded {len(images)} images from {len(set(labels))} classes")

if len(images) == 0:
    raise RuntimeError(f"No images found under {MASTER_DATASET_DIR}. Check path/structure.")

# ===================== ENCODE LABELS =====================

le = LabelEncoder()
labels_encoded = le.fit_transform(labels)

# ===================== TRAIN / VAL SPLIT =====================

train_images, val_images, train_labels, val_labels = train_test_split(
    images,
    labels_encoded,
    test_size=VALIDATION_SPLIT,
    random_state=42,
    stratify=labels_encoded,
)

print(f"Training samples: {train_images.shape[0]}, Validation samples: {val_images.shape[0]}")

# ===================== MODEL =====================

def create_model(num_classes: int):
    model = models.Sequential(
        [
            layers.Flatten(input_shape=(IMAGE_HEIGHT, IMAGE_WIDTH, 3)),
            layers.Dense(512, activation="relu"),
            layers.Dropout(0.2),
            layers.Dense(num_classes, activation="softmax"),
        ]
    )
    model.compile(
        optimizer="adam",
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"],
    )
    return model


model = create_model(len(le.classes_))

# ===================== CALLBACKS =====================

early_stopping = EarlyStopping(
    monitor="val_accuracy",
    patience=3,
    restore_best_weights=True,
    verbose=1,
)

# ===================== TRAIN =====================

history = model.fit(
    train_images,
    train_labels,
    validation_data=(val_images, val_labels),
    epochs=20,
    batch_size=BATCH_SIZE,
    callbacks=[early_stopping],
    verbose=1,
)

# ===================== SAVE MODEL + LABELS =====================

model.save(MODEL_PATH)
np.save(LABELS_PATH, le.classes_)
print(f"Model saved as {MODEL_PATH}")
print(f"Label classes saved as {LABELS_PATH}")

# ===================== GPU INFO =====================

print("Num GPUs Available: ", len(tf.config.list_physical_devices("GPU")))
