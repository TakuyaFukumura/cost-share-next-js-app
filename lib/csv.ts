import fs from 'fs/promises';
import path from 'path';

export interface BudgetCsvRow {
    category: string;
    item: string;
    amount: number;
    isActive: boolean;
}

export interface BudgetData {
    rows: BudgetCsvRow[];
    activeBudgetRows: BudgetCsvRow[];
    totalBudget: number;
    husbandIncomeDefault: number;
    wifeIncomeDefault: number;
}

const BUDGET_CSV_PATH = path.join(process.cwd(), 'public', 'data', 'budget_data.csv');

const toAmount = (value: string | undefined): number => {
    const amount = Number.parseInt(value ?? '', 10);
    return Number.isNaN(amount) ? 0 : amount;
};

const toIsActive = (value: string | undefined): boolean => (value ?? '').trim().toLowerCase() === 'true';

export const parseBudgetCsv = (content: string): BudgetCsvRow[] => {
    const lines = content
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0 && !line.startsWith('#'));

    if (lines.length === 0) {
        return [];
    }

    const [headerLine, ...dataLines] = lines;
    const headers = headerLine.split(',').map((value) => value.trim());
    const indexMap = {
        category: headers.indexOf('category'),
        item: headers.indexOf('item'),
        amount: headers.indexOf('amount'),
        isActive: headers.indexOf('is_active'),
    };

    if (Object.values(indexMap).some((index) => index < 0)) {
        return [];
    }

    return dataLines.map((line) => {
        const columns = line.split(',').map((value) => value.trim());
        return {
            category: columns[indexMap.category] ?? '',
            item: columns[indexMap.item] ?? '',
            amount: toAmount(columns[indexMap.amount]),
            isActive: toIsActive(columns[indexMap.isActive]),
        };
    });
};

export const loadBudgetData = async (): Promise<BudgetData> => {
    const csv = await fs.readFile(BUDGET_CSV_PATH, 'utf-8');
    const rows = parseBudgetCsv(csv);
    const activeBudgetRows = rows.filter((row) => row.isActive);
    const totalBudget = activeBudgetRows.reduce((sum, row) => sum + row.amount, 0);

    const husbandIncomeDefault = rows.find((row) => row.category === 'income_sample' && row.item.includes('夫'))?.amount ?? 0;
    const wifeIncomeDefault = rows.find((row) => row.category === 'income_sample' && row.item.includes('妻'))?.amount ?? 0;

    return {
        rows,
        activeBudgetRows,
        totalBudget,
        husbandIncomeDefault,
        wifeIncomeDefault,
    };
};
