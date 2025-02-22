/**
 * 日時関連の関数をまとめたファイル
 */

export const useDate = () => {
	return {
		format,
		localize,
		elapsed,
	}
}

/**
 * 日時の文字列を指定したフォーマットの文字列で返す
 * @param {string} date - 2021-10-11 13:45:16 こんなフォーマットの文字列。APIから来たものそのまま
 * @param {string} format - 書式フォーマット。yyyyMMDD、yyyy-MM-dd HH:MM:SS など。y:年、M：月、d：日、H:時間、m：分、s：秒、S：ミリ秒
 * @see https://zukucode.com/2017/04/javascript-date-format.html
 * @returns yyyyMMdd -> "20170102"、HH:mm:ss:SSS -> "03:04:05:006"、など
 */
const format = (date: string, format: string) => {
	const d = new Date(date)
	format = format.replace(/yyyy/g, `${d.getFullYear()}`)
	format = format.replace(/MM/g, ('0' + (d.getMonth() + 1)).slice(-2))
	format = format.replace(/dd/g, ('0' + d.getDate()).slice(-2))
	format = format.replace(/HH/g, ('0' + d.getHours()).slice(-2))
	format = format.replace(/mm/g, ('0' + d.getMinutes()).slice(-2))
	format = format.replace(/ss/g, ('0' + d.getSeconds()).slice(-2))
	format = format.replace(/SSS/g, ('00' + d.getMilliseconds()).slice(-3))
	format = format.replace(/M/g, `${d.getMonth() + 1}`)
	format = format.replace(/d/g, `${d.getDate()}`)
	format = format.replace(/H/g, `${d.getHours()}`)
	format = format.replace(/m/g, `${d.getMinutes()}`)
	format = format.replace(/s/g, `${d.getSeconds()}`)
	format = format.replace(/S/g, `${d.getMilliseconds()}`)
	return format
}

/**
 * 日付データを指定したローカル言語でフォーマットする。
 * @param {string} dateString 変換する日付データ文字列。 ex) 2021-01-01T01:01:01.000000Z
 * @param {boolean} [showTime] 時間を表示するかどうか
 * @param {string} [local] 変換するローカル言語。 ex) ja-JP
 * @returns {string} ローカル言語でフォーマットされた日付データ文字列。 ex) 2021年1月1日
 */
const localize = (dateString: string, showTime = false, local = 'ja-JP') => {
	const date = new Date(dateString)
	const formatter = new Intl.DateTimeFormat(local, {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: showTime ? '2-digit' : undefined,
		minute: showTime ? '2-digit' : undefined,
		hour12: false,
	})
	return formatter.format(date)
}

/**
 * 指定された日時から経過時間を n分前・n時間前・n日前・n週間前・nヶ月前・n年前 の形式で返す
 * @param {string} date - 2021-10-11 13:45:16 こんなフォーマットの文字列。APIから来たものそのまま
 * @returns 経過時間文字列 (例: "2 days ago"、"3 weeks ago"、"4 months ago"、"1 year ago")
 */
const elapsed = (date: string) => {
	const now = new Date()
	const past = new Date(date)
	const diffMs = now.getTime() - past.getTime()

	const minutes = Math.floor(diffMs / (1000 * 60))
	const hours = Math.floor(minutes / 60)
	const days = Math.floor(hours / 24)
	const weeks = Math.floor(days / 7)
	const months = Math.floor(now.getMonth() - past.getMonth() + 12 * (now.getFullYear() - past.getFullYear()))
	const years = Math.floor(months / 12)

	if (years > 0) {
		return `${years}年前`
	}
	else if (months > 0) {
		return `${months}ヶ月前`
	}
	else if (weeks > 0) {
		return `${weeks}週間前`
	}
	else if (days > 0) {
		return `${days}日前`
	}
	else if (hours > 0) {
		return `${hours}時間前`
	}
	else if (minutes > 0) {
		return `${minutes}分前`
	}
	else {
		return '今'
	}
}
