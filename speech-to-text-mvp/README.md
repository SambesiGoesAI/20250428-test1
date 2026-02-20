# Speech-to-Text MVP

A modular, production-ready React + Vite speech-to-text application with Deepgram API integration. This MVP features a clean architecture with reusable components that can be easily integrated into other React applications.

## Features

- **Real-time Audio Recording**: Uses Web Audio API for high-quality audio capture
- **Speech Transcription**: Deepgram API integration for accurate transcription
- **Modular Architecture**: Easily reusable components and services
- **Beautiful UI**: Clean, modern interface with visual feedback
- **Confidence Scores**: See transcription confidence levels
- **Copy to Clipboard**: Quick copy functionality for transcripts
- **Responsive Design**: Works on desktop and mobile devices
- **Swappable Services**: Easy to switch from Deepgram to other providers

## Project Structure

```
src/
├── components/
│   ├── MicrophoneButton.jsx    # Reusable mic button with recording states
│   ├── TranscriptDisplay.jsx   # Display area for transcription results
│   └── AudioRecorder.jsx       # Main recorder component
├── services/
│   └── transcriptionService.js # Deepgram API integration layer
├── hooks/
│   ├── useAudioRecorder.js     # Audio recording logic
│   └── useTranscription.js     # Transcription state management
└── utils/
    └── audioUtils.js           # Audio processing helper functions
```

## Getting Started

### Prerequisites

- Node.js 14+ and npm
- A Deepgram API key (see below)

### Installation

1. **Clone or navigate to the project directory:**

```bash
cd speech-to-text-mvp
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

4. **Add your Deepgram API key to `.env`:**

```env
VITE_DEEPGRAM_API_KEY=your_actual_api_key_here
```

5. **Start the development server:**

```bash
npm run dev
```

6. **Open your browser:**

Navigate to `http://localhost:5173` (or the URL shown in your terminal).

## Getting a Deepgram API Key

1. Go to [https://console.deepgram.com/signup](https://console.deepgram.com/signup)
2. Create a free account
3. Navigate to the API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env` file

**Note:** Deepgram offers $200 in free credits for new users, which is plenty for testing and development.

## Usage

### Basic Usage

The simplest way to use this application is to import the `AudioRecorder` component:

```jsx
import AudioRecorder from './components/AudioRecorder'

function App() {
  return (
    <AudioRecorder />
  )
}
```

### Advanced Usage with Callbacks

```jsx
import AudioRecorder from './components/AudioRecorder'

function App() {
  const handleTranscriptionComplete = (result) => {
    console.log('Transcript:', result.transcript);
    console.log('Confidence:', result.confidence);
    // Do something with the result
  };

  return (
    <AudioRecorder
      onTranscriptionComplete={handleTranscriptionComplete}
      transcriptionOptions={{
        language: 'en-US',
        punctuate: true,
        model: 'nova-2',
        smartFormat: true
      }}
    />
  )
}
```

## Using Components in Other React Apps

### Option 1: Copy Components

1. Copy the `src/components`, `src/hooks`, `src/services`, and `src/utils` folders to your project
2. Install any missing dependencies
3. Import and use the components:

```jsx
import AudioRecorder from './components/AudioRecorder'
```

### Option 2: Individual Components

You can use components individually for more control:

```jsx
import MicrophoneButton from './components/MicrophoneButton'
import TranscriptDisplay from './components/TranscriptDisplay'
import { useAudioRecorder } from './hooks/useAudioRecorder'
import { useTranscription } from './hooks/useTranscription'

function MyCustomRecorder() {
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
      <TranscriptDisplay transcript={transcript} />
    </div>
  );
}
```

## Customization

### Changing the Transcription Service

The service layer is designed to be easily swappable. To use a different provider:

1. Create a new service file (e.g., `googleTranscriptionService.js`)
2. Implement the same interface:
   - `transcribe(audioBlob, options)` - Returns `{ transcript, confidence, raw }`
   - `isConfigured()` - Returns boolean
3. Replace the import in `useTranscription.js`

Example structure:

```javascript
class MyTranscriptionService {
  async transcribe(audioBlob, options) {
    // Your API call here
    return {
      transcript: "...",
      confidence: 0.95,
      raw: {}
    };
  }

  isConfigured() {
    return !!this.apiKey;
  }
}

export default new MyTranscriptionService(apiKey);
```

### Styling

All components have their own CSS files that can be customized:

- `MicrophoneButton.css` - Button styles and animations
- `TranscriptDisplay.css` - Transcript display area
- `AudioRecorder.css` - Main layout and background

## API Reference

### AudioRecorder Component

**Props:**
- `onTranscriptionComplete` (Function): Callback when transcription completes
  - Receives: `{ transcript, confidence, raw }`
- `transcriptionOptions` (Object): Options for transcription service
  - `language` (string): Language code (default: 'en-US')
  - `punctuate` (boolean): Add punctuation (default: true)
  - `model` (string): Deepgram model (default: 'nova-2')
  - `smartFormat` (boolean): Smart formatting (default: true)

### MicrophoneButton Component

**Props:**
- `isRecording` (boolean): Recording state
- `isProcessing` (boolean): Processing state
- `onToggle` (Function): Click handler
- `disabled` (boolean): Disabled state
- `size` (string): Button size - 'small', 'medium', 'large'

### TranscriptDisplay Component

**Props:**
- `transcript` (string): The transcribed text
- `confidence` (number): Confidence score (0-1)
- `isTranscribing` (boolean): Processing state
- `error` (string): Error message
- `onClear` (Function): Clear button handler
- `onCopy` (Function): Copy button handler

### useAudioRecorder Hook

**Returns:**
- `isRecording` (boolean): Current recording state
- `error` (string|null): Error message if any
- `startRecording()` (Function): Start recording
- `stopRecording()` (Function): Stop and return audio blob
- `cancelRecording()` (Function): Cancel without saving

### useTranscription Hook

**Returns:**
- `transcript` (string): Current transcript
- `isTranscribing` (boolean): Processing state
- `error` (string|null): Error message
- `confidence` (number|null): Confidence score
- `transcribe(audioBlob, options)` (Function): Transcribe audio
- `clearTranscript()` (Function): Clear current transcript
- `appendTranscript(text)` (Function): Append to transcript

## Browser Support

This application requires:
- Modern browser with Web Audio API support
- Microphone access permissions
- HTTPS (for production deployment)

**Supported Browsers:**
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Important: HTTPS Required

For microphone access in production, your app must be served over HTTPS. Most hosting platforms (Vercel, Netlify, etc.) provide this automatically.

### Environment Variables

Remember to set `VITE_DEEPGRAM_API_KEY` in your hosting platform's environment variables.

## Troubleshooting

### Microphone Not Working

1. Check browser permissions
2. Ensure you're using HTTPS (or localhost)
3. Check browser console for errors

### Transcription Fails

1. Verify your Deepgram API key is correct
2. Check your API credits/limits
3. Ensure audio is being recorded (check console logs)
4. Verify network connectivity

### Build Issues

1. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
2. Clear Vite cache: `rm -rf node_modules/.vite`
3. Check Node.js version (14+ required)

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## License

MIT

## Contributing

Contributions are welcome! This is an MVP designed to be extended and customized for your specific needs.

## Credits

- Built with [React](https://react.dev/) and [Vite](https://vite.dev/)
- Transcription powered by [Deepgram](https://deepgram.com/)
- Icons adapted from [Lucide](https://lucide.dev/)
