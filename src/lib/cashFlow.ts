import type {BudgetCsvRow} from '@/lib/csv';

export type PaymentSource = 'husband' | 'wife' | 'shared';
export type DefaultPaymentSource = Exclude<PaymentSource, 'shared'>;

export interface CashFlowSummary {
    totalBudget: number;
    husbandRatio: number;
    wifeRatio: number;
    husbandTarget: number;
    wifeTarget: number;
    husbandDirectPayment: number;
    wifeDirectPayment: number;
    sharedAccountExpense: number;
    husbandSharedDeposit: number;
    wifeSharedDeposit: number;
    settlementAmount: number;
    settlementFrom: DefaultPaymentSource | null;
    settlementTo: DefaultPaymentSource | null;
    husbandFinalBurden: number;
    wifeFinalBurden: number;
    husbandRemaining: number;
    wifeRemaining: number;
}

export const getBudgetItemKey = (item: Pick<BudgetCsvRow, 'category' | 'item'>) =>
    JSON.stringify([item.category, item.item]);

export function calculateCashFlow(
    budgetItems: BudgetCsvRow[],
    paymentSources: Record<string, PaymentSource>,
    husbandIncome: number,
    wifeIncome: number,
): CashFlowSummary {
    const totalBudget = budgetItems.reduce((sum, item) => sum + item.amount, 0);
    const totalIncome = husbandIncome + wifeIncome;
    const husbandRatio = totalIncome === 0 ? 0.5 : husbandIncome / totalIncome;
    const wifeRatio = 1 - husbandRatio;
    const husbandTarget = Math.round(totalBudget * husbandRatio);
    const wifeTarget = totalBudget - husbandTarget;

    let husbandDirectPayment = 0;
    let wifeDirectPayment = 0;
    let sharedAccountExpense = 0;

    for (const item of budgetItems) {
        const source = paymentSources[getBudgetItemKey(item)];
        if (!source) {
            throw new Error(`Payment source is missing for budget item: ${item.item}`);
        }

        if (source === 'husband') {
            husbandDirectPayment += item.amount;
        } else if (source === 'wife') {
            wifeDirectPayment += item.amount;
        } else {
            sharedAccountExpense += item.amount;
        }
    }

    const husbandAfterDirectPayment = husbandTarget - husbandDirectPayment;
    const wifeAfterDirectPayment = wifeTarget - wifeDirectPayment;
    let husbandSharedDeposit = husbandAfterDirectPayment;
    let wifeSharedDeposit = wifeAfterDirectPayment;
    let settlementAmount = 0;
    let settlementFrom: DefaultPaymentSource | null = null;
    let settlementTo: DefaultPaymentSource | null = null;

    if (husbandAfterDirectPayment < 0) {
        settlementAmount = -husbandAfterDirectPayment;
        settlementFrom = 'wife';
        settlementTo = 'husband';
        husbandSharedDeposit = 0;
        wifeSharedDeposit = wifeAfterDirectPayment - settlementAmount;
    } else if (wifeAfterDirectPayment < 0) {
        settlementAmount = -wifeAfterDirectPayment;
        settlementFrom = 'husband';
        settlementTo = 'wife';
        wifeSharedDeposit = 0;
        husbandSharedDeposit = husbandAfterDirectPayment - settlementAmount;
    }

    if (husbandSharedDeposit < 0 || wifeSharedDeposit < 0) {
        throw new Error('Direct payments exceed the total target burden for both people.');
    }

    const husbandFinalBurden = husbandDirectPayment
        + husbandSharedDeposit
        + (settlementFrom === 'husband' ? settlementAmount : 0)
        - (settlementTo === 'husband' ? settlementAmount : 0);
    const wifeFinalBurden = wifeDirectPayment
        + wifeSharedDeposit
        + (settlementFrom === 'wife' ? settlementAmount : 0)
        - (settlementTo === 'wife' ? settlementAmount : 0);

    return {
        totalBudget,
        husbandRatio,
        wifeRatio,
        husbandTarget,
        wifeTarget,
        husbandDirectPayment,
        wifeDirectPayment,
        sharedAccountExpense,
        husbandSharedDeposit,
        wifeSharedDeposit,
        settlementAmount,
        settlementFrom,
        settlementTo,
        husbandFinalBurden,
        wifeFinalBurden,
        husbandRemaining: husbandIncome - husbandFinalBurden,
        wifeRemaining: wifeIncome - wifeFinalBurden,
    };
}
