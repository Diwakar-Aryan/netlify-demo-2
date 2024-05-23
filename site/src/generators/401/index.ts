import { html } from 'code-tag'
import content from '../../content.js'
import { writeFile } from '../../utilities.js'
import base from '../../templates/base.js'
import page from '../../templates/page.js'

const slug = '401'

export const template = () => {
  return html`
    ${base({
      title: `Wabisabi Project · Cart`,
      body: page({
        body: html`
          <main>
            <section
              class="layout--container--grid --article layout--bleeding layout--lining--thick layout--leading--thick"
            >
              <ui--separator custom heavy style="grid-column-end: -2;">
                <h1>Unauthenticated</h1>
                <h5 slot="sub">Error 401</h5>
              </ui--separator>
              <p>Please authenticate before accessing this content.</p>
            </section>
          </main>
        `,
        palette: content.cms.singletons.palettes.data.neutral,
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
