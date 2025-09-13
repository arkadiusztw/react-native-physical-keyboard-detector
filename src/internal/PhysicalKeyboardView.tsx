import { requireNativeViewManager } from "expo-modules-core";
import React, { type ReactNode } from "react";

const NativePhysicalKeyboardView = requireNativeViewManager(
	"ReactNativePhysicalKeyboardView",
);

/**
 * Key press event data from physical keyboard
 * @platform Android
 */
export interface KeyPressEvent {
	/** Android KeyEvent keyCode */
	keyCode: number;
	/** Timestamp when key event occurred */
	timestamp: number;
	/** Key action type - "down" when pressed, "up" when released */
	action: "up" | "down";
}

/**
 * Props for PhysicalKeyboardView component
 * @platform Android
 */
export interface PhysicalKeyboardViewProps {
	children: ReactNode;
	/** Callback fired when physical keyboard key is pressed or released */
	onKeyPress?: (event: KeyPressEvent) => void;
}

/**
 * Android-only invisible view component that captures physical keyboard events
 * without interfering with touch interactions or focus navigation.
 *
 * This component creates an invisible overlay that listens for physical keyboard
 * events and passes them through to the normal app navigation.
 *
 * @platform Android
 */
export function PhysicalKeyboardView({
	onKeyPress,
	children,
}: PhysicalKeyboardViewProps) {
	return (
		<NativePhysicalKeyboardView
			style={{
				flex: 1,
			}}
			onKeyPress={(event: { nativeEvent: KeyPressEvent }) => {
				if (onKeyPress && event.nativeEvent) {
					const nativeEvent = event.nativeEvent;
					if (typeof nativeEvent.keyCode === "number") {
						onKeyPress({
							keyCode: nativeEvent.keyCode,
							action: nativeEvent.action || "down",
							timestamp: nativeEvent.timestamp || Date.now(),
						});
					}
				}
			}}
		>
			{children}
		</NativePhysicalKeyboardView>
	);
}
