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
		public redirect?: string, // リダイレクト先 back で一つ前のページに戻る。それ以外は path を指定する。
	) {
		super(message)
		this.name = 'CustomError' // ここで name を設定

		// message が空の場合でもデフォルトメッセージを設定
		if (!message) {
			if (code == CustomErrorCode.NetworkError) {
				this.message = 'Network Error'
			}
			else if (code == CustomErrorCode.ValidationError) {
				this.message = 'Validation Error'
			}
			else if (code == CustomErrorCode.UnknownError) {
				this.message = 'Unknown Error'
			}
			else if (code == CustomErrorCode.BadRequest) {
				this.message = 'Bad Request'
			}
			else if (code == CustomErrorCode.AuthorizationRequired) {
				this.message = 'Authorization Required'
			}
			else if (code == CustomErrorCode.Forbidden) {
				this.message = 'Forbidden'
			}
			else if (code == CustomErrorCode.NotFound) {
				this.message = 'Not Found'
			}
			else if (code == CustomErrorCode.MethodNotAllowed) {
				this.message = 'Method Not Allowed'
			}
			else if (code == CustomErrorCode.TooManyRequests) {
				this.message = 'Too Many Requests'
			}
			else if (code == CustomErrorCode.ServerError) {
				this.message = 'Internal Server Error'
			}
			else if (code == CustomErrorCode.Unknown) {
				this.message = 'Unknown'
			}
			else {
				this.message = 'Undefined error'
			}
		}

		// title が空の場合でもデフォルトタイトルを設定
		if (!title) {
			if (code == CustomErrorCode.NetworkError) {
				this.title = 'Network Error'
			}
			else if (code == CustomErrorCode.ValidationError) {
				this.title = 'Validation Error'
			}
			else if (code == CustomErrorCode.UnknownError) {
				this.title = 'Unknown Error'
			}
			else if (code == CustomErrorCode.BadRequest) {
				this.title = 'Bad Request'
			}
			else if (code == CustomErrorCode.AuthorizationRequired) {
				this.title = 'Authorization Required'
			}
			else if (code == CustomErrorCode.Forbidden) {
				this.title = 'Forbidden'
			}
			else if (code == CustomErrorCode.NotFound) {
				this.title = 'Not Found'
			}
			else if (code == CustomErrorCode.MethodNotAllowed) {
				this.title = 'Method Not Allowed'
			}
			else if (code == CustomErrorCode.TooManyRequests) {
				this.title = 'Too Many Requests'
			}
			else if (code == CustomErrorCode.ServerError) {
				this.title = 'Internal Server Error'
			}
			else if (code == CustomErrorCode.Unknown) {
				this.title = 'Unknown'
			}
			else {
				this.title = 'Undefined error'
			}
		}
	}

	/**
	 * エラーオブジェクトを受け取り、CustomErrorインスタンスを返す静的メソッド
	 * @param error 任意のエラーオブジェクト
	 * @returns CustomErrorインスタンス
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static fromError(error: any): CustomError {
		if (error instanceof CustomError) {
			return error
		}
		else {
			// エラーコードが未定義の場合、'Unknown Error'として扱う
			const errorCode = error.code || CustomErrorCode.UnknownError
			const errorMessage = error.message || 'Unknown error'
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
	Unknown = 'ERR000',
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
