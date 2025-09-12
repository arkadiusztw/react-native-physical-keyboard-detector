import type { EventSubscription } from "expo-modules-core";
import { useEffect, useState } from "react";
import type { KeyboardStatusEventPayload } from "../ReactNativePhysicalKeyboard.types";
import ReactNativePhysicalKeyboard from "../ReactNativePhysicalKeyboardModule";

export const usePhysicalKeyboard = () => {
	const [isConnected, setIsConnected] = useState(() => {
		try {
			return ReactNativePhysicalKeyboard.hasPhysicalKeyboard();
		} catch (error) {
			console.warn(
				"[usePhysicalKeyboard] Failed to get initial keyboard status:",
				error,
			);
			return false;
		}
	});

	useEffect(() => {
		let subscription: EventSubscription | null = null;

		try {
			subscription = ReactNativePhysicalKeyboard.addListener(
				"onKeyboardStatusChanged",
				(event: KeyboardStatusEventPayload) => {
					try {
						if (event && typeof event.isConnected === "boolean") {
							setIsConnected(event.isConnected);
						} else {
							console.warn(
								"[usePhysicalKeyboard] Invalid event payload:",
								event,
							);
						}
					} catch (error) {
						console.warn(
							"[usePhysicalKeyboard] Error processing keyboard status event:",
							error,
						);
					}
				},
			);
		} catch (error) {
			console.warn(
				"[usePhysicalKeyboard] Failed to register keyboard status listener:",
				error,
			);
		}

		return () => {
			try {
				subscription?.remove();
			} catch (error) {
				console.warn(
					"[usePhysicalKeyboard] Error removing keyboard status listener:",
					error,
				);
			}
		};
	}, []);

	return isConnected;
};
