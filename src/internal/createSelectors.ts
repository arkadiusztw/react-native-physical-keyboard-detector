/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import type { StoreApi, UseBoundStore } from "zustand";

type WithSelectors<S> = S extends { getState: () => infer T }
	? S & {
			use: { [K in keyof T]: () => T[K] };
			get: { [K in keyof T]: () => T[K] };
		}
	: never;

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
	_store: S,
) => {
	const store = _store as WithSelectors<typeof _store>;

	store.use = {};
	store.get = {};

	for (const k of Object.keys(store.getState())) {
		(store.use as any)[k] = () => store((s: any) => s[k]);
		(store.get as any)[k] = () => (store.getState() as any)[k];
	}

	return store;
};
