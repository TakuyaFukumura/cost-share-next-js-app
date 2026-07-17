'use client';

import {useMemo, useState} from 'react';
import type {BudgetCsvRow} from '@/lib/csv';

interface CalculatorProps {
    budgetItems: BudgetCsvRow[];
    totalBudget: number;
    husbandIncomeDefault: number;
    wifeIncomeDefault: number;
}

const formatCurrency = (amount: number) => `${amount.toLocaleString('ja-JP')}円`;

export default function Calculator({
                                       budgetItems,
                                       totalBudget,
                                       husbandIncomeDefault,
                                       wifeIncomeDefault,
                                   }: Readonly<CalculatorProps>) {
    const [husbandIncome, setHusbandIncome] = useState<number>(husbandIncomeDefault);
    const [wifeIncome, setWifeIncome] = useState<number>(wifeIncomeDefault);

    const summary = useMemo(() => {
        const totalIncome = husbandIncome + wifeIncome;
        if (totalIncome <= 0) {
            return {
                husbandRatio: 0,
                wifeRatio: 0,
                husbandContribution: 0,
                wifeContribution: 0,
            };
        }

        const husbandRatio = husbandIncome / totalIncome;
        const wifeRatio = wifeIncome / totalIncome;
        const husbandContribution = Math.round(totalBudget * husbandRatio);

        return {
            husbandRatio,
            wifeRatio,
            husbandContribution,
            wifeContribution: totalBudget - husbandContribution,
        };
    }, [husbandIncome, wifeIncome, totalBudget]);

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-8">
            <div className="space-y-6">
                <section className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">収入入力フォーム</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <label className="flex flex-col gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-300">夫の当月手取り収入</span>
                            <input
                                type="number"
                                min={0}
                                value={husbandIncome}
                                onChange={(event) => setHusbandIncome(Math.max(0, Number(event.target.value)))}
                                className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-900"
                            />
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-300">妻の当月手取り収入</span>
                            <input
                                type="number"
                                min={0}
                                value={wifeIncome}
                                onChange={(event) => setWifeIncome(Math.max(0, Number(event.target.value)))}
                                className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-900"
                            />
                        </label>
                    </div>
                </section>

                <section className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">共通予算サマリ</h2>
                    <ul className="space-y-2 mb-4">
                        {budgetItems.map((item) => (
                            <li key={`${item.category}-${item.item}`} className="flex justify-between">
                                <span>{item.item}</span>
                                <span>{formatCurrency(item.amount)}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="border-t pt-3 font-semibold flex justify-between">
                        <span>合計</span>
                        <span>{formatCurrency(totalBudget)}</span>
                    </div>
                </section>

                <section className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">計算結果</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                            <h3 className="font-medium mb-2">夫</h3>
                            <p>負担割合: {(summary.husbandRatio * 100).toFixed(1)}%</p>
                            <p>拠出額: {formatCurrency(summary.husbandContribution)}</p>
                        </div>
                        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                            <h3 className="font-medium mb-2">妻</h3>
                            <p>負担割合: {(summary.wifeRatio * 100).toFixed(1)}%</p>
                            <p>拠出額: {formatCurrency(summary.wifeContribution)}</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
