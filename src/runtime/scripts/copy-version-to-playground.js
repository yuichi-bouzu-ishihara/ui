import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// __dirname の代わりに以下を使用
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 各 package.json のパスを設定
const rootPackageJsonPath = path.join(__dirname, '../../../package.json')
const playgroundPackageJsonPath = path.join(__dirname, '../../../playground/package.json')

// ルートの package.json を読み込み
fs.readFile(rootPackageJsonPath, 'utf-8', (err, data) => {
	if (err) {
		console.error('Error reading root package.json:', err)
		process.exit(1)
	}

	const rootPackageJson = JSON.parse(data)
	const version = rootPackageJson.version

	// playground/package.json を読み込み
	fs.readFile(playgroundPackageJsonPath, 'utf-8', (err, data) => {
		if (err) {
			console.error('Error reading playground package.json:', err)
			process.exit(1)
		}

		const playgroundPackageJson = JSON.parse(data)
		playgroundPackageJson.version = version

		// playground/package.json に書き込み
		fs.writeFile(playgroundPackageJsonPath, JSON.stringify(playgroundPackageJson, null, 2), (err) => {
			if (err) {
				console.error('Error writing playground package.json:', err)
				process.exit(1)
			}
			console.log('Version copied to playground package.json successfully.')
		})
	})
})
