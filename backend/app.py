from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
from werkzeug.utils import secure_filename
from ai_analyzer import analyze_resume
from resume_parser import extract_text_from_file
from utils import allowed_file, generate_pdf_report
import traceback

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB max file size
ALLOWED_EXTENSIONS = {'pdf', 'docx'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def home():
    return jsonify({
        "message": "AI-Powered Resume Analyzer API",
        "version": "1.0.0",
        "endpoints": {
            "/analyze": "POST - Analyze resume",
            "/health": "GET - Health check"
        }
    })

@app.route('/health')
def health_check():
    return jsonify({"status": "healthy", "timestamp": str(datetime.now())})

@app.route('/analyze', methods=['POST'])
def analyze_resume_endpoint():
    try:
        # Check if file is present
        if 'resume' not in request.files:
            return jsonify({"error": "No resume file provided"}), 400

        file = request.files['resume']
        job_description = request.form.get('job_description', '')

        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400

        if not allowed_file(file.filename):
            return jsonify({"error": "File type not allowed. Please upload PDF or DOCX files only."}), 400

        if not job_description.strip():
            return jsonify({"error": "Job description is required"}), 400

        # Save uploaded file
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        try:
            # Extract text from resume
            resume_text = extract_text_from_file(file_path)

            if not resume_text.strip():
                return jsonify({"error": "Could not extract text from the resume. Please ensure the file is not corrupted."}), 400

            # Analyze resume with AI
            analysis_result = analyze_resume(resume_text, job_description)

            # Clean up uploaded file
            os.remove(file_path)

            return jsonify({
                "success": True,
                "analysis": analysis_result,
                "filename": filename
            })

        except Exception as analysis_error:
            # Clean up file in case of error
            if os.path.exists(file_path):
                os.remove(file_path)

            print(f"Analysis error: {str(analysis_error)}")
            return jsonify({
                "error": f"Analysis failed: {str(analysis_error)}"
            }), 500

    except Exception as e:
        print(f"Server error: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": "Internal server error"}), 500

@app.route('/export-report', methods=['POST'])
def export_report():
    try:
        data = request.get_json()
        report_data = data.get('analysis')

        if not report_data:
            return jsonify({"error": "No analysis data provided"}), 400

        # Generate PDF report
        pdf_path = generate_pdf_report(report_data)

        return send_from_directory(
            directory=os.path.dirname(pdf_path),
            path=os.path.basename(pdf_path),
            as_attachment=True
        )

    except Exception as e:
        print(f"Export error: {str(e)}")
        return jsonify({"error": "Failed to generate report"}), 500

if __name__ == '__main__':
    from datetime import datetime
    app.run(debug=True, host='127.0.0.1', port=5000)
