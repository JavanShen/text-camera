import { copyFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const resPath = (p) => resolve(__dirname, p)

copyFileSync(resPath('../node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js'), resPath('../dist/webcomponents-bundle.js'))