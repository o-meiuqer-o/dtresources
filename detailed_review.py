import os
import json
import requests
import base64
from bs4 import BeautifulSoup

# Configuration
API_KEY = "YOUR_API_KEY_HERE"
MODEL = "gpt-4o"
BASE_DIR = "d:/dt presentation building"
PAGES = [
    "introduction.html",
    "foundations.html",
    "finding_problem.html",
    "crow_cjm.html",
    "templates/empathy_map_template.html",
    "templates/journey_map_template.html",
    "templates/persona_template.html",
    "templates/problem_canvas_template.html",
    "templates/problem_eval_template.html",
    "templates/proto_persona_template.html",
    "templates/root_cause_template.html",
    "templates/survey_template.html"
]

PERSONAS = {
    "14yo": "A 14-year-old school student who wants to learn design thinking. Curious but easily bored. High attention to visuals and fun.",
    "forced_student": "A 17-21 year old student from Hyderabad forced to take this engineering course. Highly skeptical, wants to finish quickly, finds things 'dry'.",
    "eager_learner": "A 17-21 year old who really wants to learn. Identifies unclear parts and marks them out.",
    "veteran_teacher": "A veteran design thinking teacher. Focuses on understandability, pedagogical flow, and clarity of methods.",
    "veteran_designer": "A veteran designer. Focuses on UI/UX, aesthetics, professional standards, and usable interaction.",
    "philosopher": "A veteran design philosopher. Focuses on the 'Why', biological theory consistency, and ontological implications.",
}

def analyze_html(page_path):
    full_path = os.path.join(BASE_DIR, page_path)
    with open(full_path, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f, 'html.parser')
    
    # Extract sections or significant elements
    sections = []
    # Try section tags first
    for s in soup.find_all(['section', 'header', 'footer']):
        sections.append({
            "id": s.get('id', 'N/A'),
            "label": s.find(['h1', 'h2', 'span'], class_=['section-label', 'accent-tag']) or s.find(['h1', 'h2']),
            "content": s.get_text(strip=True)[:500] # Snippet for context
        })
    
    # If no sections, just take main blocks
    if not sections:
        for card in soup.find_all('div', class_='card'):
            sections.append({
                "id": "card",
                "label": card.find(['h3', 'h4']),
                "content": card.get_text(strip=True)[:500]
            })

    # Clean labels
    for s in sections:
        if s['label']:
            s['label'] = s['label'].get_text(strip=True)
        else:
            s['label'] = "Generic Section"

    return sections

def get_gpt_review(page_name, sections):
    reviews = {}
    
    sections_text = "\n".join([f"- {s['label']} (ID: {s['id']}): {s['content']}" for s in sections])
    
    prompt = f"""
    You are performing a comprehensive audit of a Design Thinking educational website page: {page_name}.
    We have the following sections/elements:
    {sections_text}

    For EACH section, provide a detailed review from the perspective of these 6 personas:
    1. 14yo student (Aarav)
    2. Forced 17-21yo Engineering student (Santhosh)
    3. Eager 17-21yo student (Priya)
    4. Veteran Teacher
    5. Veteran Designer
    6. Design Philosopher

    For each persona, for each section, provide:
    - Positive: What they liked.
    - Negative: What they disliked or found confusing.
    - Improvement: Specific suggestion.

    Also, act as a 'Me (Fixer)' persona who summarizes these and provides 3 concrete fix options for each major gap identified in the page.

    Format the output as a JSON object:
    {{
      "sections": [
        {{
          "id": "section_id",
          "label": "Section Label",
          "persona_reviews": {{
             "14yo": {{ "pos": "...", "neg": "...", "imp": "..." }},
             ...
          }}
        }}
      ],
      "fixer_insights": [
        {{ "gap": "...", "id": "...", "options": ["Option 1", "Option 2", "Option 3"] }}
      ]
    }}
    """

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }
    
    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": "You are a world-class educational auditor specializing in Design Thinking."},
            {"role": "user", "content": prompt}
        ],
        "response_format": { "type": "json_object" }
    }

    try:
        response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
        return response.json()['choices'][0]['message']['content']
    except Exception as e:
        print(f"Error reviewing {page_name}: {e}")
        return None

def main():
    all_results = {}
    for page in PAGES:
        print(f"Analyzing {page}...")
        sections = analyze_html(page)
        review_json = get_gpt_review(page, sections)
        if review_json:
            all_results[page] = json.loads(review_json)
        else:
            print(f"Failed to get review for {page}")

    with open(os.path.join(BASE_DIR, "detailed_audit.json"), "w", encoding='utf-8') as f:
        json.dump(all_results, f, indent=2)
    print("Audit complete! Saved to detailed_audit.json")

if __name__ == "__main__":
    main()
