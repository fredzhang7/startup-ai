'use client';
import { NextUIProvider } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { ThemeProvider as NextThemesProvider } from "next-themes";
import "../styles/theme.css";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider themes={["light", "dark", "system", "purple-dark"]} attribute="class" defaultTheme="light" enableColorScheme={true} enableSystem={false} forcedTheme='light'>
        {children}
      </NextThemesProvider>
    </NextUIProvider>
  );
}