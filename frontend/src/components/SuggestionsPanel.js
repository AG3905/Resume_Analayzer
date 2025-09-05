import React, { useState } from 'react';

const SuggestionsPanel = ({ analysisResult }) => {
  const [expandedSuggestion, setExpandedSuggestion] = useState(null);

  const {
    suggestions = [],
    strengths = [],
    weaknesses = [],
    missing_skills = [],
    ats_issues = []
  } = analysisResult || {};

  const getSuggestionIcon = (suggestion) => {
    const suggestionLower = suggestion.toLowerCase();
    if (suggestionLower.includes('summary') || suggestionLower.includes('profile')) return 'fas fa-user-edit';
    if (suggestionLower.includes('skill')) return 'fas fa-cogs';
    if (suggestionLower.includes('experience') || suggestionLower.includes('work')) return 'fas fa-briefcase';
    if (suggestionLower.includes('education')) return 'fas fa-graduation-cap';
    if (suggestionLower.includes('format') || suggestionLower.includes('table')) return 'fas fa-file-alt';
    if (suggestionLower.includes('keyword')) return 'fas fa-key';
    if (suggestionLower.includes('project')) return 'fas fa-code';
    if (suggestionLower.includes('certification')) return 'fas fa-certificate';
    return 'fas fa-lightbulb';
  };

  const getSuggestionPriority = (suggestion) => {
    const suggestionLower = suggestion.toLowerCase();
    if (suggestionLower.includes('table') || suggestionLower.includes('format') || suggestionLower.includes('ats')) return 'high';
    if (suggestionLower.includes('skill') || suggestionLower.includes('keyword')) return 'medium';
    return 'low';
  };

  const generateActionableSteps = (suggestion) => {
    const suggestionLower = suggestion.toLowerCase();

    if (suggestionLower.includes('summary')) {
      return [
        'Write a 2-3 line professional summary at the top of your resume',
        'Include your years of experience and key skills',
        'Mention your career objective or target role',
        'Use keywords from the job description'
      ];
    }

    if (suggestionLower.includes('skill')) {
      return [
        'Add a dedicated "Skills" or "Technical Skills" section',
        'List both hard and soft skills relevant to the job',
        'Group skills by category (e.g., Programming, Tools, Languages)',
        'Include proficiency levels where appropriate'
      ];
    }

    if (suggestionLower.includes('table') || suggestionLower.includes('format')) {
      return [
        'Remove tables and use simple text formatting',
        'Use standard fonts like Arial, Calibri, or Times New Roman',
        'Stick to black text on white background',
        'Use bullet points instead of complex layouts'
      ];
    }

    if (suggestionLower.includes('keyword')) {
      return [
        'Review the job description for important keywords',
        'Naturally incorporate these keywords in your experience descriptions',
        'Use industry-standard terminology',
        'Match the exact terms used in the job posting when possible'
      ];
    }

    return [
      'Review the specific area mentioned in the suggestion',
      'Research best practices for this section',
      'Update your resume accordingly',
      'Test the changes with ATS-friendly formats'
    ];
  };

  const toggleSuggestionExpansion = (index) => {
    setExpandedSuggestion(expandedSuggestion === index ? null : index);
  };

  // Categorize suggestions
  const categorizedSuggestions = {
    'High Priority': suggestions.filter(s => getSuggestionPriority(s) === 'high'),
    'Medium Priority': suggestions.filter(s => getSuggestionPriority(s) === 'medium'),
    'Low Priority': suggestions.filter(s => getSuggestionPriority(s) === 'low')
  };

  return (
    <div className="suggestions-panel">
      <div className="suggestions-header">
        <h3>
          <i className="fas fa-lightbulb"></i>
          Improvement Suggestions
        </h3>
        <div className="suggestions-count">
          <span>{suggestions.length} suggestions</span>
        </div>
      </div>

      {suggestions.length === 0 ? (
        <div className="no-suggestions">
          <i className="fas fa-trophy"></i>
          <h4>Excellent Resume!</h4>
          <p>No specific improvements suggested. Your resume appears to be well-optimized for this job.</p>
        </div>
      ) : (
        <div className="suggestions-content">
          {Object.entries(categorizedSuggestions).map(([priority, prioritySuggestions]) => (
            prioritySuggestions.length > 0 && (
              <div key={priority} className="priority-section">
                <h4 className={`priority-header ${priority.toLowerCase().replace(' ', '-')}`}>
                  <i className={`fas ${priority === 'High Priority' ? 'fa-exclamation-circle' : priority === 'Medium Priority' ? 'fa-clock' : 'fa-info-circle'}`}></i>
                  {priority} ({prioritySuggestions.length})
                </h4>

                <div className="suggestions-list">
                  {prioritySuggestions.map((suggestion, index) => {
                    const globalIndex = suggestions.indexOf(suggestion);
                    const isExpanded = expandedSuggestion === globalIndex;

                    return (
                      <div key={globalIndex} className={`suggestion-item ${getSuggestionPriority(suggestion)}`}>
                        <div 
                          className="suggestion-header"
                          onClick={() => toggleSuggestionExpansion(globalIndex)}
                        >
                          <div className="suggestion-icon">
                            <i className={getSuggestionIcon(suggestion)}></i>
                          </div>
                          <div className="suggestion-text">
                            <p>{suggestion}</p>
                          </div>
                          <div className="suggestion-toggle">
                            <i className={`fas ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="suggestion-details">
                            <h5>Action Steps:</h5>
                            <ul className="action-steps">
                              {generateActionableSteps(suggestion).map((step, stepIndex) => (
                                <li key={stepIndex}>
                                  <i className="fas fa-arrow-right"></i>
                                  {step}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {/* Quick Wins Section */}
      {(missing_skills.length > 0 || ats_issues.length > 0) && (
        <div className="quick-wins">
          <h4>
            <i className="fas fa-rocket"></i>
            Quick Wins
          </h4>

          <div className="wins-grid">
            {missing_skills.length > 0 && (
              <div className="win-item">
                <div className="win-icon">
                  <i className="fas fa-plus-circle"></i>
                </div>
                <div className="win-content">
                  <h5>Add Missing Skills</h5>
                  <p>Include {missing_skills.slice(0, 3).join(', ')} {missing_skills.length > 3 && `and ${missing_skills.length - 3} more`} skills if you have experience with them.</p>
                </div>
              </div>
            )}

            {ats_issues.length > 0 && (
              <div className="win-item">
                <div className="win-icon">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <div className="win-content">
                  <h5>Fix ATS Issues</h5>
                  <p>Resolve {ats_issues.length} formatting issue{ats_issues.length > 1 ? 's' : ''} to improve ATS compatibility.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Success Factors */}
      {strengths.length > 0 && (
        <div className="success-factors">
          <h4>
            <i className="fas fa-star"></i>
            Keep These Strengths
          </h4>

          <div className="strengths-list">
            {strengths.map((strength, index) => (
              <div key={index} className="strength-item">
                <i className="fas fa-check-circle"></i>
                <span>{strength}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SuggestionsPanel;