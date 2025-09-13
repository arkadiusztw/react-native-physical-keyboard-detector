import { create } from "zustand";
import type {
	ExtendedPhysicalKeyboardInfo,
	KeyPressEventPayload,
} from "../types";
import { createSelectors } from "./createSelectors";

interface KeyboardState {
	isConnected: boolean;
	keyboardInfo: ExtendedPhysicalKeyboardInfo | null;
	lastKeyEvent: KeyPressEventPayload | null;

	setConnected: (connected: boolean) => void;
	setKeyboardInfo: (info: ExtendedPhysicalKeyboardInfo | null) => void;
	setKeyEvent: (event: KeyPressEventPayload) => void;
	reset: () => void;
}

const initialState = {
	isConnected: false,
	keyboardInfo: null,
	lastKeyEvent: null,
};

const keyboardStore = create<KeyboardState>((set) => ({
	...initialState,

	setConnected: (isConnected: boolean) =>
		set((state) => ({ ...state, isConnected })),

	setKeyboardInfo: (keyboardInfo: ExtendedPhysicalKeyboardInfo | null) =>
		set((state) => ({ ...state, keyboardInfo })),

	setKeyEvent: (lastKeyEvent: KeyPressEventPayload) =>
		set((state) => ({ ...state, lastKeyEvent })),

	reset: () => set(initialState),
}));

export const useInternalKeyboardStore = createSelectors(keyboardStore);
