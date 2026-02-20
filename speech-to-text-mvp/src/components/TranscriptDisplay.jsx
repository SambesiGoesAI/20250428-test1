import './TranscriptDisplay.css';

/**
 * Component to display transcription results
 * @param {Object} props - Component props
 * @param {string} props.transcript - The transcribed text
 * @param {number} props.confidence - Confidence score (0-1)
 * @param {boolean} props.isTranscribing - Whether transcription is in progress
 * @param {string} props.error - Error message if any
 * @param {Function} props.onClear - Callback to clear transcript
 * @param {Function} props.onCopy - Callback to copy transcript
 */
const TranscriptDisplay = ({
  transcript = '',
  confidence = null,
  isTranscribing = false,
  error = null,
  onClear,
  onCopy,
  onSpeak,
  isSpeaking = false
}) => {
  const handleCopy = () => {
    if (transcript && onCopy) {
      navigator.clipboard.writeText(transcript);
      onCopy();
    }
  };

  const getConfidenceClass = () => {
    if (!confidence) return '';
    if (confidence >= 0.8) return 'high';
    if (confidence >= 0.5) return 'medium';
    return 'low';
  };

  const formatConfidence = () => {
    if (!confidence) return null;
    return `${Math.round(confidence * 100)}%`;
  };

  return (
    <div className="transcript-display">
      <div className="transcript-header">
        <h2>Transcript</h2>
        {transcript && (
          <div className="transcript-actions">
            {confidence !== null && (
              <span className={`confidence-badge ${getConfidenceClass()}`}>
                Confidence: {formatConfidence()}
              </span>
            )}
            <button
              className={`action-button speak-button${isSpeaking ? ' speaking' : ''}`}
              onClick={onSpeak}
              disabled={isSpeaking}
              title={isSpeaking ? 'Speaking...' : 'Speak transcript'}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
              {isSpeaking ? 'Speaking...' : 'Speak'}
            </button>
            <button
              className="action-button copy-button"
              onClick={handleCopy}
              title="Copy to clipboard"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </button>
            <button
              className="action-button clear-button"
              onClick={onClear}
              title="Clear transcript"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              Clear
            </button>
          </div>
        )}
      </div>

      <div className="transcript-content">
        {error && (
          <div className="transcript-error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p>{error}</p>
          </div>
        )}

        {isTranscribing && !error && (
          <div className="transcript-loading">
            <div className="loading-spinner"></div>
            <p>Transcribing audio...</p>
          </div>
        )}

        {!isTranscribing && !error && !transcript && (
          <div className="transcript-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
            <p>Your transcript will appear here</p>
            <span className="transcript-hint">Click the microphone to start recording</span>
          </div>
        )}

        {transcript && !isTranscribing && (
          <div className="transcript-text">
            <p>{transcript}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscriptDisplay;
