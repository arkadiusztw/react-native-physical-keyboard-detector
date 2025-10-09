# React Native Physical Keyboard

[![npm](https://img.shields.io/npm/v/react-native-physical-keyboard-detector.svg?style=flat-square&label=npm&labelColor=gray&color=blue)](https://www.npmjs.com/package/react-native-physical-keyboard-detector) [![Downloads](https://img.shields.io/npm/dm/react-native-physical-keyboard-detector.svg?style=flat-square&labelColor=gray&color=blue&label=downloads/month)](https://www.npmjs.com/package/react-native-physical-keyboard-detector) [![CI](https://img.shields.io/github/actions/workflow/status/arkadiusztw/react-native-physical-keyboard-detector/ci.yml?style=flat-square&labelColor=gray&color=blue&label=CI)](https://github.com/arkadiusztw/react-native-physical-keyboard-detector/actions)

Cross-platform React Native + Expo module for detecting physical keyboards on mobile devices. This library can be useful for detecting external keyboards when implementing accessibility features.



## Features

🔌 Real-time keyboard connection detection

⌨️ Key press and release event monitoring

📊 Hardware information (vendor, model, type)

🎣 Simple React Hooks API

📘 Full TypeScript support

⚡ Zero configuration required

📦 Zero unnecessary dependencies

🍎 iOS and Android support

🎨 Expo compatible (SDK 50+)

## Installation

```bash
npm install react-native-physical-keyboard-detector
```

```bash
bun add react-native-physical-keyboard-detector
```

**⚠️ Requires native rebuild** - run `expo prebuild` after installation.

**📱 Testing Note** - For best results, test on physical devices. Simulators may not properly detect key press events, though keyboard connection detection should work correctly.

## Usage

### Basic Setup

```typescript
import { PhysicalKeyboardProvider } from 'react-native-physical-keyboard-detector';

export default function App() {
  return (
    <PhysicalKeyboardProvider>
      <YourApp />
    </PhysicalKeyboardProvider>
  );
}
```

### Detect Connection

```typescript
function MyComponent() {
  const isConnected = usePhysicalKeyboardConnected();
  
  return (
    <Text>
      Keyboard: {isConnected ? 'Connected' : 'Not Connected'}
    </Text>
  );
}
```

### Get Keyboard Details

```typescript
function KeyboardInfo() {
  const keyboard = usePhysicalKeyboardDetails();
  
  if (!keyboard) return <Text>No external hardware keyboard</Text>;
  
  return (
    <View>
      <Text>Name: {keyboard.name}</Text>
      <Text>Connected: {new Date(keyboard.connectedAt).toLocaleString()}</Text>
      {/* iOS specific */}
      {keyboard.vendorName && <Text>Vendor: {keyboard.vendorName}</Text>}
      {/* Android specific */}
      {keyboard.keyboardType && <Text>Type: {keyboard.keyboardTypeName}</Text>}
    </View>
  );
}
```

### Listen to Key Events

```typescript
function KeyListener() {
  const keyEvent = usePhysicalKeyboardEvents();
  
  if (!keyEvent) return null;
  
  return (
    <Text>
      Last key: {keyEvent.keyCode} ({keyEvent.action})
    </Text>
  );
}
```

## API

### Provider

- `<PhysicalKeyboardProvider>` - Wrap your app to enable keyboard detection

### Hooks

- `usePhysicalKeyboardConnected()` - Returns `boolean`
- `usePhysicalKeyboardDetails()` - Returns keyboard info or `null`
- `usePhysicalKeyboardEvents()` - Returns last key event or `null`

**Note:** All hooks must be used within `PhysicalKeyboardProvider`

### Types

```typescript
interface IOSPhysicalKeyboardInfo {
  name: string;
  connectedAt: number;
  vendorName?: string;
  productCategory?: string;
  availableButtonKeys?: string[];
  buttonCount?: number;
}

interface AndroidPhysicalKeyboardInfo {
  name: string;
  connectedAt: number;
  id?: number;
  vendorId?: number;
  productId?: number;
  controllerNumber?: number;
  descriptor?: string;
  isVirtual?: boolean;
  isExternal?: boolean;
  sources?: number;
  keyboardType?: number;
  keyboardTypeName?: string;
}

interface KeyPressEventPayload {
  keyCode: number;
  timestamp: number;
  action: 'up' | 'down';
}
```

## Platform Support

- **iOS**: Uses GameController framework for connection detection, UIKit for key events
- **Android**: Uses InputDevice API
- **Expo**: SDK 50+

## Known Limitations

### iOS - Arrow Keys, Tab, and Space with Full Keyboard Access

**Platform:** iOS only (Android is not affected)

When **Full Keyboard Access (FKA)** is enabled on iOS (Settings > Accessibility > Keyboards > Full Keyboard Access), the system intercepts arrow keys, tab, and space for accessibility navigation. This is a system-level behavior that cannot be overridden by third-party apps.

**Impact on iOS:**
- ✅ Keyboard connection detection works normally
- ✅ All other keys (letters, numbers, function keys, etc.) work normally
- ❌ Arrow keys (up, down, left, right) are not detected when FKA is enabled
- ❌ Tab key is not detected when FKA is enabled
- ❌ Space key is not detected when FKA is enabled

**Android:** All keys including arrows, tab, and space should work correctly regardless of accessibility settings.

**Technical Details:**
This limitation exists because iOS uses these keys for system-wide accessibility features. Apple's UIKit APIs (UIKeyCommand, pressesBegan) and even the GameController framework cannot bypass FKA. This affects all iOS apps that attempt to capture these specific keys.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT