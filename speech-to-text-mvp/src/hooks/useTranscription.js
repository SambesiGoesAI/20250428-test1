import { useState, useCallback } from 'react';
import transcriptionService from '../services/transcriptionService';

/**
 * Custom hook for managing transcription state and operations
 * @returns {Object} Transcription state and control functions
 */
export const useTranscription = () => {
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState(null);
  const [confidence, setConfidence] = useState(null);

  /**
   * Transcribe an audio blob
   * @param {Blob} audioBlob - Audio data to transcribe
   * @param {Object} options - Transcription options
   */
  const transcribe = useCallback(async (audioBlob, options = {}) => {
    try {
      setIsTranscribing(true);
      setError(null);

      const result = await transcriptionService.transcribe(audioBlob, options);

      setTranscript(result.transcript);
      setConfidence(result.confidence);

      return result;
    } catch (err) {
      console.error('Transcription error:', err);
      setError(err.message || 'Failed to transcribe audio');
      throw err;
    } finally {
      setIsTranscribing(false);
    }
  }, []);

  /**
   * Clear the current transcript
   */
  const clearTranscript = useCallback(() => {
    setTranscript('');
    setConfidence(null);
    setError(null);
  }, []);

  /**
   * Append text to the current transcript
   * @param {string} text - Text to append
   */
  const appendTranscript = useCallback((text) => {
    setTranscript(prev => prev ? `${prev} ${text}` : text);
  }, []);

  return {
    transcript,
    isTranscribing,
    error,
    confidence,
    transcribe,
    clearTranscript,
    appendTranscript
  };
};
