import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { compileString } from 'sass'

/**
 * Row / Column の基本クラスが width を宣言しないことを検証する。
 *
 * `.row { width: auto }` は初期値の再宣言で、それ自体は何もしない。
 * ところが同じ詳細度 (0,1,0) のクラス（例: `.ratio-container-inner { width: 100% }`）と
 * 同じ要素に付くと、CSS の出力順だけで勝敗が決まる。コンポーネントの CSS は
 * 読み込まれた順に足されるため、遷移の順番しだいで幅指定が打ち消され、
 * Ratio の中の FileUpload の幅が 0 になった（#7）。
 *
 * カスケードそのものはブラウザが無いと確かめられないため、
 * 原因となる宣言が基本クラスに無いことをコンパイル後の CSS で確かめる。
 */

/** .vue の <style lang="scss"> を取り出してコンパイルし、セレクタごとの宣言に分ける。 */
const compileRules = (path: string) => {
	const source = readFileSync(fileURLToPath(new URL(path, import.meta.url)), 'utf8')
	const scss = source.match(/<style lang="scss">([\s\S]*?)<\/style>/)?.[1] ?? ''
	const { css } = compileString(scss)
	const rules = new Map<string, string[]>()
	for (const [, selectors, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
		for (const selector of selectors!.split(',').map(s => s.trim())) {
			rules.set(selector, [...(rules.get(selector) ?? []), ...body!.split(';').map(d => d.trim()).filter(Boolean)])
		}
	}
	return rules
}

/** 指定したセレクタの width 宣言を返す。 */
const widthOf = (rules: Map<string, string[]>, selector: string) =>
	(rules.get(selector) ?? []).filter(declaration => /^width\s*:/.test(declaration))

describe.each([
	{ name: 'Row', path: '../src/runtime/components/layout/Row.vue', base: '.row' },
	{ name: 'Column', path: '../src/runtime/components/layout/Column.vue', base: '.column' },
])('$name', ({ path, base }) => {
	it('基本クラスは width を宣言しない', () => {
		// Arrange & Act
		const rules = compileRules(path)

		// Assert: 基本クラスのルール自体はある（display: flex）うえで、width だけが無い。
		expect(rules.get(base)).toContain('display: flex')
		expect(widthOf(rules, base)).toEqual([])
	})

	it('幅を指定する修飾クラスは残っている', () => {
		// Arrange & Act
		const rules = compileRules(path)

		// Assert: 修飾クラスは詳細度 (0,2,0) で意図して幅を決めているので残す。
		expect(widthOf(rules, `${base}._fit`)).toEqual(['width: 100%'])
		expect(widthOf(rules, `${base}._fitW`)).toEqual(['width: 100%'])
		expect(widthOf(rules, `${base}._autoWidth`)).toEqual(['width: auto'])
	})
})

describe('Row の inline', () => {
	it('inline は width: auto のまま残っている', () => {
		// Arrange & Act
		const rules = compileRules('../src/runtime/components/layout/Row.vue')

		// Assert
		expect(widthOf(rules, '.row._inline')).toEqual(['width: auto'])
	})
})
