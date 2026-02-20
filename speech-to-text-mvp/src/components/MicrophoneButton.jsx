import { useState } from 'react';
import './MicrophoneButton.css';

/**
 * Reusable microphone button component
 * @param {Object} props - Component props
 * @param {boolean} props.isRecording - Whether recording is active
 * @param {boolean} props.isProcessing - Whether audio is being processed
 * @param {Function} props.onToggle - Callback when button is clicked
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {string} props.size - Button size ('small', 'medium', 'large')
 */
const MicrophoneButton = ({
  isRecording = false,
  isProcessing = false,
  onToggle,
  disabled = false,
  size = 'large'
}) => {
  const [isPulsing, setIsPulsing] = useState(false);

  const handleClick = () => {
    if (!disabled && onToggle) {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 200);
      onToggle();
    }
  };

  const getButtonClass = () => {
    const classes = ['microphone-button', size];
    if (isRecording) classes.push('recording');
    if (isProcessing) classes.push('processing');
    if (disabled) classes.push('disabled');
    if (isPulsing) classes.push('pulse');
    return classes.join(' ');
  };

  const getStatusText = () => {
    if (isProcessing) return 'Processing...';
    if (isRecording) return 'Recording... (Click to stop)';
    return 'Click to record';
  };

  return (
    <div className="microphone-button-container">
      <button
        className={getButtonClass()}
        onClick={handleClick}
        disabled={disabled}
        aria-label={getStatusText()}
        title={getStatusText()}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isRecording ? (
            // Stop icon when recording
            <rect x="6" y="6" width="12" height="12" rx="2" />
          ) : (
            // Microphone icon when not recording
            <>
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </>
          )}
        </svg>
      </button>

      {isRecording && (
        <div className="recording-indicator">
          <span className="recording-dot"></span>
          <span className="recording-text">Recording</span>
        </div>
      )}

      {isProcessing && (
        <div className="processing-indicator">
          <span className="processing-text">Processing audio...</span>
        </div>
      )}
    </div>
  );
};

export default MicrophoneButton;
