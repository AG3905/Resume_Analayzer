import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const SkillsChart = ({ analysisResult }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const {
    matched_skills = [],
    missing_skills = [],
    match_score = 0
  } = analysisResult || {};

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    // Skills Overview Chart
    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Matched Skills', 'Missing Skills'],
        datasets: [{
          data: [matched_skills.length, missing_skills.length],
          backgroundColor: ['#10B981', '#F59E0B'],
          borderColor: ['#059669', '#D97706'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              font: {
                size: 14
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [matched_skills.length, missing_skills.length]);

  // Skills breakdown by category (simplified categorization)
  const categorizeSkills = (skills) => {
    const categories = {
      'Programming': [],
      'Frameworks': [],
      'Databases': [],
      'Cloud/DevOps': [],
      'Other': []
    };

    const categoryKeywords = {
      'Programming': ['python', 'java', 'javascript', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'typescript'],
      'Frameworks': ['react', 'angular', 'vue', 'django', 'flask', 'spring', 'express', 'laravel'],
      'Databases': ['sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'cassandra', 'oracle'],
      'Cloud/DevOps': ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'terraform', 'ansible']
    };

    skills.forEach(skill => {
      const skillLower = skill.toLowerCase();
      let categorized = false;

      for (const [category, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(keyword => skillLower.includes(keyword))) {
          categories[category].push(skill);
          categorized = true;
          break;
        }
      }

      if (!categorized) {
        categories['Other'].push(skill);
      }
    });

    return categories;
  };

  const matchedCategories = categorizeSkills(matched_skills);
  const missingCategories = categorizeSkills(missing_skills);

  return (
    <div className="skills-chart">
      <div className="chart-header">
        <h3>
          <i className="fas fa-chart-pie"></i>
          Skills Analysis
        </h3>
        <div className="score-badge">
          <span className="score-label">Match Score:</span>
          <span className={`score-value ${match_score >= 70 ? 'high' : match_score >= 50 ? 'medium' : 'low'}`}>
            {match_score}%
          </span>
        </div>
      </div>

      <div className="chart-content">
        <div className="chart-container">
          <canvas ref={chartRef}></canvas>
        </div>

        <div className="skills-breakdown">
          <div className="breakdown-section">
            <h4 className="text-success">
              <i className="fas fa-check-circle"></i>
              Matched Skills ({matched_skills.length})
            </h4>
            {Object.entries(matchedCategories).map(([category, skills]) => (
              skills.length > 0 && (
                <div key={category} className="category-group">
                  <h5>{category}</h5>
                  <div className="skills-list">
                    {skills.map((skill, index) => (
                      <span key={index} className="skill-tag matched">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>

          <div className="breakdown-section">
            <h4 className="text-warning">
              <i className="fas fa-exclamation-triangle"></i>
              Missing Skills ({missing_skills.length})
            </h4>
            {Object.entries(missingCategories).map(([category, skills]) => (
              skills.length > 0 && (
                <div key={category} className="category-group">
                  <h5>{category}</h5>
                  <div className="skills-list">
                    {skills.map((skill, index) => (
                      <span key={index} className="skill-tag missing">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Skills Matrix */}
      <div className="skills-matrix">
        <h4>Skills Matrix Overview</h4>
        <div className="matrix-grid">
          {Object.entries(matchedCategories).map(([category, matchedSkills]) => {
            const missingSkills = missingCategories[category] || [];
            const total = matchedSkills.length + missingSkills.length;
            const matchPercentage = total > 0 ? Math.round((matchedSkills.length / total) * 100) : 0;

            return total > 0 ? (
              <div key={category} className="matrix-item">
                <div className="matrix-header">
                  <span className="category-name">{category}</span>
                  <span className="category-score">{matchPercentage}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${matchPercentage}%` }}
                  ></div>
                </div>
                <div className="matrix-details">
                  <span className="matched">{matchedSkills.length} matched</span>
                  <span className="missing">{missingSkills.length} missing</span>
                </div>
              </div>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
};

export default SkillsChart;