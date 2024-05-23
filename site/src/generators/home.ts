import { html } from 'code-tag'
import content from '../content.js'
import { parseMd, parseMdBlock, writeFile } from '../utilities.js'
import base from '../templates/base.js'
import page from '../templates/page.js'

export const template = () => {
  const home = content.cms.singletons.home

  return html`
    ${base({
      title: 'Wabisabi Project',
      description: home.data.description,
      body: page({
        body: html`
          <main>

            <section id="cover" class="layout--container--stack">
              <color--grading no-normal no-addition no-muliply>
                <img src="${home.data.cover}" alt=""></img>
              </color--grading>

              <div class="layout--container--grid layout--bleeding layout--lining">
              </div>

              <style>
                #cover {
                  align-items: center;
                  color: var(--palette--lightest);
                  --color--grading--intensity: 0.25;
                }
                #cover img {
                  width: 100%;
                  aspect-ratio: 16 / 9;
                  object-fit: cover;
                }
                @media (max-width: 714px) {
                  #cover img {
                    aspect-ratio: 1 / 1;
                  }
                }
              </style>
            </section>
            
            <section
              id="blurb"
              class="layout--container--grid --article layout--bleeding layout--leading--thick layout--lining--thick"
            >
              <div class="layout--container--grid --article">
                <blockquote>${parseMdBlock(home.data.blurb)}</blockquote>
              </div>

              <aside>${parseMd(home.data.callout)}</aside>

              <style>
                #blurb {
                  background: var(--palette--secondary--paper);
                  color: var(--palette--secondary--ink);
                }
              </style>
            </section>
            
            <section
              id="copy"
              class="layout--container--grid --article layout--bleeding layout--leading--thick layout--lining--thick"
            >
            ${parseMdBlock(home.content)}

              <style>
                #copy {
                  background: var(--palette--neutral-1--paper);
                  color: var(--palette--neutral--ink);
                }
              </style>
            </section>
            
            <section
              id="projects"
              class="layout--container--grid --article layout--bleeding layout--leading--thick layout--lining--thick"
            >
              <style>
                #projects {
                  display: none;
                }
              </style>
            </section>
          </main>
        `,
        currentPage: '/',
      }),
    })}
  `
}

export default () => {
  const path = `./dist/index.html`
  console.log(`Generating ${path}`)
  writeFile(`./dist/index.html`, template())
}
