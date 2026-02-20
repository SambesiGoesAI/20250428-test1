/**
 * Transcription service layer for Deepgram API integration
 * This service can be easily swapped out for other providers (Google, AWS, Azure, etc.)
 */

const DEEPGRAM_API_URL = 'https://api.deepgram.com/v1/listen';

/**
 * Transcription service class
 */
class TranscriptionService {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  /**
   * Set or update the API key
   * @param {string} apiKey - Deepgram API key
   */
  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  /**
   * Transcribe an audio blob using Deepgram API
   * @param {Blob} audioBlob - Audio data to transcribe
   * @param {Object} options - Transcription options
   * @returns {Promise<Object>} Transcription result
   */
  async transcribe(audioBlob, options = {}) {
    if (!this.apiKey) {
      throw new Error('API key not set. Please provide a Deepgram API key.');
    }

    const {
      language = 'en-US',
      punctuate = true,
      model = 'nova-2',
      smartFormat = true
    } = options;

    try {
      // Build query parameters
      const params = new URLSearchParams({
        language,
        punctuate: punctuate.toString(),
        model,
        smart_format: smartFormat.toString()
      });

      // Make API request
      const response = await fetch(`${DEEPGRAM_API_URL}?${params}`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.apiKey}`,
          'Content-Type': audioBlob.type || 'audio/webm'
        },
        body: audioBlob
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Deepgram API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Extract transcript from response
      const transcript = data.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';
      const confidence = data.results?.channels?.[0]?.alternatives?.[0]?.confidence || 0;

      return {
        transcript,
        confidence,
        raw: data
      };
    } catch (error) {
      console.error('Transcription error:', error);
      throw error;
    }
  }

  /**
   * Check if the service is configured
   * @returns {boolean} True if API key is set
   */
  isConfigured() {
    return !!this.apiKey;
  }
}

// Create singleton instance
const transcriptionService = new TranscriptionService(
  import.meta.env.VITE_DEEPGRAM_API_KEY
);

export default transcriptionService;

/**
 * Factory function to create a new transcription service instance
 * Useful for testing or using multiple API keys
 * @param {string} apiKey - API key
 * @returns {TranscriptionService} New service instance
 */
export const createTranscriptionService = (apiKey) => {
  return new TranscriptionService(apiKey);
};
