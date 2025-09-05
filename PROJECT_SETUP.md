# 🚀 AI Resume Analyzer - Setup Guide

This guide will help you set up the AI-Powered Resume Analyzer project from scratch.

## 📋 Prerequisites

Before starting, make sure you have:

### Required Software
- **Python 3.8+** - [Download here](https://python.org/downloads/)
- **Node.js 16+** - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **Code Editor** - VS Code, PyCharm, or your preferred editor

### API Keys (Free)
- **Google Gemini API Key** - [Get it here](https://ai.google.dev/)
  - Visit Google AI Studio
  - Sign in with your Google account  
  - Click "Get API Key"
  - Create new project or select existing
  - Generate API key and copy it

## 🛠️ Step-by-Step Installation

### Step 1: Download the Project
```bash
# Extract the ZIP file to your desired location
# Navigate to the project directory
cd ai-resume-analyzer
```

### Step 2: Backend Setup (Flask)

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment (recommended):**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux  
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**

   **Option A: Create .env file (recommended)**
   ```bash
   # Create .env file in backend directory
   echo "GEMINI_API_KEY=your-actual-api-key-here" > .env
   echo "FLASK_ENV=development" >> .env
   echo "SECRET_KEY=your-secret-key-here" >> .env
   ```

   **Option B: Set environment variables directly**
   ```bash
   # Windows
   set GEMINI_API_KEY=your-actual-api-key-here

   # macOS/Linux
   export GEMINI_API_KEY=your-actual-api-key-here
   ```

5. **Test backend server:**
   ```bash
   python app.py
   ```

   You should see:
   ```
   * Running on http://0.0.0.0:5000
   * Debug mode: on
   ```

### Step 3: Frontend Setup (React)

1. **Open new terminal and navigate to frontend:**
   ```bash
   cd frontend  # From project root
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

   This will install:
   - React and React DOM
   - Chart.js for visualizations
   - Axios for API calls
   - React Dropzone for file uploads
   - All other dependencies

3. **Start development server:**
   ```bash
   npm start
   ```

   You should see:
   ```
   Compiled successfully!
   Local: http://localhost:3000
   ```

### Step 4: Verify Installation

1. **Check both servers are running:**
   - Backend: http://localhost:5000 (should show API info)
   - Frontend: http://localhost:3000 (should show the app)

2. **Test the application:**
   - Visit http://localhost:3000
   - Upload a sample PDF/DOCX resume
   - Paste a job description
   - Click "Analyze Resume"
   - Verify results appear in dashboard

## 🔧 Configuration Options

### Backend Configuration

Edit `backend/config.py` to customize:

```python
class Config:
    # File upload settings
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB
    ALLOWED_EXTENSIONS = {'pdf', 'docx'}

    # AI API settings
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')

    # Rate limiting
    RATE_LIMIT_PER_MINUTE = 10
```

### Frontend Configuration

Edit `frontend/package.json` proxy setting:

```json
{
  "proxy": "http://localhost:5000"
}
```

## 🚨 Common Setup Issues

### Backend Issues

**Issue: ModuleNotFoundError**
```bash
# Solution: Install missing packages
pip install -r requirements.txt

# If still failing, install individually:
pip install Flask Flask-CORS PyPDF2 python-docx requests reportlab
```

**Issue: API Key Not Working**
```bash
# Check your .env file exists and contains:
GEMINI_API_KEY=your-actual-key-here

# Verify the key is loaded:
python -c "import os; print(os.getenv('GEMINI_API_KEY'))"
```

**Issue: Port 5000 Already in Use**
```bash
# Change port in app.py:
app.run(debug=True, host='0.0.0.0', port=5001)

# Update frontend proxy in package.json:
"proxy": "http://localhost:5001"
```

### Frontend Issues

**Issue: npm install fails**
```bash
# Clear npm cache and try again:
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Issue: Port 3000 in use**
```bash
# React will automatically suggest port 3001
# Or set specific port:
PORT=3001 npm start  # macOS/Linux
set PORT=3001 && npm start  # Windows
```

**Issue: CORS errors**
```bash
# Verify backend is running on correct port
# Check proxy setting in package.json
# Ensure Flask-CORS is installed: pip install Flask-CORS
```

## 🎯 Testing Your Setup

### Quick Test Checklist

1. **✅ Backend Health Check**
   ```bash
   curl http://localhost:5000/health
   # Should return: {"status": "healthy", "timestamp": "..."}
   ```

2. **✅ File Upload Test**
   - Create a simple test PDF with some text
   - Upload through the web interface
   - Verify no console errors

3. **✅ AI Analysis Test**
   - Use the sample resume and job description below
   - Verify analysis completes successfully
   - Check all dashboard tabs work

### Sample Test Data

**Sample Job Description:**
```
Software Engineer - Frontend
We are looking for a Frontend Developer with 2+ years of experience in React, JavaScript, and CSS. Must have experience with REST APIs, Git, and responsive design. Knowledge of Node.js and Python is a plus.
```

**Sample Resume Text (create as PDF):**
```
John Doe
Software Developer

EXPERIENCE
Frontend Developer at TechCorp (2022-2024)
- Developed React applications
- Worked with JavaScript and CSS
- Integrated REST APIs
- Used Git for version control

SKILLS
- React
- JavaScript  
- CSS
- HTML
- Git
```

## 🚀 Next Steps

Once setup is complete:

1. **Customize the AI prompts** in `backend/ai_analyzer.py`
2. **Add new file format support** in `backend/resume_parser.py`
3. **Enhance the UI** by modifying React components
4. **Deploy to production** using the deployment guide

## 🆘 Getting Help

If you encounter issues:

1. **Check the logs:**
   - Backend: Look at terminal running `python app.py`
   - Frontend: Check browser console (F12)

2. **Verify API key:**
   ```bash
   # Test Gemini API directly:
   curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY" \
   -H "Content-Type: application/json" \
   -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
   ```

3. **Check file permissions:**
   ```bash
   # Ensure uploads directory exists:
   mkdir -p backend/uploads
   chmod 755 backend/uploads
   ```

4. **Review requirements:**
   - Python 3.8+ installed?
   - Node.js 16+ installed?
   - All dependencies installed?
   - API key properly set?

## 📚 Additional Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://reactjs.org/docs/)
- [Google Gemini API Docs](https://ai.google.dev/docs)
- [Chart.js Documentation](https://www.chartjs.org/docs/)

---

**Setup complete!** 🎉 Your AI Resume Analyzer is ready to use.
