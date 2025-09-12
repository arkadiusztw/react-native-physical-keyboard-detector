import { requireNativeModule } from "expo-modules-core";

import type { ReactNativePhysicalKeyboardModule } from "./ReactNativePhysicalKeyboard.types";

const RNPKModule: ReactNativePhysicalKeyboardModule = requireNativeModule(
	"ReactNativePhysicalKeyboard",
);

export default RNPKModule;
