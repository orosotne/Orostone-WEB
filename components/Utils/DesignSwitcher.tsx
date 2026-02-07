import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Palette, X } from 'lucide-react';
import { Button } from '../UI/Button';
import { motion, AnimatePresence } from 'framer-motion';

export const DesignSwitcher = () => {
    const { theme, toggleTheme } = useTheme();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // 1. Check URL param
        const params = new URLSearchParams(window.location.search);
        if (params.get('dev') === 'true') {
            setIsVisible(true);
        }

        // 2. Keyboard listener (Ctrl + Shift + O)
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'O') {
                setIsVisible(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 z-[100]">
            <div className="bg-white/90 backdrop-blur-md border border-gray-200 p-2 rounded-full shadow-2xl flex items-center gap-2">
                <div className="px-3 text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Dev Mode
                </div>
                <Button
                    onClick={toggleTheme}
                    variant="primary"
                    className="!rounded-full !py-2 !px-4 text-xs flex items-center gap-2"
                >
                    <Palette size={14} />
                    {theme === 'classic' ? 'Switch to Organic' : 'Switch to Classic'}
                </Button>
                <button
                    onClick={() => setIsVisible(false)}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
};
