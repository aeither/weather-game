import "@tamagui/core/reset.css";
import "@tamagui/font-inter/css/400.css";
import "@tamagui/font-inter/css/700.css";

import { NextThemeProvider, useRootTheme } from "@tamagui/next-theme";
import { Provider } from "app/provider";
import Head from "next/head";
import React, { useMemo } from "react";
import type { SolitoAppProps } from "solito";
import "raf/polyfill";
import { trpc } from "app/lib/utils/trpc.web";

function MyApp({ Component, pageProps }: SolitoAppProps) {
  return (
    <>
      <Head>
        <title>Weather Forecaster Game</title>
        <meta name="description" content="A game for predicting weather conditions." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useRootTheme();

  return (
    <NextThemeProvider onChangeTheme={setTheme}>
      <Provider disableRootThemeClass defaultTheme={theme}>
        {children}
      </Provider>
    </NextThemeProvider>
  );
}

export default trpc.withTRPC(MyApp);
