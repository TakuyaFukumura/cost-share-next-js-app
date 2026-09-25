'use client';

import {useMemo} from 'react';
import {calculateCashFlow, getBudgetItemKey, type PaymentSource} from '@/lib/cashFlow';
import {useHouseholdData} from './HouseholdDataProvider';

const formatCurrency = (amount: number) => `${amount.toLocaleString('ja-JP')}円`;
const getAmountColorClass = (amount: number) =>
    amount < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100';
const isPaymentSource = (value: string): value is PaymentSource =>
    value === 'husband' || value === 'wife' || value === 'shared';
const isDefaultPaymentSource = (value: string): value is 'husband' | 'wife' =>
    value === 'husband' || value === 'wife';

const parseNonNegativeAmount = (value: string) => {
    const amount = Number(value);
    return value === '' || !Number.isFinite(amount) ? 0 : Math.max(0, amount);
};

export default function CashFlowCalculator() {
    const {
        husbandIncome,
        setHusbandIncome,
        wifeIncome,
        setWifeIncome,
        budgetItems,
        setBudgetItems,
        paymentSources,
        setPaymentSources,
        defaultPaymentSource,
        setDefaultPaymentSource,
    } = useHouseholdData();

    const summary = useMemo(() => (
        paymentSources
            ? calculateCashFlow(budgetItems, paymentSources, husbandIncome, wifeIncome)
            : null
    ), [budgetItems, husbandIncome, paymentSources, wifeIncome]);

    const handleBudgetAmountChange = (index: number, value: string) => {
        const amount = parseNonNegativeAmount(value);
        setBudgetItems(budgetItems.map((item, itemIndex) =>
            itemIndex === index ? {...item, amount} : item,
        ));
    };

    const applyDefaultPaymentSource = () => {
        const nextSources = Object.fromEntries(
            budgetItems.map((item) => [getBudgetItemKey(item), defaultPaymentSource]),
        );
        const hasOverrides = paymentSources
            && budgetItems.some((item) => paymentSources[getBudgetItemKey(item)] !== defaultPaymentSource);

        if (hasOverrides && !window.confirm('項目ごとの支払元設定をすべて上書きします。続けますか？')) {
            return;
        }

        setPaymentSources(nextSources);
    };

    const handlePaymentSourceChange = (key: string, source: PaymentSource) => {
        if (!paymentSources) {
            return;
        }
        setPaymentSources({...paymentSources, [key]: source});
    };

    const husbandItems = paymentSources
        ? budgetItems.filter((item) => paymentSources[getBudgetItemKey(item)] === 'husband')
        : [];
    const wifeItems = paymentSources
        ? budgetItems.filter((item) => paymentSources[getBudgetItemKey(item)] === 'wife')
        : [];
    const sharedItems = paymentSources
        ? budgetItems.filter((item) => paymentSources[getBudgetItemKey(item)] === 'shared')
        : [];

    return (
        <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
            <section className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
                <h2 className="mb-4 text-xl font-semibold">手取り月収</h2>
                <div className="grid gap-4 md:grid-cols-2">
                    <label className="flex flex-col gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-300">夫</span>
                        <span className="flex items-center gap-2">
                            <input
                                type="number"
                                min={0}
                                step={1}
                                value={husbandIncome}
                                onChange={(event) => setHusbandIncome(parseNonNegativeAmount(event.target.value))}
                                aria-label="夫の手取り月収"
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
                                value={wifeIncome}
                                onChange={(event) => setWifeIncome(parseNonNegativeAmount(event.target.value))}
                                aria-label="妻の手取り月収"
                                className="w-full rounded border border-gray-300 bg-white px-3 py-2
                                    dark:border-gray-600 dark:bg-gray-900"
                            />
                            <span>円</span>
                        </span>
                    </label>
                </div>
                <div className="mt-4 flex justify-between border-t pt-4 font-semibold">
                    <span>世帯収入合計</span>
                    <span className="text-lg text-blue-600 dark:text-blue-400">
                        {formatCurrency(husbandIncome + wifeIncome)}
                    </span>
                </div>
            </section>

            <section className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
                <h2 className="mb-2 text-xl font-semibold">共通予算と支払元</h2>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                    初期担当を全項目に適用してから、実際の支払元に合わせて項目ごとに変更できます。
                </p>
                <div className="mb-5 flex flex-col gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-900 sm:flex-row sm:items-end">
                    <label className="flex flex-1 flex-col gap-2">
                        <span className="text-sm font-medium">初期担当者</span>
                        <select
                            aria-label="初期担当者"
                            value={defaultPaymentSource}
                            onChange={(event) => {
                                if (isDefaultPaymentSource(event.target.value)) {
                                    setDefaultPaymentSource(event.target.value);
                                }
                            }}
                            className="rounded border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
                        >
                            <option value="husband">夫</option>
                            <option value="wife">妻</option>
                        </select>
                    </label>
                    <button
                        type="button"
                        onClick={applyDefaultPaymentSource}
                        className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors
                            hover:bg-blue-700 focus-visible:outline focus-visible:outline-2
                            focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        全項目に適用
                    </button>
                </div>

                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {budgetItems.map((item, index) => {
                        const key = getBudgetItemKey(item);
                        const source = paymentSources?.[key];

                        return (
                            <li key={key} className="grid gap-3 py-3 sm:grid-cols-[1fr_9rem_12rem] sm:items-center">
                                <span className="font-medium">{item.item}</span>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min={0}
                                        step={1}
                                        value={item.amount}
                                        onChange={(event) => handleBudgetAmountChange(index, event.target.value)}
                                        aria-label={`${item.item}の予算`}
                                        className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-right
                                            dark:border-gray-600 dark:bg-gray-900"
                                    />
                                    <span>円</span>
                                </label>
                                {paymentSources ? (
                                    <label className="flex items-center gap-2">
                                        <span className="sr-only">{item.item}の支払元</span>
                                        <select
                                            aria-label={`${item.item}の支払元`}
                                            value={source ?? ''}
                                            onChange={(event) => {
                                                if (isPaymentSource(event.target.value)) {
                                                    handlePaymentSourceChange(key, event.target.value);
                                                }
                                            }}
                                            className="w-full rounded border border-gray-300 bg-white px-3 py-2
                                                dark:border-gray-600 dark:bg-gray-900"
                                        >
                                            <option value="husband">夫口座</option>
                                            <option value="wife">妻口座</option>
                                            <option value="shared">共通口座</option>
                                        </select>
                                    </label>
                                ) : (
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        支払元は一括適用後に設定できます
                                    </span>
                                )}
                            </li>
                        );
                    })}
                </ul>
                <div className="mt-3 flex justify-between border-t pt-3 font-semibold">
                    <span>共通予算合計</span>
                    <span>{formatCurrency(budgetItems.reduce((sum, item) => sum + item.amount, 0))}</span>
                </div>
            </section>

            {!paymentSources || !summary ? (
                <p className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-900 dark:border-blue-900
                    dark:bg-blue-950 dark:text-blue-100" role="status">
                    初期担当者を選び、「全項目に適用」を押すと、お金の流れと拠出額を表示します。
                </p>
            ) : (
                <>
                    <section className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
                        <h2 className="mb-4 text-xl font-semibold">お金の流れ</h2>
                        <div className="space-y-3" role="list" aria-label="家計のお金の流れ">
                            <FlowRow
                                source="夫口座"
                                destination={`夫が直接払う項目：${formatItems(husbandItems)}`}
                                amount={summary.husbandDirectPayment}
                            />
                            <FlowRow
                                source="妻口座"
                                destination={`妻が直接払う項目：${formatItems(wifeItems)}`}
                                amount={summary.wifeDirectPayment}
                            />
                            <FlowRow
                                source="夫口座"
                                destination="共通口座への入金"
                                amount={summary.husbandSharedDeposit}
                            />
                            <FlowRow
                                source="妻口座"
                                destination="共通口座への入金"
                                amount={summary.wifeSharedDeposit}
                            />
                            <FlowRow
                                source="共通口座"
                                destination={`共通口座から支払う項目：${formatItems(sharedItems)}`}
                                amount={summary.sharedAccountExpense}
                            />
                        </div>
                        <div className="mt-5 grid gap-4 border-t pt-4 md:grid-cols-2">
                            <div>
                                <h3 className="mb-2 font-medium">目標負担額</h3>
                                <p>夫（{(summary.husbandRatio * 100).toFixed(1)}%）：{formatCurrency(summary.husbandTarget)}</p>
                                <p>妻（{(summary.wifeRatio * 100).toFixed(1)}%）：{formatCurrency(summary.wifeTarget)}</p>
                            </div>
                            <div>
                                <h3 className="mb-2 font-medium">共通口座への入金</h3>
                                <p>合計：{formatCurrency(summary.husbandSharedDeposit + summary.wifeSharedDeposit)}</p>
                                <p>共通口座からの支出：{formatCurrency(summary.sharedAccountExpense)}</p>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
                        <h2 className="mb-4 text-xl font-semibold">支払い前の共通口座入金</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <PersonAmount name="夫" label="入金額" amount={summary.husbandSharedDeposit}/>
                            <PersonAmount name="妻" label="入金額" amount={summary.wifeSharedDeposit}/>
                        </div>
                        <div className="mt-4 flex justify-between border-t pt-4 font-semibold">
                            <span>入金合計</span>
                            <span>{formatCurrency(summary.husbandSharedDeposit + summary.wifeSharedDeposit)}</span>
                        </div>
                    </section>

                    <section className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
                        <h2 className="mb-4 text-xl font-semibold">直接払い後の夫婦間精算</h2>
                        {summary.settlementAmount > 0 && summary.settlementFrom && summary.settlementTo ? (
                            <p role="status" className="rounded-lg bg-amber-50 p-4 font-semibold text-amber-950
                                dark:bg-amber-950 dark:text-amber-100">
                                {summary.settlementFrom === 'husband' ? '夫' : '妻'}から
                                {summary.settlementTo === 'husband' ? '夫' : '妻'}へ
                                {formatCurrency(summary.settlementAmount)}を精算します。
                            </p>
                        ) : (
                            <p role="status" className="rounded-lg bg-green-50 p-4 text-green-900
                                dark:bg-green-950 dark:text-green-100">
                                追加の夫婦間精算はありません。
                            </p>
                        )}
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <PersonAmount name="夫" label="精算後の最終負担額" amount={summary.husbandFinalBurden}/>
                            <PersonAmount name="妻" label="精算後の最終負担額" amount={summary.wifeFinalBurden}/>
                        </div>
                    </section>

                    <section className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
                        <h2 className="mb-4 text-xl font-semibold">精算後の残額</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <PersonAmount name="夫" label="手取り収入 - 最終負担額" amount={summary.husbandRemaining}/>
                            <PersonAmount name="妻" label="手取り収入 - 最終負担額" amount={summary.wifeRemaining}/>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}

function formatItems(items: {item: string}[]) {
    return items.length > 0 ? items.map(({item}) => item).join('、') : 'なし';
}

function FlowRow({source, destination, amount}: {source: string; destination: string; amount: number}) {
    return (
        <div role="listitem" className="grid gap-2 rounded-lg border border-gray-200 p-3 dark:border-gray-700 sm:grid-cols-[9rem_2rem_1fr_auto]
            sm:items-center">
            <span className="font-medium">{source}</span>
            <span aria-hidden="true" className="text-center text-blue-600 dark:text-blue-400">→</span>
            <span>{destination}</span>
            <strong className={getAmountColorClass(amount)}>{formatCurrency(amount)}</strong>
        </div>
    );
}

function PersonAmount({name, label, amount}: {name: string; label: string; amount: number}) {
    return (
        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <h3 className="mb-2 font-medium">{name}</h3>
            <p>
                {label}：
                <span className={getAmountColorClass(amount)}>{formatCurrency(amount)}</span>
            </p>
        </div>
    );
}
