# Project Structure

Complete overview of the Speech-to-Text MVP architecture.

## Directory Tree

```
speech-to-text-mvp/
├── public/                          # Static assets
│   └── vite.svg
├── src/                             # Source code
│   ├── components/                  # React components
│   │   ├── AudioRecorder.jsx        # Main recorder component (integrates all features)
│   │   ├── AudioRecorder.css
│   │   ├── MicrophoneButton.jsx     # Reusable mic button
│   │   ├── MicrophoneButton.css
│   │   ├── TranscriptDisplay.jsx    # Display transcription results
│   │   ├── TranscriptDisplay.css
│   │   └── index.js                 # Component exports
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAudioRecorder.js      # Audio recording logic
│   │   ├── useTranscription.js      # Transcription state management
│   │   └── index.js                 # Hook exports
│   ├── services/                    # External service integrations
│   │   └── transcriptionService.js  # Deepgram API integration
│   ├── utils/                       # Utility functions
│   │   └── audioUtils.js            # Audio processing helpers
│   ├── App.jsx                      # Main app component
│   ├── App.css                      # App styles
│   ├── main.jsx                     # React entry point
│   └── index.css                    # Global styles
├── .env.example                     # Environment variable template
├── .gitignore                       # Git ignore rules
├── COMPONENT_USAGE.md               # Component usage examples
├── QUICK_START.md                   # Quick start guide
├── README.md                        # Full documentation
├── PROJECT_STRUCTURE.md             # This file
├── package.json                     # Dependencies and scripts
├── vite.config.js                   # Vite configuration
└── index.html                       # HTML entry point
```

## Architecture Overview

### Component Hierarchy

```
App
└── AudioRecorder
    ├── MicrophoneButton
    └── TranscriptDisplay
```

### Data Flow

```
User Action (Click Mic)
    ↓
MicrophoneButton (UI)
    ↓
useAudioRecorder (Hook) → Web Audio API
    ↓
Audio Blob
    ↓
useTranscription (Hook)
    ↓
transcriptionService → Deepgram API
    ↓
Transcript Result
    ↓
TranscriptDisplay (UI)
```

## File Descriptions

### Components (`src/components/`)

#### AudioRecorder.jsx (72 lines)
- **Purpose**: Main component that integrates recording and transcription
- **Dependencies**: MicrophoneButton, TranscriptDisplay, hooks
- **Exports**: AudioRecorder (default)
- **Props**:
  - `onTranscriptionComplete`: Callback function
  - `transcriptionOptions`: Configuration object

#### MicrophoneButton.jsx (80 lines)
- **Purpose**: Reusable microphone button with visual states
- **Dependencies**: None (standalone)
- **Exports**: MicrophoneButton (default)
- **Props**:
  - `isRecording`: boolean
  - `isProcessing`: boolean
  - `onToggle`: function
  - `disabled`: boolean
  - `size`: 'small' | 'medium' | 'large'

#### TranscriptDisplay.jsx (95 lines)
- **Purpose**: Display transcription results with actions
- **Dependencies**: None (standalone)
- **Exports**: TranscriptDisplay (default)
- **Props**:
  - `transcript`: string
  - `confidence`: number (0-1)
  - `isTranscribing`: boolean
  - `error`: string
  - `onClear`: function
  - `onCopy`: function

### Hooks (`src/hooks/`)

#### useAudioRecorder.js (109 lines)
- **Purpose**: Manage audio recording via Web Audio API
- **Dependencies**: audioUtils
- **Returns**:
  - `isRecording`: boolean
  - `error`: string | null
  - `startRecording()`: Promise<void>
  - `stopRecording()`: Promise<Blob>
  - `cancelRecording()`: void

#### useTranscription.js (59 lines)
- **Purpose**: Manage transcription state and operations
- **Dependencies**: transcriptionService
- **Returns**:
  - `transcript`: string
  - `isTranscribing`: boolean
  - `error`: string | null
  - `confidence`: number | null
  - `transcribe(blob, options)`: Promise<Result>
  - `clearTranscript()`: void
  - `appendTranscript(text)`: void

### Services (`src/services/`)

#### transcriptionService.js (95 lines)
- **Purpose**: Deepgram API integration layer
- **Pattern**: Singleton service class
- **Methods**:
  - `transcribe(audioBlob, options)`: Main transcription method
  - `setApiKey(key)`: Update API key
  - `isConfigured()`: Check if ready
- **Exports**:
  - `default`: Singleton instance
  - `createTranscriptionService(key)`: Factory function

### Utils (`src/utils/`)

