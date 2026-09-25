# SonarQube 静的解析手順書

## 目的

Docker で SonarQube Community Build を起動し、このリポジトリの Next.js / TypeScript コードを解析する手順です。コマンド例は Windows の PowerShell を対象としています。

解析範囲やカバレッジの設定はリポジトリ直下の `sonar-project.properties` で管理します。解析結果は、解析後に SonarQube のプロジェクト画面で確認してください。

## 前提条件

- Docker Desktop が起動しており、Linux コンテナーを実行できること
- Node.js と npm がインストールされ、リポジトリの依存パッケージが利用できること
- SonarQube の初回起動時に Docker Hub へ接続できること
- ホストの TCP ポート `9000` が未使用であること

リポジトリのルートで作業してください。

## SonarQube の起動

次のコマンドで SonarQube を起動します。

```powershell
docker run --name cost-share-sonarqube -d -p 9000:9000 sonarqube:community
```

初回はイメージのダウンロードとサーバーの初期化に時間がかかります。次のコマンドでログを確認します。

```powershell
docker logs -f cost-share-sonarqube
```

`SonarQube is operational` が表示されたら `http://localhost:9000` を開きます。初回ログインはユーザー名 `admin`、パスワード `admin` です。画面の案内に従ってパスワードを変更し、ユーザー設定のセキュリティ画面で解析用トークンを発行してください。トークンは再表示できないため、安全な場所で一時的に扱います。

## テストとカバレッジの作成

SonarQube に取り込む Jest の LCOV レポートを生成します。

```powershell
npm run test:coverage -- --coverageReporters=lcov
```

テスト成功後、レポートが作成されたことを確認できます。

```powershell
Test-Path coverage\lcov.info
```

`True` と表示されることを確認してください。

## SonarScanner の実行

発行したトークンを環境変数に設定します。トークンをソースコード、設定ファイル、コマンドへ直接書き込んだり、コミットしたりしないでください。

```powershell
$env:SONAR_TOKEN = Read-Host "SonarQube analysis token"
try {
    docker run --rm -e SONAR_HOST_URL=http://host.docker.internal:9000 -e SONAR_TOKEN -v "${PWD}:/usr/src" -w /usr/src sonarsource/sonar-scanner-cli:latest
    if ($LASTEXITCODE -ne 0) {
        throw "SonarScanner exited with code $LASTEXITCODE"
    }
}
finally {
    Remove-Item Env:SONAR_TOKEN -ErrorAction SilentlyContinue
}
```

`sonar.qualitygate.wait=true` により、Scanner はサーバー側の解析処理と品質ゲート判定が終わるまで待機します。正常終了後は `http://localhost:9000/dashboard?id=cost-share-next-js-app` を開き、品質ゲート、指摘、カバレッジを確認します。プロジェクトキーは `sonar-project.properties` に設定されています。

## 設定上の注意

- `sonar.sources` と `sonar.tests` により、アプリ本体とテストを区別して解析します。
- `sonar.javascript.lcov.reportPaths` が Jest の `coverage/lcov.info` を読み込みます。テストを実行する前に Scanner を起動すると、カバレッジを取り込めません。
- Windows の作業ツリーを Docker から解析する際に Git インデックスの読み取りエラーが発生したため、`sonar.scm.disabled=true` を設定しています。解析とカバレッジには影響しませんが、SonarQube 上では Git の blame 情報を利用できません。
- `sonarqube:community` と `sonarsource/sonar-scanner-cli:latest` は更新されるタグです。実際に使用されたバージョンは、サーバーの `/api/server/version` と Scanner の実行ログで確認してください。

## よくある問題

### ポート 9000 を使用できない

別のサービスやコンテナーがポートを使用していないか確認します。

```powershell
docker ps --format "table {{.Names}}\t{{.Ports}}"
```

必要であれば、SonarQube のホスト側ポートを別の空きポートに変更し、`SONAR_HOST_URL` とブラウザーで開く URL も合わせて変更してください。

### SonarQube が起動しない

Docker Desktop が稼働していることを確認し、次のコマンドでコンテナーの状態とログを確認します。

```powershell
docker ps -a --filter name=cost-share-sonarqube
docker logs cost-share-sonarqube
```

### カバレッジが表示されない

Jest を再実行し、`coverage\lcov.info` が存在することを確認してください。また、`sonar-project.properties` の LCOV パスとリポジトリのルートから Scanner を実行していることを確認してください。

### Scanner が認証に失敗する

SonarQube で発行したトークンを使用していること、環境変数が設定されていることを確認します。

```powershell
Test-Path Env:SONAR_TOKEN
```

トークンを再発行した場合は、PowerShell の環境変数も新しい値に更新してください。

## 停止とデータの扱い

作業を一時中断する場合は、コンテナーを停止します。

```powershell
docker stop cost-share-sonarqube
```

同じコンテナーを再利用する場合は、次のコマンドで再起動できます。

```powershell
docker start cost-share-sonarqube
```

この手順ではデータベース用の永続ボリュームを設定していません。コンテナーを削除すると、プロジェクト設定と解析履歴も削除されます。履歴が不要になった場合に限り、次のコマンドで削除してください。

```powershell
docker rm cost-share-sonarqube
```

継続利用する場合は、H2 の評価用構成ではなく、PostgreSQL と永続ボリュームを使用する運用構成を別途用意してください。
