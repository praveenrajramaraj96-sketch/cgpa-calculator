import React, { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import ChoicePage from './components/ChoicePage';
import SGPACalculator from './components/SGPACalculator';
import CGPACalculator from './components/CGPACalculator';
import './App.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [selectedMode, setSelectedMode] = useState(null); // 'sgpa' or 'cgpa'

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleChoiceSelect = (mode) => {
    setSelectedMode(mode);
  };

  const handleBack = () => {
    setSelectedMode(null);
  };

  return (
    <div className="app-main">
      {showSplash ? (
        <SplashScreen onFinish={handleSplashFinish} />
      ) : selectedMode === null ? (
        <ChoicePage onChoiceSelect={handleChoiceSelect} />
      ) : selectedMode === 'sgpa' ? (
        <SGPACalculator onBack={handleBack} />
      ) : (
        <CGPACalculator onBack={handleBack} />
      )}
    </div>
  );
}

export default App;
