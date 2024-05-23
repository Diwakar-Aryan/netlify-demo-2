import { html } from 'code-tag'
import content from '../content.js'
import {
  // parseMd,
  // parseMdBlock,
  writeFile,
  // uniques,
  // attr,
} from '../utilities.js'
import base from '../templates/base.js'
import page from '../templates/page.js'

const slug = 'cart'

export const template = () => {
  return html`
    ${base({
      title: `Wabisabi Project · Cart`,
      description: `The shopping-cart page for Wabisabi Project`,
      body: page({
        body: html`
          <main id="cart">
            <section
              class="layout--container--grid layout--bleeding layout--lining--thick layout--leading--thick"
            >
              <ui--separator custom heavy>
                <h1>Cart</h1>
              </ui--separator>

              <site--cart-page></site--cart-page>
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
