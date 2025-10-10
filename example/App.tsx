import { ScrollView, StyleSheet, Text } from "react-native";
import {
	PhysicalKeyboardProvider,
	usePhysicalKeyboardConnected,
	usePhysicalKeyboardDetails,
	usePhysicalKeyboardEvents,
} from "react-native-physical-keyboard-detector";
import {
	SafeAreaProvider,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ConnectionStatus } from "./components/ConnectionStatus";
import { Instructions } from "./components/Instructions";
import { KeyboardDetails } from "./components/KeyboardDetails";
import { LastKeyEvent } from "./components/LastKeyEvent";
import { colors, spacing, typography } from "./theme";

function KeyboardDemo() {
	const { top } = useSafeAreaInsets();

	const isConnected = usePhysicalKeyboardConnected();
	const keyboardDetails = usePhysicalKeyboardDetails();
	const lastKeyEvent = usePhysicalKeyboardEvents();

	return (
		<ScrollView
			style={[styles.scrollContainer, { paddingTop: top }]}
			contentContainerStyle={styles.scrollViewContainer}
		>
			<Text style={styles.title}>Physical Keyboard Detector</Text>
			<Text style={styles.subtitle}>Example App</Text>
			<ConnectionStatus isConnected={isConnected} />
			{keyboardDetails && <KeyboardDetails keyboard={keyboardDetails} />}
			{lastKeyEvent && <LastKeyEvent keyEvent={lastKeyEvent} />}
			<Instructions />
		</ScrollView>
	);
}

export default function App() {
	return (
		<PhysicalKeyboardProvider>
			<SafeAreaProvider>
				<KeyboardDemo />
			</SafeAreaProvider>
		</PhysicalKeyboardProvider>
	);
}

const styles = StyleSheet.create({
	scrollContainer: {
		backgroundColor: colors.background,
		padding: spacing.xl,
	},
	scrollViewContainer: {
		gap: spacing.xs,
	},
	title: {
		...typography.title,
		textAlign: "center",
		marginBottom: spacing.xs,
	},
	subtitle: {
		...typography.subtitle,
		textAlign: "center",
		marginBottom: spacing.xl,
	},
});
