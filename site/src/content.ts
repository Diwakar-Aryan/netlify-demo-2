import fg from 'fast-glob'
import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'

export const categories = [
  'singletons',
  'locations',
  'programs',
  'excursions',
  'workshops',
  'notes',
  'collections',
]

export type Content = {
  categories: string[]
  cms: Record<string, Record<string, matter.GrayMatterFile<string>>>
  custom: Record<string, Record<string, string>>
}

export const readContent = (categories: string[]): Content => ({
  categories,
  cms: Object.fromEntries(
    categories.map((category) => [
      category,
      Object.fromEntries(
        fg.sync(`../content/${category}/*.md`).map((entry) => {
          const slug = path.basename(entry, '.md')
          const data = matter(fs.readFileSync(entry, 'utf8'))
          data.data.slug = slug
          return [slug, data]
        }),
      ),
    ]),
  ),
  custom: Object.fromEntries(
    [
      ...categories.map((category) => [
        category,
        Object.fromEntries(
          fg
            .sync(`../content/${category}/*/index.html`)
            .map(path.dirname)
            .map((entry) => {
              const slug = path.basename(entry)
              const data = fs.readFileSync(`${entry}/index.html`, 'utf8')
              return [slug, data]
            }),
        ),
      ]),
      [
        'projects',
        Object.fromEntries(
          fg
            .sync(`../content/projects/*/index.md`)
            .map((entry) => {
              const slug = path.basename(path.dirname(entry))
              const data = matter(fs.readFileSync(entry, 'utf8'))
              return [slug, data]
            }),
        ),
      ],
    ],
  ),
})

console.log(`Collating contents`)
export default readContent(categories)
