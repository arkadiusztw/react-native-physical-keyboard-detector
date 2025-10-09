const path = require("node:path");
module.exports = (api) => {
	api.cache(true);
	return {
		presets: ["babel-preset-expo"],
		plugins: [
			[
				"module-resolver",
				{
					extensions: [".tsx", ".ts", ".js", ".json"],
					alias: {
						"react-native-physical-keyboard-detector": path.join(
							__dirname,
							"..",
							"src",
							"index.ts",
						),
					},
				},
			],
		],
	};
};
