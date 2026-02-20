import { useState } from 'react';
import AudioRecorder from './components/AudioRecorder'
import ChatDisplay from './components/ChatDisplay';
import llmService from './services/llmService';
import './App.css'


function App() {
  const [language, setLanguage] = useState('en-US');
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
      <button
        className="language-toggle"
        onClick={() => setLanguage(language === 'en-US' ? 'fi' : 'en-US')}
      >
        {language === 'en-US' ? 'English' : 'Finnish'}
      </button>

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
        <ChatDisplay messages={chatHistory} isThinking={isThinking} language={language} />
      </div>
    </div>
  )
}

export default App
