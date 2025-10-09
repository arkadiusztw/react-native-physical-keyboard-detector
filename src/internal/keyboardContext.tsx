import React, {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import type {
	ExtendedPhysicalKeyboardInfo,
	KeyPressEventPayload,
} from "../types";

interface KeyboardState {
	isConnected: boolean;
	keyboardInfo: ExtendedPhysicalKeyboardInfo | null;
	lastKeyEvent: KeyPressEventPayload | null;
}

interface KeyboardContextType extends KeyboardState {
	setConnected: (connected: boolean) => void;
	setKeyboardInfo: (info: ExtendedPhysicalKeyboardInfo | null) => void;
	setKeyEvent: (event: KeyPressEventPayload) => void;
	reset: () => void;
}

const KeyboardContext = createContext<KeyboardContextType | null>(null);

const initialState: KeyboardState = {
	isConnected: false,
	keyboardInfo: null,
	lastKeyEvent: null,
};

export function KeyboardStateProvider({ children }: { children: ReactNode }) {
	const [state, setState] = useState<KeyboardState>(initialState);

	const setConnected = useCallback((isConnected: boolean) => {
		setState((prev) => ({ ...prev, isConnected }));
	}, []);

	const setKeyboardInfo = useCallback(
		(keyboardInfo: ExtendedPhysicalKeyboardInfo | null) => {
			setState((prev) => ({ ...prev, keyboardInfo }));
		},
		[],
	);

	const setKeyEvent = useCallback((lastKeyEvent: KeyPressEventPayload) => {
		setState((prev) => ({ ...prev, lastKeyEvent }));
	}, []);

	const reset = useCallback(() => {
		setState(initialState);
	}, []);

	const value: KeyboardContextType = useMemo(
		() => ({
			...state,
			setConnected,
			setKeyboardInfo,
			setKeyEvent,
			reset,
		}),
		[state, setConnected, setKeyboardInfo, setKeyEvent, reset],
	);

	return (
		<KeyboardContext.Provider value={value}>
			{children}
		</KeyboardContext.Provider>
	);
}

export function useKeyboardContext() {
	const context = useContext(KeyboardContext);
	if (!context) {
		throw new Error(
			"useKeyboardContext must be used within KeyboardStateProvider",
		);
	}
	return context;
}

let globalStateRef: KeyboardState = initialState;

export function updateGlobalStateRef(state: KeyboardState) {
	globalStateRef = state;
}

export function getGlobalIsConnected(): boolean {
	return globalStateRef.isConnected;
}

export function getGlobalKeyboardInfo(): ExtendedPhysicalKeyboardInfo | null {
	return globalStateRef.keyboardInfo;
}

export function getGlobalLastKeyEvent(): KeyPressEventPayload | null {
	return globalStateRef.lastKeyEvent;
}
