import React from 'react';
import './ChoicePage.css';

const ChoicePage = ({ onChoiceSelect }) => {
    return (
        <div className="choice-container">
            <div className="choice-header slide-in-top">
                <h2>What would you like to calculate?</h2>
                <p className="subtitle">Select the calculator that fits your needs</p>
            </div>

            <div className="choice-cards-wrapper">
                <button
                    className="choice-card glass-panel slide-in-left hover-lift"
                    onClick={() => onChoiceSelect('sgpa')}
                >
                    <div className="card-icon gradient-sgpa">
                        <span>S</span>
                    </div>
                    <h3>SGPA Calculator</h3>
                    <p>Calculate your Semester Grade Point Average for a single term.</p>
                </button>

                <button
                    className="choice-card glass-panel slide-in-right hover-lift"
                    onClick={() => onChoiceSelect('cgpa')}
                >
                    <div className="card-icon gradient-cgpa">
                        <span>C</span>
                    </div>
                    <h3>CGPA Calculator</h3>
                    <p>Calculate your Cumulative Grade Point Average across multiple terms.</p>
                </button>
            </div>
        </div>
    );
};

export default ChoicePage;
