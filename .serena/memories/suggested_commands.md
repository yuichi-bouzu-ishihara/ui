# 推奨コマンド

## 開発環境セットアップ
```bash
# 依存関係インストール
npm install

# 型スタブ生成
npm run dev:prepare

# 開発サーバー起動
npm run dev
```

## ビルド・テスト
```bash
# ビルド
npm run build

# リンター実行
npm run lint

# テスト実行
npm run test

# 型チェック
npm run test:types
```

## パッケージ管理
```bash
# ローカルパッケージ作成
npm run release:local

# パッチリリース
npm run pub:patch

# マイナーバージョンリリース
npm run pub:minor

# メジャーバージョンリリース
npm run pub:major
```

## システムユーティリティ（macOS）
```bash
# ファイル検索
find . -name "*.vue" -type f

# 文字列検索
grep -r "pattern" src/

# ディレクトリ一覧
ls -la

# Git操作
git status
git add .
git commit -m "message"
git push
```