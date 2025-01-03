import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

export const __dirname = dirname(fileURLToPath(import.meta.url))

export const resPath = (p) => resolve(__dirname, p)