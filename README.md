<!--
Get your module up and running quickly.

Find and replace all on all files (CMD+SHIFT+F):
- Name: My Module
- Package name: my-module
- Description: My new Nuxt module
-->

# bouzu UI [![Nuxt][nuxt-src]][nuxt-href]

## Features

<!-- Highlight some of the features your module provide here -->
- Components
- Composables
- Scss Variables & Mixins & Functions

## Quick Setup

Install the module to your Nuxt application with one command:

1. このリポジトリをクローンします。
2. 使用したいバージョンが貼られたタグのコミットに移動します。
3. `npm run release:local` を実行します。
4. `/packs/bouzu-ui-{package.version}.tgz` が出力されたか確認します。
5. 利用したいプロジェクトに移動し `npm i {path}/bouzu-ui-components/packs/bouzu-ui-{package.version}.tgz` を実行します。

That's it! You can now use My Module in your Nuxt app ✨


## Contribution
#### このリポジトリの作業を他プロジェクトでテストする方法
  
1. このリポジトリで `npm link` を実行する。
2. テストしたいプロジェクトで `npm link @bouzu/ui` を実行する。

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  npm install
  
  # Generate type stubs
  npm run dev:prepare
  
  # Develop with the playground
  npm run dev
  
  # Build the playground
  npm run dev:build
  
  # Run ESLint
  npm run lint
  
  # Run Vitest
  npm run test
  npm run test:watch
  
  # Release new version
  npm run local:release
  ```

</details>
[license-href]: https://npmjs.com/package/my-module

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
