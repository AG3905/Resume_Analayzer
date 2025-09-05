import json
import requests
import os
from typing import Dict, Any
import time

# Free API configurations - using Google Gemini API (free tier)
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'your-gemini-api-key-here')
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

def analyze_resume(resume_text: str, job_description: str) -> Dict[str, Any]:
    """
    Analyze resume against job description using AI
    """
    try:
        # Construct the analysis prompt
        prompt = create_analysis_prompt(resume_text, job_description)

        # Call Gemini API for analysis
        analysis_result = call_gemini_api(prompt)

        # Parse and structure the result
        structured_result = parse_analysis_result(analysis_result)

        return structured_result

    except Exception as e:
        print(f"AI Analysis error: {str(e)}")
        # Return fallback analysis
        return create_fallback_analysis(resume_text, job_description)

def create_analysis_prompt(resume_text: str, job_description: str) -> str:
    """Create a structured prompt for AI analysis"""

    prompt = f"""
You are a professional ATS (Applicant Tracking System) and resume analysis expert. 
Analyze the following resume against the job description and provide a comprehensive analysis.

RESUME TEXT:
{resume_text}

JOB DESCRIPTION:
{job_description}

Please analyze and return ONLY a valid JSON response with the following structure:
{{
    "match_score": 85,
    "matched_skills": ["React", "JavaScript", "Python", "CSS"],
    "missing_skills": ["Node.js", "AWS", "Docker", "MongoDB"],
    "matched_keywords": ["frontend", "responsive design", "API integration"],
    "missing_keywords": ["backend", "cloud deployment", "database design"],
    "experience_match": {{
        "required_years": 3,
        "candidate_years": 2,
        "match_percentage": 67
    }},
    "education_match": {{
        "required": "Bachelor's in Computer Science",
        "candidate": "Bachelor's in Information Technology",
        "match": true
    }},
    "missing_sections": ["Summary", "Certifications"],
    "ats_issues": ["Tables detected", "Non-standard fonts used"],
    "suggestions": [
        "Add a professional summary at the beginning",
        "Include backend development experience",
        "Highlight cloud computing skills",
        "Remove tables and use simple text formatting",
        "Add relevant certifications section"
    ],
    "strengths": [
        "Strong frontend development experience", 
        "Good project portfolio",
        "Relevant educational background"
    ],
    "weaknesses": [
        "Limited backend experience",
        "Missing cloud platform knowledge",
        "No mention of testing frameworks"
    ],
    "overall_assessment": "Strong candidate with solid frontend skills but lacks some backend requirements. Recommended for interview with focus on technical growth areas.",
    "recommendation": "CONSIDER"
}}

Instructions:
1. Match score should be 0-100 based on overall fit
2. List specific skills found vs required
3. Identify missing resume sections (Summary, Experience, Skills, Education, Projects, Certifications)
4. Flag ATS issues (tables, images, complex formatting, unusual fonts)
5. Provide actionable improvement suggestions
6. Give overall assessment and recommendation (STRONG_FIT, CONSIDER, WEAK_FIT)
7. Return ONLY valid JSON, no other text
"""

    return prompt

def call_gemini_api(prompt: str) -> str:
    """Call Google Gemini API for analysis"""

    try:
        headers = {
            'Content-Type': 'application/json',
            'x-goog-api-key': GEMINI_API_KEY
        }

        data = {
            "contents": [{
                "parts": [{
                    "text": prompt
                }]
            }],
            "generationConfig": {
                "temperature": 0.3,
                "topP": 0.8,
                "maxOutputTokens": 2048
            }
        }

        response = requests.post(GEMINI_API_URL, headers=headers, json=data, timeout=30)

        if response.status_code == 200:
            result = response.json()
            if 'candidates' in result and len(result['candidates']) > 0:
                return result['candidates'][0]['content']['parts'][0]['text']
            else:
                raise Exception("No response content from Gemini API")
        else:
            print(f"Gemini API error: {response.status_code} - {response.text}")
            raise Exception(f"API call failed with status {response.status_code}")

    except Exception as e:
        print(f"Gemini API call failed: {str(e)}")
        raise e

