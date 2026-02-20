import { useState } from 'react';
import MicrophoneButton from './MicrophoneButton';
import TranscriptDisplay from './TranscriptDisplay';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useTranscription } from '../hooks/useTranscription';
import './AudioRecorder.css';

/**
 * Main audio recorder component that combines recording and transcription
 * This is the primary component to use in your app
 * @param {Object} props - Component props
 * @param {Function} props.onTranscriptionComplete - Callback when transcription completes
 * @param {Object} props.transcriptionOptions - Options to pass to transcription service
 */
const AudioRecorder = ({
  onTranscriptionComplete,
  transcriptionOptions = {}
}) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const {
    isRecording,
    error: recordingError,
    startRecording,
    stopRecording
  } = useAudioRecorder();

  const {
    transcript,
    isTranscribing,
    error: transcriptionError,
    confidence,
    transcribe,
    clearTranscript
  } = useTranscription();

  const handleToggleRecording = async () => {
    if (isRecording) {
      try {
        // Stop recording and get audio blob
        const audioBlob = await stopRecording();

        // Transcribe the audio
        const result = await transcribe(audioBlob, transcriptionOptions);

        // Call callback if provided
        if (onTranscriptionComplete) {
          onTranscriptionComplete(result);
        }
      } catch (err) {
        console.error('Error processing audio:', err);
      }
    } else {
      // Start recording
      await startRecording();
    }
  };

  const handleCopy = () => {
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const error = recordingError || transcriptionError;

  return (
    <div className="audio-recorder">
      <div className="audio-recorder-content">
        <MicrophoneButton
          isRecording={isRecording}
          isProcessing={isTranscribing}
          onToggle={handleToggleRecording}
          disabled={isTranscribing}
          size="large"
        />

        <TranscriptDisplay
          transcript={transcript}
          confidence={confidence}
          isTranscribing={isTranscribing}
          error={error}
          onClear={clearTranscript}
          onCopy={handleCopy}
        />

        {copySuccess && (
          <div className="copy-notification">
            Copied to clipboard!
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;
