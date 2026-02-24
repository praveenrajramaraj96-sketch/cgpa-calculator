import React, { useState } from 'react';
import ResultDisplay from './ResultDisplay';
import './UploadResult.css';
import './CGPACalculator.css';

const CGPACalculator = ({ onBack }) => {
    const [step, setStep] = useState(1);
    const [numSemesters, setNumSemesters] = useState('');
    const [semestersData, setSemestersData] = useState([]);
    const [resultData, setResultData] = useState(null);

    const handleNumSemestersSubmit = (e) => {
        e.preventDefault();
        const count = parseInt(numSemesters, 10);
        if (count > 0 && count <= 12) {
            // Initialize array for each semester
            const initialData = Array.from({ length: count }, (_, i) => ({
                sem: i + 1,
                sgpa: ''
            }));
            setSemestersData(initialData);
            setStep(2);
        } else {
            alert('Please enter a valid number of semesters (between 1 and 12).');
        }
    };

    const handleSgpaChange = (index, field, value) => {
        const newData = [...semestersData];
        newData[index][field] = value;
        setSemestersData(newData);
    };

    const calculateCgpa = (e) => {
        e.preventDefault();
        let totalSgpa = 0;
        let validSemestersCount = 0;

        let isValid = true;
        const subjectsFormat = [];

        semestersData.forEach(sem => {
            const sgpaNum = parseFloat(sem.sgpa);

            if (isNaN(sgpaNum) || sgpaNum < 0 || sgpaNum > 10) {
                isValid = false;
            }

            if (isValid) {
                totalSgpa += sgpaNum;
                validSemestersCount++;

                subjectsFormat.push({
                    code: `SEM-${sem.sem}`,
                    name: `Semester ${sem.sem} SGPA`,
                    credits: '-',
                    grade: '-',
                    points: sgpaNum.toFixed(2)
                });
            }
        });

        if (!isValid) {
            alert("Please ensure all SGPA values are between 0 and 10.");
            return;
        }

        const cgpa = validSemestersCount > 0 ? (totalSgpa / validSemestersCount).toFixed(2) : 0;

        setResultData({
            gpa: cgpa,
            subjects: subjectsFormat
        });
        setStep(3);
    };

    const resetCalculator = () => {
        setStep(1);
        setNumSemesters('');
        setSemestersData([]);
        setResultData(null);
    };

    return (
        <div className="calculator-wrapper slide-in-top">
            <div className="nav-bar">
                <button onClick={onBack} className="back-btn glass-panel hover-lift">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Back to Menu
                </button>
            </div>

            {step === 1 && (
                <div className="upload-container glass-panel">
                    <h2>Manual CGPA Calculation</h2>
                    <p className="upload-subtitle">How many semesters have you completed so far?</p>
                    <form onSubmit={handleNumSemestersSubmit} className="manual-form">
                        <div className="input-group">
                            <input
                                type="number"
                                min="1"
                                max="12"
                                value={numSemesters}
                                onChange={(e) => setNumSemesters(e.target.value)}
                                placeholder="E.g., 6"
                                className="styled-input"
                                required
                            />
                        </div>
                        <button type="submit" className="primary-btn mt-4">Next Step</button>
                    </form>
                </div>
            )}

            {step === 2 && (
                <div className="upload-container glass-panel" style={{ maxWidth: '800px' }}>
                    <h2>Enter Semester Details</h2>
                    <p className="upload-subtitle">Enter your SGPA for each semester accurately.</p>
                    <form onSubmit={calculateCgpa} className="manual-form">
                        <div className="semesters-grid">
                            {semestersData.map((sem, idx) => (
                                <div key={idx} className="semester-input-card">
                                    <h4>Semester {sem.sem}</h4>
                                    <div className="input-row">
                                        <div className="input-group" style={{ width: '100%' }}>
                                            <label>SGPA (out of 10)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max="10"
                                                value={sem.sgpa}
                                                onChange={(e) => handleSgpaChange(idx, 'sgpa', e.target.value)}
                                                placeholder="e.g. 8.5"
                                                className="styled-input"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="action-buttons">
                            <button type="button" className="secondary-btn hover-lift" onClick={() => setStep(1)}>Back</button>
                            <button type="submit" className="primary-btn hover-lift">Calculate CGPA</button>
                        </div>
                    </form>
                </div>
            )}

            {step === 3 && resultData && (
                <ResultDisplay data={resultData} mode="cgpa" onReset={resetCalculator} />
            )}
        </div>
    );
};

export default CGPACalculator;
