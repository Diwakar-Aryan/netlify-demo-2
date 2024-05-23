import { html } from 'code-tag'
import content from '../content.js'
import { writeFile } from '../utilities.js'
import base from '../templates/base.js'
import page from '../templates/page.js'

const slug = '404'

export const template = () => {
  return html`
    ${base({
      title: `Wabisabi Project · Cart`,
      description: `Error 404`,
      body: page({
        body: html`
          <main>
            <section
              class="layout--container--grid layout--bleeding layout--lining--thick layout--leading--thick"
            >
              <ui--separator custom heavy>
                <h1>Not Found</h1>
                <h5 slot="sub">Error 404</h5>
              </ui--separator>
              <p>
                We could not find the content you're looking for. Are you sure
                it exists?
              </p>
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
