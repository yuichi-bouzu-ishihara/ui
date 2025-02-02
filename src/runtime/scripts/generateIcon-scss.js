// scripts/generateIcon-scss.js
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// __dirname の代わりに以下を使用
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const iconsDir = path.join(__dirname, '../assets/bouzu-ui/icons')
const outputScssPath = path.join(__dirname, '../assets/bouzu-ui/icons/_names.scss')

fs.readdir(iconsDir, (err, files) => {
	if (err) {
		console.error('Error reading icons directory:', err)
		process.exit(1)
	}

	const svgFiles = files.filter(file => file.endsWith('.svg'))
	const iconNames = svgFiles.map(file => path.basename(file, '.svg'))

	const scssContent = `$str: "${iconNames.join('", "')}" ;`

	fs.writeFile(outputScssPath, scssContent, (err) => {
		if (err) {
			console.error('Error writing SCSS file:', err)
			process.exit(1)
		}
		console.log('SCSS file generated successfully.')
	})
})
