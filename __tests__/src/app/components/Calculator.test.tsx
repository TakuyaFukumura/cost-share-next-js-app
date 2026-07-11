import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import Calculator from '@/app/components/Calculator';

describe('Calculator', () => {
    const props = {
        budgetItems: [
            {category: 'fixed_cost', item: '家賃', amount: 150000, isActive: true},
            {category: 'investment', item: '共通貯金', amount: 30000, isActive: true},
        ],
        totalBudget: 180000,
        husbandIncomeDefault: 400000,
        wifeIncomeDefault: 200000,
    };

    it('初期値から負担割合と拠出額を表示する', () => {
        render(<Calculator {...props} />);

        expect(screen.getByDisplayValue('400000')).toBeInTheDocument();
        expect(screen.getByDisplayValue('200000')).toBeInTheDocument();
        expect(screen.getByText('負担割合: 66.7%')).toBeInTheDocument();
        expect(screen.getByText('拠出額: 120,000円')).toBeInTheDocument();
        expect(screen.getByText('負担割合: 33.3%')).toBeInTheDocument();
        expect(screen.getByText('拠出額: 60,000円')).toBeInTheDocument();
    });

    it('入力変更時に計算結果をリアルタイム更新する', () => {
        render(<Calculator {...props} />);

        const husbandInput = screen.getByLabelText('夫の当月手取り収入');
        const wifeInput = screen.getByLabelText('妻の当月手取り収入');

        fireEvent.change(husbandInput, {target: {value: '300000'}});
        fireEvent.change(wifeInput, {target: {value: '300000'}});

        expect(screen.getAllByText('負担割合: 50.0%')).toHaveLength(2);
        expect(screen.getAllByText('拠出額: 90,000円')).toHaveLength(2);
    });
});
