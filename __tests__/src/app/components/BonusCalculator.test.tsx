import {fireEvent, render, screen} from '@testing-library/react';
import BonusCalculator from '@/app/components/BonusCalculator';

const hasTextContent = (text: string) => (_: string, element: Element | null) => element?.textContent === text;

describe('BonusCalculator', () => {
    it('初期値と按分後の拠出額・残額を表示する', () => {
        render(<BonusCalculator/>);

        expect(screen.getByLabelText('夫のボーナス手取り額')).toHaveValue(500000);
        expect(screen.getByLabelText('妻のボーナス手取り額')).toHaveValue(400000);
        expect(screen.getByLabelText('貯金目標額')).toHaveValue(300000);
        expect(screen.getByText('負担割合：55.6%')).toBeInTheDocument();
        expect(screen.getByText('負担割合：44.4%')).toBeInTheDocument();
        expect(screen.getByText('拠出額：166,667円')).toBeInTheDocument();
        expect(screen.getByText('拠出額：133,333円')).toBeInTheDocument();
        expect(screen.getByText(hasTextContent('残額：333,333円'))).toBeInTheDocument();
        expect(screen.getByText(hasTextContent('残額：266,667円'))).toBeInTheDocument();
        expect(screen.getByText('600,000円')).toBeInTheDocument();
    });

    it('入力変更を計算結果に即時反映し、目標未達を表示する', () => {
        render(<BonusCalculator/>);

        fireEvent.change(screen.getByLabelText('貯金目標額'), {target: {value: '1000000'}});

        expect(screen.getByText('今回の拠出額合計')).toBeInTheDocument();
        expect(screen.getAllByText('900,000円')).toHaveLength(2);
        const unmetAmount = screen.getByRole('status');
        expect(unmetAmount.tagName).toBe('OUTPUT');
        expect(unmetAmount).toHaveClass('block');
        expect(unmetAmount).toHaveTextContent('貯金目標までの未達額：100,000円');
        expect(screen.getAllByText(hasTextContent('残額：0円'))).toHaveLength(2);
    });

    it('夫婦のボーナスが0円の場合は負担割合0%と目標全額未達を表示する', () => {
        render(<BonusCalculator/>);

        fireEvent.change(screen.getByLabelText('夫のボーナス手取り額'), {target: {value: '0'}});
        fireEvent.change(screen.getByLabelText('妻のボーナス手取り額'), {target: {value: '0'}});

        expect(screen.getAllByText('負担割合：0.0%')).toHaveLength(2);
        expect(screen.getAllByText('拠出額：0円')).toHaveLength(2);
        const unmetAmount = screen.getByRole('status');
        expect(unmetAmount.tagName).toBe('OUTPUT');
        expect(unmetAmount).toHaveTextContent('貯金目標までの未達額：300,000円');
    });
});
