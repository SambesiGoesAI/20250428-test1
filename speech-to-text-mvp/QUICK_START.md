# Quick Start Guide

Get up and running in 5 minutes!

## 1. Install Dependencies

```bash
npm install
```

## 2. Get Deepgram API Key

1. Visit: https://console.deepgram.com/signup
2. Sign up (free $200 credits)
3. Create an API key
4. Copy the key

## 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your API key:

```env
VITE_DEEPGRAM_API_KEY=your_api_key_here
```

## 4. Run the App

```bash
npm run dev
```

Visit http://localhost:5173

## 5. Test It Out

1. Click the microphone button
2. Allow microphone access
3. Speak into your microphone
4. Click the button again to stop
5. See your transcription appear!

## Using in Your Own App

### Quick Integration

Copy these folders to your React project:
- `src/components/`
- `src/hooks/`
- `src/services/`
- `src/utils/`

Then import and use:

```jsx
import AudioRecorder from './components/AudioRecorder'

function App() {
  return <AudioRecorder />
}
```

### Custom Implementation

```jsx
import { useAudioRecorder, useTranscription } from './hooks'
import MicrophoneButton from './components/MicrophoneButton'

function MyApp() {
  const { isRecording, startRecording, stopRecording } = useAudioRecorder();
  const { transcript, transcribe, isTranscribing } = useTranscription();

  const handleToggle = async () => {
    if (isRecording) {
      const audioBlob = await stopRecording();
      await transcribe(audioBlob);
    } else {
      await startRecording();
    }
  };

  return (
    <div>
      <MicrophoneButton
        isRecording={isRecording}
        isProcessing={isTranscribing}
        onToggle={handleToggle}
      />
      <p>{transcript}</p>
    </div>
  );
}
```

## Common Issues

### Microphone doesn't work
- Check browser permissions
- Use HTTPS or localhost
- Check console for errors

### Transcription fails
- Verify API key is correct
- Check you have credits remaining
- Ensure audio is recording (check console)

## Next Steps

See [README.md](./README.md) for complete documentation.
