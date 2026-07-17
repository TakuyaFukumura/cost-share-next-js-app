import Calculator from './components/Calculator';
import {loadBudgetData} from '@/lib/csv';

export default async function Home() {
    const budgetData = await loadBudgetData();

    return (
        <main className="min-h-[calc(100vh-4rem)] bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
            <h1 className="text-center text-3xl font-bold mb-6">家計負担割合計算アプリ</h1>
            <Calculator
                budgetItems={budgetData.activeBudgetRows}
                totalBudget={budgetData.totalBudget}
                husbandIncomeDefault={budgetData.husbandIncomeDefault}
                wifeIncomeDefault={budgetData.wifeIncomeDefault}
            />
        </main>
    );
}
