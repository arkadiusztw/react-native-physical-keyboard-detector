import type { EventSubscription } from "expo-modules-core";
import type {
	ExtendedPhysicalKeyboardInfo,
	KeyPressEventPayload,
} from "../types";

export type KeyboardStatusEventPayload = {
	isConnected: boolean;
};

export type KeyboardInfoChangedEventPayload = {
	keyboard: ExtendedPhysicalKeyboardInfo | null;
};

export type ReactNativePhysicalKeyboardModule = {
	hasPhysicalKeyboard: () => boolean;
	getPhysicalKeyboardDetails: () => ExtendedPhysicalKeyboardInfo | null;
	addListener: {
		(
			eventName: "onKeyboardStatusChanged",
			listener: (event: KeyboardStatusEventPayload) => void,
		): EventSubscription;
		(
			eventName: "onKeyboardInfoChanged",
			listener: (event: KeyboardInfoChangedEventPayload) => void,
		): EventSubscription;
		(
			eventName: "onKeyPress",
			listener: (event: KeyPressEventPayload) => void,
		): EventSubscription;
	};
};
