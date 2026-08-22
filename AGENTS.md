# 開発エージェント向けガイド

## プロジェクト概要

このプロジェクトは、共働き夫婦向けに完全収入比例の家計負担割合を計算する
Next.js アプリケーションです。共通予算は `public/data/budget_data.csv` から読み込みます。

## 開発ルール

- `main` ブランチで改修依頼を受けた場合は、作業開始前に作業ブランチを作成する。
- 変更内容に応じて `package.json` の Semantic Versioning と `CHANGELOG.md` を更新する。
- 資料を作成する場合は `docs` ディレクトリ配下に Markdown ファイルとして作成し、ファイル名と内容は日本語にする。
- 改修対象ファイルと新規追加ファイルの末尾には改行を入れる。
- プルリクエストの説明には `<!-- 日本語でレビューして下さい -->` を必ず含める。
- 共通で守るべき運用ルールは、このファイルに追記する。
- 既存の実装や設定を変更する際は、関係するテストとドキュメントも確認する。
- 依存関係や既存のプロジェクト設定を尊重し、不要なライブラリやツールを追加しない。

## 技術スタック

- Next.js（App Router）
- React + TypeScript
- Tailwind CSS
- Jest + Testing Library

## 検証コマンド

変更後は、必要に応じて次のコマンドを実行する。

```bash
npm run lint
npm run build
npm test
```

## データ定義

- CSV ファイル: `public/data/budget_data.csv`
- 使用列: `category`, `item`, `amount`, `is_active`
- `is_active=true` の項目を共通予算合計として扱う。
- `income_sample` カテゴリ（夫・妻）を初期収入値として使用する。
