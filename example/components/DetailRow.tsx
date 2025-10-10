import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "../theme";

interface DetailRowProps {
	label: string;
	value: string;
}

export function DetailRow({ label, value }: DetailRowProps) {
	return (
		<View style={styles.detailRow}>
			<Text style={styles.detailLabel}>{label}:</Text>
			<Text style={styles.detailValue}>{value}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	detailRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: spacing.sm,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	detailLabel: typography.bodySecondary,
	detailValue: typography.bodyPrimary,
});
