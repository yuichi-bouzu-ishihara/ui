import { deepmerge } from 'deepmerge-ts'
import { defineNuxtModule, addPlugin, addComponentsDir, addImportsDir, createResolver } from '@nuxt/kit'
import { name, version } from '../package.json'
import type { UIConfig } from './runtime/types'
import { defaultOptions } from './defaults'

// Module options TypeScript interface definition
export interface ModuleOptions {
	/**
	 * Prefix for the components
	 * @note If enabled, all components will be prefixed with the given prefix.
	 * @default ''
	 */
	prefix?: string

	/**
	 * Global components
	 * @note If enabled, components will be globally available.
	 * @default false
	 */
	global?: boolean

	/**
	 * UI Config
	 */
	config?: UIConfig
}

export default defineNuxtModule<ModuleOptions>({
	meta: {
		name,
		version,
		configKey: 'ui',
	},
	// Default configuration options of the Nuxt module
	defaults: {
		prefix: '',
		global: true,
	},
	setup(options, nuxt) {
		let config = defaultOptions
		config = deepmerge(config, options.config || {})
		nuxt.options.appConfig.ui = config

		const { resolve } = createResolver(import.meta.url)

		// Transpile runtime
		const runtimeDir = resolve('./runtime')

		// Plugins
		addPlugin(resolve(runtimeDir, 'plugins', 'directive-click-outside.js'))
		addPlugin(resolve(runtimeDir, 'plugins', 'directive-focus.js'))
		addPlugin(resolve(runtimeDir, 'plugins', 'directive-intersect.js'))
		addPlugin(resolve(runtimeDir, 'plugins', 'directive-resize.js'))

		// Components
		addComponentsDir({
			path: resolve(runtimeDir, 'components', 'elements'),
			prefix: options.prefix ?? '',
			global: options.global ?? false,
			watch: false,
		})
		addComponentsDir({
			path: resolve(runtimeDir, 'components', 'layout'),
			prefix: options.prefix ?? '',
			global: options.global ?? false,
			watch: false,
		})
		addComponentsDir({
			path: resolve(runtimeDir, 'components', 'forms'),
			prefix: options.prefix ?? '',
			global: options.global ?? false,
			watch: false,
		})
		addComponentsDir({
			path: resolve(runtimeDir, 'components', 'navigation'),
			prefix: options.prefix ?? '',
			global: options.global ?? false,
			watch: false,
		})
		addComponentsDir({
			path: resolve(runtimeDir, 'components', 'overlays'),
			prefix: options.prefix ?? '',
			global: options.global ?? false,
			watch: false,
		})
		addComponentsDir({
			path: resolve(runtimeDir, 'components', 'transition'),
			prefix: options.prefix ?? '',
			global: options.global ?? false,
			watch: false,
		})
		addComponentsDir({
			path: resolve(runtimeDir, 'components', 'gesture'),
			prefix: options.prefix ?? '',
			global: options.global ?? false,
			watch: false,
		})
		addComponentsDir({
			path: resolve(runtimeDir, 'components', 'dev'),
			prefix: options.prefix ?? '',
			global: options.global ?? false,
			watch: false,
		})

		// Composables
		addImportsDir(resolve(runtimeDir, 'composables'))
		addImportsDir(resolve(runtimeDir, 'composables', 'elements'))
		addImportsDir(resolve(runtimeDir, 'composables', 'layout'))
		addImportsDir(resolve(runtimeDir, 'composables', 'overlays'))
		// addImportsDir(resolve(runtimeDir, 'composables', 'forms'))
		// addImportsDir(resolve(runtimeDir, 'composables', 'navigation'))
		// addImportsDir(resolve(runtimeDir, 'composables', 'transition'))

		// Classes
		addImportsDir(resolve(runtimeDir, 'classes'))

		// Scss
		nuxt.hook('nitro:config', async (nitroConfig) => {
			nitroConfig.publicAssets ||= []
			nitroConfig.publicAssets.push({
				dir: resolve(runtimeDir, 'scss'),
				maxAge: 60 * 60 * 24 * 365, // 1 year
			})
		})

		// Assets
		nuxt.hook('nitro:config', async (nitroConfig) => {
			nitroConfig.publicAssets ||= []
			nitroConfig.publicAssets.push({
				dir: resolve(runtimeDir, 'assets'),
				maxAge: 60 * 60 * 24 * 365, // 1 year
			})
		})

		// Utils
		nuxt.hook('nitro:config', async (nitroConfig) => {
			nitroConfig.publicAssets ||= []
			nitroConfig.publicAssets.push({
				dir: resolve(runtimeDir, 'utils'),
				maxAge: 60 * 60 * 24 * 365, // 1 year
			})
		})

		// Type definitions
		nuxt.hook('prepare:types', ({ references }) => {
			references.push({
				path: resolve(runtimeDir, 'types', 'vue.d.ts'),
			})
			references.push({
				path: resolve(runtimeDir, 'types', 'global.d.ts'),
			})
		})

		// 明示的 import 用の Alias を作成
		// これにより import { useA } from '#module-a/composables' が可能になります
		// 注意: この方法は Module A が Nuxt コンテキスト内で動いている時のみ有効です
		nuxt.options.alias['#module-a/composables'] = resolve(runtimeDir, 'composables')
	},
})
