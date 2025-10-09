export type BasePhysicalKeyboardInfo = {
	name: string;
	connectedAt: number;
};

export type IOSPhysicalKeyboardInfo = BasePhysicalKeyboardInfo & {
	vendorName?: string;
	productCategory?: string;
	availableButtonKeys?: string[];
	buttonCount?: number;
};

export type AndroidPhysicalKeyboardInfo = BasePhysicalKeyboardInfo & {
	id?: number;
	vendorId?: number;
	productId?: number;
	controllerNumber?: number;
	descriptor?: string;
	isVirtual?: boolean;
	isExternal?: boolean;
	sources?: number;
	keyboardType?: number;
	keyboardTypeName?: string;
};

export type ExtendedPhysicalKeyboardInfo =
	| IOSPhysicalKeyboardInfo
	| AndroidPhysicalKeyboardInfo;

export interface KeyPressEventPayload {
	keyCode: number;
	timestamp?: number;
	action?: "up" | "down";
}
