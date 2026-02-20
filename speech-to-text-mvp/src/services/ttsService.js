/**
 * Text-to-Speech service using Deepgram Aura API
 * Uses the same API key as the transcription service
 */

const DEEPGRAM_TTS_URL = 'https://api.deepgram.com/v1/speak';

class TTSService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.currentAudio = null;
  }

  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  /**
   * Speak the given text using Deepgram Aura TTS
   * @param {string} text - Text to speak
   * @param {string} model - Deepgram Aura voice model (default: aura-asteria-en)
   * @returns {Promise<void>} Resolves when audio finishes playing
   */
  async speak(text, model = 'aura-asteria-en') {
    if (!this.apiKey) {
      throw new Error('API key not set.');
    }
    if (!text) return;

    // Stop any currently playing audio
    this.stop();

    const response = await fetch(`${DEEPGRAM_TTS_URL}?model=${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `Deepgram TTS error: ${response.status}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    this.currentAudio = audio;

    return new Promise((resolve, reject) => {
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        this.currentAudio = null;
        resolve();
      };
      audio.onerror = (e) => {
        URL.revokeObjectURL(audioUrl);
        this.currentAudio = null;
        reject(e);
      };
      audio.play();
    });
  }

  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
  }

  isConfigured() {
    return !!this.apiKey;
  }
}

const ttsService = new TTSService(import.meta.env.VITE_DEEPGRAM_API_KEY);

export default ttsService;
