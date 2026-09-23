import Link from 'next/link';
import type {ReactNode} from 'react';

interface ExplanationArticleProps {
    title: string;
    children: ReactNode;
}

export default function ExplanationArticle({title, children}: Readonly<ExplanationArticleProps>) {
    return (
        <main className="min-h-[calc(100vh-4rem)] bg-linear-to-br from-blue-50 to-indigo-100
            px-4 py-8 dark:from-gray-900 dark:to-gray-800 sm:px-6 lg:px-8">
            <article className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800 sm:p-10">
                <p className="mb-3 text-sm font-medium text-blue-700 dark:text-blue-300">家計負担の解説</p>
                <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
                {children}
                <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
                    <Link
                        href="/explanation"
                        className="font-medium text-blue-700 underline underline-offset-4 hover:text-blue-900
                            dark:text-blue-300 dark:hover:text-blue-100"
                    >
                        解説一覧に戻る
                    </Link>
                </div>
            </article>
        </main>
    );
}
