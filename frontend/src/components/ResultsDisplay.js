import React from 'react';

const ResultsDisplay = ({ analysisResult }) => {
  const {
    matched_skills = [],
    missing_skills = [],
    matched_keywords = [],
    missing_keywords = [],
    experience_match = {},
    education_match = {},
    strengths = [],
    weaknesses = [],
    overall_assessment = '',
    recommendation = ''
  } = analysisResult || {};

  const getRecommendationColor = (rec) => {
    switch (rec?.toUpperCase()) {
      case 'STRONG_FIT':
        return 'success';
      case 'CONSIDER':
        return 'warning';
      case 'WEAK_FIT':
        return 'danger';
      default:
        return 'info';
    }
  };

  const getRecommendationIcon = (rec) => {
    switch (rec?.toUpperCase()) {
      case 'STRONG_FIT':
        return 'fas fa-thumbs-up';
      case 'CONSIDER':
        return 'fas fa-balance-scale';
      case 'WEAK_FIT':
        return 'fas fa-thumbs-down';
      default:
        return 'fas fa-info-circle';
    }
  };

  return (
    <div className="results-display">
      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card matched">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3>{matched_skills.length}</h3>
            <p>Matched Skills</p>
          </div>
        </div>

        <div className="stat-card missing">
          <div className="stat-icon">
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <div className="stat-content">
            <h3>{missing_skills.length}</h3>
            <p>Missing Skills</p>
          </div>
        </div>

        <div className="stat-card keywords">
          <div className="stat-icon">
            <i className="fas fa-key"></i>
          </div>
          <div className="stat-content">
            <h3>{matched_keywords.length}</h3>
            <p>Matched Keywords</p>
          </div>
        </div>

        <div className={`stat-card recommendation ${getRecommendationColor(recommendation)}`}>
          <div className="stat-icon">
            <i className={getRecommendationIcon(recommendation)}></i>
          </div>
          <div className="stat-content">
            <h3>{recommendation || 'N/A'}</h3>
            <p>Recommendation</p>
          </div>
        </div>
      </div>

      {/* Skills Analysis */}
      <div className="analysis-grid">
        <div className="analysis-card">
          <h3>
            <i className="fas fa-check-circle text-success"></i>
            Matched Skills
          </h3>
          {matched_skills.length > 0 ? (
            <div className="skills-list">
              {matched_skills.map((skill, index) => (
                <span key={index} className="skill-tag matched">
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="empty-state">No skills matched</p>
          )}
        </div>

        <div className="analysis-card">
          <h3>
            <i className="fas fa-exclamation-triangle text-warning"></i>
            Missing Skills
          </h3>
          {missing_skills.length > 0 ? (
            <div className="skills-list">
              {missing_skills.map((skill, index) => (
                <span key={index} className="skill-tag missing">
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="empty-state">All required skills found!</p>
          )}
        </div>
      </div>

      {/* Experience & Education Match */}
      <div className="analysis-grid">
        <div className="analysis-card">
          <h3>
            <i className="fas fa-briefcase"></i>
            Experience Match
          </h3>
          <div className="match-details">
            <div className="match-row">
              <span className="label">Required:</span>
              <span className="value">{experience_match.required_years || 'Not specified'} years</span>
            </div>
            <div className="match-row">
              <span className="label">Candidate:</span>
              <span className="value">{experience_match.candidate_years || 'Not determined'} years</span>
            </div>
            <div className="match-row">
              <span className="label">Match:</span>
              <span className={`value ${experience_match.match_percentage >= 80 ? 'text-success' : experience_match.match_percentage >= 50 ? 'text-warning' : 'text-danger'}`}>
                {experience_match.match_percentage || 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="analysis-card">
          <h3>
            <i className="fas fa-graduation-cap"></i>
            Education Match
          </h3>
          <div className="match-details">
            <div className="match-row">
              <span className="label">Required:</span>
              <span className="value">{education_match.required || 'Not specified'}</span>
            </div>
            <div className="match-row">
              <span className="label">Candidate:</span>
              <span className="value">{education_match.candidate || 'Not determined'}</span>
            </div>
            <div className="match-row">
              <span className="label">Match:</span>
              <span className={`value ${education_match.match ? 'text-success' : 'text-warning'}`}>
                <i className={`fas ${education_match.match ? 'fa-check' : 'fa-times'}`}></i>
                {education_match.match ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="analysis-grid">
        <div className="analysis-card strengths">
          <h3>
            <i className="fas fa-star text-success"></i>
            Strengths
          </h3>
          {strengths.length > 0 ? (
            <ul className="points-list">
              {strengths.map((strength, index) => (
                <li key={index}>
                  <i className="fas fa-plus-circle"></i>
                  {strength}
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-state">No specific strengths identified</p>
          )}
        </div>

        <div className="analysis-card weaknesses">
          <h3>
            <i className="fas fa-exclamation-triangle text-warning"></i>
            Areas for Improvement
          </h3>
          {weaknesses.length > 0 ? (
            <ul className="points-list">
              {weaknesses.map((weakness, index) => (
                <li key={index}>
                  <i className="fas fa-minus-circle"></i>
                  {weakness}
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-state">No specific weaknesses identified</p>
          )}
        </div>
      </div>

      {/* Overall Assessment */}
      {overall_assessment && (
        <div className="analysis-card assessment">
          <h3>
            <i className="fas fa-clipboard-check"></i>
            Overall Assessment
          </h3>
          <div className="assessment-content">
            <p>{overall_assessment}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;