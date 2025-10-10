import { StyleSheet, Text, View } from "react-native";
import { borderRadius, colors, spacing, typography } from "../theme";
import { Section } from "./Section";

interface ConnectionStatusProps {
	isConnected: boolean;
}

export function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
	return (
		<Section title="Connection Status">
			<View
				style={[
					styles.statusBadge,
					isConnected ? styles.connected : styles.disconnected,
				]}
			>
				<Text style={styles.statusText}>
					{isConnected ? "✓ Keyboard Connected" : "✗ No Keyboard"}
				</Text>
			</View>
		</Section>
	);
}

const styles = StyleSheet.create({
	statusBadge: {
		paddingVertical: spacing.md,
		paddingHorizontal: spacing.xl,
		borderRadius: borderRadius.md,
		alignItems: "center",
	},
	connected: {
		backgroundColor: colors.success,
	},
	disconnected: {
		backgroundColor: colors.error,
	},
	statusText: {
		...typography.button,
		color: colors.white,
	},
});
