import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { DarkModeProvider } from "@/context/DarkModeContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/services/reactQueryClient";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <DarkModeProvider>
          <Component {...pageProps} />
        </DarkModeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  );
}

export default MyApp;