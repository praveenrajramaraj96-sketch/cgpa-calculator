import React from 'react';
import './ResultDisplay.css';

const ResultDisplay = ({ data, mode, onReset }) => {
    const { gpa, subjects } = data;

    return (
        <div className="result-container slide-in-top">
            <div className="gpa-card glass-panel">
                <div className="gpa-header">
                    <h3>Your Calculated {mode.toUpperCase()}</h3>
                    <p>Based on the extracted mark sheet</p>
                </div>

                <div className="gpa-circle">
                    <svg className="circular-chart" viewBox="0 0 36 36">
                        <path
                            className="circle-bg"
                            d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        {/* The strokeDasharray is percentage, assuming scale is 10. so 8.75/10 * 100 = 87.5 */}
                        <path
                            className="circle"
                            strokeDasharray={`${(gpa / 10) * 100}, 100`}
                            d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <text x="18" y="20.35" className="percentage">{gpa}</text>
                    </svg>
                </div>
            </div>

            <div className="subjects-card glass-panel">
                <div className="subjects-header">
                    <h3>Extracted Subjects & Grades</h3>
                </div>
                <div className="table-responsive">
                    <table className="subjects-table">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Subject Name</th>
                                <th>Credits</th>
                                <th>Grade</th>
                                <th>Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map((sub, idx) => (
                                <tr key={idx}>
                                    <td><span className="code-badge">{sub.code}</span></td>
                                    <td className="subject-name">{sub.name}</td>
                                    <td>{sub.credits}</td>
                                    <td><span className={`grade-badge grade-${sub.grade.replace('+', '-plus')}`}>{sub.grade}</span></td>
                                    <td>{sub.points}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button className="recalculate-btn" onClick={onReset}>
                    Calculate Another Photo
                </button>
            </div>
        </div>
    );
};

export default ResultDisplay;
