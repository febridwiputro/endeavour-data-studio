// _app.tsx

import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { DarkModeProvider } from "@/context/DarkModeContext";
import { store } from "../store/store";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <DarkModeProvider>
        <Component {...pageProps} />
      </DarkModeProvider>
    </Provider>
  );
}

export default MyApp;