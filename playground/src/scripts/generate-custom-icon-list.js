// scripts/generateIcon-list.js
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// __dirname の代わりに以下を使用
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const iconsDir = path.join(__dirname, '../public/assets/icons')
const outputFilePath = path.join(__dirname, '../assets/custom-icon-list.json')

fs.readdir(iconsDir, (err, files) => {
	if (err) {
		console.error('Error reading icons directory:', err)
		process.exit(1)
	}

	const svgFiles = files.filter(file => file.endsWith('.svg'))
	const iconList = svgFiles.map(file => path.basename(file, '.svg'))

	fs.writeFile(outputFilePath, JSON.stringify(iconList, null, 2), (err) => {
		if (err) {
			console.error('Error writing icon list file:', err)
			process.exit(1)
		}
		console.log('Icon list generated successfully.')
	})
})
