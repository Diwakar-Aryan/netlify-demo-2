import content from '../content.js'
import { cpDir, writeFile } from '../utilities.js'
import fs from 'fs'
import base from '../templates/base.js'
import page from '../templates/page.js'


export default () => {
  cpDir(`../content/projects`, `./dist/projects`)

  Object.entries(content.custom.projects)
    .forEach(([projectSlug, projectData]) => {
      const project = projectData as any
      project.data.pages.forEach((subpage: { title: string, description: string, slug: string, palette: { primary: string, secondary: string } }) => {
        writeFile(
          `./dist/projects/${projectSlug}/${subpage.slug}.html`,
          base({
            title: `Wabisabi Project · Projects · ${project.data.title} · ${subpage.title}`,
            description: subpage.description,
            body: page({
              body: fs.readFileSync(`../content/projects/${projectSlug}/${subpage.slug}.html`, 'utf8'),
              palette: subpage.palette,
              currentPage: `/projects/${projectSlug}`,
            })
          }),
        )
      })
    })
}