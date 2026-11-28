import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { compileStyleRules, splitDeclaration, type StyleRules } from './utils/compileStyleRules'

/**
 * Box / Typography で描画される要素の CSS が、読み込み順に左右されないことをライブラリ全体で検証する。
 *
 * `<Box class="x">` で描画した要素には `.box` も、`<Typography class="x">` には `.typography` も付く。
 * `.x`（詳細度 0,1,0）が `.box` / `.typography`（同じく 0,1,0）と同じプロパティを違う値で宣言すると、
 * 後に読み込まれた方が勝つ。本番ビルドでは CSS がチャンクに分かれ、Box や Typography の CSS が後に来るため、
 * ボタンのラベル（#128）や Spinner が中央からずれた。
 *
 * 違う値を指定したいときは、親を付ける（`.button .button-inner-loader`）か、
 * 同じクラスを重ねて（`.circleCheck.circleCheck`）詳細度を上げる。
 *
 * 対象はテンプレートに直接書いた class 属性だけ。`:class` で動的に付けるクラスは見ない。
 */

const COMPONENTS_DIR = new URL('../src/runtime/components/', import.meta.url)

/** 基本ルールを持つコンポーネント（タグ名 → ファイルと基本クラス）。 */
const BASE_COMPONENTS = {
	Box: { file: 'layout/Box.vue', selector: '.box' },
	Typography: { file: 'elements/Typography.vue', selector: '.typography' },
} as const

type BaseTag = keyof typeof BASE_COMPONENTS

interface SameElementClass {
	component: string
	tag: BaseTag
	className: string
}

/** 宣言の一覧を property → value の Map にする（後勝ち）。 */
const toPropertyMap = (declarations: string[]) =>
	new Map(declarations.map(splitDeclaration))

const componentFiles = (readdirSync(fileURLToPath(COMPONENTS_DIR), { recursive: true }) as string[])
	.filter(file => file.endsWith('.vue'))
	.sort()

/** テンプレートで <Box class="..."> / <Typography class="..."> として描画されるクラスを集める。 */
const collectSameElementClasses = (): SameElementClass[] =>
	componentFiles.flatMap((component) => {
		const template = readFileSync(new URL(component, COMPONENTS_DIR), 'utf8').split('<script')[0]!
		return [...template.matchAll(/<(Box|Typography)\b[^>]*?\sclass="([^"]+)"/g)].flatMap(([, tag, classes]) =>
			classes!.split(/\s+/).filter(Boolean).map(className => ({ component, tag: tag as BaseTag, className })))
	})

const baseDeclarations = Object.fromEntries(
	Object.entries(BASE_COMPONENTS).map(([tag, { file, selector }]) =>
		[tag, toPropertyMap(compileStyleRules(new URL(file, COMPONENTS_DIR)).get(selector) ?? [])]),
) as Record<BaseTag, Map<string, string>>

const rulesCache = new Map<string, StyleRules>()
const rulesOf = (component: string) => {
	if (!rulesCache.has(component)) {
		rulesCache.set(component, compileStyleRules(new URL(component, COMPONENTS_DIR)))
	}
	return rulesCache.get(component)!
}

describe('Box / Typography で描画される要素', () => {
	const sameElementClasses = collectSameElementClasses()

	it('基本ルールと、テンプレートの要素を読み取れている', () => {
		// Arrange & Act
		const found = sameElementClasses.map(({ tag, className }) => `${tag}.${className}`)

		// Assert: 何も読み取れずに通ってしまわないよう、既知の要素と基本ルールを確かめる
		expect(baseDeclarations.Box.get('display')).toBe('block')
		expect(baseDeclarations.Typography.get('text-align')).toBe('left')
		expect(found).toContain('Box.button-inner-loader')
		expect(found).toContain('Typography.button-inner-slot')
	})

	it('自分のクラスだけ（0,1,0）で、基本ルールと同じプロパティを違う値にしていない', () => {
		// Arrange & Act
		const conflicts = sameElementClasses.flatMap(({ component, tag, className }) => {
			const own = toPropertyMap(rulesOf(component).get(`.${className}`) ?? [])
			return [...own.entries()]
				.filter(([property, value]) => baseDeclarations[tag].has(property) && baseDeclarations[tag].get(property) !== value)
				.map(([property, value]) =>
					`${component}: .${className} { ${property}: ${value} } と ${BASE_COMPONENTS[tag].selector} { ${property}: ${baseDeclarations[tag].get(property)} } が同じ詳細度`)
		})

		// Assert
		expect([...new Set(conflicts)]).toEqual([])
	})
})
