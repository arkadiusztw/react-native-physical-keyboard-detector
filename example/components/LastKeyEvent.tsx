import type { KeyPressEventPayload } from "react-native-physical-keyboard-detector";
import { DetailRow } from "./DetailRow";
import { DetailsBox, Section } from "./Section";

interface LastKeyEventProps {
	keyEvent: KeyPressEventPayload;
}

export function LastKeyEvent({ keyEvent }: LastKeyEventProps) {
	return (
		<Section title="Last Key Event">
			<DetailsBox>
				<DetailRow label="Key Code" value={keyEvent.keyCode.toString()} />
				<DetailRow
					label="Action"
					value={keyEvent.action?.toUpperCase() || "N/A"}
				/>
				<DetailRow
					label="Timestamp"
					value={
						keyEvent.timestamp
							? new Date(keyEvent.timestamp).toLocaleTimeString()
							: "N/A"
					}
				/>
			</DetailsBox>
		</Section>
	);
}
