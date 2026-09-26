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
                        夫・妻の手取り月収と共通予算を入力します。
                    </FlowNode>

                    <FlowConnector/>

                    <FlowNode title="資産形成分を先取り">
                        <p>各自の負担計算対象収入 = max(0, 手取り月収 - 50,000円)</p>
                        <p>資産形成分は各自月50,000円を上限に先取りし、共通予算には含めません。</p>
                    </FlowNode>

                    <FlowConnector/>

                    <FlowNode title="合計負担計算対象収入と負担割合">
                        <p>合計負担計算対象収入 = 夫 + 妻の負担計算対象収入</p>
                        <p>各自の負担割合 = 各自の負担計算対象収入 ÷ 合計負担計算対象収入</p>
                    </FlowNode>

                    <FlowConnector/>

                    <FlowNode title="共通予算を収入割合で分ける">
                        共通予算全体に、それぞれの収入による負担割合を適用します。
                    </FlowNode>

                    <FlowConnector/>

                    <FlowNode title="夫の支出を計算">
                        <p>夫の支出 = round(共通予算合計 × 夫の負担割合)</p>
                        <p className="mt-2">円単位で四捨五入します。</p>
                    </FlowNode>

                    <FlowConnector/>

                    <FlowNode title="妻の支出を求める">
                        妻の支出 = 共通予算合計 - 夫の支出
                        <p className="mt-2">2人の支出合計が共通予算合計と一致します。</p>
                    </FlowNode>

                    <FlowConnector/>

                    <FlowNode title="拠出後の残額">
                        <p>各自の残額 = 各自の負担計算対象収入 - 各自の支出</p>
                        <p>世帯全体の残額 = 合計負担計算対象収入 - 共通予算合計</p>
                    </FlowNode>
                </div>
            </section>

            <section className="mt-6 rounded-xl bg-amber-50 p-5 dark:bg-amber-950/40">
                <h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">補足</h2>
                <ul className="list-disc space-y-2 pl-5 leading-7 text-gray-700 dark:text-gray-300">
                    <li>
                        合計負担計算対象収入が0円の場合、計算ページでは負担割合・支出・残額をすべて0円として扱います。
                    </li>
                    <li>
                        「お金の流れ」ページでは、合計負担計算対象収入が0円の場合、負担割合を夫婦で50%ずつにします。
                    </li>
                    <li>
                        共通予算が合計負担計算対象収入を上回る場合、拠出後の残額がマイナスになることがあります。
                    </li>
                </ul>
            </section>
        </ExplanationArticle>
    );
}
