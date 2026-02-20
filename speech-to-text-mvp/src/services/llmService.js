/**
 * LLM service using Groq API (OpenAI-compatible)
 * Model: llama-3.3-70b-versatile — fast, free, GPT-4 class quality
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

const SYSTEM_PROMPTS = {
  'en-US': `You are a helpful voice assistant. The user is speaking to you via microphone —
their speech has been transcribed to text. Keep your responses concise and conversational (2-4 sentences).
Avoid bullet points or markdown formatting since responses may be read aloud.`,
  'fi': `Olet avulias ääniavustaja. Käyttäjä puhuu sinulle mikrofonin kautta —
heidän puheensa on litteroitu tekstiksi. Pidä vastauksesi ytimekkäinä ja keskustelunomaisina (2-4 lausetta).
Vältä luettelomerkkejä tai markdown-muotoilua, koska vastaukset saatetaan lukea ääneen.
TÄRKEÄÄ: Vastaa AINA suomeksi, vaikka käyttäjä puhuisi englanniksi.`
};

class LLMService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.language = 'en-US';
  }

  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  setLanguage(language) {
    this.language = language;
  }

  /**
   * Send a message and get a response, maintaining conversation history
   * @param {string} userMessage - The transcribed user message
   * @param {Array} history - Previous messages [{role, content}]
   * @param {string} language - Language code ('en-US' or 'fi')
   * @returns {Promise<string>} The assistant's response text
   */
  async chat(userMessage, history = [], language = 'en-US') {
    if (!this.apiKey) {
      throw new Error('Groq API key not set. Add VITE_GROQ_API_KEY to your environment.');
    }

    const systemPrompt = SYSTEM_PROMPTS[language] || SYSTEM_PROMPTS['en-US'];

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: userMessage }
    ];

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        max_tokens: 300,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  isConfigured() {
    return !!this.apiKey;
  }
}

const llmService = new LLMService(import.meta.env.VITE_GROQ_API_KEY);

export default llmService;
