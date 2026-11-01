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
        // Persist theme choice. A browser that blocks site storage (Safari "Block All Cookies") throws on any
        // access; uncaught here it would unmount the whole app and leave an empty page.
        try {
            const saved = localStorage.getItem('orostone-theme');
            return (saved as Theme) || 'classic';
        } catch {
            return 'classic';
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('orostone-theme', theme);
        } catch {
            // Storage blocked: the theme lasts for this page load
        }
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
