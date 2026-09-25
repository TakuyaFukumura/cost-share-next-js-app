# SonarQube による静的解析

## 目的と対象

Docker で SonarQube Community Build を起動し、このリポジトリの Next.js / TypeScript アプリを解析する手順です。解析対象は `src/`、`lib/` と `__tests__/` のテストで、Jest のカバレッジを SonarQube に取り込みます。

## 必要なもの

- Docker Desktop が起動していること
- リポジトリの依存関係がインストール済みであること
- ホストの TCP ポート `9000` が空いていること

## SonarQube の起動

PowerShell でリポジトリのルートへ移動して実行します。

```powershell
docker run --name cost-share-sonarqube -d -p 9000:9000 sonarqube:community
```

起動状態は次のコマンドで確認できます。

```powershell
docker logs -f cost-share-sonarqube
```

`SonarQube is operational` と表示されたら `http://localhost:9000` を開きます。初回ログインはユーザー名 `admin`、パスワード `admin` です。案内に従ってパスワードを変更し、SonarQube の画面でプロジェクト解析用トークンを発行してください。

## 解析の実行

まず Jest のテストを実行して LCOV 形式のカバレッジを作成します。

```powershell
npm run test:coverage -- --coverageReporters=lcov
```

SonarQube 画面で発行したトークンを環境変数に設定してから、Docker の Scanner CLI を実行します。トークンはコマンドや設定ファイルに直接書かず、共有・コミットしないでください。`sonar.qualitygate.wait=true` を設定しているため、解析レポートのサーバー処理と品質ゲート判定が終わるまで Scanner が待機します。

```powershell
$env:SONAR_TOKEN = Read-Host "SonarQube analysis token"
docker run --rm -e SONAR_HOST_URL=http://host.docker.internal:9000 -e SONAR_TOKEN -v "${PWD}:/usr/src" -w /usr/src sonarsource/sonar-scanner-cli
Remove-Item Env:SONAR_TOKEN
```

スキャン完了後、SonarQube のプロジェクト画面で品質ゲート、バグ、脆弱性、コードスメル、重複率、カバレッジを確認できます。SonarQube の解析結果は設定した品質プロファイルや品質ゲートに依存します。

解析対象とカバレッジファイルの設定はリポジトリルートの `sonar-project.properties` にあります。通常の再解析では同じ SonarQube サーバーとプロジェクトキーを使用してください。
Windows の作業ツリーを Docker から解析する際の Git インデックス読み取りエラーを避けるため、SonarQube の SCM 連携（Git の blame 情報収集）は無効にしています。ソースコードの解析とカバレッジ計測には影響しませんが、SonarQube 上で変更者情報は表示されません。

## 停止と後片付け

```powershell
docker stop cost-share-sonarqube
docker rm cost-share-sonarqube
```

この起動例では DB の永続ボリュームを設定していません。コンテナを削除すると SonarQube のプロジェクト・設定・解析履歴も削除されます。履歴を継続利用する場合は、PostgreSQL と永続ボリュームを含む運用構成を用意してください。

## 解析結果

2026年9月25日に SonarQube Community Build `26.9.0.129388`、SonarScanner CLI `8.1.0.6389` で初回解析しました。品質ゲートは **OK** です。

| 指標 | 結果 |
| --- | ---: |
| インデックスされたファイル | 27 |
| 非コメントコード行数（NCLOC） | 1,039 |
| バグ | 0 |
| 脆弱性 | 0 |
| セキュリティホットスポット | 0 |
| コードスメル | 10（Major 6、Minor 4） |
| カバレッジ | 84.2%（対象196行、未カバー25行） |
| 重複行密度 | 0.0% |

コードスメルの内訳は次のとおりです。

| ファイル・行 | 重要度 | 内容 |
| --- | --- | --- |
| `lib/csv.ts:1-2` | Minor（2件） | Node.js 標準モジュールの import に `node:` プレフィックスを使用する |
| `lib/database.ts:2-3` | Minor（2件） | Node.js 標準モジュールの import に `node:` プレフィックスを使用する |
| `src/app/components/BonusCalculator.tsx:91` | Major | `status` ロールより `<output>` 要素を使用する |
| `src/app/components/BonusCalculator.tsx:127,136` | Major（2件） | `span` 要素の前の空白が曖昧 |
| `src/app/explanation/rent-subsidy/page.tsx:67,72,77` | Major（3件） | `strong` 要素の後の空白が曖昧 |

Jest は 8 スイート・57 テストすべて成功しました。LCOV の集計では行カバレッジ 87.77%（165/188行）、分岐カバレッジ 76.32%（58/76分岐）でした。SonarQube のカバレッジは SonarQube が解析対象と判定したコード行を分母にするため、LCOV の行カバレッジと数値が異なります。

プロジェクトキーは `cost-share-next-js-app` です。SonarQube を起動して解析を再実行した後、`http://localhost:9000/dashboard?id=cost-share-next-js-app` で結果を確認できます。

SonarQube の指摘は修正候補です。特に JSX の空白やアクセシビリティの指摘は、画面表示・読み上げへの影響を確認してから変更してください。判定は解析時点のソース、ツールバージョン、品質プロファイルに基づくものであり、将来の解析で変わる場合があります。
