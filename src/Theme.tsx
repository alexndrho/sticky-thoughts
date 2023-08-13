import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from '@mantine/core';
import { useEffect, useState } from 'react';

interface ThemeProps {
  children: React.ReactNode;
}

const Theme = ({ children }: ThemeProps) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');

  useEffect(() => {
    const storedColorScheme = localStorage.getItem('colorScheme');

    if (storedColorScheme) {
      setColorScheme(storedColorScheme as ColorScheme);
    } else {
      const systemColorScheme = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches
        ? 'dark'
        : 'light';

      setColorScheme(systemColorScheme);
    }
  }, []);

  const toggleColorScheme = (value?: ColorScheme) => {
    const newColorScheme = value || colorScheme === 'dark' ? 'light' : 'dark';

    localStorage.setItem('colorScheme', newColorScheme);
    setColorScheme(newColorScheme);
  };

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{
          colorScheme: colorScheme,
        }}
        withGlobalStyles
        withNormalizeCSS
      >
        {children}
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default Theme;
