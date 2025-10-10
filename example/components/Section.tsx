import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { borderRadius, colors, shadows, spacing, typography } from "../theme";

interface SectionProps {
	title?: string;
	children: ReactNode;
}

export function Section({ title, children }: SectionProps) {
	return (
		<View style={styles.section}>
			{title && <Text style={styles.sectionTitle}>{title}</Text>}
			{children}
		</View>
	);
}

interface DetailsBoxProps {
	children: ReactNode;
}

export function DetailsBox({ children }: DetailsBoxProps) {
	return <View style={styles.detailsBox}>{children}</View>;
}

const styles = StyleSheet.create({
	section: {
		marginBottom: spacing.xxl,
		backgroundColor: colors.cardBackground,
		borderRadius: borderRadius.lg,
		padding: spacing.lg,
		...shadows.card,
	},
	sectionTitle: {
		...typography.sectionTitle,
		marginBottom: spacing.md,
	},
	detailsBox: {
		backgroundColor: colors.detailsBoxBackground,
		borderRadius: borderRadius.md,
		padding: spacing.md,
	},
});
