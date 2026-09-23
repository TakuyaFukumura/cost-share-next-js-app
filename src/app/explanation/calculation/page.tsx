import type {Metadata} from 'next';
import type {ReactNode} from 'react';
import ExplanationArticle from '../components/ExplanationArticle';

export const metadata: Metadata = {
    title: '計算のしくみ | 家計負担割合計算アプリ',
    description: '収入と共通予算から家計負担割合や支出を求める計算の流れを図解します。',
};

function FlowNode({title, children}: Readonly<{title: string; children: ReactNode}>) {
    return (
        <section className="rounded-xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900
            dark:bg-blue-950/40">
            <h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h2>
            <div className="leading-7 text-gray-700 dark:text-gray-300">{children}</div>
        </section>
    );
}

function FlowConnector() {
    return (
        <div aria-hidden="true" className="py-1 text-center text-2xl font-semibold text-blue-700 dark:text-blue-300">
            ↓
        </div>
    );
}

export default function CalculationExplanationPage() {
    return (
        <ExplanationArticle title="計算のしくみ">
            <section aria-labelledby="calculation-flow-title">
                <h2 id="calculation-flow-title" className="sr-only">家計負担割合の計算フロー</h2>
                <div className="space-y-2">
                    <FlowNode title="入力">
                        夫・妻の手取り月収、共通予算、食費の負担割合を入力します。
                    </FlowNode>

                    <FlowConnector/>

                    <FlowNode title="合計収入と収入による負担割合">
                        <p>合計収入 = 夫の収入 + 妻の収入</p>
                        <p>各自の負担割合 = 各自の収入 ÷ 合計収入</p>
                    </FlowNode>

                    <FlowConnector/>

                    <section className="rounded-xl border border-gray-200 p-5 dark:border-gray-700">
                        <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">
                            共通予算を2つの経路に分ける
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <article className="rounded-lg border border-indigo-200 bg-indigo-50 p-4
                                dark:border-indigo-900 dark:bg-indigo-950/40">
                                <p className="mb-2 text-sm font-semibold text-indigo-800 dark:text-indigo-200">
                                    食費の経路
                                </p>
                                <h3 className="mb-2 font-bold text-gray-900 dark:text-gray-100">
                                    食費負担割合を適用
                                </h3>
                                <p className="leading-7 text-gray-700 dark:text-gray-300">
                                    食費は、画面で設定した夫・妻それぞれの食費負担割合で分けます。
                                </p>
                                <div aria-hidden="true" className="pt-3 text-center text-xl text-blue-700
                                    dark:text-blue-300">
                                    ↓
                                </div>
                            </article>
                            <article className="rounded-lg border border-teal-200 bg-teal-50 p-4
                                dark:border-teal-900 dark:bg-teal-950/40">
                                <p className="mb-2 text-sm font-semibold text-teal-800 dark:text-teal-200">
                                    食費以外の経路
                                </p>
                                <h3 className="mb-2 font-bold text-gray-900 dark:text-gray-100">
                                    収入による負担割合を適用
                                </h3>
                                <p className="leading-7 text-gray-700 dark:text-gray-300">
                                    共通予算合計から食費を除いた金額を、収入による負担割合で分けます。
                                </p>
                                <div aria-hidden="true" className="pt-3 text-center text-xl text-blue-700
                                    dark:text-blue-300">
                                    ↓
                                </div>
                            </article>
                        </div>
                    </section>

                    <FlowConnector/>

                    <FlowNode title="2つの経路が合流し、夫の支出を計算">
                        <p>夫の支出 = round(食費以外の予算 × 夫の負担割合</p>
                        <p className="pl-12">+ 食費 × 夫の食費負担割合)</p>
                        <p className="mt-2">円単位で四捨五入します。</p>
                    </FlowNode>

                    <FlowConnector/>

                    <FlowNode title="妻の支出を求める">
                        妻の支出 = 共通予算合計 - 夫の支出
                        <p className="mt-2">2人の支出合計が共通予算合計と一致します。</p>
                    </FlowNode>

                    <FlowConnector/>

                    <FlowNode title="拠出後の残額">
                        <p>各自の残額 = 各自の収入 - 各自の支出</p>
                        <p>世帯全体の残額 = 合計収入 - 共通予算合計</p>
                    </FlowNode>
                </div>
            </section>

            <section className="mt-6 rounded-xl bg-amber-50 p-5 dark:bg-amber-950/40">
                <h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">補足</h2>
                <ul className="list-disc space-y-2 pl-5 leading-7 text-gray-700 dark:text-gray-300">
                    <li>
                        合計収入が0円の場合、0円で割らずに、負担割合・支出・残額をすべて0円として扱います。
                    </li>
                    <li>
                        片方だけに収入がある場合、その人の収入による負担割合は100%、もう片方は0%です。
                    </li>
                    <li>
                        共通予算が合計収入を上回る場合、拠出後の残額がマイナスになることがあります。
                    </li>
                </ul>
            </section>
        </ExplanationArticle>
    );
}
