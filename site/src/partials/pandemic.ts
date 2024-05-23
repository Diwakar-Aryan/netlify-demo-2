import { html } from 'code-tag'
import content from '../content.js'
import { parseMdBlock } from '../utilities.js'

export default () =>
  html`
    <section
      id="pandemic"
      class="layout--span--bleed layout--container--grid --article layout--bleeding layout--lining layout--lining--thick"
    >
      <h3>${content.cms.singletons.pandemic.data.title}</h3>
      ${parseMdBlock(content.cms.singletons.pandemic.content)}

      <style>
        #pandemic {
          background: var(--palette--secondary);
          color: var(--palette--primary);
        }
      </style>
    </section>
  `
