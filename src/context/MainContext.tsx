import React, { createContext, useState, useContext } from 'react';
import { AppTheme, allThemes } from '../theme/theme';

interface MainContextType {
  themeName: string;
  setThemeName: (name: string) => void;
  theme: AppTheme;
  allThemes: AppTheme[];
}

const MainContext = createContext<MainContextType | undefined>(undefined);

export const MainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeName, setThemeName] = useState('آبی ملایم'); // تم پیش‌فرض

  const theme = allThemes.find(t => t.name === themeName) || allThemes[0];

  return (
    <MainContext.Provider value={{ themeName, setThemeName, theme, allThemes }}>
      {children}
    </MainContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(MainContext);
  if (!context) throw new Error('useTheme باید درون MainProvider استفاده شود!');
  return context;
};