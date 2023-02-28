import "@/styles/globals.scss";
import "@/styles/tailwind.css";
import { Provider } from "react-redux";
import type { AppProps } from "next/app";

import store from "@/core/store";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
