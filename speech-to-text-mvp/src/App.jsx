import { useState } from 'react';
import AudioRecorder from './components/AudioRecorder'
import ChatDisplay from './components/ChatDisplay';
import llmService from './services/llmService';
import './App.css'


function App() {
  const [language, setLanguage] = useState('en-US');
  const [voiceQuality, setVoiceQuality] = useState('wavenet'); // 'wavenet' or 'standard'
  const [ttsProvider, setTtsProvider] = useState('elevenlabs'); // 'google' or 'elevenlabs'
  const [chatHistory, setChatHistory] = useState([]);
  const [isThinking, setIsThinking] = useState(false);

  const handleTranscriptionComplete = async (result) => {
    const userText = result.transcript;
    if (!userText) return;

    // Add user message to chat immediately
    const updatedHistory = [...chatHistory, { role: 'user', content: userText }];
    setChatHistory(updatedHistory);
    setIsThinking(true);

    try {
      // Send to Groq with full history for multi-turn context
      const reply = await llmService.chat(userText, chatHistory, language);
      setChatHistory([...updatedHistory, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error('LLM error:', err);
      setChatHistory([...updatedHistory, {
        role: 'assistant',
        content: `Error: ${err.message}`
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="App">
      <div className="controls-panel">
        <button
          className="language-toggle"
          onClick={() => setLanguage(language === 'en-US' ? 'fi' : 'en-US')}
        >
          {language === 'en-US' ? 'English' : 'Finnish'}
        </button>

        {language === 'fi' && (
          <>
            <button
              className="voice-quality-toggle"
              onClick={() => setTtsProvider(ttsProvider === 'google' ? 'elevenlabs' : 'google')}
              title={ttsProvider === 'elevenlabs' ? 'Using ElevenLabs (Premium)' : 'Using Google TTS'}
            >
              {ttsProvider === 'elevenlabs' ? '🎙️ ElevenLabs' : '🔊 Google TTS'}
            </button>

            {ttsProvider === 'google' && (
              <button
                className="voice-quality-toggle"
                onClick={() => setVoiceQuality(voiceQuality === 'wavenet' ? 'standard' : 'wavenet')}
                title={voiceQuality === 'wavenet' ? 'Using WaveNet (Best Quality)' : 'Using Standard (Basic Quality)'}
              >
                {voiceQuality === 'wavenet' ? '⭐ WaveNet' : '✓ Standard'}
              </button>
            )}
          </>
        )}
      </div>

      <AudioRecorder
        onTranscriptionComplete={handleTranscriptionComplete}
        transcriptionOptions={{
          language,
          punctuate: true,
          model: 'nova-2',
          smartFormat: true
        }}
      />

      <div className="chat-section">
        <ChatDisplay messages={chatHistory} isThinking={isThinking} language={language} voiceQuality={voiceQuality} ttsProvider={ttsProvider} />
      </div>
    </div>
  )
}

export default App
