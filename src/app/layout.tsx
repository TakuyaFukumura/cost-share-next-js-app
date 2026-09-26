import type {Metadata} from "next";
import "./globals.css";
import {DarkModeProvider} from "./components/DarkModeProvider";
import {HouseholdDataProvider} from "./components/HouseholdDataProvider";
import Header from "./components/Header";
import React from "react";
import {loadBudgetData} from "@/lib/csv";

export const metadata: Metadata = {
    title: "家計負担割合計算アプリ",
    description: "共働き夫妻向けの収入比例による家計負担割合計算アプリ",
};

export default async function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const budgetData = await loadBudgetData();

    return (
        <html lang="ja">
        <body className="antialiased">
        <HouseholdDataProvider
            husbandIncomeDefault={budgetData.husbandIncomeDefault}
            wifeIncomeDefault={budgetData.wifeIncomeDefault}
            budgetItemsDefault={budgetData.activeBudgetRows}
        >
            <DarkModeProvider>
                <Header/>
                {children}
            </DarkModeProvider>
        </HouseholdDataProvider>
        </body>
        </html>
    );
}
