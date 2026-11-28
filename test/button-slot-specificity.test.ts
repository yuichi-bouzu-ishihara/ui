import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { compileString } from 'sass'

/**
 * Button のラベル枠（.button-inner-slot）の配置が、CSS の読み込み順に左右されないことを検証する。
 *
 * ラベル枠は Typography で描画されるため、同じ要素に `.typography` も付く。
 * `.typography { display: block; text-align: left; margin: 0 }` と
 * `.button-inner-slot { display: inline-flex; align-items: center; ... }` がどちらも詳細度 (0,1,0) だと、
 * 後に読み込まれた方が勝つ。本番ビルドで CSS がチャンクに分かれ、Typography の CSS が後に来ると、
 * ラベルがボタンの左上に寄る（elama website #128）。
 *
 * カスケードそのものはブラウザが無いと確かめられないため、
 * コンパイル後の CSS で、ラベル枠のルールが `.typography` より強い詳細度で書かれていることを確かめる。
 */

type Specificity = [number, number, number]

const COMPONENTS_DIR = '../src/runtime/components/elements/'

/** .vue の <style lang="scss"> を取り出してコンパイルし、セレクタごとの宣言に分ける。 */
const compileRules = (path: string) => {
	const url = new URL(path, import.meta.url)
	const source = readFileSync(fileURLToPath(url), 'utf8')
	const scss = source.match(/<style lang="scss">([\s\S]*?)<\/style>/)?.[1] ?? ''
	// @use の相対パスを解決するため、元ファイルの URL を渡す。
	const { css } = compileString(scss, { url })
	// @charset とコメントが次のセレクタにくっつかないよう、先に取り除く。
	const plainCss = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/@charset[^;]*;/g, '')
	const rules = new Map<string, string[]>()
	for (const [, selectors, body] of plainCss.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
		for (const selector of selectors!.split(',').map(s => s.trim())) {
			rules.set(selector, [...(rules.get(selector) ?? []), ...body!.split(';').map(d => d.trim()).filter(Boolean)])
		}
	}
	return rules
}

/** id・クラス/属性/擬似クラス・要素の数で詳細度を数える（このテストで扱う単純なセレクタ向け）。 */
const specificityOf = (selector: string): Specificity => {
	const withoutPseudoElements = selector.replace(/::[\w-]+/g, '')
	const ids = (withoutPseudoElements.match(/#[\w-]+/g) ?? []).length
	const classes = (withoutPseudoElements.match(/\.[\w-]+|\[[^\]]+\]|:[\w-]+/g) ?? []).length
	const elements = (withoutPseudoElements.match(/(^|[\s>+~])[a-z][\w-]*/g) ?? []).length
	return [ids, classes, elements]
}

const compareSpecificity = (a: Specificity, b: Specificity) =>
	a[0] - b[0] || a[1] - b[1] || a[2] - b[2]

const TYPOGRAPHY_BASE = specificityOf('.typography')

/** 指定したプロパティを宣言しているセレクタを返す。 */
const selectorsDeclaring = (rules: Map<string, string[]>, selectorPattern: RegExp, property: string) =>
	[...rules.entries()]
		.filter(([selector, declarations]) =>
			selectorPattern.test(selector)
			&& declarations.some(declaration => declaration.startsWith(`${property}:`)))
		.map(([selector]) => selector)

const propertyOf = (declaration: string) => declaration.split(':')[0]!.trim()

/** ラベル枠の配置を決めるプロパティ。`.typography` 側と衝突するもの。 */
const LAYOUT_PROPERTIES = ['display', 'text-align', 'margin', 'margin-top', 'padding', 'width', 'height']

/** `.typography` の配置プロパティを、ラベル枠ではどのプロパティで上書きしているか。 */
const SLOT_OVERRIDE_PROPERTY: Record<string, string> = {
	'margin': 'margin-top',
	'text-align': 'justify-content', // flex の中央寄せで横位置を決めている
}

/** Button がラベル枠の Typography に付ける修飾クラス（既定の body を含む）。 */
const SLOT_TYPOGRAPHY_MODIFIERS = ['._body', '._bold', '._unselectable', '._nowrap']

const SLOT_SELECTOR = /\.button-inner-slot$/

describe('Button のラベル枠（.button-inner-slot）', () => {
	const buttonRules = compileRules(`${COMPONENTS_DIR}Button.vue`)
	const typographyRules = compileRules(`${COMPONENTS_DIR}Typography.vue`)

	it('配置を決めるルールは .typography より強い詳細度で書かれている', () => {
		// Arrange & Act: ラベル枠を中央に並べる display を宣言しているセレクタ
		const layoutSelectors = selectorsDeclaring(buttonRules, SLOT_SELECTOR, 'display')

		// Assert: ルールはあり、そのすべてが .typography (0,1,0) に読み込み順で負けない
		expect(layoutSelectors).not.toEqual([])
		for (const selector of layoutSelectors) {
			expect(buttonRules.get(selector)).toContain('display: inline-flex')
			expect(compareSpecificity(specificityOf(selector), TYPOGRAPHY_BASE), selector).toBeGreaterThan(0)
		}
	})

	it('.typography が持つ配置のプロパティを、基本の配置ルールがすべて .typography より強く宣言している', () => {
		// Arrange: .typography の基本クラスが宣言する配置のプロパティと、
		// サイズ指定の無い（medium の）ボタンにも効く、基本の配置ルール
		const typographyLayout = (typographyRules.get('.typography') ?? [])
			.map(propertyOf)
			.filter(property => LAYOUT_PROPERTIES.includes(property))
		const baseDeclarations = selectorsDeclaring(buttonRules, SLOT_SELECTOR, 'display')
			.filter(selector => compareSpecificity(specificityOf(selector), TYPOGRAPHY_BASE) > 0)
			.flatMap(selector => (buttonRules.get(selector) ?? []).map(propertyOf))

		// Act
		const missing = typographyLayout
			.map(property => SLOT_OVERRIDE_PROPERTY[property] ?? property)
			.filter(slotProperty => !baseDeclarations.includes(slotProperty))

		// Assert
		expect(typographyLayout).toEqual(expect.arrayContaining(['display', 'margin', 'text-align']))
		expect(missing).toEqual([])
	})

	it('サイズ別の指定は、基本の配置ルールより強いまま残っている', () => {
		// Arrange
		const [base] = selectorsDeclaring(buttonRules, SLOT_SELECTOR, 'display')

		// Act & Assert
		for (const size of ['xsmall', 'small', 'large']) {
			const selector = `.button._${size} .button-inner-slot`
			expect(buttonRules.get(selector), selector).toContain(`margin-top: var(--button-${size}-text-adjust-top)`)
			expect(compareSpecificity(specificityOf(selector), specificityOf(base!)), selector).toBeGreaterThan(0)
		}
	})

	it('ラベル枠に付く Typography の修飾クラスは、配置のプロパティを宣言しない', () => {
		// Arrange & Act: (0,2,0) の修飾クラスが配置を宣言すると、ラベル枠のルールと同点になり読み込み順で決まってしまう
		const conflicts = SLOT_TYPOGRAPHY_MODIFIERS.flatMap(modifier =>
			(typographyRules.get(`.typography${modifier}`) ?? [])
				.filter(declaration => LAYOUT_PROPERTIES.includes(propertyOf(declaration)))
				.map(declaration => `.typography${modifier} { ${declaration} }`))

		// Assert
		expect(conflicts).toEqual([])
	})
})
