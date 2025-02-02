import path from 'node:path'
import fs from 'node:fs'
import dotenv from 'dotenv'

// package.json の version を取得する関数
function getVersion() {
	const packageJsonPath = path.resolve(process.cwd(), 'package.json')
	const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
	return pkg.version
}

// runtimeConfig を生成する関数
export function createRuntimeConfig() {
	dotenv.config({ path: path.resolve(__dirname, '../env/.env') })
	const env = process.env

	const publicConfig = Object.entries(env).reduce((acc, [key, value]) => {
		if (key.startsWith('PUBLIC_')) {
			acc[key] = value
		}
		return acc
	}, {} as Record<string, string | undefined>)

	const privateConfig = Object.entries(env).reduce((acc, [key, value]) => {
		if (key.startsWith('PRIVATE_')) {
			acc[key] = value
		}
		return acc
	}, {} as Record<string, string | undefined>)

	return {
		...privateConfig,
		public: {
			...publicConfig,
			VERSION: getVersion(),
		},
	}
}