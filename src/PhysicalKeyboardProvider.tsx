import type { EventSubscription } from "expo-modules-core";
import React, { type ReactNode, useEffect } from "react";
import { Platform } from "react-native";
import { useInternalKeyboardStore } from "./internal/keyboardStore";
import {
	type KeyPressEvent,
	PhysicalKeyboardView,
} from "./internal/PhysicalKeyboardView";
import type {
	KeyboardInfoChangedEventPayload,
	KeyboardStatusEventPayload,
} from "./internal/types";
import ReactNativePhysicalKeyboard from "./ReactNativePhysicalKeyboardModule";
import type {
	ExtendedPhysicalKeyboardInfo,
	KeyPressEventPayload,
} from "./types";

export interface PhysicalKeyboardProviderProps {
	children: ReactNode;
}

export function PhysicalKeyboardProvider({
	children,
}: PhysicalKeyboardProviderProps) {
	const { setConnected, setKeyboardInfo, setKeyEvent, reset } =
		useInternalKeyboardStore();

	useEffect(() => {
		let keyboardStatusSubscription: EventSubscription | null = null;
		let keyboardInfoSubscription: EventSubscription | null = null;
		let keyPressSubscription: EventSubscription | null = null;

		const setupListeners = () => {
			try {
				keyboardStatusSubscription = ReactNativePhysicalKeyboard.addListener(
					"onKeyboardStatusChanged",
					(event: KeyboardStatusEventPayload) => {
						setConnected(event.isConnected);
						if (!event.isConnected) {
							setKeyboardInfo(null);
						}
					},
				);

				keyboardInfoSubscription = ReactNativePhysicalKeyboard.addListener(
					"onKeyboardInfoChanged",
					(event: KeyboardInfoChangedEventPayload) => {
						setKeyboardInfo(event.keyboard);
					},
				);

				if (Platform.OS === "ios") {
					keyPressSubscription = ReactNativePhysicalKeyboard.addListener(
						"onKeyPress",
						(event: KeyPressEventPayload) => {
							if (event && typeof event.keyCode === "number") {
								setKeyEvent({
									keyCode: event.keyCode,
									timestamp: event.timestamp || Date.now(),
									action: event.action || "down",
								});
							}
						},
					);
				}

				const isConnected = ReactNativePhysicalKeyboard.hasPhysicalKeyboard();
				setConnected(isConnected);

				if (isConnected) {
					const keyboardDetails =
						ReactNativePhysicalKeyboard.getPhysicalKeyboardDetails();
					setKeyboardInfo(keyboardDetails);
				}
			} catch (error) {
				console.warn("[PhysicalKeyboardProvider] Setup failed:", error);
			}
		};

		setupListeners();

		return () => {
			keyboardStatusSubscription?.remove();
			keyboardInfoSubscription?.remove();
			keyPressSubscription?.remove();
			reset();
		};
	}, [setConnected, setKeyboardInfo, setKeyEvent, reset]);

	const handleAndroidKeyPress = (event: KeyPressEvent) => {
		setKeyEvent({
			keyCode: event.keyCode,
			timestamp: event.timestamp,
			action: event.action,
		});
	};

	if (Platform.OS === "android") {
		return (
			<PhysicalKeyboardView onKeyPress={handleAndroidKeyPress}>
				{children}
			</PhysicalKeyboardView>
		);
	}

	return <>{children}</>;
}

export function usePhysicalKeyboardConnected(): boolean {
	return useInternalKeyboardStore.use.isConnected();
}

export function usePhysicalKeyboardDetails(): ExtendedPhysicalKeyboardInfo | null {
	return useInternalKeyboardStore.use.keyboardInfo();
}

export function usePhysicalKeyboardEvents(): KeyPressEventPayload | null {
	return useInternalKeyboardStore.use.lastKeyEvent();
}

export const getPhysicalKeyboardConnected = (): boolean => {
	return useInternalKeyboardStore.get.isConnected();
};

export const getPhysicalKeyboardDetails =
	(): ExtendedPhysicalKeyboardInfo | null => {
		return useInternalKeyboardStore.get.keyboardInfo();
	};

export const getPhysicalKeyboardEvents = (): KeyPressEventPayload | null => {
	return useInternalKeyboardStore.get.lastKeyEvent();
};
