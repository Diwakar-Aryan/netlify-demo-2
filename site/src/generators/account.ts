import { html } from 'code-tag'
import content from '../content.js'
import { writeFile } from '../utilities.js'
import base from '../templates/base.js'
import page from '../templates/page.js'
import coverPartial from '../partials/cover.js'

const slug = 'account'
const account = content.cms.singletons.account

export const template = () => {
  return html`
    ${base({
      title: `Wabisabi Project · ${slug}`,
      description: account.data.description,
      body: page({
        body: html`
          <main>
            ${coverPartial({ cover: account.data.cover, title: 'Account' })}

            <section
              id="blurb"
              class="layout--container--grid --article layout--bleeding layout--leading--thick layout--lining--thick"
            >
              <div class="layout--container--flex">
                <img id="user_picture" alt="user's profile picture"></img>
                <div class="layout--leading">
                  <h3 id="user_name">User Name</h3>
                  <p id="user_details">Logging in...</p>
                </div>
              </div>

              <aside class="layout--leading">
                <ui--button
                  class="account--button"
                  style="--ui--base--palette--paper: currentColor;"
                  stretch
                  tabindex="0"
                  featured
                  tier="secondary"
                  icon-start="logout"
                  target="_self"
                  onclick="document.dispatchEvent(new CustomEvent('logout', { bubbles: true }))"
                >
                  Log out
                </ui--button>
              </aside>

              <style>
                #blurb {
                  background: var(--palette--primary);
                  color: var(--palette--lightest);
                }
                #blurb #user_picture {
                  width: 4rem;
                }
                #blurb #user_picture:not([src]) {
                  display: none;
                }
              </style>
            </section>

            <!-- No notes means no need for library yet -->
            <!-- <section
              class="layout--container--grid layout--bleeding layout--leading--thick layout--lining--thick"
              id="library"
            >
              <h3>The Library</h3>
              <site--library></site--library>
            </section> -->

            <script>
                const displayUserProfile = (profile) => {
                  if (profile) {
                    document.querySelector('#user_name').innerText =
                      profile.name ?? profile.nickname ?? 'User Profile'
                    document.querySelector('#user_details').innerText =
                      profile.email
                    if (profile.picture)
                      document.querySelector('#user_picture').src =
                      profile.picture
                  }
                }

              document.addEventListener('readystatechange', (event) => {
                displayUserProfile(document.querySelector('site--header').user_profile)
                document.dispatchEvent(
                  new CustomEvent('login', {
                    bubbles: true,
                  }),
                )
              })

              document.addEventListener('loggedthru', (event) => {
                displayUserProfile(event.detail)
              })
            </script>
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
