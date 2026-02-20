/**
 * Text-to-Speech service supporting multiple providers:
 * - Deepgram Aura for English
 * - Google Cloud TTS for Finnish
 * - ElevenLabs for multilingual (high quality)
 */

const DEEPGRAM_TTS_URL = 'https://api.deepgram.com/v1/speak';
const GOOGLE_TTS_URL = 'https://texttospeech.googleapis.com/v1/text:synthesize';
const ELEVENLABS_TTS_URL = 'https://api.elevenlabs.io/v1/text-to-speech';

class TTSService {
  constructor(deepgramKey, googleKey, elevenlabsKey) {
    this.deepgramKey = deepgramKey;
    this.googleKey = googleKey;
    this.elevenlabsKey = elevenlabsKey;
    this.currentAudio = null;
  }

  setDeepgramKey(apiKey) {
    this.deepgramKey = apiKey;
  }

  setGoogleKey(apiKey) {
    this.googleKey = apiKey;
  }

  setElevenlabsKey(apiKey) {
    this.elevenlabsKey = apiKey;
  }

  /**
   * Speak the given text using the appropriate TTS provider
   * @param {string} text - Text to speak
   * @param {string} language - Language code ('en-US' or 'fi')
   * @param {string} voiceQuality - For Google TTS Finnish: 'wavenet' or 'standard' (default: 'wavenet')
   * @param {string} provider - TTS provider: 'google' or 'elevenlabs' (default: 'google' for Finnish)
   * @returns {Promise<void>} Resolves when audio finishes playing
   */
  async speak(text, language = 'en-US', voiceQuality = 'wavenet', provider = 'google') {
    if (!text) return;

    // Stop any currently playing audio
    this.stop();

    // Choose provider based on language and preference
    if (language === 'fi') {
      if (provider === 'elevenlabs') {
        return this.speakElevenLabs(text, language);
      } else {
        const voiceName = voiceQuality === 'wavenet'
          ? 'fi-FI-Wavenet-A'
          : 'fi-FI-Standard-A';
        return this.speakGoogleTTS(text, voiceName);
      }
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
   * - fi-FI-Wavenet-A (Female, BEST quality available - more natural)
   */
  async speakGoogleTTS(text, voiceName = 'fi-FI-Wavenet-A') {
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
          speakingRate: 1.14, // 20% faster for more dynamic speech
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
   * Speak using ElevenLabs TTS (Multilingual - supports Finnish)
   * Using "Charlotte" voice (multilingual v2 model)
   */
  async speakElevenLabs(text, language = 'fi') {
    if (!this.elevenlabsKey) {
      throw new Error('ElevenLabs API key not set.');
    }

    // Charlotte - excellent multilingual voice
    const voiceId = 'XB0fDUnXU5powFXDhCwa';

    const response = await fetch(`${ELEVENLABS_TTS_URL}/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': this.elevenlabsKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail?.message || err.message || `ElevenLabs TTS error: ${response.status}`);
    }

    const audioBlob = await response.blob();
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

  isConfigured(language = 'en-US', provider = 'google') {
    if (language === 'fi') {
      return provider === 'elevenlabs' ? !!this.elevenlabsKey : !!this.googleKey;
    }
    return !!this.deepgramKey;
  }
}

const ttsService = new TTSService(
  import.meta.env.VITE_DEEPGRAM_API_KEY,
  import.meta.env.VITE_GOOGLE_TTS_KEY,
  import.meta.env.VITE_ELEVENLABS_API_KEY
);

export default ttsService;
