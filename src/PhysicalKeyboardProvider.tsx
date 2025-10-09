import type { EventSubscription } from "expo-modules-core";
import React, { type ReactNode, useCallback, useEffect } from "react";
import {
	getGlobalIsConnected,
	getGlobalKeyboardInfo,
	getGlobalLastKeyEvent,
	KeyboardStateProvider,
	updateGlobalStateRef,
	useKeyboardContext,
} from "./internal/keyboardContext";
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

function PhysicalKeyboardProviderInner({
	children,
}: PhysicalKeyboardProviderProps) {
	const { setConnected, setKeyboardInfo, setKeyEvent, reset, ...state } =
		useKeyboardContext();

	useEffect(() => {
		let keyboardStatusSubscription: EventSubscription | null = null;
		let keyboardInfoSubscription: EventSubscription | null = null;

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
			reset();
		};
	}, [setConnected, setKeyboardInfo, reset]);

	useEffect(() => {
		updateGlobalStateRef({
			isConnected: state.isConnected,
			keyboardInfo: state.keyboardInfo,
			lastKeyEvent: state.lastKeyEvent,
		});
	}, [state.isConnected, state.keyboardInfo, state.lastKeyEvent]);

	const handleKeyPress = useCallback(
		(event: KeyPressEvent) => {
			setKeyEvent({
				keyCode: event.keyCode,
				timestamp: event.timestamp,
				action: event.action,
			});
		},
		[setKeyEvent],
	);

	return (
		<PhysicalKeyboardView onKeyPress={handleKeyPress}>
			{children}
		</PhysicalKeyboardView>
	);
}

export function PhysicalKeyboardProvider({
	children,
}: PhysicalKeyboardProviderProps) {
	return (
		<KeyboardStateProvider>
			<PhysicalKeyboardProviderInner>{children}</PhysicalKeyboardProviderInner>
		</KeyboardStateProvider>
	);
}

export function usePhysicalKeyboardConnected(): boolean {
	const context = useKeyboardContext();
	return context.isConnected;
}

export function usePhysicalKeyboardDetails(): ExtendedPhysicalKeyboardInfo | null {
	const context = useKeyboardContext();
	return context.keyboardInfo;
}

export function usePhysicalKeyboardEvents(): KeyPressEventPayload | null {
	const context = useKeyboardContext();
	return context.lastKeyEvent;
}

export const getPhysicalKeyboardConnected = (): boolean => {
	return getGlobalIsConnected();
};

export const getPhysicalKeyboardDetails =
	(): ExtendedPhysicalKeyboardInfo | null => {
		return getGlobalKeyboardInfo();
	};

export const getPhysicalKeyboardEvents = (): KeyPressEventPayload | null => {
	return getGlobalLastKeyEvent();
};
