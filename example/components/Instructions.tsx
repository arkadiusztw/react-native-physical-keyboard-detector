import { Platform, StyleSheet, Text } from "react-native";
import { typography } from "../theme";
import { Section } from "./Section";

export function Instructions() {
	return (
		<Section>
			<Text style={styles.instructions}>
				{Platform.OS === "ios"
					? "Connect a Bluetooth keyboard or use the iPad keyboard to see details.\n\n" +
						"ℹ️ With Full Keyboard Access enabled, arrow keys are detected via focus tracking."
					: "Connect a Bluetooth or USB keyboard to see details."}
			</Text>
		</Section>
	);
}

const styles = StyleSheet.create({
	instructions: {
		...typography.body,
	},
});
