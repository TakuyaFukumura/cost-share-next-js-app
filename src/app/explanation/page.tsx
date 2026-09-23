import type {Metadata} from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: '解説 | 家計負担割合計算アプリ',
    description: '家計負担割合の計算方法や、家賃補助を受ける場合の考え方を説明します。',
};

const articles = [
    {
        href: '/explanation/calculation',
        title: '計算のしくみ',
        description: '収入・共通予算・食費負担割合から、支出と残額が決まる流れを図解します。',
    },
    {
        href: '/explanation/rent-subsidy',
        title: '家賃補助を受ける場合の考え方',
        description: '家賃補助を家計負担へどう反映するか、代表的な考え方を説明します。',
    },
];

export default function ExplanationIndexPage() {
    return (
        <main className="min-h-[calc(100vh-4rem)] bg-linear-to-br from-blue-50 to-indigo-100
            px-4 py-8 dark:from-gray-900 dark:to-gray-800 sm:px-6 lg:px-8">
            <section className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800 sm:p-10">
                <p className="mb-3 text-sm font-medium text-blue-700 dark:text-blue-300">家計負担の解説</p>
                <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100">解説</h1>
                <p className="mb-8 leading-7 text-gray-700 dark:text-gray-300">
                    家計負担割合の計算方法や、家計について考えるときのポイントを紹介します。
                    知りたい内容を選んでください。
                </p>

                <div className="grid gap-4">
                    {articles.map((article) => (
                        <Link
                            key={article.href}
                            href={article.href}
                            className="group rounded-xl border border-gray-200 p-5 transition-colors
                                hover:border-blue-400 hover:bg-blue-50 focus-visible:outline-2
                                focus-visible:outline-offset-2 focus-visible:outline-blue-600
                                dark:border-gray-700 dark:hover:border-blue-700 dark:hover:bg-gray-700/60
                                dark:focus-visible:outline-blue-300"
                        >
                            <h2 className="mb-2 text-xl font-semibold text-gray-900 group-hover:text-blue-800
                                dark:text-gray-100 dark:group-hover:text-blue-200">
                                {article.title}
                            </h2>
                            <p className="leading-7 text-gray-700 dark:text-gray-300">{article.description}</p>
                            <span className="mt-3 inline-block font-medium text-blue-700 underline
                                underline-offset-4 dark:text-blue-300">
                                解説を読む
                            </span>
                        </Link>
                    ))}
                </div>

                <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
                    <Link
                        href="/"
                        className="font-medium text-blue-700 underline underline-offset-4 hover:text-blue-900
                            dark:text-blue-300 dark:hover:text-blue-100"
                    >
                        家計負担割合の計算に戻る
                    </Link>
                </div>
            </section>
        </main>
    );
}
