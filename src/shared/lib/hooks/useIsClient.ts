import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export const useIsClient = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
