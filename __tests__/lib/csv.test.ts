import {loadBudgetData, parseBudgetCsv} from '../../lib/csv';

describe('parseBudgetCsv', () => {
    it('コメント行と空行を無視してCSVをパースする', () => {
        const csv = `
# comment
category,item,amount,is_active

fixed_cost,家賃,90000,true
income_sample,夫基本手取り,230000,false
`;

        const rows = parseBudgetCsv(csv);

        expect(rows).toHaveLength(2);
        expect(rows[0]).toEqual({
            category: 'fixed_cost',
            item: '家賃',
            amount: 90000,
            isActive: true,
        });
    });

    it('共通予算と初期収入を設定値どおりに読み込む', async () => {
        const budgetData = await loadBudgetData();

        expect(budgetData.activeBudgetRows.find((row) => row.item === '家賃')?.amount).toBe(90000);
        expect(budgetData.totalBudget).toBe(199000);
        expect(budgetData.activeBudgetRows.some((row) => row.item === '資産形成')).toBe(false);
        expect(budgetData.husbandIncomeDefault).toBe(240000);
        expect(budgetData.wifeIncomeDefault).toBe(210000);
    });

    it('amount失敗時は0、is_activeはtrueのみtrueとして扱う', () => {
        const csv = `category,item,amount,is_active
fixed_cost,通信費,abc,TRUE
fixed_cost,雑費,1000,1`;

        const rows = parseBudgetCsv(csv);

        expect(rows[0].amount).toBe(0);
        expect(rows[0].isActive).toBe(true);
        expect(rows[1].isActive).toBe(false);
    });
});
