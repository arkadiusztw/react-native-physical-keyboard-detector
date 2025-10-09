# Physical Keyboard Detector - Example App

Demo application showcasing the `react-native-physical-keyboard-detector` library.

## Features Demonstrated

- ✅ Real-time keyboard connection detection
- ✅ Display keyboard hardware information (name, vendor, type, etc.)
- ✅ Live key press events (DOWN/UP)
- ✅ iOS Full Keyboard Access support
- ✅ Cross-platform (iOS & Android)

## Setup

### 1. Install dependencies

```bash
cd example
bun install
```

### 2. Build the library (parent directory)

```bash
cd ..
bun run build
cd example
```

### 3. Prebuild native code

```bash
bun run prebuild
```

### 4. Run the app

**iOS:**
```bash
bun run ios
```

**Android:**
```bash
bun run android
```

## Testing

### iOS Testing
1. Connect a physical keyboard via Bluetooth or USB-C
2. Run the app on an iPad or iPhone
3. Test with Full Keyboard Access enabled:
   - Settings → Accessibility → Keyboards → Full Keyboard Access → Enable
4. Press keys and observe events

### Android Testing
1. Connect a physical keyboard via Bluetooth or USB-C/OTG
2. Run the app on an Android device
3. Press keys and observe events

## What You'll See

### Connection Status
Green badge when keyboard is connected, red when disconnected.

### Keyboard Details
Shows platform-specific information:
- **iOS**: Name, vendor, product category, button count
- **Android**: Device ID, vendor ID, keyboard type, external status

### Key Events
Real-time display of:
- Key code (numeric)
- Action (down/up)
- Timestamp

## Troubleshooting

### Module not found error
Make sure you've run `bun run build` in the parent directory.

### Native build errors
Try:
```bash
bun run prebuild
```

### Changes not reflected
After making changes to the library, rebuild:
```bash
cd ..
bun run build
cd example
# Kill metro bundler and restart
bun run ios  # or android
```

## Development Workflow

1. Make changes to library code (`../src`, `../ios`, `../android`)
2. Rebuild library: `cd .. && bun run build && cd example`
3. If native code changed: `bun run prebuild`
4. Restart the app

## Notes

- The example uses `file:..` dependency to link to the local library
- Changes to TypeScript code will hot-reload automatically
- Native code changes require a full rebuild
