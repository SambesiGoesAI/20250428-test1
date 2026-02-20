import { useState, useRef, useCallback } from 'react';
import { audioBufferToWav } from '../utils/audioUtils';

/**
 * Custom hook for audio recording using Web Audio API
 * @returns {Object} Recording state and control functions
 */
export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  /**
   * Start recording audio from the user's microphone
   */
  const startRecording = useCallback(async () => {
    try {
      setError(null);
      audioChunksRef.current = [];

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        }
      });

      streamRef.current = stream;

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;

      // Collect audio data
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting recording:', err);
      setError(err.message || 'Failed to start recording');
    }
  }, []);

  /**
   * Stop recording and return the audio blob
   * @returns {Promise<Blob>} Audio blob
   */
  const stopRecording = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorderRef.current) {
        reject(new Error('No active recording'));
        return;
      }

      mediaRecorderRef.current.onstop = () => {
        // Create blob from recorded chunks
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm;codecs=opus'
        });

        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }

        setIsRecording(false);
        resolve(audioBlob);
      };

      mediaRecorderRef.current.onerror = (event) => {
        reject(new Error('Recording error: ' + event.error));
      };

      mediaRecorderRef.current.stop();
    });
  }, []);

  /**
   * Cancel the current recording without saving
   */
  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      audioChunksRef.current = [];
      setIsRecording(false);
    }
  }, [isRecording]);

  return {
    isRecording,
    error,
    startRecording,
    stopRecording,
    cancelRecording
  };
};
