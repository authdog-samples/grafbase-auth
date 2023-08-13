import "../styles/globals.css";
import type { AppProps } from "next/app";

import { AuthdogProvider } from "@authdog/react";

export default function App({ Component, pageProps }: AppProps) {
  const authnApi = "https://cdn-mgt.auth.dog";
  const webLoginUri =
    "https://web.auth.dog?id=23c0ed12-444f-4b2d-8afa-e9413e51f29f";

  return (
    <AuthdogProvider
      authnApi={authnApi}
      webLoginUri={webLoginUri}
      {...pageProps}
    >
      <Component {...pageProps} />
    </AuthdogProvider>
  );
}
