# Changelog

このプロジェクトのすべての変更はこのファイルに記録されます。

フォーマットは [Keep a Changelog](https://keepachangelog.com/ja/1.0.0/) に基づいており、
このプロジェクトは [Semantic Versioning](https://semver.org/lang/ja/) に従っています。

## [Unreleased]

### 変更

- なし

## [0.2.0] - 2026-07-11

### 追加

- 家計負担割合計算アプリを実装（CSV読み込み、収入比例計算、リアルタイム更新UI）
- `lib/csv.ts` と関連ユニットテストを追加
- `Calculator` コンポーネントと関連テストを追加

### 変更

- メインページをSQLiteメッセージ表示から家計負担割合計算画面に変更
- READMEを新仕様に合わせて更新

### 削除

- `docs/specification.md`（実装完了に伴い削除）

## [0.1.0] - 2026-07-11

### 変更

- テンプレートからの初期設定を実施
