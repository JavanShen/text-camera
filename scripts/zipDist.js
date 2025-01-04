import archiver from 'archiver'
import { resPath } from './utils.js'
import { createWriteStream, readdirSync, createReadStream, lstatSync } from 'fs'

const output = createWriteStream(resPath('../text-camera-extension.zip'))
const archive = archiver('zip')

archive.pipe(output)

const dirPath = resPath('../dist')
const files = readdirSync(dirPath)

for (const fileName of files) {
    const path = dirPath + '/' + fileName

    if (lstatSync(path).isFile()) {
        const file = createReadStream(path)
        archive.append(file, { name: fileName })
    } else {
        archive.directory(path, fileName)
    }
}

archive.finalize()
