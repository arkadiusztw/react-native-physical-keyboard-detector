import { StatusBar } from "expo-status-bar";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import {
	PhysicalKeyboardProvider,
	usePhysicalKeyboardConnected,
	usePhysicalKeyboardDetails,
	usePhysicalKeyboardEvents,
} from "react-native-physical-keyboard-detector";

function KeyboardDemo() {
	const isConnected = usePhysicalKeyboardConnected();
	const keyboardDetails = usePhysicalKeyboardDetails();
	const lastKeyEvent = usePhysicalKeyboardEvents();

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={styles.scrollContent}
			showsVerticalScrollIndicator={false}
		>
			<View style={styles.contentWrapper}>
				<Text style={styles.title}>Physical Keyboard Detector</Text>
				<Text style={styles.subtitle}>Example App</Text>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Connection Status</Text>
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
				</View>

				{keyboardDetails && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Keyboard Details</Text>
						<View style={styles.detailsBox}>
							<DetailRow label="Name" value={keyboardDetails.name || "N/A"} />
							<DetailRow
								label="Vendor"
								value={
									"vendorName" in keyboardDetails
										? keyboardDetails.vendorName || "N/A"
										: "vendorId" in keyboardDetails
											? keyboardDetails.vendorId?.toString() || "N/A"
											: "N/A"
								}
							/>
							<DetailRow
								label="Platform"
								value={"productCategory" in keyboardDetails ? "iOS" : "Android"}
							/>
							{"buttonCount" in keyboardDetails &&
							keyboardDetails.buttonCount ? (
								<DetailRow
									label="Buttons"
									value={keyboardDetails.buttonCount.toString()}
								/>
							) : null}
							{"keyboardTypeName" in keyboardDetails &&
								keyboardDetails.keyboardTypeName && (
									<DetailRow
										label="Type"
										value={keyboardDetails.keyboardTypeName}
									/>
								)}
						</View>
					</View>
				)}

				{lastKeyEvent && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Last Key Event</Text>
						<View style={styles.detailsBox}>
							<DetailRow
								label="Key Code"
								value={lastKeyEvent.keyCode.toString()}
							/>
							<DetailRow
								label="Action"
								value={lastKeyEvent.action?.toUpperCase() || "N/A"}
							/>
							<DetailRow
								label="Timestamp"
								value={
									lastKeyEvent.timestamp
										? new Date(lastKeyEvent.timestamp).toLocaleTimeString()
										: "N/A"
								}
							/>
						</View>
					</View>
				)}

				<View style={styles.section}>
					<Text style={styles.instructions}>
						{Platform.OS === "ios"
							? "Connect a Bluetooth keyboard or use the iPad keyboard to see details."
							: "Connect a Bluetooth or USB keyboard to see details."}
					</Text>
				</View>

				<StatusBar style="auto" />
			</View>
		</ScrollView>
	);
}

function DetailRow({ label, value }: { label: string; value: string }) {
	return (
		<View style={styles.detailRow}>
			<Text style={styles.detailLabel}>{label}:</Text>
			<Text style={styles.detailValue}>{value}</Text>
		</View>
	);
}

export default function App() {
	return (
		<PhysicalKeyboardProvider>
			<KeyboardDemo />
		</PhysicalKeyboardProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	},
	contentWrapper: {
		flex: 1,
		justifyContent: "center",
		padding: 20,
		width: "100%",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 4,
		color: "#333",
	},
	subtitle: {
		fontSize: 16,
		textAlign: "center",
		marginBottom: 20,
		color: "#666",
	},
	scrollContent: {
		flexGrow: 1,
	},
	section: {
		marginBottom: 24,
		backgroundColor: "white",
		borderRadius: 12,
		padding: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 12,
		color: "#333",
	},
	statusBadge: {
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 8,
		alignItems: "center",
	},
	connected: {
		backgroundColor: "#4CAF50",
	},
	disconnected: {
		backgroundColor: "#F44336",
	},
	statusText: {
		color: "white",
		fontSize: 16,
		fontWeight: "600",
	},
	detailsBox: {
		backgroundColor: "#f9f9f9",
		borderRadius: 8,
		padding: 12,
	},
	detailRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: "#e0e0e0",
	},
	detailLabel: {
		fontSize: 14,
		color: "#666",
		fontWeight: "500",
	},
	detailValue: {
		fontSize: 14,
		color: "#333",
		fontWeight: "600",
	},
	noData: {
		fontSize: 14,
		color: "#999",
		fontStyle: "italic",
		textAlign: "center",
		paddingVertical: 12,
	},
	instructions: {
		fontSize: 14,
		color: "#666",
		marginBottom: 8,
		lineHeight: 20,
	},
	highlight: {
		backgroundColor: "#FFF3CD",
		padding: 8,
		borderRadius: 4,
		marginTop: 8,
		color: "#856404",
	},
});
