import * as dotenv from 'dotenv'
import utilities from './utilities.js'
import generators from './generators/index.js'

dotenv.config()

utilities.rm('./dist')
utilities.cpDir('../media', './dist/media')
utilities.cpDir('../library', './dist/library')
utilities.cpDir('../content', './dist/content', [
  '../content/index.html',
  '../content/config.yml',
])

await Promise.all(Object.values(generators).map((generator) => generator()))

console.log(`Built site on ${Date().toLocaleString()}`)
