import type { ExtendedPhysicalKeyboardInfo } from "react-native-physical-keyboard-detector";
import { DetailRow } from "./DetailRow";
import { DetailsBox, Section } from "./Section";

interface KeyboardDetailsProps {
	keyboard: ExtendedPhysicalKeyboardInfo;
}

export function KeyboardDetails({ keyboard }: KeyboardDetailsProps) {
	return (
		<Section title="Keyboard Details">
			<DetailsBox>
				<DetailRow label="Name" value={keyboard.name || "N/A"} />
				<DetailRow
					label="Vendor"
					value={
						"vendorName" in keyboard
							? keyboard.vendorName || "N/A"
							: "vendorId" in keyboard
								? keyboard.vendorId?.toString() || "N/A"
								: "N/A"
					}
				/>
				<DetailRow
					label="Platform"
					value={"productCategory" in keyboard ? "iOS" : "Android"}
				/>
				{"buttonCount" in keyboard && keyboard.buttonCount ? (
					<DetailRow label="Buttons" value={keyboard.buttonCount.toString()} />
				) : null}
				{"keyboardTypeName" in keyboard && keyboard.keyboardTypeName && (
					<DetailRow label="Type" value={keyboard.keyboardTypeName} />
				)}
			</DetailsBox>
		</Section>
	);
}
