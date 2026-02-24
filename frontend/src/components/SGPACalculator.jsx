import React, { useState } from 'react';
import UploadResult from './UploadResult';
import ResultDisplay from './ResultDisplay';

const SGPACalculator = ({ onBack }) => {
    const [resultData, setResultData] = useState(null);

    const handleUploadComplete = (data) => {
        // Process the data passed from the upload component
        setResultData(data);
    };

    const resetCalculator = () => {
        setResultData(null);
    };

    return (
        <div className="calculator-wrapper slide-in-top">
            <div className="nav-bar">
                <button
                    onClick={onBack}
                    className="back-btn glass-panel"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Back to Menu
                </button>
            </div>

            {!resultData ? (
                <UploadResult onUploadComplete={handleUploadComplete} mode="sgpa" />
            ) : (
                <ResultDisplay data={resultData} mode="sgpa" onReset={resetCalculator} />
            )}
        </div>
    );
};

export default SGPACalculator;
