import { useEffect, useRef, useState } from 'react';
import ttsService from '../services/ttsService';
import './ChatDisplay.css';

/**
 * Displays the LLM conversation history as a chat interface
 * @param {Array} messages - [{role: 'user'|'assistant', content: string}]
 * @param {boolean} isThinking - Whether the LLM is currently generating a response
 * @param {string} language - Current language setting ('en-US' or 'fi')
 * @param {string} voiceQuality - Voice quality for Finnish TTS ('neural2' or 'wavenet')
 */
const ChatDisplay = ({ messages = [], isThinking = false, language = 'en-US', voiceQuality = 'neural2' }) => {
  const bottomRef = useRef(null);
  const [playingIndex, setPlayingIndex] = useState(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSpeak = async (text, index) => {
    if (playingIndex === index) {
      // Stop current playback
      ttsService.stop();
      setPlayingIndex(null);
      return;
    }

    try {
      setPlayingIndex(index);
      await ttsService.speak(text, language, voiceQuality);
      setPlayingIndex(null);
    } catch (err) {
      console.error('TTS error:', err);
      setPlayingIndex(null);
      alert(`TTS Error: ${err.message}`);
    }
  };

  if (messages.length === 0 && !isThinking) {
    return (
      <div className="chat-display chat-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <p>Your conversation will appear here</p>
        <span>Record your voice — the AI will respond automatically</span>
      </div>
    );
  }

  return (
    <div className="chat-display">
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.role}`}>
            <div className="bubble-label">{msg.role === 'user' ? 'You' : 'AI'}</div>
            <div className="bubble-content">{msg.content}</div>
            {msg.role === 'assistant' && (
              <button
                className={`speak-button ${playingIndex === i ? 'playing' : ''}`}
                onClick={() => handleSpeak(msg.content, i)}
                title={playingIndex === i ? 'Stop' : 'Listen'}
              >
                {playingIndex === i ? '⏸' : '🔊'}
              </button>
            )}
          </div>
        ))}

        {isThinking && (
          <div className="chat-bubble assistant thinking">
            <div className="bubble-label">AI</div>
            <div className="bubble-content">
              <span className="dot" /><span className="dot" /><span className="dot" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatDisplay;
