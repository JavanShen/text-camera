import archiver from 'archiver'
import { resPath } from './utils.js'
import { createWriteStream, readdirSync, createReadStream } from 'fs'

const output = createWriteStream(resPath('../text-camera-extension.zip'))
const archive = archiver('zip')

archive.pipe(output)

const dirPath = resPath('../dist')
const files = readdirSync(dirPath)

for (const path of files) {
    const file = createReadStream(dirPath + '/' + path)
    archive.append(file, { name: path })
}

archive.finalize()
