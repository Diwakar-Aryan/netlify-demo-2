import content from '../content.js'
import { writeFile } from '../utilities.js'

export default () => {
  writeFile(
    `./dist/data/singleton/countries.json`,
    JSON.stringify(content.cms.singletons.countries.data, null, 2),
  )
  writeFile(
    `./dist/data/singleton/palettes.json`,
    JSON.stringify(content.cms.singletons.palettes.data, null, 2),
  )
  writeFile(
    `./dist/data/singleton/links.json`,
    JSON.stringify(content.cms.singletons.links.data, null, 2),
  )
}
