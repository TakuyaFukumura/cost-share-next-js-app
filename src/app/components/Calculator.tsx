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
const getAmountColorClass = (amount: number) =>
    amount < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100';

export default function Calculator({
                                       budgetItems,
                                       totalBudget,
                                       husbandIncomeDefault,
                                       wifeIncomeDefault,
                                   }: Readonly<CalculatorProps>) {
    const [husbandIncome, setHusbandIncome] = useState<number>(husbandIncomeDefault);
    const [wifeIncome, setWifeIncome] = useState<number>(wifeIncomeDefault);
    const [husbandFoodRatio, setHusbandFoodRatio] = useState(55);
    const wifeFoodRatio = 100 - husbandFoodRatio;
    const foodBudget = budgetItems.find((item) => item.item === '食費')?.amount ?? 0;
    const husbandFoodContribution = Math.round(foodBudget * (husbandFoodRatio / 100));
    const wifeFoodContribution = foodBudget - husbandFoodContribution;

    const summary = useMemo(() => {
        const totalIncome = husbandIncome + wifeIncome;
        if (totalIncome <= 0) {
            return {
                husbandRatio: 0,
                wifeRatio: 0,
                husbandContribution: 0,
                wifeContribution: 0,
                husbandRemaining: 0,
                wifeRemaining: 0,
                totalRemaining: 0,
            };
        }

        const husbandRatio = husbandIncome / totalIncome;
        const wifeRatio = wifeIncome / totalIncome;
        const otherBudget = totalBudget - foodBudget;
        const husbandContribution = Math.round(
            otherBudget * husbandRatio + foodBudget * (husbandFoodRatio / 100),
        );

        return {
            husbandRatio,
            wifeRatio,
            husbandContribution,
            wifeContribution: totalBudget - husbandContribution,
            husbandRemaining: husbandIncome - husbandContribution,
            wifeRemaining: wifeIncome - (totalBudget - husbandContribution),
            totalRemaining: totalIncome - totalBudget,
        };
    }, [foodBudget, husbandFoodRatio, husbandIncome, totalBudget, wifeIncome]);

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
                    <div className="border-t mt-4 pt-4 font-semibold flex justify-between">
                        <span>合計収入</span>
                        <span className="text-lg text-blue-600 dark:text-blue-400">{formatCurrency(husbandIncome + wifeIncome)}</span>
                    </div>
                </section>

                <section className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">共通予算サマリ</h2>
                    <ul className="space-y-2 mb-4">
                        {budgetItems.map((item) => (
                            <li key={`${item.category}-${item.item}`} className="flex justify-between">
                                <span>{item.item}</span>
                                <span className={getAmountColorClass(item.amount)}>{formatCurrency(item.amount)}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="border-t pt-3 font-semibold flex justify-between">
                        <span>合計</span>
                        <span className={getAmountColorClass(totalBudget)}>{formatCurrency(totalBudget)}</span>
                    </div>
                </section>

                <section className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">食費の負担割合</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        食事量の差を考慮して、食費だけ個別に負担割合を設定できます。
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                        <label className="flex flex-col gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-300">男性（夫）</span>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={husbandFoodRatio}
                                    onChange={(event) => setHusbandFoodRatio(
                                        Math.min(100, Math.max(0, Number(event.target.value) || 0)),
                                    )}
                                    className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-900"
                                    aria-label="食費の男性負担割合"
                                />
                                <span>%</span>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                負担額: {formatCurrency(husbandFoodContribution)}
                            </span>
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-300">女性（妻）</span>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={wifeFoodRatio}
                                    onChange={(event) => {
                                        const ratio = Math.min(100, Math.max(0, Number(event.target.value) || 0));
                                        setHusbandFoodRatio(100 - ratio);
                                    }}
                                    className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-900"
                                    aria-label="食費の女性負担割合"
                                />
                                <span>%</span>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                負担額: {formatCurrency(wifeFoodContribution)}
                            </span>
                        </label>
                    </div>
                </section>

                <section className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">計算結果</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                            <h3 className="font-medium mb-2">夫</h3>
                            <p>負担割合: {(summary.husbandRatio * 100).toFixed(1)}%</p>
                            <p>拠出額: <span className={getAmountColorClass(summary.husbandContribution)}>{formatCurrency(summary.husbandContribution)}</span></p>
                        </div>
                        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                            <h3 className="font-medium mb-2">妻</h3>
                            <p>負担割合: {(summary.wifeRatio * 100).toFixed(1)}%</p>
                            <p>拠出額: <span className={getAmountColorClass(summary.wifeContribution)}>{formatCurrency(summary.wifeContribution)}</span></p>
                        </div>
                    </div>
                </section>

                <section className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">差額サマリ</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                            <h3 className="font-medium mb-2">夫</h3>
                            <p>収入 - 拠出額: <span className={getAmountColorClass(summary.husbandRemaining)}>{formatCurrency(summary.husbandRemaining)}</span></p>
                        </div>
                        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                            <h3 className="font-medium mb-2">妻</h3>
                            <p>収入 - 拠出額: <span className={getAmountColorClass(summary.wifeRemaining)}>{formatCurrency(summary.wifeRemaining)}</span></p>
                        </div>
                    </div>
                    <div className="border-t mt-4 pt-4 font-semibold flex justify-between">
                        <span>合計差額</span>
                        <span className={getAmountColorClass(summary.totalRemaining)}>{formatCurrency(summary.totalRemaining)}</span>
                    </div>
                </section>
            </div>
        </div>
    );
}
