import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fading out slightly before the full duration ends
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2500); // Trigger fade out at 2.5s

    // Call onFinish when animation is complete
    const finishTimer = setTimeout(() => {
      onFinish();
    }, 3000); // Total splash duration 3s

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className={`splash-container ${fadeOut ? 'fade-out' : ''}`}>
      <div className="splash-content glass-panel">
        <h1 className="splash-title">
          <span className="gradient-text">CGPA</span> Calculator
        </h1>
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
