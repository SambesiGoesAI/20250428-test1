# Component Usage Guide

Detailed examples of how to use each component and hook in this library.

## Table of Contents

1. [AudioRecorder (All-in-One)](#audiorecorder-all-in-one)
2. [Individual Components](#individual-components)
3. [Custom Hooks](#custom-hooks)
4. [Service Layer](#service-layer)
5. [Advanced Examples](#advanced-examples)

---

## AudioRecorder (All-in-One)

The simplest way to add speech-to-text to your app.

### Basic Usage

```jsx
import AudioRecorder from './components/AudioRecorder'

function App() {
  return <AudioRecorder />
}
```

### With Callback

```jsx
import AudioRecorder from './components/AudioRecorder'

function App() {
  const handleComplete = (result) => {
    console.log('Transcript:', result.transcript)
    console.log('Confidence:', result.confidence)
    console.log('Raw data:', result.raw)
  }

  return <AudioRecorder onTranscriptionComplete={handleComplete} />
}
```

### With Custom Options

```jsx
import AudioRecorder from './components/AudioRecorder'

function App() {
  return (
    <AudioRecorder
      transcriptionOptions={{
        language: 'es',           // Spanish
        punctuate: true,
        model: 'nova-2',
        smartFormat: true
      }}
      onTranscriptionComplete={(result) => {
        // Save to database
        saveToDatabase(result.transcript)
      }}
    />
  )
}
```

---

## Individual Components

Build your own custom UI using individual components.

### MicrophoneButton

A reusable microphone button with recording states.

```jsx
import MicrophoneButton from './components/MicrophoneButton'

function MyApp() {
  const [isRecording, setIsRecording] = useState(false)

  return (
    <MicrophoneButton
      isRecording={isRecording}
      isProcessing={false}
      onToggle={() => setIsRecording(!isRecording)}
      size="large"  // 'small', 'medium', or 'large'
    />
  )
}
```

### TranscriptDisplay

Display transcription results with confidence scores.

```jsx
import TranscriptDisplay from './components/TranscriptDisplay'

function MyApp() {
  const [transcript, setTranscript] = useState('')

  return (
    <TranscriptDisplay
      transcript={transcript}
      confidence={0.95}
      isTranscribing={false}
      error={null}
      onClear={() => setTranscript('')}
      onCopy={() => console.log('Copied!')}
    />
  )
}
```

---

## Custom Hooks

Use hooks for complete control over the recording and transcription flow.

### useAudioRecorder

Record audio from the user's microphone.

```jsx
import { useAudioRecorder } from './hooks/useAudioRecorder'

function MyRecorder() {
  const {
    isRecording,
    error,
    startRecording,
    stopRecording,
    cancelRecording
  } = useAudioRecorder()

  const handleRecord = async () => {
    if (isRecording) {
      const audioBlob = await stopRecording()
      console.log('Got audio:', audioBlob)
      // Do something with the audio blob
    } else {
      await startRecording()
    }
  }

  return (
    <div>
      <button onClick={handleRecord}>
        {isRecording ? 'Stop' : 'Record'}
      </button>
      {error && <p>Error: {error}</p>}
    </div>
  )
}
```

### useTranscription

Manage transcription state and operations.

```jsx
import { useTranscription } from './hooks/useTranscription'

function MyTranscriber() {
  const {
    transcript,
    isTranscribing,
    error,
    confidence,
    transcribe,
    clearTranscript,
    appendTranscript
  } = useTranscription()

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    await transcribe(file, {
      language: 'en-US',
      punctuate: true
    })
  }

  return (
    <div>
      <input type="file" accept="audio/*" onChange={handleFileUpload} />
      {isTranscribing && <p>Transcribing...</p>}
      {transcript && (
        <div>
          <p>{transcript}</p>
          <button onClick={clearTranscript}>Clear</button>
        </div>
      )}
    </div>
  )
}
```

### Combined Hooks Example

Full control with both hooks.

```jsx
import { useAudioRecorder } from './hooks/useAudioRecorder'
import { useTranscription } from './hooks/useTranscription'

function CustomRecorder() {
  const {
    isRecording,
    startRecording,
    stopRecording
  } = useAudioRecorder()

  const {
    transcript,
    isTranscribing,
    transcribe
  } = useTranscription()

  const handleToggle = async () => {
    if (isRecording) {
      const audioBlob = await stopRecording()
      await transcribe(audioBlob)
    } else {
      await startRecording()
    }
  }

  return (
    <div>
      <button onClick={handleToggle} disabled={isTranscribing}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {isTranscribing && <p>Processing...</p>}
      {transcript && <p>{transcript}</p>}
    </div>
  )
}
```

---

## Service Layer

Use the transcription service directly.

### Basic Service Usage

```jsx
import transcriptionService from './services/transcriptionService'

async function transcribeAudio(audioBlob) {
  try {
    const result = await transcriptionService.transcribe(audioBlob)
    console.log(result.transcript)
    console.log(result.confidence)
    return result
  } catch (error) {
    console.error('Transcription failed:', error)
  }
}
```

### With Custom Options

```jsx
import transcriptionService from './services/transcriptionService'

async function transcribeSpanish(audioBlob) {
  const result = await transcriptionService.transcribe(audioBlob, {
    language: 'es',
    punctuate: true,
    model: 'nova-2',
    smartFormat: true
  })
  return result
}
```

### Create Custom Service Instance

```jsx
import { createTranscriptionService } from './services/transcriptionService'

// Create service with different API key
const customService = createTranscriptionService('different_api_key')

async function transcribe(audio) {
  return await customService.transcribe(audio)
}
```

---

## Advanced Examples

### Multi-Language Support

```jsx
import AudioRecorder from './components/AudioRecorder'
import { useState } from 'react'

function MultiLanguageRecorder() {
  const [language, setLanguage] = useState('en-US')

  return (
    <div>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en-US">English (US)</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="de">German</option>
      </select>

      <AudioRecorder
        transcriptionOptions={{
          language: language,
          punctuate: true,
          model: 'nova-2'
        }}
      />
    </div>
  )
}
```

### Save Transcripts to State

```jsx
import AudioRecorder from './components/AudioRecorder'
import { useState } from 'react'

function TranscriptHistory() {
  const [transcripts, setTranscripts] = useState([])

  const handleComplete = (result) => {
    setTranscripts(prev => [...prev, {
      id: Date.now(),
      text: result.transcript,
      confidence: result.confidence,
      timestamp: new Date().toISOString()
    }])
  }

  return (
    <div>
      <AudioRecorder onTranscriptionComplete={handleComplete} />

      <div>
        <h3>History</h3>
        {transcripts.map(t => (
          <div key={t.id}>
            <p>{t.text}</p>
            <small>Confidence: {(t.confidence * 100).toFixed(0)}%</small>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Integration with Forms

```jsx
import { useAudioRecorder } from './hooks/useAudioRecorder'
import { useTranscription } from './hooks/useTranscription'
import MicrophoneButton from './components/MicrophoneButton'

function FormWithVoiceInput() {
  const [formData, setFormData] = useState({ message: '' })
  const { isRecording, startRecording, stopRecording } = useAudioRecorder()
  const { transcript, transcribe, isTranscribing } = useTranscription()

  useEffect(() => {
    if (transcript) {
      setFormData(prev => ({ ...prev, message: transcript }))
    }
  }, [transcript])

  const handleVoiceInput = async () => {
    if (isRecording) {
      const audio = await stopRecording()
      await transcribe(audio)
    } else {
      await startRecording()
    }
  }

  return (
    <form>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ message: e.target.value })}
          placeholder="Type or speak your message"
        />
        <MicrophoneButton
          isRecording={isRecording}
          isProcessing={isTranscribing}
          onToggle={handleVoiceInput}
          size="medium"
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}
```

### Custom Error Handling

```jsx
import AudioRecorder from './components/AudioRecorder'
import { useState } from 'react'

function RobustRecorder() {
  const [errors, setErrors] = useState([])

  const handleComplete = (result) => {
    if (result.confidence < 0.5) {
      setErrors(prev => [...prev, 'Low confidence transcription'])
    }
    console.log('Success:', result)
  }

  return (
    <div>
      {errors.length > 0 && (
        <div className="error-banner">
          {errors.map((err, i) => <p key={i}>{err}</p>)}
          <button onClick={() => setErrors([])}>Clear</button>
        </div>
      )}
      <AudioRecorder onTranscriptionComplete={handleComplete} />
    </div>
  )
}
```

---

## Tips and Best Practices

### 1. Always Handle Errors

```jsx
const { error } = useAudioRecorder()
const { error: transcriptionError } = useTranscription()

if (error || transcriptionError) {
  // Show user-friendly error message
}
```

### 2. Provide Visual Feedback

```jsx
{isRecording && <div className="recording-indicator">Recording...</div>}
{isTranscribing && <div className="loading-spinner" />}
```

### 3. Handle Permissions

```jsx
const startRecordingWithPermission = async () => {
  try {
    await startRecording()
  } catch (err) {
    if (err.message.includes('Permission')) {
      alert('Please allow microphone access')
    }
  }
}
```

### 4. Optimize for Mobile

```jsx
// Use smaller button on mobile
const isMobile = window.innerWidth < 768
const buttonSize = isMobile ? 'medium' : 'large'

<MicrophoneButton size={buttonSize} />
```

---

## Need More Help?

- Check the [README.md](./README.md) for full documentation
- See [QUICK_START.md](./QUICK_START.md) for setup instructions
- Review the source code for implementation details
