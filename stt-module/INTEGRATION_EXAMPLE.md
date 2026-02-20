# Integration Example

This document shows how to integrate the STT module into your existing application.

## Option 1: Local Installation (During Development)

While developing, you can install the module locally:

```bash
# From your React app directory
npm install ../stt-module

# Or with yarn
yarn add file:../stt-module
```

## Option 2: After Publishing to NPM

```bash
npm install @yourusername/stt-module
```

## Example: Migrating the Original App

Here's how to update the original `speech-to-text-mvp` app to use the module:

### Before (Original Code)

```javascript
// App.jsx
import { useAudioRecorder } from './hooks/useAudioRecorder';
import transcriptionService from './services/transcriptionService';
```

### After (Using the Module)

```typescript
// App.tsx
import {
  useAudioRecorder,
  createTranscriptionService,
  type TranscriptionResult
} from '@yourusername/stt-module';

// Initialize once (can be in a separate config file)
const transcriptionService = createTranscriptionService(
  import.meta.env.VITE_DEEPGRAM_API_KEY || ''
);
```

## Complete Migration Example

### 1. Install the module

```bash
cd speech-to-text-mvp
npm install ../stt-module
```

### 2. Update imports in your components

```typescript
// Before
import { useAudioRecorder } from './hooks/useAudioRecorder';
import transcriptionService from './services/transcriptionService';

// After
import {
  useAudioRecorder,
  transcriptionService
} from '@yourusername/stt-module';
```

### 3. Initialize the transcription service

```typescript
// In your App.tsx or a config file
import { transcriptionService } from '@yourusername/stt-module';

// Set API key from environment
transcriptionService.setApiKey(
  import.meta.env.VITE_DEEPGRAM_API_KEY || ''
);
```

### 4. Use in components (same API)

```typescript
function VoiceRecorder() {
  const { isRecording, error, startRecording, stopRecording } = useAudioRecorder();
  const [transcript, setTranscript] = useState('');

  const handleRecord = async () => {
    if (isRecording) {
      const audioBlob = await stopRecording();
      const result = await transcriptionService.transcribe(audioBlob);
      setTranscript(result.transcript);
    } else {
      await startRecording();
    }
  };

  return (
    <button onClick={handleRecord}>
      {isRecording ? 'Stop' : 'Start'}
    </button>
  );
}
```

## Benefits of Using the Module

1. **Type Safety**: Full TypeScript support out of the box
2. **Reusability**: Use the same module across multiple projects
3. **Maintenance**: Fix bugs and add features in one place
4. **Testing**: Easier to test as a standalone module
5. **Documentation**: Comprehensive API documentation
6. **Versioning**: Track changes with semantic versioning

## Using in Non-React Applications

The core services can be used without React:

```typescript
import {
  createTranscriptionService,
  isAudioRecordingSupported
} from '@yourusername/stt-module';

// Check browser support
if (!isAudioRecordingSupported()) {
  console.error('Browser does not support audio recording');
}

// Use transcription service
const service = createTranscriptionService('your-api-key');

// Manual recording (vanilla JS)
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
const recorder = new MediaRecorder(stream);
const chunks: Blob[] = [];

recorder.ondataavailable = (e) => chunks.push(e.data);
recorder.onstop = async () => {
  const blob = new Blob(chunks, { type: 'audio/webm' });
  const result = await service.transcribe(blob);
  console.log('Transcript:', result.transcript);
};

recorder.start();
// ... later
recorder.stop();
```

## Building the Module

Before publishing or using locally, build the module:

```bash
cd stt-module
npm install
npm run build
```

This will:
1. Compile TypeScript to JavaScript (CommonJS)
2. Generate ES modules
3. Create type declaration files
4. Output to `dist/` directory

## Publishing to NPM

```bash
# Login to npm
npm login

# Publish (updates package name in package.json first)
npm publish --access public
```
