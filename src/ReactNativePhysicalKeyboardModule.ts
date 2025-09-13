import { requireNativeModule } from "expo-modules-core";
import type { ReactNativePhysicalKeyboardModule } from "./internal/types";

const RNPKModule: ReactNativePhysicalKeyboardModule = requireNativeModule(
	"ReactNativePhysicalKeyboard",
);

export default RNPKModule;
