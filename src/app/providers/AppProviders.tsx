import type { ReactNode } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import type { AppStore } from "../store/store";

interface AppProvidersProps {
  store: AppStore;
  helmetContext?: object;
  children: ReactNode;
}

export const AppProviders = ({ store, helmetContext, children }: AppProvidersProps) => (
  <Provider store={store}>
    <HelmetProvider context={helmetContext}>{children}</HelmetProvider>
  </Provider>
);
