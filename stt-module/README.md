# STT Module

A clean, reusable TypeScript module for Speech-to-Text functionality that can be easily integrated into any TypeScript/React application. This module provides audio recording capabilities using the MediaRecorder API and transcription services via the Deepgram API.

## Features

- **Audio Recording**: Simple React hook for recording audio from the user's microphone
- **Deepgram Integration**: Clean service layer for Deepgram API transcription
- **TypeScript First**: Full TypeScript support with comprehensive type definitions
- **Production Ready**: Error handling, cleanup, and best practices built-in
- **Framework Agnostic Core**: While the hook is React-specific, the core services can be used anywhere
- **Zero Dependencies**: Only peer dependency is React

## Installation

```bash
npm install @yourusername/stt-module
```

Or with yarn:

```bash
yarn add @yourusername/stt-module
```

## Quick Start

```typescript
import React, { useState } from 'react';
import {
  useAudioRecorder,
  createTranscriptionService,
  TranscriptionResult
} from '@yourusername/stt-module';

function App() {
  const { isRecording, error, startRecording, stopRecording } = useAudioRecorder();
  const [transcript, setTranscript] = useState<string>('');

  // Initialize transcription service with your Deepgram API key
  const transcriptionService = createTranscriptionService('your-deepgram-api-key');

  const handleRecord = async () => {
    if (isRecording) {
      // Stop recording and transcribe
      const audioBlob = await stopRecording();
      const result = await transcriptionService.transcribe(audioBlob);
      setTranscript(result.transcript);
    } else {
      // Start recording
      await startRecording();
    }
  };

  return (
    <div>
      <button onClick={handleRecord}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {error && <p>Error: {error}</p>}
      {transcript && <p>Transcript: {transcript}</p>}
    </div>
  );
}

export default App;
```

## API Documentation

### useAudioRecorder

React hook for managing audio recording.

#### Usage

```typescript
import { useAudioRecorder } from '@yourusername/stt-module';

const {
  isRecording,
  error,
  startRecording,
  stopRecording,
  cancelRecording
} = useAudioRecorder(constraints);
```

#### Parameters

- `constraints` (optional): Custom audio constraints
  ```typescript
  {
    channelCount?: number;      // Default: 1 (mono)
    sampleRate?: number;        // Default: 16000
    echoCancellation?: boolean; // Default: true
    noiseSuppression?: boolean; // Default: true
  }
  ```

#### Return Value

```typescript
{
  isRecording: boolean;                    // Current recording state
  error: string | null;                    // Error message if any
  startRecording: () => Promise<void>;     // Start recording
  stopRecording: () => Promise<Blob>;      // Stop and get audio blob
  cancelRecording: () => void;             // Cancel without saving
}
```

#### Example

```typescript
import { useAudioRecorder } from '@yourusername/stt-module';

function RecordButton() {
  const recorder = useAudioRecorder({
    sampleRate: 48000,
    channelCount: 2
  });

  const handleStart = async () => {
    await recorder.startRecording();
  };

  const handleStop = async () => {
    const audioBlob = await recorder.stopRecording();
    // Do something with the audio blob
    console.log('Recorded audio:', audioBlob);
  };

  return (
    <>
      <button onClick={handleStart} disabled={recorder.isRecording}>
        Start
      </button>
      <button onClick={handleStop} disabled={!recorder.isRecording}>
        Stop
      </button>
      {recorder.error && <p>Error: {recorder.error}</p>}
    </>
  );
}
```

### TranscriptionService

Service class for transcribing audio using Deepgram API.

#### Creating an Instance

```typescript
import { createTranscriptionService } from '@yourusername/stt-module';

const service = createTranscriptionService('your-api-key');
```

Or use the singleton:

```typescript
import { transcriptionService } from '@yourusername/stt-module';

transcriptionService.setApiKey('your-api-key');
```

#### Methods

##### `transcribe(audioBlob, options)`

Transcribe an audio blob.

**Parameters:**
- `audioBlob: Blob` - The audio data to transcribe
- `options?: TranscriptionOptions` (optional)
  ```typescript
  {
    language?: string;      // Default: 'en-US'
    punctuate?: boolean;    // Default: true
    model?: string;         // Default: 'nova-2'
    smartFormat?: boolean;  // Default: true
  }
  ```

