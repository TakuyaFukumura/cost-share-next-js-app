import Link from 'next/link';

export const metadata = {
    title: '家賃補助と負担割合の考え方',
    description: '家賃補助を受ける場合の、夫婦間の家計負担の考え方を解説します。',
};

export default function ExplanationPage() {
    return (
        <main className="min-h-[calc(100vh-4rem)] bg-linear-to-br from-blue-50 to-indigo-100
            px-4 py-8 dark:from-gray-900 dark:to-gray-800 sm:px-6 lg:px-8">
            <article className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800 sm:p-10">
                <p className="mb-3 text-sm font-medium text-blue-700 dark:text-blue-300">家計負担の解説</p>
                <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-gray-100">
                    家賃補助を受ける場合の考え方
                </h1>

                <section className="mb-8">
                    <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-gray-100">
                        なぜ、補助後の家賃を単純に折半すると不公平になり得るのか
                    </h2>
                    <p className="leading-7 text-gray-700 dark:text-gray-300">
                        家賃補助は通常、勤務先から受給者本人に支給されます。補助を受けた人は家賃の負担が軽くなる一方、
                        補助が給与として扱われる場合には、その人の所得税・住民税・社会保険料が増えることがあります。
                        そのため、補助を家賃から先に差し引き、残った金額だけを夫婦で折半すると、
                        補助の恩恵と補助に伴う負担が受給者側に偏る可能性があります。
                    </p>
                </section>

                <section className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/40">
                    <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-gray-100">具体例</h2>
                    <p className="mb-4 leading-7 text-gray-700 dark:text-gray-300">
                        家賃が10万円で、妻だけが3万円の家賃補助を受ける場合を考えます。
                    </p>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[28rem] text-left text-sm text-gray-700 dark:text-gray-300">
                            <thead>
                                <tr className="border-b border-blue-200 dark:border-blue-800">
                                    <th className="px-3 py-2 font-semibold">項目</th>
                                    <th className="px-3 py-2 text-right font-semibold">金額</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-blue-100 dark:border-blue-900">
                                    <td className="px-3 py-2">家賃</td>
                                    <td className="px-3 py-2 text-right">100,000円</td>
                                </tr>
                                <tr className="border-b border-blue-100 dark:border-blue-900">
                                    <td className="px-3 py-2">妻の家賃補助</td>
                                    <td className="px-3 py-2 text-right">30,000円</td>
                                </tr>
                                <tr>
                                    <td className="px-3 py-2">補助後の残額</td>
                                    <td className="px-3 py-2 text-right">70,000円</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-4 leading-7 text-gray-700 dark:text-gray-300">
                        残額を折半すると、2人とも35,000円を支払います。しかし、妻だけが補助を受け、
                        補助に伴う税金や社会保険料も妻だけが負担するなら、2人の実質的な負担は同じとは限りません。
                        たとえば3万円の補助で税金・社会保険料が6,000円増えると、妻の手取り増加は実質24,000円にとどまり、
                        その6,000円分の負担は妻だけが負うことになります。
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-gray-100">
                        公平性を考える代表的な方法
                    </h2>
                    <ol className="list-decimal space-y-3 pl-6 leading-7 text-gray-700 dark:text-gray-300">
                        <li>
                            <strong>補助込みの手取り収入で割合を計算する：</strong>
                            補助を受けた後の税金・社会保険料も考慮した、実際に使える収入を基準にします。
                        </li>
                        <li>
                            <strong>補助の手取り相当額を共通家計に入れる：</strong>
                            補助による家賃の軽減を、夫婦2人の利益として扱います。
                        </li>
                        <li>
                            <strong>本人の福利厚生として扱う：</strong>
                            補助を受給者個人のメリットと考え、補助後の家賃を折半する方法です。
                            この場合は、補助を個人の権利とすることを夫婦で合意しておくことが大切です。
                        </li>
                    </ol>
                </section>

                <section className="mb-8 rounded-xl bg-amber-50 p-5 dark:bg-amber-950/40">
                    <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-gray-100">注意点</h2>
                    <p className="leading-7 text-gray-700 dark:text-gray-300">
                        家賃補助が課税対象になるか、社会保険料の算定に含まれるかは、支給方法や勤務先の制度によって異なります。
                        標準報酬月額には等級や上限もあるため、補助額から税金・保険料を一律の割合で差し引けば正確になるとは限りません。
                        正確な金額は給与明細や勤務先の制度を確認してください。
                    </p>
                </section>

                <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
                    <Link
                        href="/"
                        className="font-medium text-blue-700 underline underline-offset-4 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100"
                    >
                        家計負担割合の計算に戻る
                    </Link>
                </div>
            </article>
        </main>
    );
}
