'use client';

import {createContext, ReactNode, useContext, useEffect, useMemo, useState} from 'react';

type Theme = 'light' | 'dark';

interface DarkModeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    isDark: boolean;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);
const isTheme = (value: string | null): value is Theme => value === 'light' || value === 'dark';

export function DarkModeProvider({children}: { readonly children: ReactNode }) {
    // SSR とクライアントの初期レンダリングを一致させるため、常に 'light' で初期化する。
    // マウント後に useEffect で localStorage から実際のテーマを読み込む。
    const [theme, setTheme] = useState<Theme>('light');
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const loadSavedTheme = () => {
            try {
                const savedTheme = localStorage.getItem('theme');
                if (isTheme(savedTheme)) {
                    setTheme(savedTheme);
                }
            } catch {
                // localStorage が使用できない環境では何もしない
            }
        };
        loadSavedTheme();
    }, []);

    useEffect(() => {
        const updateTheme = () => {
            const isDarkMode = theme === 'dark';
            setIsDark(isDarkMode);

            // HTMLタグにdarkクラスを追加/削除
            if (isDarkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };

        updateTheme();
    }, [theme]);

    const handleSetTheme = (newTheme: Theme) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const value = useMemo(() => ({theme, setTheme: handleSetTheme, isDark}), [theme, isDark]);

    return (
        <DarkModeContext.Provider value={value}>
            {children}
        </DarkModeContext.Provider>
    );
}

export function useDarkMode() {
    const context = useContext(DarkModeContext);
    if (context === undefined) {
        throw new Error('useDarkMode must be used within a DarkModeProvider');
    }
    return context;
}
