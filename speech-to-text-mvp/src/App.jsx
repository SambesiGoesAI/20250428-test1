import { useState } from 'react';
import AudioRecorder from './components/AudioRecorder'
import './App.css'


function App() {
  const [language, setLanguage] = useState('en-US');

  const handleTranscriptionComplete = (result) => {
    console.log('Transcription complete:', result);
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
    </div>
  )
}

export default App
