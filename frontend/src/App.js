import React, { useState } from 'react';
import './styles/App.css';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
    setError(null);
  };

  const handleAnalysisError = (error) => {
    setError(error);
    setAnalysisResult(null);
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="container">
          <h1>
            <i className="fas fa-robot"></i>
            AI-Powered Resume Analyzer
          </h1>
          <p>Analyze your resume against job descriptions with advanced AI</p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {error && (
            <div className="error-banner">
              <i className="fas fa-exclamation-triangle"></i>
              <div>
                <h3>Analysis Error</h3>
                <p>{error}</p>
                <button onClick={handleReset} className="btn-secondary">
                  Try Again
                </button>
              </div>
            </div>
          )}

          {!analysisResult && !error && (
            <FileUpload
              onAnalysisComplete={handleAnalysisComplete}
              onAnalysisError={handleAnalysisError}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          )}

          {analysisResult && (
            <Dashboard
              analysisResult={analysisResult}
              onReset={handleReset}
            />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>&copy; 2025 AI Resume Analyzer. Built with React + Flask + AI.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;