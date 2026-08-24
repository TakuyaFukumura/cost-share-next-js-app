import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import Calculator from '@/app/components/Calculator';

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

    it('初期値から負担割合と支出を表示する', () => {
        render(<Calculator {...props} />);

        expect(screen.getByDisplayValue('230000')).toBeInTheDocument();
        expect(screen.getByLabelText('家賃の予算')).toHaveValue(150000);
        expect(screen.getByText('負担割合: 53.5%')).toBeInTheDocument();
        expect(screen.getByText(hasTextContent('支出: 96,279円'))).toBeInTheDocument();
        expect(screen.getByText('負担割合: 46.5%')).toBeInTheDocument();
        expect(screen.getByText(hasTextContent('支出: 83,721円'))).toBeInTheDocument();
        expect(screen.getByText(hasTextContent('収入 - 支出: 133,721円'))).toBeInTheDocument();
        expect(screen.getByText(hasTextContent('収入 - 支出: 116,279円'))).toBeInTheDocument();
        expect(screen.getByText('合計差額')).toBeInTheDocument();
        expect(screen.getByText(hasTextContent('250,000円'))).toBeInTheDocument();
    });

    it('入力変更時に計算結果をリアルタイム更新する', () => {
        render(<Calculator {...props} />);

        const husbandInput = screen.getByLabelText('夫');
        const wifeInput = screen.getByLabelText('妻');

        fireEvent.change(husbandInput, {target: {value: '230000'}});
        fireEvent.change(wifeInput, {target: {value: '230000'}});

        expect(screen.getAllByText('負担割合: 50.0%')).toHaveLength(2);
        expect(screen.getAllByText(hasTextContent('支出: 90,000円'))).toHaveLength(2);
    });

    it('共通予算の金額変更を合計と計算結果へ反映する', () => {
        render(<Calculator {...props} />);

        fireEvent.change(screen.getByLabelText('家賃の予算'), {target: {value: '200000'}});

        expect(screen.getByLabelText('家賃の予算')).toHaveValue(200000);
        expect(screen.getByText(hasTextContent('230,000円'))).toBeInTheDocument();
        expect(screen.getByText(hasTextContent('123,023円'))).toBeInTheDocument();
        expect(screen.getAllByText(hasTextContent('106,977円'))).toHaveLength(2);
    });

    it('食費に男女別の負担割合を適用する', () => {
        render(
            <Calculator
                {...props}
                budgetItems={[
                    {category: 'fixed_cost', item: '食費', amount: 50000, isActive: true},
                    {category: 'fixed_cost', item: '家賃', amount: 150000, isActive: true},
                ]}
            />,
        );

        expect(screen.getByDisplayValue('55')).toBeInTheDocument();
        expect(screen.getByDisplayValue('45')).toBeInTheDocument();
        expect(screen.getByText('負担額: 27,500円')).toBeInTheDocument();
        expect(screen.getByText('負担額: 22,500円')).toBeInTheDocument();
        expect(screen.getByText(hasTextContent('支出: 107,733円'))).toBeInTheDocument();
        expect(screen.getByText(hasTextContent('支出: 92,267円'))).toBeInTheDocument();

        fireEvent.change(screen.getByLabelText('食費の夫負担割合'), {target: {value: '60'}});

        expect(screen.getByDisplayValue('60')).toBeInTheDocument();
        expect(screen.getByDisplayValue('40')).toBeInTheDocument();
        expect(screen.getByText('負担額: 30,000円')).toBeInTheDocument();
        expect(screen.getByText('負担額: 20,000円')).toBeInTheDocument();
        expect(screen.getByText(hasTextContent('支出: 110,233円'))).toBeInTheDocument();
        expect(screen.getByText(hasTextContent('支出: 89,767円'))).toBeInTheDocument();
    });

    it('端数丸めが発生しても支出合計が予算合計と一致する', () => {
        render(
            <Calculator
                budgetItems={[{category: 'other', item: 'テスト', amount: 1, isActive: true}]}
                husbandIncomeDefault={1}
                wifeIncomeDefault={1}
            />,
        );

        expect(screen.getByText(hasTextContent('支出: 1円'))).toBeInTheDocument();
        expect(screen.getByText(hasTextContent('支出: 0円'))).toBeInTheDocument();
    });
});
