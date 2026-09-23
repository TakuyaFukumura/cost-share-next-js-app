import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import ExplanationIndexPage from '@/app/explanation/page';
import CalculationExplanationPage from '@/app/explanation/calculation/page';
import RentSubsidyExplanationPage from '@/app/explanation/rent-subsidy/page';

describe('解説ページ', () => {
    it('解説一覧に各記事へのカードリンクと計算ページへのリンクを表示する', () => {
        render(<ExplanationIndexPage/>);

        expect(screen.getByRole('heading', {name: '解説'})).toBeInTheDocument();
        expect(screen.getByRole('link', {name: /計算のしくみ/}))
            .toHaveAttribute('href', '/explanation/calculation');
        expect(screen.getByRole('link', {name: /家賃補助を受ける場合の考え方/}))
            .toHaveAttribute('href', '/explanation/rent-subsidy');
        expect(screen.getByRole('link', {name: '家計負担割合の計算に戻る'})).toHaveAttribute('href', '/');
    });

    it('計算ロジック記事で食費と食費以外の経路および例外注記を説明する', () => {
        render(<CalculationExplanationPage/>);

        expect(screen.getByRole('heading', {name: '計算のしくみ'})).toBeInTheDocument();
        expect(screen.getByText('食費の経路')).toBeInTheDocument();
        expect(screen.getByText('食費以外の経路')).toBeInTheDocument();
        expect(screen.getByText(/合計収入が0円の場合/)).toBeInTheDocument();
        expect(screen.getByRole('link', {name: '解説一覧に戻る'}))
            .toHaveAttribute('href', '/explanation');
    });

    it('家賃補助の記事を個別ページに表示し、一覧へ戻れる', () => {
        render(<RentSubsidyExplanationPage/>);

        expect(screen.getByRole('heading', {name: '家賃補助を受ける場合の考え方'})).toBeInTheDocument();
        expect(screen.getByRole('heading', {name: '公平性を考える代表的な方法'})).toBeInTheDocument();
        expect(screen.getByRole('link', {name: '解説一覧に戻る'}))
            .toHaveAttribute('href', '/explanation');
    });
});
