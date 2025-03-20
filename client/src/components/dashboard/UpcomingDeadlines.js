import React from 'react';

const UpcomingDeadlines = () => {
  // This would typically use data from Redux
  const deadlines = [
    {
      id: '1',
      title: 'Q2 Data Collection Deadline',
      date: '2025-04-15',
      daysRemaining: 26,
      priority: 'high'
    },
    {
      id: '2',
      title: 'Annual Disclosure Submission',
      date: '2025-05-30',
      daysRemaining: 71,
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Board ESG Review Meeting',
      date: '2025-04-05',
      daysRemaining: 16,
      priority: 'high'
    }
  ];
  
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  };
  
  return (
    <div className="upcoming-deadlines">
      <h3 className="component-title">Upcoming Deadlines</h3>
      
      <div className="deadlines-list">
        {deadlines.map((deadline) => (
          <div key={deadline.id} className="deadline-item">
            <div className="deadline-info">
              <h4>{deadline.title}</h4>
              <div className="deadline-meta">
                <span className="deadline-date">{deadline.date}</span>
                <span className={`deadline-priority ${getPriorityClass(deadline.priority)}`}>
                  {deadline.priority}
                </span>
              </div>
            </div>
            <div className="days-remaining">
              <span className="days-count">{deadline.daysRemaining}</span>
              <span className="days-label">days</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingDeadlines;