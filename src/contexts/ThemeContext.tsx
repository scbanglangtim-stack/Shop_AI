// src/contexts/ThemeContext.tsx
// ThemeContext quản lý chế độ Sáng / Tối toàn cục (Chương 3.3 & Sprint 3)
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { COLORS } from '@constants/theme';

export const LIGHT_COLORS = {
  background: COLORS.background,
  surface: COLORS.surface,
  text: COLORS.text,
  textLight: COLORS.textLight,
  primary: COLORS.primary,
  border: COLORS.border,
  card: '#FFFFFF',
};

export const DARK_COLORS = {
  background: '#121212',
  surface: '#1E1E1E',
  text: '#F5F5F5',
  textLight: '#9BA1A6',
  primary: COLORS.primary,
  border: '#2C2C2C',
  card: '#1E1E1E',
};

export interface ThemeContextValue {
  isDark: boolean;
  colors: typeof LIGHT_COLORS;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(false);

  const value: ThemeContextValue = {
    isDark,
    colors: isDark ? DARK_COLORS : LIGHT_COLORS,
    toggleTheme: () => setIsDark(prev => !prev),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme phải được sử dụng bên trong <ThemeProvider>');
  }
  return ctx;
};
