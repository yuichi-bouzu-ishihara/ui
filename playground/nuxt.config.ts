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
// font
const fontJA = 'M PLUS 1'
const fontFamily = `Rubik, '${fontJA}', sans-serif`
const fontFamilyEN = `Rubik, '${fontJA}', sans-serif`
const fontWeightNormal = 400
const fontWeightBold = 700

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
        avatar: {
          maskSrc: 'url(/assets/images/circle-mask.svg)',
        },
        skeletonShape: {
          avatarSvgSrc: 'url(/assets/images/circle-mask.svg)',
        },
        webfont: {
          googleFont: {
            list: [
              {
                family: 'Rubik',
                weight: ['400', '700'],
                display: 'swap',
                sizeAdjust: '120%',
                ascentOverride: '100%',
                descentOverride: '20%',
                exLocation: [],
                exOS: [],
              },
              {
                family: 'M PLUS 1',
                weight: ['400', '700'],
                display: 'swap',
                sizeAdjust: '100%',
                ascentOverride: 'normal',
                descentOverride: 'normal',
                exLocation: [],
                exOS: [],
              },
            ],
          },
        },
        typography: {
          font: {
            family: {
              base: fontFamily,
              en: fontFamilyEN,
              normal: fontFamily,
              bold: fontFamily,
              extrabold: fontFamily,
            },
            weight: {
              extrabold: `${fontWeightBold}`,
              bold: `${fontWeightBold}`,
              normal: `${fontWeightNormal}`,
            },
            latinBaselineAdjust: '-0.1em',
          },
          largeTitle: {
            fontFamily: fontFamily,
            fontSize: '40px',
            fontWeight: `${fontWeightBold}`,
            lineHeight: 'calc(55 / 40)',
            capHeightBaselineTop: '-0.26em',
            capHeightBaselineBottom: '-0.16em',
            latinBaselineAdjust: '-0.05em',
          },
          title1: {
            fontFamily: fontFamily,
            fontSize: '32px',
            fontWeight: `${fontWeightBold}`,
            lineHeight: 'calc(40 / 32)',
            capHeightBaselineTop: '-0.22em',
            capHeightBaselineBottom: '-0.12em',
          },
          title2: {
            fontFamily: fontFamily,
            fontSize: '24px',
            fontWeight: `${fontWeightBold}`,
            lineHeight: 'calc(33 / 24)',
            capHeightBaselineTop: '-0.26em',
            capHeightBaselineBottom: '-0.2em',
          },
          title3: {
            fontFamily: fontFamily,
            fontSize: '20px',
            fontWeight: `${fontWeightBold}`,
            lineHeight: 'calc(27.5 / 20)',
            capHeightBaselineTop: '-0.26em',
            capHeightBaselineBottom: '-0.2em',
          },
          headline: {
            fontFamily: fontFamily,
            fontSize: '16px',
            fontWeight: `${fontWeightBold}`,
            lineHeight: 'calc(26.8 / 16)',
            capHeightBaselineTop: '-0.38em',
            capHeightBaselineBottom: '-0.36em',
          },
          subheadline: {
            fontFamily: fontFamily,
            fontSize: '15px',
            fontWeight: `${fontWeightBold}`,
            lineHeight: 'calc(23.5 / 15)',
            capHeightBaselineTop: '-0.36em',
            capHeightBaselineBottom: '-0.26em',
          },
          lead: {
            fontFamily: fontFamily,
            fontSize: '16px',
            fontWeight: `${fontWeightNormal}`,
            lineHeight: 'calc(24 / 16)',
            capHeightBaselineTop: '-0.36em',
            capHeightBaselineBottom: '-0.25em',
          },
          body: {
            fontFamily: fontFamily,
            fontSize: '14px',
            fontWeight: `${fontWeightNormal}`,
            lineHeight: 'calc(23.5 / 14)',
            capHeightBaselineTop: '-0.4em',
            capHeightBaselineBottom: '-0.4em',
          },
          caption1: {
            fontFamily: fontFamily,
            fontSize: '13px',
            fontWeight: `${fontWeightNormal}`,
            lineHeight: 'calc(21.8 / 13)',
            capHeightBaselineTop: '-0.36em',
            capHeightBaselineBottom: '-0.32em',
          },
          caption2: {
            fontFamily: fontFamily,
            fontSize: '12px',
            fontWeight: `${fontWeightNormal}`,
            lineHeight: 'calc(18.5 / 12)',
            capHeightBaselineTop: '-0.25em',
            capHeightBaselineBottom: '-0.26em',
          },
          caption3: {
            fontFamily: fontFamily,
            fontSize: '11px',
            fontWeight: `${fontWeightNormal}`,
            lineHeight: 'calc(16 / 11)',
            capHeightBaselineTop: '-0.25em',
            capHeightBaselineBottom: '-0.22em',
          },
          callout: {
            fontFamily: fontFamily,
            fontSize: '11px',
            fontWeight: `${fontWeightNormal}`,
            lineHeight: 'calc(15.1 / 11)',
            capHeightBaselineTop: '-0.2em',
            capHeightBaselineBottom: '-0.24em',
          },
          footnote: {
            fontFamily: fontFamily,
            fontSize: '10px',
            fontWeight: `${fontWeightNormal}`,
            lineHeight: 'calc(13.8 / 10)',
            capHeightBaselineTop: '-0.2em',
            capHeightBaselineBottom: '-0.24em',
          },
          mark: 'gradation-horizontal', // マークの色
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
