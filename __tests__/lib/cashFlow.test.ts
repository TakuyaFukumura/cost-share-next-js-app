import {calculateCashFlow, getBudgetItemKey, PaymentSource} from '@/lib/cashFlow';

const budgetItems = [
    {category: 'fixed_cost', item: '家賃', amount: 90000, isActive: true},
    {category: 'fixed_cost', item: '日用品', amount: 20000, isActive: true},
    {category: 'fixed_cost', item: '食費', amount: 189000, isActive: true},
];

const createSources = (sources: PaymentSource[]) => {
    const result: Record<string, PaymentSource> = {};
    budgetItems.forEach((item, index) => {
        result[getBudgetItemKey(item)] = sources[index];
    });
    return result;
};

describe('calculateCashFlow', () => {
    it('直接払いと共通口座支出に応じた入金額を計算する', () => {
        const summary = calculateCashFlow(
            budgetItems,
            createSources(['husband', 'wife', 'shared']),
            240000,
            210000,
        );

        expect(summary.husbandTarget).toBe(162314);
        expect(summary.wifeTarget).toBe(136686);
        expect(summary.husbandDirectPayment).toBe(90000);
        expect(summary.wifeDirectPayment).toBe(20000);
        expect(summary.sharedAccountExpense).toBe(189000);
        expect(summary.husbandSharedDeposit).toBe(72314);
        expect(summary.wifeSharedDeposit).toBe(116686);
        expect(summary.husbandSharedDeposit + summary.wifeSharedDeposit).toBe(summary.sharedAccountExpense);
        expect(summary.husbandFinalBurden).toBe(summary.husbandTarget);
        expect(summary.wifeFinalBurden).toBe(summary.wifeTarget);
    });

    it('目標負担額を超えて直接払いした人への精算を計算する', () => {
        const items = [
            {category: 'fixed_cost', item: '家賃', amount: 200000, isActive: true},
            {category: 'fixed_cost', item: '共通費', amount: 99000, isActive: true},
        ];
        const sources = {
            [getBudgetItemKey(items[0])]: 'husband',
            [getBudgetItemKey(items[1])]: 'shared',
        } satisfies Record<string, PaymentSource>;

        const summary = calculateCashFlow(items, sources, 240000, 210000);

        expect(summary.settlementAmount).toBe(37686);
        expect(summary.settlementFrom).toBe('wife');
        expect(summary.settlementTo).toBe('husband');
        expect(summary.husbandSharedDeposit).toBe(0);
        expect(summary.wifeSharedDeposit).toBe(99000);
        expect(summary.husbandFinalBurden).toBe(summary.husbandTarget);
        expect(summary.wifeFinalBurden).toBe(summary.wifeTarget);
    });

    it('合計負担計算対象収入が0円の場合は新画面の負担目標を折半する', () => {
        const items = [{category: 'other', item: '予算', amount: 299001, isActive: true}];
        const sources = {[getBudgetItemKey(items[0])]: 'shared'} satisfies Record<string, PaymentSource>;

        const summary = calculateCashFlow(items, sources, 0, 0);

        expect(summary.husbandRatio).toBe(0.5);
        expect(summary.wifeRatio).toBe(0.5);
        expect(summary.husbandTarget).toBe(149501);
        expect(summary.wifeTarget).toBe(149500);
        expect(summary.husbandSharedDeposit + summary.wifeSharedDeposit).toBe(299001);
    });

    it('資産形成分を引いた収入で負担割合と残額を計算する', () => {
        const items = [{category: 'other', item: '予算', amount: 30000, isActive: true}];
        const sources = {[getBudgetItemKey(items[0])]: 'shared'} satisfies Record<string, PaymentSource>;

        const summary = calculateCashFlow(items, sources, 90000, 40000);

        expect(summary.husbandRatio).toBe(1);
        expect(summary.wifeRatio).toBe(0);
        expect(summary.husbandRemaining).toBe(10000);
        expect(summary.wifeRemaining).toBe(0);
    });

    it('支払元が割り当てられていない予算項目では明示的に失敗する', () => {
        expect(() => calculateCashFlow(budgetItems, {}, 240000, 210000))
            .toThrow('Payment source is missing for budget item: 家賃');
    });
});
