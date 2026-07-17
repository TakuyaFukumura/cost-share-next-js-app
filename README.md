# cost-share-next-js-app

共働き夫妻向けの「完全収入比例」による家計負担割合計算アプリです。  
共通予算データを `public/data/budget_data.csv` から読み込み、夫・妻の手取り入力に応じて負担割合と拠出額をリアルタイム計算します。

## 技術スタック

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Jest + Testing Library

## セットアップ

```bash
npm install
```

## 開発

```bash
npm run dev
```

## 検証コマンド

```bash
npm run lint
npm run build
npm test
```

## データ定義

- CSVファイル: `public/data/budget_data.csv`
- 使用列: `category`, `item`, `amount`, `is_active`
- `is_active=true` の項目を共通予算合計として扱います
- `income_sample` カテゴリ（夫/妻）を初期収入値として使用します
