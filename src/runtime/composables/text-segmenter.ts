/**
 * テキストを欧文・和文に分割するユーティリティ
 * 全角文字を和文、それ以外を欧文として分類する
 */

export type TextSegment = {
	text: string
	type: 'ja' | 'latin'
}

/**
 * 全角文字かどうかを判定する
 * - CJK統合漢字 (U+4E00-U+9FFF)
 * - CJK統合漢字拡張A (U+3400-U+4DBF)
 * - CJK互換漢字 (U+F900-U+FAFF)
 * - ひらがな (U+3040-U+309F)
 * - カタカナ (U+30A0-U+30FF)
 * - 半角カタカナ (U+FF65-U+FF9F)
 * - CJK記号・句読点 (U+3000-U+303F)
 * - 全角英数・記号 (U+FF01-U+FF60)
 * - 全角括弧など (U+FF5F-U+FF64)
 * - CJK統合漢字拡張B以降 (U+20000-U+2FA1F)
 */
const isFullwidthChar = (char: string): boolean => {
	const code = char.codePointAt(0)
	if (code === undefined) return false

	return (
		(code >= 0x3000 && code <= 0x303F) // CJK記号・句読点（。、・「」など）
		|| (code >= 0x3040 && code <= 0x309F) // ひらがな
		|| (code >= 0x30A0 && code <= 0x30FF) // カタカナ
		|| (code >= 0x3400 && code <= 0x4DBF) // CJK統合漢字拡張A
		|| (code >= 0x4E00 && code <= 0x9FFF) // CJK統合漢字
		|| (code >= 0xF900 && code <= 0xFAFF) // CJK互換漢字
		|| (code >= 0xFF01 && code <= 0xFF60) // 全角英数・記号
		|| (code >= 0xFF5F && code <= 0xFF64) // 全角括弧
		|| (code >= 0xFF65 && code <= 0xFF9F) // 半角カタカナ
		|| (code >= 0x20000 && code <= 0x2FA1F) // CJK統合漢字拡張B以降
	)
}

/**
 * テキストを欧文・和文のセグメントに分割する
 */
export const segmentText = (text: string): TextSegment[] => {
	if (!text) return []

	const segments: TextSegment[] = []
	let currentText = ''
	let currentType: 'ja' | 'latin' | null = null

	for (const char of text) {
		const charType = isFullwidthChar(char) ? 'ja' : 'latin'

		if (currentType === null) {
			currentType = charType
			currentText = char
		}
		else if (charType === currentType) {
			currentText += char
		}
		else {
			segments.push({ text: currentText, type: currentType })
			currentType = charType
			currentText = char
		}
	}

	if (currentText && currentType) {
		segments.push({ text: currentText, type: currentType })
	}

	return segments
}
