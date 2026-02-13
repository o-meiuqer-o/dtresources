from tensorflow.keras.applications import MobileNetV2

# Load pretrained MobileNetV2 model with ImageNet weights
model = MobileNetV2(weights='imagenet')

# Save the model as a .keras file
model.save('mobilenetv2.keras')
