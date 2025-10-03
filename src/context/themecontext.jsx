import { createContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { paletteColors } from './color';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // --- ESTADOS ---
  const [mode, setMode] = useState(() => localStorage.getItem('themeMode') || 'light');
  const [fontSize, setFontSize] = useState(() => parseInt(localStorage.getItem('fontSize'), 10) || 14);
  const [colorMode, setColorMode] = useState(() => localStorage.getItem('colorMode') || 'default');

  // --- EFEITOS PARA SALVAR NO LOCALSTORAGE ---
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('colorMode', colorMode);
  }, [colorMode]);

  // --- FUNÇÕES DE CONTROLE ---
  const toggleTheme = () => setMode(prev => (prev === 'light' ? 'dark' : 'light'));
  const toggleColorMode = () => setColorMode(prev => (prev === 'default' ? 'colorblind' : 'default'));
  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 1, 20));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 1, 12));

  // --- CRIAÇÃO DO TEMA (TUDO JUNTO AQUI) ---
  const muiTheme = useMemo(() => {
    const isColorblind = colorMode === 'colorblind';

    return createTheme({
      palette: {
        mode: mode,
        primary: {
          main: isColorblind ? '#007bff' : '#C00000', // Exemplo: vermelhoSenai
        },
        secondary: {
          main: '#6c757d',
        },
        error: {
          main: isColorblind ? '#ffc107' : '#dc3545',
        },
        success: {
          main: isColorblind ? '#17a2b8' : '#28a745',
        },
        // ... outras cores da paleta
      },
      typography: {
        fontSize: fontSize, // Controle global do tamanho da fonte
      },
    });
  }, [mode, fontSize, colorMode]);

  // --- VALOR A SER PASSADO PELO CONTEXT ---
  const value = useMemo(() => ({
    theme: mode,
    toggleTheme,
    colorMode,
    toggleColorMode,
    increaseFontSize,
    decreaseFontSize
  }), [mode, colorMode, fontSize]);

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}