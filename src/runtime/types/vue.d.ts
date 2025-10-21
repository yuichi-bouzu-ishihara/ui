import 'vue'

// Vueディレクティブの型定義を拡張
declare module '@vue/runtime-core' {
	interface GlobalDirectives {
		intersect: {
			value?: {
				rootMargin?: string
				threshold?: number | number[]
			}
			modifiers?: {
				once?: boolean
				each?: boolean
				out?: boolean
				in?: boolean
			}
		}
	}
}

// Vueテンプレート内でのディレクティブ使用を許可
declare module 'vue' {
	interface ComponentCustomProperties {
		vIntersect: {
			value?: {
				rootMargin?: string
				threshold?: number | number[]
			}
			modifiers?: {
				once?: boolean
				each?: boolean
				out?: boolean
				in?: boolean
			}
		}
	}
}
