import React, {useState} from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import CashFlowCalculator from '@/app/components/CashFlowCalculator';
import Calculator from '@/app/components/Calculator';
import {HouseholdDataProvider} from '@/app/components/HouseholdDataProvider';

const budgetItems = [
    {category: 'fixed_cost', item: '家賃', amount: 90000, isActive: true},
    {category: 'fixed_cost', item: '日用品', amount: 20000, isActive: true},
    {category: 'fixed_cost', item: '食費', amount: 189000, isActive: true},
];

const renderCashFlow = () => render(
    <HouseholdDataProvider
        husbandIncomeDefault={240000}
        wifeIncomeDefault={210000}
        budgetItemsDefault={budgetItems}
    >
        <CashFlowCalculator/>
    </HouseholdDataProvider>,
);

function ScreenSwitcher() {
    const [screen, setScreen] = useState<'calculator' | 'cashFlow'>('calculator');

    return (
        <>
            <button type="button" onClick={() => setScreen(screen === 'calculator' ? 'cashFlow' : 'calculator')}>
                {screen === 'calculator' ? 'お金の流れへ' : '計算画面へ'}
            </button>
            {screen === 'calculator' ? <Calculator/> : <CashFlowCalculator/>}
        </>
    );
}

describe('CashFlowCalculator', () => {
    it('初期状態から項目ごとに支払元を設定でき、入金額と精算額を表示する', () => {
        renderCashFlow();

        expect(screen.getByLabelText('家賃の支払元')).toHaveValue('wife');
        expect(screen.getByLabelText('日用品の支払元')).toHaveValue('shared');
        expect(screen.getByLabelText('食費の支払元')).toHaveValue('shared');
        fireEvent.change(screen.getByLabelText('家賃の支払元'), {target: {value: 'husband'}});
        fireEvent.change(screen.getByLabelText('日用品の支払元'), {target: {value: 'wife'}});

        expect(screen.getByText('夫が直接払う項目：家賃')).toBeInTheDocument();
        expect(screen.getByText('妻が直接払う項目：日用品')).toBeInTheDocument();
        expect(screen.getByText('共通口座から支払う項目：食費')).toBeInTheDocument();
        expect(screen.getByRole('status')).toHaveTextContent('追加の夫婦間精算はありません');
    });

    it('既存計算画面との間で収入と予算を共有する', () => {
        render(
            <HouseholdDataProvider
                husbandIncomeDefault={240000}
                wifeIncomeDefault={210000}
                budgetItemsDefault={budgetItems}
            >
                <Calculator/>
                <CashFlowCalculator/>
            </HouseholdDataProvider>,
        );

        fireEvent.change(screen.getByLabelText('夫の手取り月収'), {target: {value: '250000'}});
        expect(screen.getByText('負担割合：54.3%')).toBeInTheDocument();

        fireEvent.change(screen.getAllByLabelText('家賃の予算')[0], {target: {value: '100000'}});
        expect(screen.getAllByLabelText('家賃の予算')).toHaveLength(2);
        expect(screen.getAllByLabelText('家賃の予算').every((input) => (input as HTMLInputElement).value === '100000'))
            .toBe(true);
    });

    it('画面間の移動で収入・予算・支払元の編集値を保持する', () => {
        render(
            <HouseholdDataProvider
                husbandIncomeDefault={240000}
                wifeIncomeDefault={210000}
                budgetItemsDefault={budgetItems}
            >
                <ScreenSwitcher/>
            </HouseholdDataProvider>,
        );

        fireEvent.change(screen.getByLabelText('夫'), {target: {value: '250000'}});
        fireEvent.change(screen.getByLabelText('家賃の予算'), {target: {value: '100000'}});
        fireEvent.click(screen.getByRole('button', {name: 'お金の流れへ'}));

        expect(screen.getByLabelText('夫の手取り月収')).toHaveValue(250000);
        expect(screen.getByLabelText('家賃の予算')).toHaveValue(100000);
        fireEvent.change(screen.getByLabelText('家賃の支払元'), {target: {value: 'shared'}});
        fireEvent.click(screen.getByRole('button', {name: '計算画面へ'}));
        fireEvent.click(screen.getByRole('button', {name: 'お金の流れへ'}));

        expect(screen.getByLabelText('家賃の予算')).toHaveValue(100000);
        expect(screen.getByLabelText('家賃の支払元')).toHaveValue('shared');
    });

    it('項目ごとの支払元変更はほかの項目に影響しない', () => {
        renderCashFlow();

        fireEvent.change(screen.getByLabelText('家賃の支払元'), {target: {value: 'shared'}});
        fireEvent.change(screen.getByLabelText('日用品の支払元'), {target: {value: 'husband'}});

        expect(screen.getByLabelText('家賃の支払元')).toHaveValue('shared');
        expect(screen.getByLabelText('日用品の支払元')).toHaveValue('husband');
        expect(screen.getByLabelText('食費の支払元')).toHaveValue('shared');
    });
});