#### audioUtils.js (73 lines)
- **Purpose**: Audio processing utilities
- **Exports**:
  - `audioBufferToWav()`: Convert Float32Array to WAV
  - `isAudioRecordingSupported()`: Browser support check
- **Dependencies**: None (pure utilities)

## Design Patterns

### 1. Separation of Concerns
- **UI Layer**: Components (presentation)
- **Logic Layer**: Hooks (business logic)
- **Service Layer**: Services (external APIs)
- **Utility Layer**: Utils (helper functions)

### 2. Custom Hooks Pattern
- Encapsulate stateful logic
- Reusable across components
- Easy to test

### 3. Service Layer Pattern
- Abstract API implementation
- Easy to swap providers
- Centralized configuration

### 4. Component Composition
- Small, focused components
- Reusable and testable
- Props for customization

## Code Statistics

- **Total Lines of Code**: ~1,123 lines
- **Components**: 3 (+ 3 CSS files)
- **Hooks**: 2
- **Services**: 1
- **Utils**: 1
- **Documentation**: 4 markdown files

## Technology Stack

### Core Dependencies
- **React** 19.2.0 - UI framework
- **Vite** 7.3.1 - Build tool
- **Web Audio API** - Browser audio recording
- **Deepgram API** - Speech-to-text service

### Dev Dependencies
- **ESLint** - Code linting
- **@vitejs/plugin-react** - React support for Vite

## Browser APIs Used

1. **MediaDevices API**
   - `navigator.mediaDevices.getUserMedia()`
   - Microphone access

2. **MediaRecorder API**
   - `new MediaRecorder(stream)`
   - Audio recording

3. **Fetch API**
   - API requests to Deepgram

4. **Clipboard API**
   - `navigator.clipboard.writeText()`
   - Copy functionality

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_DEEPGRAM_API_KEY` | Yes | Deepgram API authentication key |

## Build Configuration

### Development
- Command: `npm run dev`
- Hot Module Replacement (HMR) enabled
- Source maps enabled
- Fast refresh enabled

### Production
- Command: `npm run build`
- Output: `dist/` directory
- Minification: Enabled
- Tree-shaking: Enabled
- Bundle size: ~200KB (gzipped: ~63KB)

## Module System

- **Type**: ES Modules (ESM)
- **Import style**: Named and default exports
- **Browser support**: Modern browsers only

## Extensibility Points

### 1. Add New Transcription Provider
```javascript
// Create new service in src/services/
class GoogleTranscriptionService {
  async transcribe(blob, options) { /* ... */ }
}
```

### 2. Add Custom Audio Processing
```javascript
// Add to src/utils/audioUtils.js
export const processAudio = (audioBuffer) => { /* ... */ }
```

### 3. Add New UI Components
```javascript
// Create in src/components/
export default function NewComponent() { /* ... */ }
```

### 4. Add Custom Hooks
```javascript
// Create in src/hooks/
export const useCustomHook = () => { /* ... */ }
```

## Testing Strategy (Future)

### Recommended Testing Approach
1. **Component Tests**: React Testing Library
2. **Hook Tests**: @testing-library/react-hooks
3. **Service Tests**: Mock API calls with MSW
4. **E2E Tests**: Playwright or Cypress

### Test Coverage Goals
- Components: 80%+
- Hooks: 90%+
- Services: 95%+
- Utils: 100%

## Performance Considerations

### Optimizations Implemented
- Lazy state updates
- Memoized callbacks
- Efficient re-renders
- Blob-based audio handling

### Future Optimizations
- Code splitting
- Lazy loading components
- Service worker caching
- Audio compression

## Security Considerations

### Implemented
- API key via environment variables
- HTTPS requirement for microphone access
- No sensitive data in localStorage

### Best Practices
- Never commit `.env` file
- Rotate API keys regularly
- Validate user input
- Sanitize transcript output

## Accessibility

### Current Features
- ARIA labels on buttons
- Keyboard navigation support
- Screen reader compatible
- Visual feedback for all states

### Future Improvements
- Keyboard shortcuts
- High contrast mode
- Focus management
- Announce transcript updates

## Browser Compatibility

| Browser | Minimum Version | Status |
|---------|----------------|---------|
| Chrome | 60+ | ✅ Supported |
| Firefox | 55+ | ✅ Supported |
| Safari | 11+ | ✅ Supported |
| Edge | 79+ | ✅ Supported |
| IE | Any | ❌ Not supported |

## License

MIT License - Feel free to use, modify, and distribute.

## Contributing

This is an MVP designed to be extended. Common additions:
- TypeScript support
- Additional transcription providers
- Real-time streaming transcription
- Audio visualization
- Recording history/playback
- Multi-language UI
