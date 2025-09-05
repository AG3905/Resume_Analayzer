import React from 'react';

const ATSReport = ({ analysisResult }) => {
  const {
    ats_issues = [],
    missing_sections = [],
    matched_keywords = [],
    missing_keywords = []
  } = analysisResult || {};

  const getIssueIcon = (issue) => {
    const issueLower = issue.toLowerCase();
    if (issueLower.includes('table')) return 'fas fa-table';
    if (issueLower.includes('image') || issueLower.includes('graphic')) return 'fas fa-image';
    if (issueLower.includes('font')) return 'fas fa-font';
    if (issueLower.includes('format')) return 'fas fa-file-alt';
    return 'fas fa-exclamation-triangle';
  };

  const getSectionIcon = (section) => {
    const sectionLower = section.toLowerCase();
    if (sectionLower.includes('summary') || sectionLower.includes('profile')) return 'fas fa-user';
    if (sectionLower.includes('experience') || sectionLower.includes('work')) return 'fas fa-briefcase';
    if (sectionLower.includes('education')) return 'fas fa-graduation-cap';
    if (sectionLower.includes('skill')) return 'fas fa-cogs';
    if (sectionLower.includes('project')) return 'fas fa-code';
    if (sectionLower.includes('certification')) return 'fas fa-certificate';
    if (sectionLower.includes('contact')) return 'fas fa-phone';
    return 'fas fa-file-text';
  };

  const atsScore = () => {
    let score = 100;
    score -= ats_issues.length * 10; // -10 for each ATS issue
    score -= missing_sections.length * 5; // -5 for each missing section
    return Math.max(0, Math.min(100, score));
  };

  const getATSScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  };

  const currentATSScore = atsScore();

  return (
    <div className="ats-report">
      <div className="ats-header">
        <h3>
          <i className="fas fa-shield-alt"></i>
          ATS Compatibility Report
        </h3>
        <div className={`ats-score ${getATSScoreColor(currentATSScore)}`}>
          <span className="score-label">ATS Score:</span>
          <span className="score-value">{currentATSScore}%</span>
        </div>
      </div>

      <div className="ats-content">
        {/* ATS Issues */}
        <div className="report-section">
          <h4 className="section-title">
            <i className={`fas fa-exclamation-triangle ${ats_issues.length > 0 ? 'text-warning' : 'text-success'}`}></i>
            ATS Issues {ats_issues.length > 0 && `(${ats_issues.length})`}
          </h4>

          {ats_issues.length > 0 ? (
            <div className="issues-list">
              {ats_issues.map((issue, index) => (
                <div key={index} className="issue-item">
                  <div className="issue-icon">
                    <i className={getIssueIcon(issue)}></i>
                  </div>
                  <div className="issue-content">
                    <p>{issue}</p>
                  </div>
                  <div className="issue-severity">
                    <span className="severity-badge high">High</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="success-message">
              <i className="fas fa-check-circle"></i>
              <p>No ATS issues detected! Your resume format is ATS-friendly.</p>
            </div>
          )}
        </div>

        {/* Missing Sections */}
        <div className="report-section">
          <h4 className="section-title">
            <i className={`fas fa-list-ul ${missing_sections.length > 0 ? 'text-warning' : 'text-success'}`}></i>
            Resume Structure {missing_sections.length > 0 && `(${missing_sections.length} missing)`}
          </h4>

          {missing_sections.length > 0 ? (
            <div className="missing-sections">
              <p className="section-description">
                The following sections are commonly expected in resumes and could improve ATS parsing:
              </p>
              <div className="sections-grid">
                {missing_sections.map((section, index) => (
                  <div key={index} className="section-item missing">
                    <i className={getSectionIcon(section)}></i>
                    <span>{section}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="success-message">
              <i className="fas fa-check-circle"></i>
              <p>All essential resume sections are present!</p>
            </div>
          )}
        </div>

        {/* Keyword Analysis */}
        <div className="report-section">
          <h4 className="section-title">
            <i className="fas fa-key"></i>
            Keyword Optimization
          </h4>

          <div className="keywords-analysis">
            <div className="keywords-row">
              <div className="keywords-group matched">
                <h5>
                  <i className="fas fa-check-circle text-success"></i>
                  Matched Keywords ({matched_keywords.length})
                </h5>
                {matched_keywords.length > 0 ? (
                  <div className="keywords-list">
                    {matched_keywords.map((keyword, index) => (
                      <span key={index} className="keyword-tag matched">
                        {keyword}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="empty-state">No specific keywords identified</p>
                )}
              </div>

              <div className="keywords-group missing">
                <h5>
                  <i className="fas fa-exclamation-triangle text-warning"></i>
                  Missing Keywords ({missing_keywords.length})
                </h5>
                {missing_keywords.length > 0 ? (
                  <div className="keywords-list">
                    {missing_keywords.map((keyword, index) => (
                      <span key={index} className="keyword-tag missing">
                        {keyword}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="empty-state">All important keywords found!</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ATS Tips */}
        <div className="report-section">
          <h4 className="section-title">
            <i className="fas fa-lightbulb"></i>
            ATS Optimization Tips
          </h4>

          <div className="tips-grid">
            <div className="tip-card">
              <i className="fas fa-file-text"></i>
              <h5>Simple Formatting</h5>
              <p>Use standard fonts (Arial, Calibri, Times New Roman) and avoid complex layouts, tables, or graphics.</p>
            </div>

            <div className="tip-card">
              <i className="fas fa-key"></i>
              <h5>Keywords</h5>
              <p>Include relevant keywords from the job description naturally throughout your resume.</p>
            </div>

            <div className="tip-card">
              <i className="fas fa-list-ul"></i>
              <h5>Standard Sections</h5>
              <p>Use common section headers like "Work Experience", "Education", "Skills", and "Contact Information".</p>
            </div>

            <div className="tip-card">
              <i className="fas fa-file-pdf"></i>
              <h5>File Format</h5>
              <p>Save as PDF or DOCX to preserve formatting across different systems.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSReport;