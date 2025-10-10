import { requireNativeViewManager } from "expo-modules-core";
import React, { type ReactNode } from "react";

const NativePhysicalKeyboardView = requireNativeViewManager(
	"ReactNativePhysicalKeyboardView",
);

export interface KeyPressEvent {
	keyCode: number;
	timestamp: number;
	action: "up" | "down";
}

export interface PhysicalKeyboardViewProps {
	children: ReactNode;
	onKeyPress?: (event: KeyPressEvent) => void;
}

export function PhysicalKeyboardView({
	onKeyPress,
	children,
}: PhysicalKeyboardViewProps) {
	const handleKeyPress = (event: { nativeEvent: KeyPressEvent }) => {
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
	};

	return (
		<NativePhysicalKeyboardView
			style={{ flex: 1 }}
			onPhysicalKeyPress={handleKeyPress}
		>
			{children}
		</NativePhysicalKeyboardView>
	);
}
