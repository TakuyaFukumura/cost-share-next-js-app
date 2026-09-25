'use client';

import {useState} from 'react';
import {calculateBonusSavings} from '@/lib/bonus';

const formatCurrency = (amount: number) => `${amount.toLocaleString('ja-JP')}円`;
const YEN_PER_MAN_YEN = 10_000;
const getAmountColorClass = (amount: number) =>
    amount < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100';

const parseAmountInput = (value: string) => {
    const amount = Number(value);
    return value === '' || !Number.isFinite(amount) ? 0 : Math.max(0, Math.trunc(amount));
};

export default function BonusCalculator() {
    const [husbandBonus, setHusbandBonus] = useState(100000);
    const [wifeBonus, setWifeBonus] = useState(500000);
    const [savingsGoalManYen, setSavingsGoalManYen] = useState(10);
    const savingsGoal = savingsGoalManYen * YEN_PER_MAN_YEN;
    const summary = calculateBonusSavings(husbandBonus, wifeBonus, savingsGoal);

    return (
        <div className="mx-auto max-w-3xl p-4 md:p-8">
            <div className="space-y-6">
                <section className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
                    <h2 className="mb-4 text-xl font-semibold">ボーナス手取り額</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="flex flex-col gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-300">夫</span>
                            <span className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min={0}
                                    step={1}
                                    value={husbandBonus}
                                    onChange={(event) => setHusbandBonus(parseAmountInput(event.target.value))}
                                    aria-label="夫のボーナス手取り額"
                                    className="w-full rounded border border-gray-300 bg-white px-3 py-2
                                        dark:border-gray-600 dark:bg-gray-900"
                                />
                                <span>円</span>
                            </span>
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-300">妻</span>
                            <span className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min={0}
                                    step={1}
                                    value={wifeBonus}
                                    onChange={(event) => setWifeBonus(parseAmountInput(event.target.value))}
                                    aria-label="妻のボーナス手取り額"
                                    className="w-full rounded border border-gray-300 bg-white px-3 py-2
                                        dark:border-gray-600 dark:bg-gray-900"
                                />
                                <span>円</span>
                            </span>
                        </label>
                    </div>
                    <div className="mt-4 flex justify-between border-t pt-4 font-semibold">
                        <span>ボーナス合計</span>
                        <span className="text-lg text-blue-600 dark:text-blue-400">
                            {formatCurrency(summary.totalBonus)}
                        </span>
                    </div>
                </section>

                <section className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
                    <h2 className="mb-4 text-xl font-semibold">貯金目標</h2>
                    <label className="flex flex-col gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-300">世帯の貯金目標額</span>
                        <span className="flex items-center gap-2">
                            <input
                                type="number"
                                min={0}
                                step={1}
                                value={savingsGoalManYen}
                                onChange={(event) => setSavingsGoalManYen(parseAmountInput(event.target.value))}
                                aria-label="貯金目標額（万円）"
                                className="w-full rounded border border-gray-300 bg-white px-3 py-2
                                    dark:border-gray-600 dark:bg-gray-900"
                            />
                            <span>万円</span>
                        </span>
                    </label>
                    <div className="mt-4 flex justify-between border-t pt-4 font-semibold">
                        <span>今回の拠出額合計</span>
                        <span>{formatCurrency(summary.contributionTotal)}</span>
                    </div>
                    {summary.unmetAmount > 0 && (
                        <output
                            className="mt-3 block rounded-lg bg-amber-50 p-3 font-medium text-amber-900
                                dark:bg-amber-950 dark:text-amber-100"
                        >
                            貯金目標までの未達額：{formatCurrency(summary.unmetAmount)}
                            <span className="mt-1 block text-sm font-normal">
                                ボーナス合計を上限として拠出します。
                            </span>
                        </output>
                    )}
                </section>

                <section className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
                    <h2 className="mb-4 text-xl font-semibold">拠出額</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                            <h3 className="mb-2 font-medium">夫</h3>
                            <p>負担割合：{(summary.husbandRatio * 100).toFixed(1)}%</p>
                            <p>拠出額：{formatCurrency(summary.husbandContribution)}</p>
                        </div>
                        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                            <h3 className="mb-2 font-medium">妻</h3>
                            <p>負担割合：{(summary.wifeRatio * 100).toFixed(1)}%</p>
                            <p>拠出額：{formatCurrency(summary.wifeContribution)}</p>
                        </div>
                    </div>
                </section>

                <section className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
                    <h2 className="mb-4 text-xl font-semibold">拠出後の残額</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                            <h3 className="mb-2 font-medium">夫</h3>
                            <p>
                                残額：
                                <span className={getAmountColorClass(summary.husbandRemaining)}>
                                    {formatCurrency(summary.husbandRemaining)}
                                </span>
                            </p>
                        </div>
                        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                            <h3 className="mb-2 font-medium">妻</h3>
                            <p>
                                残額：
                                <span className={getAmountColorClass(summary.wifeRemaining)}>
                                    {formatCurrency(summary.wifeRemaining)}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-between border-t pt-4 font-semibold">
                        <span>世帯の残額</span>
                        <span className={getAmountColorClass(summary.householdRemaining)}>
                            {formatCurrency(summary.householdRemaining)}
                        </span>
                    </div>
                </section>
            </div>
        </div>
    );
}
