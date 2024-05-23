import { html } from 'code-tag'
import content from '../content.js'
import { parseMdBlock, writeFile } from '../utilities.js'
import base from '../templates/base.js'
import page from '../templates/page.js'

const slug = 'returns'

export const template = () => {
  return html`
    ${base({
      title: `Wabisabi Project · ${content.cms.singletons[slug].data.title}`,
      description: content.cms.singletons[slug].data.description,
      body: page({
        body: html`
          <main
            class="layout--container--grid --article layout--bleeding layout--lining"
          >
            ${parseMdBlock(content.cms.singletons[slug].content)}
          </main>
        `,
        currentPage: `/${slug}`,
      }),
    })}
  `
}

export default () => {
  const path = `./dist/${slug}.html`
  console.log(`Generating ${path}`)
  writeFile(`./dist/${slug}.html`, template())
}
