import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { compileString } from 'sass'

/** セレクタごとの宣言（`property: value` の文字列）の一覧。 */
export type StyleRules = Map<string, string[]>

/** .vue の <style lang="scss"> を取り出す。無ければ空文字。 */
export const extractScss = (source: string): string =>
	source.match(/<style lang="scss">([\s\S]*?)<\/style>/)?.[1] ?? ''

/** .vue の <style lang="scss"> をコンパイルし、セレクタごとの宣言に分ける。 */
export const compileStyleRules = (url: URL): StyleRules => {
	const scss = extractScss(readFileSync(fileURLToPath(url), 'utf8'))
	// @use の相対パスを解決するため、元ファイルの URL を渡す。
	const { css } = compileString(scss, { url })
	// @charset とコメントが次のセレクタにくっつかないよう、先に取り除く。
	const plainCss = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/@charset[^;]*;/g, '')
	const rules: StyleRules = new Map()
	for (const [, selectors, body] of plainCss.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
		const declarations = body!.split(';').map(d => d.trim()).filter(Boolean)
		for (const selector of selectors!.split(',').map(s => s.trim())) {
			rules.set(selector, [...(rules.get(selector) ?? []), ...declarations])
		}
	}
	return rules
}

/** `property: value` を [property, value] に分ける。 */
export const splitDeclaration = (declaration: string): [string, string] => {
	const index = declaration.indexOf(':')
	return [declaration.slice(0, index).trim(), declaration.slice(index + 1).trim()]
}
