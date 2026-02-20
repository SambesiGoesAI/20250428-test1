import { useEffect, useRef } from 'react';
import './ChatDisplay.css';

/**
 * Displays the LLM conversation history as a chat interface
 * @param {Array} messages - [{role: 'user'|'assistant', content: string}]
 * @param {boolean} isThinking - Whether the LLM is currently generating a response
 */
const ChatDisplay = ({ messages = [], isThinking = false }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

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
