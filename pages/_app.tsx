import type { AppProps } from 'next/app';
import { NextUIProvider } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import "../styles/theme.css";
import "../app/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider themes={["light", "dark", "system", "purple-dark"]} attribute="class" defaultTheme="light" enableColorScheme={true} enableSystem={false} forcedTheme='light'>
        <Component {...pageProps} />
      </NextThemesProvider>
    </NextUIProvider>
  )
}

export default MyApp;