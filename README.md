# 🤖 AI-Powered Resume Analyzer

A comprehensive web application that analyzes resumes against job descriptions using advanced AI technology. Built with React frontend and Flask backend, featuring real-time analysis, ATS compatibility checking, and detailed reporting.

## ✨ Features

### 🎯 Core Analysis
- **AI-Powered Matching**: Advanced resume analysis using Google Gemini API
- **Match Score**: Percentage-based compatibility score (0-100%)
- **Skills Gap Analysis**: Identifies matched and missing skills
- **Keyword Optimization**: Analyzes keyword alignment with job requirements
- **Experience Matching**: Compares candidate experience with job requirements

### 🛡️ ATS Compatibility
- **Format Checking**: Identifies ATS-unfriendly elements (tables, images, complex formatting)
- **Structure Analysis**: Detects missing resume sections
- **Optimization Tips**: Provides specific recommendations for ATS improvement

### 📊 Visual Dashboard
- **Interactive Charts**: Skills breakdown with Chart.js visualizations
- **Progress Indicators**: Visual representation of match scores
- **Categorized Results**: Organized display of analysis results
- **Responsive Design**: Works perfectly on desktop and mobile devices

### 📋 Detailed Reporting
- **Comprehensive Analysis**: Strengths, weaknesses, and improvement areas
- **Actionable Suggestions**: Step-by-step improvement recommendations
- **PDF Export**: Download detailed analysis reports
- **Priority Levels**: High, medium, and low priority suggestions

## 🚀 Quick Start

### Prerequisites
- Python 3.8+ with pip
- Node.js 16+ with npm
- Free Google Gemini API key ([Get one here](https://ai.google.dev/))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-resume-analyzer
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt

   # Set up environment variables
   export GEMINI_API_KEY="your-gemini-api-key-here"
   # Or create a .env file with your API key

   # Run the Flask server
   python app.py
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm start
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:

```bash
GEMINI_API_KEY=your-gemini-api-key-here
FLASK_ENV=development
SECRET_KEY=your-secret-key-here

# Optional: Alternative AI APIs
HUGGINGFACE_TOKEN=your-hf-token
OPENAI_API_KEY=your-openai-key
```

### API Configuration
The application uses **Google Gemini API** (free tier) by default. Alternative configurations:

- **Hugging Face**: Free inference API with rate limits
- **OpenAI**: Paid API with high accuracy
- **Local Models**: Use local LLMs for privacy

## 📁 Project Structure

```
ai-resume-analyzer/
├── backend/                    # Flask backend
│   ├── app.py                 # Main Flask application
│   ├── ai_analyzer.py         # AI analysis logic
│   ├── resume_parser.py       # PDF/DOCX text extraction
│   ├── utils.py              # Utility functions
│   ├── config.py             # Configuration settings
│   └── requirements.txt      # Python dependencies
├── frontend/                   # React frontend
│   ├── public/               # Static files
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── FileUpload.js
│   │   │   ├── Dashboard.js
│   │   │   ├── ResultsDisplay.js
│   │   │   ├── SkillsChart.js
│   │   │   ├── MatchScore.js
│   │   │   ├── ATSReport.js
│   │   │   └── SuggestionsPanel.js
│   │   ├── styles/           # CSS files
│   │   ├── App.js           # Main React app
│   │   └── index.js         # Entry point
│   └── package.json         # Node dependencies
└── README.md               # This file
```

## 🎨 Features in Detail

### File Upload Support
- **PDF files**: Extracted using PyPDF2
- **DOCX files**: Processed with python-docx
- **File size limit**: 16MB maximum
- **Drag & drop interface**: User-friendly upload experience

### AI Analysis Engine
- **Prompt Engineering**: Structured prompts for consistent results
- **Multi-model Support**: Fallback options for reliability
- **Error Handling**: Graceful degradation when APIs fail
- **Rate Limiting**: Respects free tier limitations

### Dashboard Components
- **Match Score**: Circular progress indicator with color coding
- **Skills Analysis**: Interactive donut charts and categorization
- **ATS Report**: Detailed compatibility analysis
- **Suggestions Panel**: Prioritized improvement recommendations

### Export Functionality
- **PDF Reports**: Professional-looking analysis reports
- **Downloadable**: Save results for future reference
- **Formatted**: Clean, readable layout with charts and metrics

## 🔌 API Endpoints

### Backend Endpoints
- `GET /` - API information and health check
- `POST /analyze` - Analyze resume against job description
- `POST /export-report` - Generate and download PDF report
- `GET /health` - Service health status

### Frontend Routes
- `/` - Main application (file upload + dashboard)
- All routing handled by React Router

## 🛠️ Development

### Backend Development
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run in debug mode
python app.py

# Run tests (if available)
python -m pytest tests/
```

### Frontend Development
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Adding New Features

1. **New AI Models**: Add configuration in `ai_analyzer.py`
2. **File Formats**: Extend `resume_parser.py` 
3. **UI Components**: Create in `src/components/`
4. **Styling**: Update `src/styles/App.css`

## 🚀 Deployment

### Production Deployment

1. **Backend** (using Gunicorn):
   ```bash
   cd backend
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

2. **Frontend** (build and serve):
   ```bash
   cd frontend
   npm run build
   # Serve the build folder with your preferred web server
   ```

### Docker Deployment
```bash
# Backend Dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]

# Frontend Dockerfile  
FROM node:16-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔍 Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify your Gemini API key is correct
   - Check if the free tier limits are exceeded
   - Ensure environment variables are properly set

2. **File Upload Fails**
   - Check file size (must be under 16MB)
   - Verify file format (PDF or DOCX only)
   - Ensure the backend server is running

3. **Analysis Fails**
   - Check internet connection for AI API calls
   - Verify the resume has extractable text
   - Review backend logs for specific errors

4. **CORS Issues**
   - Ensure Flask-CORS is properly configured
   - Check if frontend URL is in allowed origins
   - Verify both servers are running on correct ports

### Performance Optimization

1. **Backend**:
   - Use caching for repeated analyses
   - Implement request rate limiting
   - Optimize text extraction for large files

2. **Frontend**:
   - Implement lazy loading for components
   - Use React.memo for expensive components
   - Optimize chart rendering

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow PEP 8 for Python code
- Use ESLint configuration for JavaScript
- Write tests for new features
- Update documentation for API changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini API** for AI-powered analysis
- **React** and **Flask** for the robust framework foundation  
- **Chart.js** for beautiful visualizations
- **PyPDF2** and **python-docx** for document processing
- **Open source community** for inspiration and tools

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing [GitHub Issues](https://github.com/your-repo/issues)
3. Create a new issue with detailed information
4. Join our community discussions

---

**Built with ❤️ for job seekers and developers**

*Last updated: September 2025*
