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

/**
 * Union type representing keyboard information from either iOS or Android
 */
export type ExtendedPhysicalKeyboardInfo =
	| IOSPhysicalKeyboardInfo
	| AndroidPhysicalKeyboardInfo;

/**
 * Key press event payload containing information about a physical key press
 */
export interface KeyPressEventPayload {
	/** The key code of the pressed key */
	keyCode: number;
	/** Timestamp when the key event occurred (milliseconds since epoch) */
	timestamp?: number;
	/** Whether the key was pressed down or released */
	action?: "up" | "down";
}
