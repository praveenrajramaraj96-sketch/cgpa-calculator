import React, { useState, useRef } from 'react';
import './UploadResult.css';

const UploadResult = ({ onUploadComplete }) => {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [loadingText, setLoadingText] = useState("Analyzing Mark Sheet...");
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelected(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFileSelected(e.target.files[0]);
        }
    };

    const onButtonClick = () => {
        inputRef.current.click();
    };

    const handleFileSelected = (selectedFile) => {
        if (!selectedFile.type.startsWith('image/')) {
            alert('Please upload an image file format (.jpg, .jpeg, .png)');
            return;
        }
        setFile(selectedFile);
        processImageWithOCR(selectedFile);
    };

    const processImageWithOCR = async (imageFile) => {
        setIsProcessing(true);
        setLoadingText("Sending to AI Engine...");

        const formData = new FormData();
        formData.append('file', imageFile);

        try {
            const response = await fetch('https://backend-three-eta-42.vercel.app/api/extract-marksheet/', {
                method: 'POST',
                body: formData,
                // Note: Don't set Content-Type header; browser does it for FormData
            });

            if (!response.ok) throw new Error("Server Error");

            const data = await response.json();

            // Check if the AI math matches our calculated math
            if (data.subjects && data.subjects.length > 0) {
                onUploadComplete({
                    gpa: data.calculated_gpa || data.gpa,
                    subjects: data.subjects
                });
            } else {
                throw new Error("No subjects detected");
            }

        } catch (error) {
            console.error(error);
            alert("AI Extraction failed. Please try a clearer photo.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="upload-container glass-panel slide-in-top">
            <h2>Upload Your Result Dashboard</h2>
            <p className="upload-subtitle">Drop a screenshot or photo of your mark sheet here, and we'll extract your grades automatically using AI.</p>

            {!isProcessing ? (
                <form
                    className={`drag-area ${dragActive ? 'drag-active' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={onButtonClick}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        className="file-input"
                        accept="image/*"
                        onChange={handleChange}
                    />
                    <div className="upload-icon">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                    </div>
                    <p className="drag-text">
                        <span>Click to browse</span> or drag & drop<br />
                        <small>JPG, PNG, WEBP supported</small>
                    </p>
                </form>
            ) : (
                <div className="processing-state">
                    <div className="scan-container">
                        <div className="scan-image">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-purple)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                            <div className="scan-line"></div>
                        </div>
                    </div>
                    <h3>{loadingText}</h3>
                    <p>Extracting subjects and calculating GPA using Computer Vision</p>
                </div>
            )}
        </div>
    );
};

export default UploadResult;
