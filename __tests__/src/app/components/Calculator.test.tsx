import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import Calculator from '@/app/components/Calculator';
import {HouseholdDataProvider} from '@/app/components/HouseholdDataProvider';

const hasTextContent = (text: string) => (_: string, element: Element | null) => element?.textContent === text;

describe('Calculator', () => {
    const props = {
        budgetItems: [
            {category: 'fixed_cost', item: '家賃', amount: 150000, isActive: true},
            {category: 'investment', item: '共通貯金', amount: 30000, isActive: true},
        ],
        husbandIncomeDefault: 230000,
        wifeIncomeDefault: 200000,
    };

    const renderCalculator = (overrides: Partial<typeof props> = {}) => {
        const calculatorProps = {...props, ...overrides};
        return render(
            <HouseholdDataProvider
                husbandIncomeDefault={calculatorProps.husbandIncomeDefault}
                wifeIncomeDefault={calculatorProps.wifeIncomeDefault}
                budgetItemsDefault={calculatorProps.budgetItems}
            >
                <Calculator/>
            </HouseholdDataProvider>,
        );
    };

    it('初期値から負担割合と支出を表示する', () => {
        renderCalculator();

        expect(screen.getByDisplayValue('230000')).toBeInTheDocument();
        expect(screen.getByLabelText('家賃の予算')).toHaveValue(150000);
        expect(screen.getByText('負担割合：54.5%')).toBeInTheDocument();
        expect(screen.getByText(hasTextContent('支出：98,182円'))).toBeInTheDocument();
        expect(screen.getByText('負担割合：45.5%')).toBeInTheDocument();
        expect(screen.getByText(hasTextContent('支出：81,818円'))).toBeInTheDocument();
        expect(screen.getByText(hasTextContent('資産形成分控除後の収入 - 支出：81,818円'))).toBeInTheDocument();
        expect(screen.getByText(hasTextContent('資産形成分控除後の収入 - 支出：68,182円'))).toBeInTheDocument();
        expect(screen.getByText(hasTextContent('330,000円'))).toBeInTheDocument();
        expect(screen.getAllByRole('heading', {level: 2}).map((heading) => heading.textContent)).toEqual([
            '手取り月収',
            '資産形成分を先取り',
            '共通予算',
            '計算結果',
            '収支',
        ]);
        expect(screen.getAllByText('合計')).toHaveLength(2);
        expect(screen.getByText(hasTextContent('150,000円'))).toBeInTheDocument();
    });

    it('入力変更時に計算結果をリアルタイム更新する', () => {
        renderCalculator();

        const husbandInput = screen.getByLabelText('夫');
        const wifeInput = screen.getByLabelText('妻');

        fireEvent.change(husbandInput, {target: {value: '230000'}});
        fireEvent.change(wifeInput, {target: {value: '230000'}});

        expect(screen.getAllByText('負担割合：50.0%')).toHaveLength(2);
        expect(screen.getAllByText(hasTextContent('支出：90,000円'))).toHaveLength(2);
    });

    it('共通予算の金額変更を合計と計算結果へ反映する', () => {
        renderCalculator();

        fireEvent.change(screen.getByLabelText('家賃の予算'), {target: {value: '200000'}});

        expect(screen.getByLabelText('家賃の予算')).toHaveValue(200000);
        expect(screen.getByText(hasTextContent('230,000円'))).toBeInTheDocument();
        expect(screen.getByText(hasTextContent('125,455円'))).toBeInTheDocument();
        expect(screen.getByText(hasTextContent('104,545円'))).toBeInTheDocument();
    });

    it('食費を含む共通予算全体を収入割合で計算する', () => {
        renderCalculator({
                budgetItems: [
                    {category: 'fixed_cost', item: '食費', amount: 50000, isActive: true},
                    {category: 'fixed_cost', item: '家賃', amount: 150000, isActive: true},
                ],
            });

        expect(screen.queryByText('食費負担割合')).not.toBeInTheDocument();
        expect(screen.queryByRole('checkbox', {name: '食費負担割合を個別に設定'})).not.toBeInTheDocument();
        expect(screen.getByText(hasTextContent('支出：109,091円'))).toBeInTheDocument();
        expect(screen.getByText(hasTextContent('支出：90,909円'))).toBeInTheDocument();
    });

    it('端数丸めが発生しても支出合計が予算合計と一致する', () => {
        renderCalculator({
            budgetItems: [{category: 'other', item: 'テスト', amount: 1, isActive: true}],
            husbandIncomeDefault: 50001,
            wifeIncomeDefault: 50001,
        });

        expect(screen.getByText(hasTextContent('支出：1円'))).toBeInTheDocument();
        expect(screen.getByText(hasTextContent('支出：0円'))).toBeInTheDocument();
    });

    it('手取りが資産形成額以下の場合は負担計算対象収入を0円にする', () => {
        renderCalculator({
            budgetItems: [{category: 'other', item: '共通費', amount: 30000, isActive: true}],
            husbandIncomeDefault: 40000,
            wifeIncomeDefault: 90000,
        });

        expect(screen.getByText('負担割合：0.0%')).toBeInTheDocument();
        expect(screen.getByText('負担割合：100.0%')).toBeInTheDocument();
        expect(screen.getByText(hasTextContent('支出：0円'))).toBeInTheDocument();
        expect(screen.getByText(hasTextContent('支出：30,000円'))).toBeInTheDocument();
        expect(screen.getByText(hasTextContent('資産形成分控除後の収入 - 支出：10,000円'))).toBeInTheDocument();
    });
});
