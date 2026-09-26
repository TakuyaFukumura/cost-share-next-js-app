import type {Metadata} from 'next';
import CashFlowCalculator from '@/app/components/CashFlowCalculator';

export const metadata: Metadata = {
    title: 'お金の流れ | 家計負担割合計算アプリ',
    description: '口座ごとの実際の支払いと収入に応じた負担額を見える化し、拠出額を調整します。',
};

export default function CashFlowPage() {
    return (
        <main className="min-h-[calc(100vh-4rem)] bg-linear-to-br from-blue-50 to-indigo-100
            py-8 dark:from-gray-900 dark:to-gray-800">
            <h1 className="mb-2 text-center text-3xl font-bold">お金の流れ</h1>
            <p className="mx-auto mb-4 max-w-3xl px-4 text-center text-gray-700 dark:text-gray-300">
                実際の支払元と収入に応じた目標負担額を比べ、共通口座への入金と夫婦間の精算を確認できます。
            </p>
            <CashFlowCalculator/>
        </main>
    );
}
