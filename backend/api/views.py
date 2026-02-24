import json
import google.generativeai as genai
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

import os

# Get your key from https://aistudio.google.com/app/apikey
api_key = os.environ.get("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
else:
    print("Warning: GEMINI_API_KEY is not set.")

@csrf_exempt
def extract_marksheet(request):
    if request.method == 'POST' and request.FILES.get('file'):
        image_file = request.FILES['file']
        
        # 1. Initialize Gemini Vision
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # 2. Precise Prompting for 100% accuracy
        prompt = """
        Act as a transcript data extractor. Look at this marksheet and extract all subjects into a JSON array.
        Strictly follow this JSON format:
        {
          "subjects": [{"code": "string", "name": "string", "credits": 4.0, "grade": "string", "points": 10.0}],
          "gpa": 8.5
        }
        Map grades: O=10, A+=9, A=8, B+=7, B=6, C=5, D=4.
        If a value is unclear, use your best visual judgment of the row/column alignment.
        CRITICAL: Return ONLY valid JSON. Do not use trailing commas. Do not include markdown blocks. Ensure all keys and strings have double quotes.
        """

        # 3. Process image
        img_data = image_file.read()
        
        # Mime type check to ensure other images formats don't crash
        mime_type = image_file.content_type if hasattr(image_file, 'content_type') else 'image/jpeg'

        try:
            response = model.generate_content(
                [prompt, {'mime_type': mime_type, 'data': img_data}],
                generation_config={"response_mime_type": "application/json"}
            )

            # Clean response text in case Gemini adds markdown formatting despite restrictions
            raw_text = response.text.strip()
            if raw_text.startswith("```json"):
                raw_text = raw_text.replace("```json", "", 1)
            if raw_text.startswith("```"):
                raw_text = raw_text.replace("```", "", 1)
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]
            raw_text = raw_text.strip()

            # Safely load the JSON
            data = json.loads(raw_text)
            
            # Logic Check: Recalculate GPA to verify AI results
            subjects = data.get('subjects', [])
            total_pts = sum(float(s.get('credits', 0)) * float(s.get('points', 0)) for s in subjects)
            total_creds = sum(float(s.get('credits', 0)) for s in subjects)
            data['calculated_gpa'] = round(total_pts / total_creds, 2) if total_creds > 0 else 0
            
            return JsonResponse(data)
        except Exception as e:
            # Also handle cases where safety filter removes response text
            if hasattr(e, 'message'):
                err_msg = e.message
            else:
                err_msg = str(e)
            return JsonResponse({'error': 'AI processing failed', 'details': err_msg}, status=500)

    return JsonResponse({'error': 'Invalid request'}, status=400)
