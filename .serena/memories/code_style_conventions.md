# コードスタイルと規約

## 命名規則
- **コンポーネント**: PascalCase (例: `BouzuInput`, `BouzuButton`)
- **ファイル名**: PascalCase for components (例: `Input.vue`, `Button.vue`)
- **変数・関数**: camelCase
- **定数**: UPPER_SNAKE_CASE

## TypeScript規約
- 型定義は必須
- Props定義は`defineProps`を使用
- Emits定義は`defineEmits`を使用
- コンポーネントは`<script setup lang="ts">`を使用

## Vue.js規約
- Composition API使用
- `<script setup>`構文を推奨
- コンポーネント名は`Bouzu`プレフィックス付き
- グローバル登録（`global: true`設定）

## SCSS規約
- BEM記法を使用
- 変数は`$`プレフィックス
- ミックスインは`@mixin`で定義
- コンポーネント固有のスタイルは`$cn`変数で管理

## ファイル構造
- コンポーネントは`src/runtime/components/`に配置
- カテゴリ別にディレクトリ分割（elements, forms, layout, overlays等）
- 型定義は`src/runtime/types/`に配置
- SCSSは`src/runtime/scss/`に配置