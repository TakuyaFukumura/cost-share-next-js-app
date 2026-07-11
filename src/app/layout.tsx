import type {Metadata} from "next";
import "./globals.css";
import {DarkModeProvider} from "./components/DarkModeProvider";
import Header from "./components/Header";
import React from "react";

export const metadata: Metadata = {
    title: "家計負担割合計算アプリ",
    description: "共働き夫妻向けの収入比例による家計負担割合計算アプリ",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
        <body className="antialiased">
        <DarkModeProvider>
            <Header/>
            {children}
        </DarkModeProvider>
        </body>
        </html>
    );
}
