import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

// package.json の version を取得する関数
function getVersion() {
	try {
		const packageJsonPath = path.resolve(process.cwd(), 'package.json')
		const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
		return pkg.version
	}
	catch (error) {
		console.error('Error reading package.json:', error)
		return 'unknown'
	}
}

// runtimeConfig を生成する関数
export const createRuntimeConfig = () => {
	const __filename = fileURLToPath(import.meta.url)
	const __dirname = path.dirname(__filename)
	dotenv.config({ path: path.resolve(__dirname, '../env/.env') })
	const env = process.env

	const publicConfig = Object.entries(env).reduce((acc, [key, value]) => {
		if (key.startsWith('PUBLIC_')) {
			acc[key.replace('PUBLIC_', '')] = value
		}
		return acc
	}, {} as Record<string, string | undefined>)

	const privateConfig = Object.entries(env).reduce((acc, [key, value]) => {
		if (key.startsWith('PRIVATE_')) {
			acc[key.replace('PRIVATE_', '')] = value
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
