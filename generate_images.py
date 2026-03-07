import urllib.request
import json
import os
import shutil

API_KEY = "" # REPLACE WITH YOUR OPENAI API KEY
URL = "https://api.openai.com/v1/images/generations"

style_prefix = "A vector artwork illustration, flat design, minimal, warm colors, clean lines, educational style. "

prompts = {
    "johnny_1_crisis.png": style_prefix + "Young Johnny holding a sugar jar, a shadow of an adult figure looming over him. He looks shocked, realizing he has been caught.",
    "johnny_2_ideation.png": style_prefix + "A thought-bubble collage over Johnny's head. Johnny imagines different options: quickly swallowing the sugar, hiding the jar behind his back, or pointing the finger at someone else.",
    "johnny_3_execution.png": style_prefix + "Johnny boldly laughing with his mouth wide open showing the sugar inside his mouth ('Ha-Ha-Ha!'). He has successfully distracted the adult.",
    "mother_1_assessment.png": style_prefix + "In a split frame, a mother looks at her sleeping child while glancing at a calendar. One side indicates 'Exam Day' and the other indicates 'Summer Vacation'.",
    "mother_2_ideation.png": style_prefix + "A thought-bubble collage over the mother's head. She imagines different wake-up methods: softly opening the curtains, loudly turning off a noisy fan, and gently splashing a drop of water.",
    "mother_3_execution.png": style_prefix + "The mother executing the chosen method—gently opening the curtains and softly patting the child, a successful and empathetic wake-up specifically tailored to the child's context.",
    "doctor_1_clarity.png": style_prefix + "A caring doctor examining a patient closely, gathering symptoms, surrounded by floating medical symbols.",
    "doctor_2_ideation.png": style_prefix + "A thought-bubble collage over the doctor's head. The doctor considers multiple medical treatments, pills, and therapies before writing a prescription.",
    "doctor_3_iteration.png": style_prefix + "The patient returning to the friendly office looking happy and healthy, and the doctor smiling and taking notes on a tablet computer. A subtle calendar visual motif implies '3 days later'."
}

print("Generating images...")

# Make images directory
os.makedirs("d:/dt presentation building/images", exist_ok=True)

for filename, prompt in prompts.items():
    print(f"Generating {filename}...")
    target_path = os.path.join("d:/dt presentation building/images", filename)
    if os.path.exists(target_path):
        print(f"Skipping {filename}, already exists")
        continue

    data = json.dumps({
        "model": "dall-e-3",
        "prompt": prompt,
        "n": 1,
        "size": "1024x1024"
    }).encode("utf-8")

    req = urllib.request.Request(URL, data=data, headers={
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    })

    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            image_url = result['data'][0]['url']
            print(f"Downloading image from {image_url}")
            
            with urllib.request.urlopen(image_url) as img_resp, open(target_path, 'wb') as f:
                shutil.copyfileobj(img_resp, f)
            print(f"Successfully saved {filename}")
    except Exception as e:
        print(f"Failed to generate {filename}: {e}")

print("Done!")
