export const colors = {
	primary: "#2196F3",
	primaryDark: "#1976D2",
	success: "#4CAF50",
	error: "#F44336",
	background: "#f5f5f5",
	cardBackground: "white",
	detailsBoxBackground: "#f9f9f9",
	textPrimary: "#333",
	textSecondary: "#666",
	textLight: "#999",
	border: "#e0e0e0",
	focusBorder: "#2196F3",
	focusBackground: "#e3f2fd",
	white: "white",
	black: "#000",
};

export const typography = {
	title: {
		fontSize: 24,
		fontWeight: "bold" as const,
		color: colors.textPrimary,
	},
	subtitle: {
		fontSize: 16,
		color: colors.textSecondary,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600" as const,
		color: colors.textPrimary,
	},
	body: {
		fontSize: 14,
		color: colors.textSecondary,
	},
	bodySmall: {
		fontSize: 13,
		color: colors.textSecondary,
	},
	bodyPrimary: {
		fontSize: 14,
		fontWeight: "600" as const,
		color: colors.textPrimary,
	},
	bodySecondary: {
		fontSize: 14,
		fontWeight: "500" as const,
		color: colors.textSecondary,
	},
	caption: {
		fontSize: 12,
		color: colors.textSecondary,
	},
	button: {
		fontSize: 16,
		fontWeight: "600" as const,
	},
};

export const spacing = {
	xs: 4,
	sm: 8,
	md: 12,
	lg: 16,
	xl: 20,
	xxl: 24,
};

export const borderRadius = {
	sm: 4,
	md: 8,
	lg: 12,
};

export const shadows = {
	card: {
		shadowColor: colors.black,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	focus: {
		shadowColor: colors.focusBorder,
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.5,
		shadowRadius: 8,
		elevation: 4,
	},
};
