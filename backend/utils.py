import os
from datetime import datetime
import json
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch

def allowed_file(filename):
    """Check if file extension is allowed"""
    ALLOWED_EXTENSIONS = {'pdf', 'docx'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def validate_file_size(file):
    """Validate file size (max 16MB)"""
    MAX_SIZE = 16 * 1024 * 1024  # 16MB
    file.seek(0, os.SEEK_END)
    size = file.tell()
    file.seek(0)  # Reset file pointer
    return size <= MAX_SIZE

def generate_pdf_report(analysis_data):
    """Generate PDF report from analysis data"""

    try:
        # Create reports directory if it doesn't exist
        reports_dir = "reports"
        os.makedirs(reports_dir, exist_ok=True)

        # Generate filename with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"resume_analysis_report_{timestamp}.pdf"
        filepath = os.path.join(reports_dir, filename)

        # Create PDF document
        doc = SimpleDocTemplate(filepath, pagesize=letter,
                              rightMargin=72, leftMargin=72,
                              topMargin=72, bottomMargin=18)

        # Build PDF content
        story = []
        styles = getSampleStyleSheet()

        # Title
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=20,
            spaceAfter=30,
            textColor=colors.darkblue,
            alignment=1  # Center alignment
        )

        story.append(Paragraph("Resume Analysis Report", title_style))
        story.append(Spacer(1, 20))

        # Match Score Section
        score = analysis_data.get('match_score', 0)
        score_color = colors.green if score >= 70 else colors.orange if score >= 50 else colors.red

        score_style = ParagraphStyle(
            'ScoreStyle',
            parent=styles['Normal'],
            fontSize=16,
            textColor=score_color,
            alignment=1
        )

        story.append(Paragraph(f"Overall Match Score: <b>{score}%</b>", score_style))
        story.append(Spacer(1, 20))

        # Matched Skills
        if analysis_data.get('matched_skills'):
            story.append(Paragraph("<b>Matched Skills:</b>", styles['Heading3']))
            skills_text = ", ".join(analysis_data['matched_skills'])
            story.append(Paragraph(skills_text, styles['Normal']))
            story.append(Spacer(1, 12))

        # Missing Skills
        if analysis_data.get('missing_skills'):
            story.append(Paragraph("<b>Missing Skills:</b>", styles['Heading3']))
            missing_text = ", ".join(analysis_data['missing_skills'])
            story.append(Paragraph(missing_text, styles['Normal']))
            story.append(Spacer(1, 12))

        # ATS Issues
        if analysis_data.get('ats_issues'):
            story.append(Paragraph("<b>ATS Issues:</b>", styles['Heading3']))
            for issue in analysis_data['ats_issues']:
                story.append(Paragraph(f"• {issue}", styles['Normal']))
            story.append(Spacer(1, 12))

        # Suggestions
        if analysis_data.get('suggestions'):
            story.append(Paragraph("<b>Improvement Suggestions:</b>", styles['Heading3']))
            for suggestion in analysis_data['suggestions']:
                story.append(Paragraph(f"• {suggestion}", styles['Normal']))
            story.append(Spacer(1, 12))

        # Overall Assessment
        if analysis_data.get('overall_assessment'):
            story.append(Paragraph("<b>Overall Assessment:</b>", styles['Heading3']))
            story.append(Paragraph(analysis_data['overall_assessment'], styles['Normal']))
            story.append(Spacer(1, 12))

        # Footer
        story.append(Spacer(1, 30))
        footer_style = ParagraphStyle(
            'Footer',
            parent=styles['Normal'],
            fontSize=10,
            textColor=colors.grey,
            alignment=1
        )
        story.append(Paragraph(f"Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", footer_style))
        story.append(Paragraph("AI-Powered Resume Analyzer", footer_style))

        # Build PDF
        doc.build(story)

        return filepath

    except Exception as e:
        print(f"PDF generation error: {str(e)}")
        raise Exception(f"Failed to generate PDF report: {str(e)}")

def format_percentage(value, total=None):
    """Format percentage values"""
    if total and total > 0:
        return f"{(value/total)*100:.1f}%"
    return f"{value}%" if isinstance(value, (int, float)) else str(value)

def sanitize_filename(filename):
    """Sanitize filename for safe storage"""
    import re
    # Remove or replace unsafe characters
    filename = re.sub(r'[<>:"/\\|?*]', '_', filename)
    # Limit length
    name, ext = os.path.splitext(filename)
    if len(name) > 50:
        name = name[:50]
    return f"{name}{ext}"

def log_analysis_request(filename, job_title, timestamp=None):
    """Log analysis requests for monitoring"""

    if not timestamp:
        timestamp = datetime.now()

    log_data = {
        "timestamp": timestamp.isoformat(),
        "filename": filename,
        "job_title": job_title[:100] if job_title else "Not specified"  # Truncate long titles
    }

    # Append to log file
    log_file = "analysis_logs.json"

    try:
        # Read existing logs
        if os.path.exists(log_file):
            with open(log_file, 'r') as f:
                logs = json.load(f)
        else:
            logs = []

        # Add new log entry
        logs.append(log_data)

        # Keep only last 1000 entries to prevent file from growing too large
        if len(logs) > 1000:
            logs = logs[-1000:]

        # Write updated logs
        with open(log_file, 'w') as f:
            json.dump(logs, f, indent=2)

    except Exception as e:
        print(f"Logging error: {str(e)}")

def calculate_match_percentage(matched_items, total_items):
    """Calculate percentage match"""
    if total_items == 0:
        return 0
    return min(100, (len(matched_items) / total_items) * 100)

def extract_job_requirements(job_description):
    """Extract key requirements from job description"""

    import re

    requirements = {
        'skills': [],
        'experience_years': None,
        'education': None,
        'certifications': []
    }

    # Simple skill extraction (this can be enhanced)
    common_skills = [
        'python', 'java', 'javascript', 'react', 'angular', 'vue.js',
        'html', 'css', 'sql', 'mongodb', 'postgresql', 'mysql',
        'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git',
        'linux', 'windows', 'node.js', 'express', 'django', 'flask'
    ]

    job_lower = job_description.lower()

    for skill in common_skills:
        if skill in job_lower:
            requirements['skills'].append(skill.title())

    # Extract years of experience
    exp_pattern = r'(\d+)\+?\s*years?\s*(?:of\s*)?experience'
    exp_match = re.search(exp_pattern, job_lower)
    if exp_match:
        requirements['experience_years'] = int(exp_match.group(1))

    # Extract education requirements
    if 'bachelor' in job_lower or 'bs' in job_lower:
        requirements['education'] = 'Bachelor\'s degree'
    elif 'master' in job_lower or 'ms' in job_lower:
        requirements['education'] = 'Master\'s degree'
    elif 'phd' in job_lower or 'doctorate' in job_lower:
        requirements['education'] = 'PhD/Doctorate'

    return requirements

def create_error_response(error_message, error_code=400):
    """Create standardized error response"""
    return {
        "error": True,
        "message": error_message,
        "code": error_code,
        "timestamp": datetime.now().isoformat()
    }

def create_success_response(data, message="Success"):
    """Create standardized success response"""
    return {
        "success": True,
        "message": message,
        "data": data,
        "timestamp": datetime.now().isoformat()
    }
