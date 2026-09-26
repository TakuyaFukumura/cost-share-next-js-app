export const MONTHLY_ASSET_FORMATION_PER_PERSON = 50_000;

export const getIncomeAfterAssetFormation = (income: number) =>
    Math.max(0, income - MONTHLY_ASSET_FORMATION_PER_PERSON);
