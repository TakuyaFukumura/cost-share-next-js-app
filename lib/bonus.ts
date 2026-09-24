export interface BonusSavingsSummary {
    totalBonus: number;
    husbandRatio: number;
    wifeRatio: number;
    targetAmount: number;
    contributionTotal: number;
    husbandContribution: number;
    wifeContribution: number;
    husbandRemaining: number;
    wifeRemaining: number;
    householdRemaining: number;
    unmetAmount: number;
}

export function calculateBonusSavings(
    husbandBonus: number,
    wifeBonus: number,
    savingsGoal: number,
): BonusSavingsSummary {
    const totalBonus = husbandBonus + wifeBonus;
    const targetAmount = Math.max(0, savingsGoal);
    const husbandRatio = totalBonus > 0 ? husbandBonus / totalBonus : 0;
    const wifeRatio = totalBonus > 0 ? wifeBonus / totalBonus : 0;
    const contributionTotal = Math.min(targetAmount, totalBonus);
    const husbandContribution = totalBonus > 0
        ? Math.round(contributionTotal * husbandRatio)
        : 0;
    const wifeContribution = contributionTotal - husbandContribution;

    return {
        totalBonus,
        husbandRatio,
        wifeRatio,
        targetAmount,
        contributionTotal,
        husbandContribution,
        wifeContribution,
        husbandRemaining: husbandBonus - husbandContribution,
        wifeRemaining: wifeBonus - wifeContribution,
        householdRemaining: totalBonus - contributionTotal,
        unmetAmount: targetAmount - contributionTotal,
    };
}
