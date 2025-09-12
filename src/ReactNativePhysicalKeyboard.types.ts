import type { EventSubscription } from "expo-modules-core";

/**
 * Common properties available on both iOS and Android platforms
 */
export type BasePhysicalKeyboardInfo = {
	/** Display name of the keyboard device */
	name: string;
	/** Timestamp when keyboard was connected (milliseconds since epoch) */
	connectedAt: number;
};

/**
 * iOS-specific keyboard information from GCKeyboard API
 * Available only when running on iOS devices
 */
export type IOSPhysicalKeyboardInfo = BasePhysicalKeyboardInfo & {
	/** Vendor/manufacturer name from GCKeyboard.vendorName */
	vendorName?: string;
	/** Product category from GCKeyboard.productCategory (e.g. "DualShock4") */
	productCategory?: string;
	/** Array of all available button key names (e.g. ["a", "space", "enter"]) */
	availableButtonKeys?: string[];
	/** Total number of buttons available on this keyboard */
	buttonCount?: number;
};

/**
 * Android-specific keyboard information from InputDevice API
 * Available only when running on Android devices
 */
export type AndroidPhysicalKeyboardInfo = BasePhysicalKeyboardInfo & {
	/** Unique device ID from InputDevice.id */
	id?: number;
	/** Hardware vendor ID from InputDevice.vendorId (e.g. 1452 for Apple) */
	vendorId?: number;
	/** Hardware product ID from InputDevice.productId */
	productId?: number;
	/** Controller number from InputDevice.controllerNumber */
	controllerNumber?: number;
	/** Device descriptor string from InputDevice.descriptor */
	descriptor?: string;
	/** Whether this is a virtual keyboard (InputDevice.isVirtual) */
	isVirtual?: boolean;
	/** Whether this is an external keyboard (InputDevice.isExternal) */
	isExternal?: boolean;
	/** Input sources bitmask from InputDevice.sources (769 = keyboard) */
	sources?: number;
	/** Keyboard type numeric value from InputDevice.keyboardType */
	keyboardType?: number;
	/** Human-readable keyboard type ("ALPHABETIC", "NON_ALPHABETIC", "NONE") */
	keyboardTypeName?: string;
};

export type ExtendedPhysicalKeyboardInfo =
	| IOSPhysicalKeyboardInfo
	| AndroidPhysicalKeyboardInfo;

export type KeyboardStatusEventPayload = {
	isConnected: boolean;
};

export type KeyboardInfoChangedEventPayload = {
	keyboard: ExtendedPhysicalKeyboardInfo | null;
};

/**
 * Native module interface for detecting and monitoring physical keyboards
 * Provides cross-platform access to physical keyboard information on iOS and Android
 */
export type ReactNativePhysicalKeyboardModule = {
	/**
	 * Check if any physical keyboard is currently connected
	 * @returns true if at least one physical keyboard is detected, false otherwise
	 */
	hasPhysicalKeyboard: () => boolean;

	/**
	 * Get detailed information about the currently connected physical keyboard
	 * @returns Keyboard info object with platform-specific properties, or null if no keyboard
	 */
	getPhysicalKeyboardDetails: () => ExtendedPhysicalKeyboardInfo | null;

	/**
	 * Add event listeners for keyboard connection changes and info updates
	 * Supports two event types with different payloads
	 */
	addListener: {
		/**
		 * Listen for keyboard connection/disconnection events
		 * @param eventName - Event type for connection status changes
		 * @param listener - Callback receiving boolean connection status
		 * @returns EventSubscription that can be used to unsubscribe
		 */
		(
			eventName: "onKeyboardStatusChanged",
			listener: (event: KeyboardStatusEventPayload) => void,
		): EventSubscription;

		/**
		 * Listen for keyboard information changes
		 * @param eventName - Event type for keyboard info changes
		 * @param listener - Callback receiving full keyboard info or null
		 * @returns EventSubscription that can be used to unsubscribe
		 */
		(
			eventName: "onKeyboardInfoChanged",
			listener: (event: KeyboardInfoChangedEventPayload) => void,
		): EventSubscription;
	};
};
