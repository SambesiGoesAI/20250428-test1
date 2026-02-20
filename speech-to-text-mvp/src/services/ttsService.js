/**
 * Text-to-Speech service supporting multiple providers:
 * - Deepgram Aura for English
 * - Google Cloud TTS for Finnish
 */

const DEEPGRAM_TTS_URL = 'https://api.deepgram.com/v1/speak';
const GOOGLE_TTS_URL = 'https://texttospeech.googleapis.com/v1/text:synthesize';

class TTSService {
  constructor(deepgramKey, googleKey) {
    this.deepgramKey = deepgramKey;
    this.googleKey = googleKey;
    this.currentAudio = null;
  }

  setDeepgramKey(apiKey) {
    this.deepgramKey = apiKey;
  }

  setGoogleKey(apiKey) {
    this.googleKey = apiKey;
  }

  /**
   * Speak the given text using the appropriate TTS provider based on language
   * @param {string} text - Text to speak
   * @param {string} language - Language code ('en-US' or 'fi')
   * @returns {Promise<void>} Resolves when audio finishes playing
   */
  async speak(text, language = 'en-US') {
    if (!text) return;

    // Stop any currently playing audio
    this.stop();

    // Choose provider based on language
    if (language === 'fi') {
      return this.speakGoogleTTS(text);
    } else {
      return this.speakDeepgram(text);
    }
  }

  /**
   * Speak using Deepgram Aura TTS (English)
   */
  async speakDeepgram(text, model = 'aura-2-thalia-en') {
    if (!this.deepgramKey) {
      throw new Error('Deepgram API key not set.');
    }

    const response = await fetch(`${DEEPGRAM_TTS_URL}?model=${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${this.deepgramKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `Deepgram TTS error: ${response.status}`);
    }

    const audioBlob = await response.blob();
    return this.playAudio(audioBlob);
  }

  /**
   * Speak using Google Cloud TTS (Finnish)
   * Available voices:
   * - fi-FI-Standard-A (Female, standard quality - robotic)
   * - fi-FI-Wavenet-A (Female, high quality - more natural)
   * - fi-FI-Neural2-A (Female, BEST quality - most natural, premium)
   */
  async speakGoogleTTS(text, voiceName = 'fi-FI-Neural2-A') {
    if (!this.googleKey) {
      throw new Error('Google TTS API key not set.');
    }

    const response = await fetch(`${GOOGLE_TTS_URL}?key=${this.googleKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: { text },
        voice: {
          languageCode: 'fi-FI',
          name: voiceName, // Using Wavenet-A for better quality
          ssmlGender: 'FEMALE'
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: 0.95, // Slightly slower for clearer pronunciation
          pitch: 0.0
        }
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `Google TTS error: ${response.status}`);
    }

    const data = await response.json();

    // Google returns base64-encoded audio
    const audioData = atob(data.audioContent);
    const audioArray = new Uint8Array(audioData.length);
    for (let i = 0; i < audioData.length; i++) {
      audioArray[i] = audioData.charCodeAt(i);
    }
    const audioBlob = new Blob([audioArray], { type: 'audio/mp3' });

    return this.playAudio(audioBlob);
  }

  /**
   * Play audio from a blob
   */
  playAudio(audioBlob) {
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

  isConfigured(language = 'en-US') {
    if (language === 'fi') {
      return !!this.googleKey;
    }
    return !!this.deepgramKey;
  }
}

const ttsService = new TTSService(
  import.meta.env.VITE_DEEPGRAM_API_KEY,
  import.meta.env.VITE_GOOGLE_TTS_KEY
);

export default ttsService;
