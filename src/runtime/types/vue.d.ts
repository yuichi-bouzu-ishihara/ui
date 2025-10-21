import 'vue'

// Vueディレクティブの型定義を拡張
declare module '@vue/runtime-core' {
	interface GlobalDirectives {
		intersect: any
	}
}

// Vueテンプレート内でのディレクティブ使用を許可
declare module 'vue' {
	interface ComponentCustomProperties {
		vIntersect: any
	}
}
