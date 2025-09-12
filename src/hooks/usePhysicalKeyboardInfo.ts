import type { EventSubscription } from "expo-modules-core";
import { useEffect, useState } from "react";
import type {
	ExtendedPhysicalKeyboardInfo,
	KeyboardInfoChangedEventPayload,
} from "../ReactNativePhysicalKeyboard.types";
import ReactNativePhysicalKeyboard from "../ReactNativePhysicalKeyboardModule";

export const usePhysicalKeyboardInfo = () => {
	const [keyboardInfo, setKeyboardInfo] =
		useState<ExtendedPhysicalKeyboardInfo | null>(() => {
			try {
				return ReactNativePhysicalKeyboard.getPhysicalKeyboardDetails();
			} catch (error) {
				console.warn(
					"[usePhysicalKeyboardInfo] Failed to get initial keyboard details:",
					error,
				);
				return null;
			}
		});

	useEffect(() => {
		let subscription: EventSubscription | null = null;

		try {
			subscription = ReactNativePhysicalKeyboard.addListener(
				"onKeyboardInfoChanged",
				(event: KeyboardInfoChangedEventPayload) => {
					try {
						if (
							event &&
							(event.keyboard === null || typeof event.keyboard === "object")
						) {
							setKeyboardInfo(event.keyboard);
						} else {
							console.warn(
								"[usePhysicalKeyboardInfo] Invalid event payload:",
								event,
							);
						}
					} catch (error) {
						console.warn(
							"[usePhysicalKeyboardInfo] Error processing keyboard info event:",
							error,
						);
					}
				},
			);
		} catch (error) {
			console.warn(
				"[usePhysicalKeyboardInfo] Failed to register keyboard info listener:",
				error,
			);
		}

		return () => {
			try {
				subscription?.remove();
			} catch (error) {
				console.warn(
					"[usePhysicalKeyboardInfo] Error removing keyboard info listener:",
					error,
				);
			}
		};
	}, []);

	return keyboardInfo;
};
