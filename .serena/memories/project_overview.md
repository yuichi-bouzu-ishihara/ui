# Bouzu UI プロジェクト概要

## プロジェクトの目的
- Vue.js/Nuxt.js向けの包括的なUIコンポーネントライブラリ
- 再利用可能なコンポーネント、composables、ユーティリティを提供
- TypeScript完全サポート
- Nuxt 3専用設計

## 技術スタック
- **フレームワーク**: Nuxt 3.15.4
- **言語**: TypeScript 5.7.3
- **スタイリング**: SCSS
- **テスト**: Vitest
- **リンター**: ESLint
- **Node.js**: 20.17.0
- **npm**: 11.1.0

## プロジェクト構造
- `src/`: メインのソースコード
  - `runtime/components/`: Vueコンポーネント
  - `runtime/composables/`: Vue composables
  - `runtime/scss/`: SCSSスタイル
- `playground/`: 開発・テスト用のNuxtアプリケーション
- `dist/`: ビルド済みファイル

## 主要コンポーネント
- **Elements**: Button, Icon, Avatar, Typography, Spinner, Logo
- **Forms**: Input, Select, Checkbox, Switch, Textarea
- **Layout**: Container, Row, Column, Box
- **Overlays**: Modal, Drawer, Sheet, Toast, Tooltip

## 開発コマンド
- `npm run dev`: 開発サーバー起動
- `npm run build`: ビルド
- `npm run lint`: リンター実行
- `npm run test`: テスト実行
- `npm run dev:prepare`: 型スタブ生成