def parse_analysis_result(api_response: str) -> Dict[str, Any]:
    """Parse and validate the AI response"""

    try:
        # Extract JSON from response (in case there's extra text)
        response_text = api_response.strip()

        # Find JSON content
        start_idx = response_text.find('{')
        end_idx = response_text.rfind('}') + 1

        if start_idx != -1 and end_idx != -1:
            json_text = response_text[start_idx:end_idx]
            result = json.loads(json_text)

            # Validate required fields
            required_fields = ['match_score', 'matched_skills', 'missing_skills', 'suggestions']
            for field in required_fields:
                if field not in result:
                    result[field] = get_default_value(field)

            return result
        else:
            raise Exception("No valid JSON found in response")

    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {str(e)}")
        print(f"Response text: {api_response}")
        raise Exception("Failed to parse AI response as JSON")

def get_default_value(field: str):
    """Get default values for missing fields"""
    defaults = {
        'match_score': 50,
        'matched_skills': [],
        'missing_skills': [],
        'suggestions': ["Unable to generate specific suggestions at this time"],
        'ats_issues': [],
        'strengths': [],
        'weaknesses': [],
        'recommendation': 'CONSIDER'
    }
    return defaults.get(field, None)

def create_fallback_analysis(resume_text: str, job_description: str) -> Dict[str, Any]:
    """Create a basic fallback analysis when AI fails"""

    # Simple keyword matching fallback
    resume_lower = resume_text.lower()
    job_lower = job_description.lower()

    # Common tech skills to check
    common_skills = [
        'python', 'java', 'javascript', 'react', 'angular', 'vue',
        'html', 'css', 'sql', 'mongodb', 'postgresql', 'aws',
        'docker', 'kubernetes', 'git', 'linux', 'windows'
    ]

    matched_skills = []
    missing_skills = []

    for skill in common_skills:
        if skill in resume_lower and skill in job_lower:
            matched_skills.append(skill.title())
        elif skill in job_lower and skill not in resume_lower:
            missing_skills.append(skill.title())

    # Calculate basic match score
    total_job_skills = len([s for s in common_skills if s in job_lower])
    matched_count = len(matched_skills)
    match_score = int((matched_count / max(total_job_skills, 1)) * 100) if total_job_skills > 0 else 50

    return {
        "match_score": min(match_score, 100),
        "matched_skills": matched_skills[:10],  # Limit to 10
        "missing_skills": missing_skills[:10],  # Limit to 10
        "matched_keywords": [],
        "missing_keywords": [],
        "experience_match": {
            "required_years": "Not specified",
            "candidate_years": "Not determined",
            "match_percentage": 50
        },
        "education_match": {
            "required": "Not specified",
            "candidate": "Not determined",
            "match": True
        },
        "missing_sections": [],
        "ats_issues": ["Unable to perform detailed ATS analysis"],
        "suggestions": [
            "Consider adding more relevant keywords from the job description",
            "Ensure your resume includes all your technical skills",
            "Add quantifiable achievements to strengthen your profile",
            "Review formatting for ATS compatibility"
        ],
        "strengths": ["Resume successfully processed"],
        "weaknesses": ["Analysis limited due to system constraints"],
        "overall_assessment": "Basic analysis completed. For detailed insights, please ensure AI service is properly configured.",
        "recommendation": "CONSIDER"
    }

# Alternative: Using Hugging Face free API as backup
def call_huggingface_api(prompt: str) -> str:
    """Backup method using Hugging Face free API"""

    HF_API_URL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium"
    HF_TOKEN = os.getenv('HUGGINGFACE_TOKEN', '')

    if not HF_TOKEN:
        raise Exception("Hugging Face token not configured")

    headers = {
        "Authorization": f"Bearer {HF_TOKEN}",
        "Content-Type": "application/json"
    }

    data = {
        "inputs": prompt,
        "parameters": {
            "max_length": 1000,
            "temperature": 0.3
        }
    }

    response = requests.post(HF_API_URL, headers=headers, json=data, timeout=30)

    if response.status_code == 200:
        result = response.json()
        return result[0]['generated_text'] if result else ""
    else:
        raise Exception(f"Hugging Face API failed with status {response.status_code}")
