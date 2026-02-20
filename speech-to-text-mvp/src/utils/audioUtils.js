/**
 * Audio utility functions for processing and converting audio data
 */

/**
 * Converts a Float32Array audio buffer to a WAV blob
 * @param {Float32Array} audioBuffer - The raw audio data
 * @param {number} sampleRate - The sample rate of the audio
 * @returns {Blob} WAV audio blob
 */
export const audioBufferToWav = (audioBuffer, sampleRate) => {
  const numChannels = 1; // Mono
  const bitsPerSample = 16;
  const bytesPerSample = bitsPerSample / 8;
  const blockAlign = numChannels * bytesPerSample;

  const buffer = new ArrayBuffer(44 + audioBuffer.length * bytesPerSample);
  const view = new DataView(buffer);

  // Write WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + audioBuffer.length * bytesPerSample, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, 'data');
  view.setUint32(40, audioBuffer.length * bytesPerSample, true);

  // Write audio data
  floatTo16BitPCM(view, 44, audioBuffer);

  return new Blob([buffer], { type: 'audio/wav' });
};

/**
 * Writes a string to a DataView
 * @param {DataView} view - The DataView to write to
 * @param {number} offset - The offset to start writing at
 * @param {string} string - The string to write
 */
const writeString = (view, offset, string) => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};

/**
 * Converts Float32Array to 16-bit PCM
 * @param {DataView} output - The output DataView
 * @param {number} offset - The offset to start writing at
 * @param {Float32Array} input - The input Float32Array
 */
const floatTo16BitPCM = (output, offset, input) => {
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
};

/**
 * Checks if the browser supports the Web Audio API
 * @returns {boolean} True if supported, false otherwise
 */
export const isAudioRecordingSupported = () => {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
};
