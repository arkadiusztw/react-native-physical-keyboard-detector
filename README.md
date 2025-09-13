# React Native Physical Keyboard

[![npm](https://img.shields.io/npm/v/react-native-physical-keyboard-detector.svg?style=flat-square&label=npm&labelColor=gray&color=blue)](https://www.npmjs.com/package/react-native-physical-keyboard-detector) [![Downloads](https://img.shields.io/npm/dm/react-native-physical-keyboard-detector.svg?style=flat-square&labelColor=gray&color=blue&label=downloads/month)](https://www.npmjs.com/package/react-native-physical-keyboard-detector) [![CI](https://img.shields.io/github/actions/workflow/status/arkadiusztw/react-native-physical-keyboard-detector/ci.yml?style=flat-square&labelColor=gray&color=blue&label=CI)](https://github.com/arkadiusztw/react-native-physical-keyboard-detector/actions)

Cross-platform React Native + Expo module for detecting physical keyboards on mobile devices. This library can be useful for detecting external keyboards when implementing accessibility features.



## Features

### 🎯 Core Functionality
- **🔌 Real-time Detection** - Detect when physical keyboards are connected or disconnected
- **⌨️ Key Event Monitoring** - Listen to key press and release events
- **📊 Hardware Information** - Get keyboard details like vendor, model, and type

### 🚀 Developer Experience  
- **<img src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg" width="16" height="16" alt="TypeScript"> TypeScript Support** - Full type definitions included
- **🎣 React Hooks API** - Simple hooks for easy integration
- **⚡ Zero Configuration** - Works without additional setup
- **🔄 Reactive State** - Components update when keyboard state changes
- **<img src="https://avatars.githubusercontent.com/u/12504344" width="16" height="16" alt="Expo"> Expo Compatible** - Supports managed workflow (SDK 50+)
- **🍎🤖 Cross-Platform** - iOS and Android support

### 🎨 Additional Features
- **📈 Connection History** - Track connection timestamps
- **🏷️ Device Classification** - Identify keyboard types and vendors
- **⚡ Performance** - Lightweight native implementation
- **🛡️ Error Handling** - Handles edge cases and platform differences



## Installation

```bash
npm install react-native-physical-keyboard-detector
```

```bash
bun add react-native-physical-keyboard-detector
```

**⚠️ Requires native rebuild** - run `expo prebuild` after installation.

**📱 Testing Note** - For best results, test on physical devices. iOS Simulator may not properly detect key press events, though keyboard connection detection should work correctly.

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
// iOS Keyboard Info
interface IOSPhysicalKeyboardInfo {
  name: string;
  connectedAt: number;
  vendorName?: string;
  productCategory?: string;
  availableButtonKeys?: string[];
  buttonCount?: number;
}

// Android Keyboard Info
interface AndroidPhysicalKeyboardInfo {
  name: string;
  connectedAt: number;
  id?: number;
  vendorId?: number;
  productId?: number;
  keyboardType?: number;
  keyboardTypeName?: string;
  isExternal?: boolean;
}

// Key Event
interface KeyPressEventPayload {
  keyCode: number;
  timestamp: number;
  action: 'up' | 'down';
}
```

## Platform Support

- **iOS**: Uses GameController framework
- **Android**: Uses InputDevice API
- **Expo**: SDK 50+

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT