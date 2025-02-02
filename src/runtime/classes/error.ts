/**
 * CustomError
 * 主に、 ModalError で表示するためのインターフェース
 */
export class CustomError extends Error {
	constructor(
		public code: CustomErrorCode, // エラーコード
		public override message: string, // エラーメッセージ
		public title?: string, // エラータイトル
		public button?: string, // ボタンラベル
		public redirect?: string, // リダイレクト先 back で一つ前のページに戻る。それ以外は path　を指定する。
	) {
		super(message)
		this.name = 'CustomError' // ここで name を設定

		if (code == CustomErrorCode.NetworkError) {
			this.message = message ? message : !title ? 'NetworkError エラーメッセージ' : ''
			this.title = title || 'NetworkError タイトル'
		}
		else if (code == CustomErrorCode.ValidationError) {
			this.message = message ? message : !title ? 'ValidationError エラーメッセージ' : ''
			this.title = title || 'ValidationError タイトル'
		}
		else if (code == CustomErrorCode.UnknownError) {
			this.message = message ? message : !title ? 'UnknownError エラーメッセージ' : ''
			this.title = title || 'UnknownError タイトル'
		}
		else if (code == CustomErrorCode.BadRequest) {
			this.message = message ? message : !title ? 'BadRequest エラーメッセージ' : ''
			this.title = title || 'BadRequest タイトル'
		}
		else if (code == CustomErrorCode.AuthorizationRequired) {
			this.message = message ? message : !title ? 'AuthorizationRequired エラーメッセージ' : ''
			this.title = title || 'AuthorizationRequired タイトル'
		}
		else if (code == CustomErrorCode.Forbidden) {
			this.message = message ? message : !title ? 'Forbidden エラーメッセージ' : ''
			this.title = title || 'Forbidden タイトル'
		}
		else if (code == CustomErrorCode.NotFound) {
			this.message = message ? message : !title ? 'NotFound エラーメッセージ' : ''
			this.title = title || 'NotFound タイトル'
		}
		else if (code == CustomErrorCode.MethodNotAllowed) {
			this.message = message ? message : !title ? 'MethodNotAllowed エラーメッセージ' : ''
			this.title = title || 'MethodNotAllowed タイトル'
		}
		else if (code == CustomErrorCode.TooManyRequests) {
			this.message = message ? message : !title ? 'TooManyRequests エラーメッセージ' : ''
			this.title = title || 'TooManyRequests タイトル'
		}
		else if (code == CustomErrorCode.ServerError) {
			this.message = message ? message : !title ? 'ServerError エラーメッセージ' : ''
			this.title = title || 'ServerError タイトル'
		}
		else if (code == CustomErrorCode.EmailAlreadyTaken) {
			this.message = message ? message : !title ? 'EmailAlreadyTaken エラーメッセージ' : ''
			this.title = title || 'EmailAlreadyTaken タイトル'
		}
		else if (code == CustomErrorCode.SnsLoginError) {
			this.message = message ? message : !title ? 'SnsLoginError エラーメッセージ' : ''
			this.title = title || 'SnsLoginError タイトル'
		}
		else if (code == CustomErrorCode.Unknown) {
			this.message = message ? message : !title ? 'Unknown エラーメッセージ' : ''
			this.title = title || 'Unknown タイトル'
		}
		else if (code == CustomErrorCode.StripeError) {
			this.message = message ? message : !title ? 'Stripe Error エラーメッセージ' : ''
			this.title = title || 'Stripe Error タイトル'
		}
		else if (code == CustomErrorCode.GoogleLoginError) {
			this.message = message ? message : !title ? 'Google Login Error エラーメッセージ' : ''
			this.title = title || 'Google Login Error タイトル'
		}
		else {
			this.message = '未定義エラー'
			this.title = 'このエラーコードは未定義です。'
		}
	}

	/**
	 * エラーオブジェクトを受け取り、CustomErrorインスタンスを返す静的メソッド
	 * @param error 任意のエラーオブジェクト
	 * @returns CustomErrorインスタンス
	 */
	static fromError(error: any): CustomError {
		if (error instanceof CustomError) {
			return error
		}
		else {
			// エラーコードが未定義の場合、'Unknown Error'として扱う
			const errorCode = error.code || CustomErrorCode.UnknownError
			const errorMessage = error.message || '未知のエラーが発生しました。'
			return new CustomError(errorCode, errorMessage)
		}
	}
}

export enum CustomErrorCode {
	NetworkError = 'Network Error',
	ValidationError = 'Validation Error',
	UnknownError = 'Unknown Error',
	BadRequest = 400,
	AuthorizationRequired = 401,
	Forbidden = 403,
	NotFound = 404,
	MethodNotAllowed = 405,
	TooManyRequests = 429,
	ServerError = 500,
	EmailAlreadyTaken = 'RGS001',
	SnsLoginError = 'RGS002',
	DisabledInviteCode = 'RGS003', // 無効な招待コード
	Unknown = 'ERR000',
	StripeError = 'Stripe Error',
	GoogleLoginError = 'Google Login Error',
}

/**
 * Nuxt Error
 * error.vue の props.error で渡されるエラー Object。
 * export されてはいないのだろうか？ 公式のエラーハンドリングページにも記載なし。
 * @see https://nuxt.com/docs/getting-started/error-handling
 */
export class NuxtError extends Error {
	constructor(
		public url: string, // エラーが起こったURL
		public statusCode: number, // エラーコード
		public statusMessage: string, // エラーメッセージ
		public override message: string, // エラーメッセージ
		public override stack: string, // ?? 不明。
	) {
		super(message)
	}
}
