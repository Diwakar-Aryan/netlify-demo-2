import { html } from 'code-tag'
import content from '../content.js'
import { writeFile } from '../utilities.js'
import base from '../templates/base.js'
import page from '../templates/page.js'

const slug = '403'

export const template = () => {
  return html`
    ${base({
      title: `Wabisabi Project · Cart`,
      description: `Error 403`,
      body: page({
        body: html`
          <main>
            <section
              class="layout--container--grid layout--bleeding layout--lining--thick layout--leading--thick"
            >
              <ui--separator custom heavy>
                <h1>Access Denied</h1>
                <h5 slot="sub">Error 403</h5>
              </ui--separator>
              <p>You do not have access to the content you're looking for.</p>
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
