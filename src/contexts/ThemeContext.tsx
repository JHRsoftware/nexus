'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  // Additional colors for toggle button
  primaryDark: string;
  primaryHover: string;
  primaryDarkHover: string;
  primaryText: string;
  primaryAlpha: string;
  primaryShadow: string;
  primaryShadowHover: string;
  primaryBorderHover: string;
}

export interface Theme {
  name: string;
  colors: ThemeColors;
}

export interface ThemeContextType {
  currentTheme: Theme;
  isDarkMode: boolean;
  selectedColorScheme: string;
  customPrimaryColor: string | null;
  toggleDarkMode: () => void;
  setColorScheme: (scheme: string) => void;
  setCustomPrimaryColor: (color: string) => void;
  availableColorSchemes: ColorScheme[];
}

export interface ColorScheme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
}

// Utility function to adjust color brightness
const adjustBrightness = (hexColor: string, percent: number): string => {
  const num = parseInt(hexColor.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16).slice(1);
};

// Available color schemes
const colorSchemes: ColorScheme[] = [
  {
    name: 'Blue',
    primary: '#3498db',
    secondary: '#2980b9',
    accent: '#1abc9c'
  },
  {
    name: 'Purple',
    primary: '#9b59b6',
    secondary: '#8e44ad',
    accent: '#e74c3c'
  },
  {
    name: 'Green',
    primary: '#27ae60',
    secondary: '#229954',
    accent: '#f39c12'
  },
  {
    name: 'Orange',
    primary: '#e67e22',
    secondary: '#d35400',
    accent: '#e74c3c'
  },
  {
    name: 'Red',
    primary: '#e74c3c',
    secondary: '#c0392b',
    accent: '#f39c12'
  },
  {
    name: 'Teal',
    primary: '#1abc9c',
    secondary: '#16a085',
    accent: '#3498db'
  }
];

const generateTheme = (colorScheme: ColorScheme, isDark: boolean, customPrimary?: string): Theme => {
  const primaryColor = customPrimary || colorScheme.primary;
  const baseColors = {
    primary: primaryColor,
    secondary: customPrimary ? adjustBrightness(customPrimary, -20) : colorScheme.secondary,
    accent: customPrimary ? adjustBrightness(customPrimary, 30) : colorScheme.accent,
    success: '#27ae60',
    warning: '#f39c12',
    error: '#e74c3c',
    // Additional colors for toggle button
    primaryDark: adjustBrightness(primaryColor, -15),
    primaryHover: adjustBrightness(primaryColor, -10),
    primaryDarkHover: adjustBrightness(primaryColor, -25),
    primaryText: '#ffffff',
    primaryAlpha: `rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.3)`,
    primaryShadow: `rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.2)`,
    primaryShadowHover: `rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.4)`,
    primaryBorderHover: `rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.5)`
  };

  if (isDark) {
    return {
      name: `${colorScheme.name} Dark`,
      colors: {
        ...baseColors,
        background: '#1a1a1a',
        surface: '#2c2c2c',
        text: '#ffffff',
        textSecondary: '#b0b0b0',
        border: '#404040'
      }
    };
  } else {
    return {
      name: `${colorScheme.name} Light`,
      colors: {
        ...baseColors,
        background: '#ffffff',
        surface: '#f8f9fa',
        text: '#2c3e50',
        textSecondary: '#6c757d',
        border: '#e9ecef'
      }
    };
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedColorScheme, setSelectedColorScheme] = useState('Blue');
  const [customPrimaryColor, setCustomPrimaryColor] = useState<string | null>(null);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-preferences');
    if (savedTheme) {
      const { isDark, colorScheme, customColor } = JSON.parse(savedTheme);
      setIsDarkMode(isDark);
      setSelectedColorScheme(colorScheme);
      setCustomPrimaryColor(customColor || null);
    }
  }, []);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('theme-preferences', JSON.stringify({
      isDark: isDarkMode,
      colorScheme: selectedColorScheme,
      customColor: customPrimaryColor
    }));
    
    // Apply CSS custom properties
    const scheme = colorSchemes.find(cs => cs.name === selectedColorScheme) || colorSchemes[0];
    const theme = generateTheme(scheme, isDarkMode, customPrimaryColor || undefined);
    
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  }, [isDarkMode, selectedColorScheme, customPrimaryColor]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const setColorScheme = (scheme: string) => {
    setSelectedColorScheme(scheme);
    // Clear custom color when selecting a predefined scheme
    setCustomPrimaryColor(null);
  };

  const handleSetCustomPrimaryColor = (color: string) => {
    setCustomPrimaryColor(color);
    // Set to "Custom" scheme when using custom color
    setSelectedColorScheme('Custom');
  };

  const currentScheme = colorSchemes.find(cs => cs.name === selectedColorScheme) || colorSchemes[0];
  const currentTheme = generateTheme(currentScheme, isDarkMode, customPrimaryColor || undefined);

  const contextValue: ThemeContextType = {
    currentTheme,
    isDarkMode,
    selectedColorScheme,
    customPrimaryColor,
    toggleDarkMode,
    setColorScheme,
    setCustomPrimaryColor: handleSetCustomPrimaryColor,
    availableColorSchemes: colorSchemes
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;