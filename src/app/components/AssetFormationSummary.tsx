import {
    getIncomeAfterAssetFormation,
    MONTHLY_ASSET_FORMATION_PER_PERSON,
} from '@/lib/income';

const formatCurrency = (amount: number) => `${amount.toLocaleString('ja-JP')}円`;

interface AssetFormationSummaryProps {
    husbandIncome: number;
    wifeIncome: number;
}

export default function AssetFormationSummary({
    husbandIncome,
    wifeIncome,
}: Readonly<AssetFormationSummaryProps>) {
    const incomes = [
        {name: '夫', amount: husbandIncome},
        {name: '妻', amount: wifeIncome},
    ];

    const totalAvailableIncome = incomes.reduce(
        (sum, {amount}) => sum + getIncomeAfterAssetFormation(amount),
        0,
    );

    return (
        <section className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold">資産形成分を先取り</h2>
            <div className="grid gap-4 md:grid-cols-2">
                {incomes.map(({name, amount}) => {
                    const availableIncome = getIncomeAfterAssetFormation(amount);

                    return (
                        <div key={name} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                            <h3 className="mb-2 font-medium">{name}</h3>
                            <p>手取り月収：{formatCurrency(amount)}</p>
                            <p>
                                資産形成分（上限{formatCurrency(MONTHLY_ASSET_FORMATION_PER_PERSON)}）：
                                {formatCurrency(amount - availableIncome)}
                            </p>
                            <p className="font-semibold">
                                負担計算対象収入：{formatCurrency(availableIncome)}
                            </p>
                        </div>
                    );
                })}
            </div>
            <div className="mt-4 flex justify-between border-t pt-4 font-semibold">
                <span>合計負担計算対象収入</span>
                <span>{formatCurrency(totalAvailableIncome)}</span>
            </div>
        </section>
    );
}
