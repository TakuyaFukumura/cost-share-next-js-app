import type {Metadata} from 'next';
import BonusCalculator from '@/app/components/BonusCalculator';

export const metadata: Metadata = {
    title: 'ボーナス貯金計算 | 家計負担割合計算アプリ',
    description: '夫婦のボーナス手取り額に応じて、貯金目標額の拠出割合を計算します。',
};

export default function BonusPage() {
    return (
        <main className="min-h-[calc(100vh-4rem)] bg-linear-to-br from-blue-50 to-indigo-100
            py-8 dark:from-gray-900 dark:to-gray-800">
            <h1 className="mb-2 text-center text-3xl font-bold">ボーナス貯金計算</h1>
            <p className="mx-auto mb-4 max-w-3xl px-4 text-center text-gray-700 dark:text-gray-300">
                ボーナス手取り額の割合に応じて、貯金目標額を夫婦で分担します。
            </p>
            <BonusCalculator/>
        </main>
    );
}
