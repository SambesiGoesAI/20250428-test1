import AudioRecorder from './components/AudioRecorder'
import './App.css'

function App() {
  const handleTranscriptionComplete = (result) => {
    console.log('Transcription complete:', result);
    // You can add custom logic here when transcription completes
  };

  return (
    <div className="App">
      <AudioRecorder
        onTranscriptionComplete={handleTranscriptionComplete}
        transcriptionOptions={{
          language: 'en-US',
          punctuate: true,
          model: 'nova-2',
          smartFormat: true
        }}
      />
    </div>
  )
}

export default App
