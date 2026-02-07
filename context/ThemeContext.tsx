import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'classic' | 'organic';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    isOrganic: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        // Persist theme choice
        const saved = localStorage.getItem('orostone-theme');
        return (saved as Theme) || 'classic';
    });

    useEffect(() => {
        localStorage.setItem('orostone-theme', theme);
        // Apply dataset attribute to body for CSS selectors
        document.body.dataset.theme = theme;
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'classic' ? 'organic' : 'classic');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isOrganic: theme === 'organic' }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