**Returns:** `Promise<TranscriptionResult>`
```typescript
{
  transcript: string;      // The transcribed text
  confidence: number;      // Confidence score (0-1)
  raw: DeepgramResponse;   // Full API response
}
```

**Example:**

```typescript
const result = await service.transcribe(audioBlob, {
  language: 'en-US',
  model: 'nova-2',
  punctuate: true
});

console.log('Transcript:', result.transcript);
console.log('Confidence:', result.confidence);
```

##### `setApiKey(apiKey)`

Set or update the API key.

```typescript
service.setApiKey('new-api-key');
```

##### `isConfigured()`

Check if the service has an API key set.

```typescript
if (service.isConfigured()) {
  // Ready to transcribe
}
```

### Utility Functions

#### `isAudioRecordingSupported()`

Check if the browser supports audio recording.

```typescript
import { isAudioRecordingSupported } from '@yourusername/stt-module';

if (isAudioRecordingSupported()) {
  console.log('Audio recording is supported');
} else {
  console.log('Audio recording is NOT supported');
}
```

#### `audioBufferToWav(audioBuffer, sampleRate)`

Convert a Float32Array audio buffer to a WAV blob.

```typescript
import { audioBufferToWav } from '@yourusername/stt-module';

const wavBlob = audioBufferToWav(float32Array, 16000);
```

## TypeScript Support

This module is written in TypeScript and includes comprehensive type definitions.

### Available Types

```typescript
import type {
  UseAudioRecorderReturn,
  AudioConstraints,
  TranscriptionOptions,
  TranscriptionResult,
  DeepgramResponse,
  ITranscriptionService
} from '@yourusername/stt-module';
```

### Type Examples

```typescript
// Hook return type
const recorder: UseAudioRecorderReturn = useAudioRecorder();

// Transcription result
const result: TranscriptionResult = await service.transcribe(audioBlob);

// Custom constraints
const constraints: AudioConstraints = {
  sampleRate: 48000,
  channelCount: 2
};
```

## Advanced Usage

### Custom Transcription Service

You can create multiple instances for different API keys or configurations:

```typescript
import { TranscriptionService } from '@yourusername/stt-module';

class CustomTranscriptionService extends TranscriptionService {
  async transcribeWithCustomLogic(audioBlob: Blob) {
    // Add custom pre-processing
    const result = await this.transcribe(audioBlob, {
      language: 'es-ES',
      model: 'nova-2'
    });
    // Add custom post-processing
    return result;
  }
}

const customService = new CustomTranscriptionService('api-key');
```

### Error Handling

```typescript
try {
  await startRecording();
} catch (err) {
  console.error('Failed to start recording:', err);
}

try {
  const result = await service.transcribe(audioBlob);
} catch (err) {
  if (err.message.includes('API key')) {
    console.error('Please set your Deepgram API key');
  } else {
    console.error('Transcription failed:', err);
  }
}
```

### Recording Lifecycle Management

```typescript
import { useEffect } from 'react';
import { useAudioRecorder } from '@yourusername/stt-module';

function Component() {
  const recorder = useAudioRecorder();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recorder.isRecording) {
        recorder.cancelRecording();
      }
    };
  }, [recorder]);

  return (/* ... */);
}
```

## Browser Compatibility

This module requires browsers that support:
- MediaRecorder API
- MediaDevices.getUserMedia()
- Web Audio API
- Fetch API

Supported browsers:
- Chrome/Edge 49+
- Firefox 25+
- Safari 14.1+
- Opera 36+

## Getting a Deepgram API Key

1. Sign up at [Deepgram](https://deepgram.com)
2. Navigate to your dashboard
3. Create a new API key
4. Copy the key and use it in your application

**Note:** Never commit API keys to version control. Use environment variables:

```typescript
const apiKey = process.env.REACT_APP_DEEPGRAM_API_KEY || '';
const service = createTranscriptionService(apiKey);
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on [GitHub](https://github.com/yourusername/stt-module/issues).
