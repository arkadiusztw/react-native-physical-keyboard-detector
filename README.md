# React Native Physical Keyboard

[![npm version](https://badge.fury.io/js/react-native-physical-keyboard-detector.svg)](https://badge.fury.io/js/react-native-physical-keyboard-detector)[![CI](https://github.com/arkadiusztw/react-native-physical-keyboard-detector/workflows/CI/badge.svg)](https://github.com/arkadiusztw/react-native-physical-keyboard-detector/actions)

**Cross-platform React Native + Expo module for detecting and monitoring physical keyboards on mobile devices.**

## 🚀 Features

- **🎯 Real-time Detection** - Monitor keyboard connection/disconnection events
- **📱 Cross-platform** - Native support for iOS and Android
- **📊  Metadata** - Get detailed keyboard information (vendor, type, capabilities)
- **🪝 React Hooks** - Easy-to-use hooks with TypeScript support
- **⚡ High Performance** - Native implementation with minimal overhead
- **🔒 Type-safe** - Full TypeScript definitions included

## ⚠️ Important Note

**This package requires rebuilding your Expo app** as it contains native code.

## 📦 Installation

### Package Managers
```bash
# npm
npm install react-native-physical-keyboard-detector

# yarn
yarn add react-native-physical-keyboard-detector

# bun
bun add react-native-physical-keyboard-detector
```

## 🎯 Quick Start

### Basic Usage
```typescript
import { usePhysicalKeyboard } from 'react-native-physical-keyboard-detector';

export default function MyApp() {
  const isKeyboardConnected = usePhysicalKeyboard();
  
  return (
    <View>
      <Text>
        External Keyboard: {isKeyboardConnected ? '✅ Connected' : '❌ Not Connected'}
      </Text>
      {isKeyboardConnected && (
        <Text>Keyboard shortcuts are now available!</Text>
      )}
    </View>
  );
}
```

### Advanced Usage with Details
```typescript
import { usePhysicalKeyboardInfo } from 'react-native-physical-keyboard-detector';

export default function KeyboardStatus() {
  const keyboardInfo = usePhysicalKeyboardInfo();
  
  if (!keyboardInfo) {
    return <Text>No physical keyboard detected</Text>;
  }
  
  return (
    <View>
      <Text>📱 Keyboard: {keyboardInfo.name}</Text>
      <Text>🕒 Connected: {new Date(keyboardInfo.connectedAt).toLocaleString()}</Text>
      
      {/* iOS-specific information */}
      {'vendorName' in keyboardInfo && (
        <View>
          <Text>🏢 Vendor: {keyboardInfo.vendorName}</Text>
          <Text>📂 Category: {keyboardInfo.productCategory}</Text>
          <Text>🔘 Buttons: {keyboardInfo.buttonCount}</Text>
        </View>
      )}
      
      {/* Android-specific information */}
      {'vendorId' in keyboardInfo && (
        <View>
          <Text>🆔 Device ID: {keyboardInfo.id}</Text>
          <Text>🏭 Vendor ID: {keyboardInfo.vendorId}</Text>
          <Text>📦 Product ID: {keyboardInfo.productId}</Text>
          <Text>🔌 External: {keyboardInfo.isExternal ? 'Yes' : 'No'}</Text>
          <Text>⌨️ Type: {keyboardInfo.keyboardTypeName}</Text>
        </View>
      )}
    </View>
  );
}
```

## 📚 API Reference

### React Hooks

#### `usePhysicalKeyboard(): boolean`
Returns the current connection status of physical keyboards.

**Returns:** `boolean` - `true` if any physical keyboard is connected

```typescript
const isConnected = usePhysicalKeyboard();
```

#### `usePhysicalKeyboardInfo(): ExtendedPhysicalKeyboardInfo | null`
Returns detailed information about the connected keyboard.

**Returns:** `ExtendedPhysicalKeyboardInfo | null` - Keyboard details or `null` if none connected

```typescript
const keyboardInfo = usePhysicalKeyboardInfo();
```

### Native Module Methods

#### `hasPhysicalKeyboard(): boolean`
Synchronously check if a physical keyboard is connected.

#### `getPhysicalKeyboardDetails(): ExtendedPhysicalKeyboardInfo | null`
Get detailed keyboard information synchronously.

#### `addListener(eventName: string, callback: Function): EventSubscription`
Listen to keyboard events.

**Events:**
- `'onKeyboardStatusChanged'` - Connection status changed
- `'onKeyboardInfoChanged'` - Keyboard details updated

```typescript
import ReactNativePhysicalKeyboard from 'react-native-physical-keyboard-detector';

// Manual event listening
const subscription = ReactNativePhysicalKeyboard.addListener(
  'onKeyboardStatusChanged',
  (event) => {
    console.log('Keyboard status changed:', event.isConnected);
  }
);

// Don't forget to cleanup
subscription.remove();
```

## 🏗️ TypeScript Definitions

```typescript

type BasePhysicalKeyboardInfo = {
  name: string;
  connectedAt: number;
};

// iOS-specific keyboard info
type IOSPhysicalKeyboardInfo = BasePhysicalKeyboardInfo & {
  vendorName?: string;
  productCategory?: string;
  availableButtonKeys?: string[];
  buttonCount?: number;
};

// Android-specific keyboard info
type AndroidPhysicalKeyboardInfo = BasePhysicalKeyboardInfo & {
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
};


type ExtendedPhysicalKeyboardInfo = IOSPhysicalKeyboardInfo | AndroidPhysicalKeyboardInfo;
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

Built with Expo Modules API for seamless React Native integration.