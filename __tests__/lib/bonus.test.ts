import {calculateBonusSavings} from '@/lib/bonus';

describe('calculateBonusSavings', () => {
    it('ボーナス比率で貯金目標を按分し、円単位で合計を一致させる', () => {
        expect(calculateBonusSavings(500000, 400000, 300000)).toEqual({
            totalBonus: 900000,
            husbandRatio: 500000 / 900000,
            wifeRatio: 400000 / 900000,
            targetAmount: 300000,
            contributionTotal: 300000,
            husbandContribution: 166667,
            wifeContribution: 133333,
            husbandRemaining: 333333,
            wifeRemaining: 266667,
            householdRemaining: 600000,
            unmetAmount: 0,
        });
    });

    it('目標額がボーナス合計を超えた場合は全額を拠出上限とし、未達額を返す', () => {
        const summary = calculateBonusSavings(500000, 400000, 1000000);

        expect(summary.contributionTotal).toBe(900000);
        expect(summary.husbandContribution).toBe(500000);
        expect(summary.wifeContribution).toBe(400000);
        expect(summary.husbandRemaining).toBe(0);
        expect(summary.wifeRemaining).toBe(0);
        expect(summary.householdRemaining).toBe(0);
        expect(summary.unmetAmount).toBe(100000);
    });

    it('ボーナス合計が0円の場合は拠出0円、目標全額を未達にする', () => {
        const summary = calculateBonusSavings(0, 0, 300000);

        expect(summary.husbandRatio).toBe(0);
        expect(summary.wifeRatio).toBe(0);
        expect(summary.contributionTotal).toBe(0);
        expect(summary.husbandContribution).toBe(0);
        expect(summary.wifeContribution).toBe(0);
        expect(summary.unmetAmount).toBe(300000);
    });

    it('片方のボーナスだけがある場合は、その人の負担割合を100%にする', () => {
        const summary = calculateBonusSavings(0, 400000, 100000);

        expect(summary.husbandRatio).toBe(0);
        expect(summary.wifeRatio).toBe(1);
        expect(summary.husbandContribution).toBe(0);
        expect(summary.wifeContribution).toBe(100000);
    });

    it('貯金目標が0円の場合は拠出額を0円にする', () => {
        const summary = calculateBonusSavings(500000, 400000, 0);

        expect(summary.contributionTotal).toBe(0);
        expect(summary.husbandContribution).toBe(0);
        expect(summary.wifeContribution).toBe(0);
        expect(summary.unmetAmount).toBe(0);
    });
});
