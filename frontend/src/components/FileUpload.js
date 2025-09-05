import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const FileUpload = ({ onAnalysisComplete, onAnalysisError, isLoading, setIsLoading }) => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      onAnalysisError('Please upload only PDF or DOCX files (max 16MB)');
      return;
    }

    if (acceptedFiles.length > 0) {
      const uploadedFile = acceptedFiles[0];
      setFile(uploadedFile);
    }
  }, [onAnalysisError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    maxSize: 16 * 1024 * 1024 // 16MB
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      onAnalysisError('Please select a resume file');
      return;
    }

    if (!jobDescription.trim()) {
      onAnalysisError('Please provide a job description');
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('job_description', jobDescription);

    try {
      const response = await axios.post('/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });

      if (response.data.success) {
        onAnalysisComplete(response.data.analysis);
      } else {
        onAnalysisError(response.data.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage = error.response?.data?.error || 'Failed to analyze resume. Please try again.';
      onAnalysisError(errorMessage);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <div className="file-upload-container">
      <div className="upload-card">
        <h2>Upload Your Resume</h2>
        <p>Get AI-powered analysis of your resume against any job description</p>

        <form onSubmit={handleSubmit} className="upload-form">
          {/* File Upload Area */}
          <div className="form-group">
            <label>Resume File (PDF or DOCX)</label>
            {!file ? (
              <div
                {...getRootProps()}
                className={`dropzone ${isDragActive ? 'active' : ''}`}
              >
                <input {...getInputProps()} />
                <div className="dropzone-content">
                  <i className="fas fa-cloud-upload-alt"></i>
                  <h3>
                    {isDragActive
                      ? 'Drop your resume here'
                      : 'Drag & drop your resume here'}
                  </h3>
                  <p>or <span className="browse-link">browse files</span></p>
                  <div className="file-types">
                    <span>PDF</span>
                    <span>DOCX</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="file-selected">
                <div className="file-info">
                  <i className="fas fa-file-alt"></i>
                  <div>
                    <h4>{file.name}</h4>
                    <p>{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="remove-file"
                  disabled={isLoading}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}
          </div>

          {/* Job Description */}
          <div className="form-group">
            <label htmlFor="jobDescription">
              Job Description
              <span className="required">*</span>
            </label>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the complete job description here. Include requirements, responsibilities, and qualifications for best analysis results..."
              rows={8}
              disabled={isLoading}
              required
            />
            <div className="char-count">
              {jobDescription.length} characters
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary analyze-btn"
              disabled={isLoading || !file || !jobDescription.trim()}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <i className="fas fa-search"></i>
                  Analyze Resume
                </>
              )}
            </button>
          </div>

          {/* Progress Bar */}
          {isLoading && uploadProgress > 0 && (
            <div className="progress-container">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <span className="progress-text">{uploadProgress}%</span>
            </div>
          )}
        </form>

        {/* Features List */}
        <div className="features-list">
          <h3>What You'll Get:</h3>
          <ul>
            <li><i className="fas fa-chart-line"></i> AI-powered match score</li>
            <li><i className="fas fa-check-circle"></i> Skills gap analysis</li>
            <li><i className="fas fa-robot"></i> ATS compatibility check</li>
            <li><i className="fas fa-lightbulb"></i> Improvement suggestions</li>
            <li><i className="fas fa-download"></i> Detailed PDF report</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;