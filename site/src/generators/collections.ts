import { html } from 'code-tag'
import content from '../content.js'
import { parseMdBlock, writeFile } from '../utilities.js'
import base from '../templates/base.js'
import page from '../templates/page.js'
import coverPartial from '../partials/cover.js'


export const indexTemplate = () => {
  const collections = content.cms.singletons.collections

  return html`
    ${base({
    title: `Wabisabi Project · Collections`,
    description: collections.data.description,
    body: page({
      body: html`
        <main>
          ${coverPartial({ cover: collections.data.cover, title: 'Collections' })}

          <section id="blurb" class="layout--container--grid --article layout--bleeding layout--leading--thick layout--lining--thick">
            <div class="layout--container--grid --article">
              <blockquote>${parseMdBlock(collections.data.blurb)}</blockquote>

              ${parseMdBlock(collections.content)}
            </div>

            <aside>${parseMdBlock(collections.data.callout)}</aside>

            <style>
              #blurb {
                background: var(--palette--primary);
                color: var(--palette--lightest);
              }
            </style>
          </section>

          <!-- <section id="collections"> -->
          <section id="collections">
            <style>
              #collections {
                scroll-snap-type: y mandatory;
                display: grid;
                gap: var(--m4);
                background: var(--palette--primary);
              }
              #collections > section {
                color: var(--palette--lightest);
                display: block;
                width: 100%;
                transition: filter 300ms;
                scroll-snap-align: start;
              }
              #collection > section .collection--heading {
                align-items: center;
              }
              #collections > section > div {
                z-index: 100;
              }
              #collections ui--button {
                --ui--base--palette--paper: var(--palette--lightest);
                --ui--base--palette--ink: var(--palette--primary);
              }
              #collections .collection--content > .token--label--big > a {
                text-decoration: none;
              }
              @media (width < 714px) {
                .collection--content > .layout--span--minor {
                  grid-column: copy-start / span 1;
                }
                .collection--content > .layout--span--minute.--end {
                  grid-column: span 1 / copy-end;
                }
              }
              @media (width >= 714px) {
                #collections > section {
                  display: grid;
                }
                #collections > section > img {
                  filter: brightness(66%);
                }
                #collections > section > .collection--content {
                  padding-top: var(--m4);
                }
              }
            </style>

            <section class="collection layout--container--stack">
              <img src="/media/galleries/collections/Jajam-Spread-Wabisabi-Project-1.jpg" alt=""></img>
              <div class="collection--content layout--container--grid --article layout--bleeding layout--lining--thick">
                <div class="collection--content layout--span--copy layout--container--grid --article">
                  <span class="token--label--big layout--span--minor"><a href="/collections/jajam-chaupad">Jajam Spread</a></span>
                  <ui--button
                    class="layout--span--minute --end"
                    slot="sub" 
                    tier="primary"
                    stretch
                    link 
                    href="/collections/jajam-chaupad" 
                    target="_blank" 
                  >
                    Learn More
                  </ui--button>
                </div>
                <p>As meeting spaces for people go missing in our urban lifestyles, this textile brings back purposeful or aimless congregations with our loved ones.</p>
              </div>
            </section>

            <!-- <section class="collection layout--container--stack">
              <img src="/media/galleries/collections/Table-Cover-Bagru-Print-in-Jajam-Collection.jpg" alt=""></img>
              <div class="collection--content layout--container--grid --article layout--bleeding layout--lining--thick">
                <div class="collection--content layout--span--copy layout--container--grid --article">
                  <span class="token--label--big layout--span--minor"><a href="/collections/table-cloth-small">Interlude</a></span>
                  <ui--button
                    class="layout--span--minute --end"
                    slot="sub" 
                    tier="primary"
                    stretch
                    link 
                    href="/collections/table-cloth-small" 
                    target="_blank" 
                  >
                    Learn More
                  </ui--button>
                </div>
                <p>Creating time and space to come together, to play and have conversations. Take a break with this table cover cum game board.</p>
              </div>
            </section> -->

            <section class="collection layout--container--stack">
              <img src="/media/galleries/collections/Procession-through-town-bedsheet.jpg" alt=""></img>
              <div class="collection--content layout--container--grid --article layout--bleeding layout--lining--thick">
                <div class="collection--content layout--span--copy layout--container--grid --article">
                  <span class="token--label--big layout--span--minor"><a href="/collections/bedsheet-procession">Procession through Town</a></span>
                  <ui--button
                    class="layout--span--minute --end"
                    slot="sub" 
                    tier="primary"
                    stretch
                    link 
                    href="/collections/bedsheet-procession" 
                    target="_blank" 
                  >
                    Learn More
                  </ui--button>
                </div>
                <p>A bedsheet design about balance of old characteristic royal processions and ambiguous city spaces.</p>
              </div>
            </section>

            <section class="collection layout--container--stack">
              <img src="/media/galleries/collections/Chaupad-board-game-Jajam-Collection.jpg" alt=""></img>
              <div class="collection--content layout--container--grid --article layout--bleeding layout--lining--thick">
                <div class="collection--content layout--span--copy layout--container--grid --article">
                  <span class="token--label--big layout--span--minor"><a href="/collections/chaupad">Chaupad Game</a></span>
                  <ui--button
                    class="layout--span--minute --end"
                    slot="sub" 
                    tier="primary"
                    stretch
                    link 
                    href="/collections/chaupad" 
                    target="_blank" 
                  >
                    Learn More
                  </ui--button>
                </div>
                <p>Enjoy tossing cowrie shells into the air and racing the tokens around a four-arm path of the ancient Indian game of chaupad.</p>
              </div>
            </section>
          </section>
          <!-- </section> -->
        </main>

        
      `,
      palette: collections.data.palette,
      currentPage: '/collections',
    }),
  })}
  `
}

export const entryTemplate = (slug: string) => {
  const collection = content.cms.collections[slug]

  return html`
    ${base({
    title: `Wabisabi Project · ${collection.data.title}`,
    description: collection.data.description,
    body: page({
      body: collection.content,
      palette: collection.data.palette,
      currentPage: '/collections',
    }),
  })}
  `
}

export default () => {
  // index
  const path = `./dist/collections`
  console.log(`Generating ${path}`)
  writeFile(`${path}/index.html`, indexTemplate())
  // entries
  Object.keys(content.cms.collections).forEach((slug) => {
    const path = `./dist/collections/${slug}`
    console.log(`Generating ${path}`)
    writeFile(`${path}/index.html`, entryTemplate(slug))
  })
}
