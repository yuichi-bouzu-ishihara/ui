import path from 'node:path'
import fs from 'node:fs'

// runtimeConfig を生成する関数
export const get = () => {
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
