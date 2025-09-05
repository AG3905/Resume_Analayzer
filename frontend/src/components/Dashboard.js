import React, { useState } from 'react';
import ResultsDisplay from './ResultsDisplay';
import SkillsChart from './SkillsChart';
import MatchScore from './MatchScore';
import ATSReport from './ATSReport';
import SuggestionsPanel from './SuggestionsPanel';
import axios from 'axios';

const Dashboard = ({ analysisResult, onReset }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isExporting, setIsExporting] = useState(false);

  const handleExportReport = async () => {
    setIsExporting(true);
    try {
      const response = await axios.post('/export-report', {
        analysis: analysisResult
      }, {
        responseType: 'blob'
      });

      // Create download link
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `resume_analysis_report_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export report. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'fas fa-chart-pie' },
    { id: 'skills', label: 'Skills Analysis', icon: 'fas fa-cogs' },
    { id: 'ats', label: 'ATS Report', icon: 'fas fa-shield-alt' },
    { id: 'suggestions', label: 'Suggestions', icon: 'fas fa-lightbulb' }
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h2>
            <i className="fas fa-chart-line"></i>
            Resume Analysis Results
          </h2>
          <div className="header-actions">
            <button
              onClick={handleExportReport}
              className="btn-secondary export-btn"
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <div className="spinner"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <i className="fas fa-download"></i>
                  Export PDF
                </>
              )}
            </button>
            <button onClick={onReset} className="btn-outline">
              <i className="fas fa-plus"></i>
              New Analysis
            </button>
          </div>
        </div>
      </div>

      {/* Match Score Card */}
      <div className="score-card">
        <MatchScore score={analysisResult?.match_score || 0} />
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <i className={tab.icon}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <ResultsDisplay analysisResult={analysisResult} />
        )}

        {activeTab === 'skills' && (
          <SkillsChart analysisResult={analysisResult} />
        )}

        {activeTab === 'ats' && (
          <ATSReport analysisResult={analysisResult} />
        )}

        {activeTab === 'suggestions' && (
          <SuggestionsPanel analysisResult={analysisResult} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;