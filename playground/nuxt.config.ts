import path from 'node:path'
import dotenv from 'dotenv'
import { defineNuxtConfig } from 'nuxt/config'
import { createRuntimeConfig } from '../src/runtime/utils/config-helper'

// .env ファイルのパスを指定して読み込み
dotenv.config({ path: path.resolve(__dirname, './env/.env') })
// 環境変数を取得
const env = process.env
// runtimeConfig の設定
const runtimeConfig = createRuntimeConfig()

export default defineNuxtConfig({
  /**
   * Basic 認証の設定
   * @see https://nuxt.com/modules/nuxt-basic-auth
   */

  modules: [
    '@kgierke/nuxt-basic-auth', // Basic 認証
    ['../src/module', {
      prefix: '',
      global: true,
      config: {
        themeColor: 'default',
        dev: {
          path: '/',
        },
        logo: {
          src: '/assets/logo.svg',
          alt: 'logo',
          width: 222,
          height: 38,
        },
      },
    }],
  ],

  // myModule: {},
  devtools: { enabled: true },

  // 使用する SCSS ファイルを配列で指定
  css: [
    '../../src/runtime/scss/style.scss',
  ],

  runtimeConfig,

  // コンポーネントなどソースコードの置き場所を変更
  srcDir: 'src/',

  compatibilityDate: '2025-03-13',

  vite: {
    server: {
      watch: {
        usePolling: true,
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler', // or "modern"
        },
      },
    },
  },

  basicAuth: {
    enabled: env.PUBLIC_BASIC_AUTH_ENABLED === 'true',
    users: [{ username: env.BASIC_AUTH_USERNAME ?? '', password: env.BASIC_AUTH_PASSWORD ?? '' }],
    // Optional: Whitelist routes
    // allowedRoutes: ["/api/.*"],
  },
})
