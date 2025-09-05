import React from 'react';

const MatchScore = ({ score }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'fair';
    return 'poor';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 70) return 'Good Match';
    if (score >= 50) return 'Fair Match';
    return 'Needs Improvement';
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return 'fas fa-trophy';
    if (score >= 70) return 'fas fa-thumbs-up';
    if (score >= 50) return 'fas fa-balance-scale';
    return 'fas fa-chart-line';
  };

  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`match-score-container ${getScoreColor(score)}`}>
      <div className="score-visual">
        <svg className="score-circle" width="120" height="120">
          <circle
            className="score-background"
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <circle
            className="score-progress"
            cx="60"
            cy="60"
            r="45"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div className="score-content">
          <div className="score-number">{score}%</div>
          <i className={`score-icon ${getScoreIcon(score)}`}></i>
        </div>
      </div>

      <div className="score-details">
        <h3>{getScoreLabel(score)}</h3>
        <p>Resume compatibility with job requirements</p>

        <div className="score-indicators">
          <div className={`indicator ${score >= 25 ? 'active' : ''}`}></div>
          <div className={`indicator ${score >= 50 ? 'active' : ''}`}></div>
          <div className={`indicator ${score >= 75 ? 'active' : ''}`}></div>
          <div className={`indicator ${score >= 90 ? 'active' : ''}`}></div>
        </div>

        <div className="score-scale">
          <span>Poor</span>
          <span>Fair</span>
          <span>Good</span>
          <span>Excellent</span>
        </div>
      </div>
    </div>
  );
};

export default MatchScore;