import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

const NAME = 'site--header'
export const tagName = NAME
@customElement(NAME)
export class SiteHeader extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: sticky;
      top: 0;
      width: 100%;
      z-index: 1000;
      transform: translateZ(0px);
    }

    header {
      position: relative;
      background: #fff9;
      color: #000;
      transition: background 1s ease;
      backdrop-filter: blur(8px);
      // border-bottom: 2px solid #0003; // Too gauche
      margin-bottom: -2px;
      --palette--primary--paper: #000;
    }
    header:hover {
      background: #fff;
    }
    header.layout--container--grid {
      grid-template-rows: auto 1fr;
      gap: 0;
    }
    @media (max-width: 714px) {
      header.is-open {
        min-height: 100vh;
      }
    }

    header nav {
      padding-block: 1em;
    }

    header a {
      text-decoration: none;
      font-weight: 600;
    }
    header a:hover {
      opacity: 33%;
    }
    header ul {
      list-style: none;
      margin: 0;
    }
    header .token--label--default {
      font-weight: 300;
    }

    header .layout--container--grid layout--lining {
      padding-block: var(--m0);
    }
    header .layout--spread {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    header .layout--container--flex {
      gap: var(--m1);
    }

    header
      *:is(ui--button[no-label], logo--element, site--cart, site--account) {
      font-size: 1.25em;
    }

    header .only--large {
      display: none;
    }
    @media (min-width: 1428px) {
      header .only--large {
        display: unset;
      }
      header .only--small {
        display: none;
      }
    }

    header .overlay {
      display: flex;
      justify-content: space-between;
      gap: var(--m2);
      flex-wrap: wrap;
    }

    header .overlay > *:nth-child(even) {
      text-align: right;
    }
    header .overlay a {
      font-weight: 700;
    }
    header .overlay > div {
      width: 40%;
    }
    header .overlay ul {
      padding-top: var(--m1);
      gap: var(--m1);
    }

    .page {
      opacity: 50%;
    }
    .page.current-page {
      opacity: 100%;
    }

    .only--open {
      opacity: 0;
    }
  `

  get user_profile() {
    return JSON.parse(localStorage.getItem('user_profile') ?? 'null')
  }

  get cart_items() {
    return this.shadowRoot?.querySelector('site--cart')?.items
  }

  @property({ reflect: true, type: Object })
  sitemap = {
    Projects: {
      Jajam: '#',
      'Natural Dye': '#',
    },
    Platform: {
      Workshop: '#',
    },
  }

  @property({ attribute: 'current-page', reflect: true, type: String })
  currentPage = ''

  @property({ state: true, type: Boolean })
  isOpen = false

  render() {
    return html`
      <link href="/library/styles.css" rel="stylesheet" />
      <header class="layout--container--grid ${this.isOpen ? 'is-open' : ''}">
        <nav class="layout--container--grid layout--bleeding">
          <div class="layout--spread">
            <section
              class="layout--container--flex"
              style="margin-left: -0.5em;"
            >
              <ui--button
                tabindex="0"
                tier="tertiary"
                link
                href="/"
                target="_self"
                aria-label="landing page"
              >
                <logo--element
                  nomark
                  style="padding-top: 0.2em; margin-right: -0.1em;"
                ></logo--element>
              </ui--button>

              <!-- Projects  -->
              ${Object.entries(this.sitemap['Projects']).map(
                ([name, url]) =>
                  html`<ui--button
                    class="only--large page ${this.currentPage === url
                      ? 'current-page'
                      : ''}"
                    tabindex="0"
                    tier="tertiary"
                    link
                    href="${url}"
                    target="_self"
                  >
                    ${name}
                  </ui--button>`,
    )}
            </section>

            <section
              class="layout--container--flex"
              style="margin-right: -0.25em;"
            >
              <!-- Platform  -->
              ${Object.entries(this.sitemap['Platform']).map(
                ([name, url]) =>
                  html`<ui--button
                    class="page only--large ${this.currentPage === url
                      ? 'current-page'
                      : ''}"
                    tabindex="0"
                    tier="tertiary"
                    link
                    href="${url}"
                    target="_self"
                  >
                    ${name}
                  </ui--button>`,
              )}

              <!-- Dashboard -->
              <site--cart></site--cart>

              <site--account></site--account>

              <div
                class="only--small"
                style="width: 2px; height: 1em; background: #0003;"
              ></div>

              <ui--button
                @click=${() => {
                  this.isOpen = !this.isOpen
                  setTimeout(() => {
                    if (this.isOpen) {
                      ;[
                        ...(this.shadowRoot?.querySelectorAll('.only--open') ??
                          []),
                      ].forEach((element) =>
                        element.animate([{ opacity: '100%' }], {
                          duration: 200,
                          easing: 'ease-out',
                          fill: 'forwards',
                        }),
                      )
                    }
                  }, 0)
                }}
                class="menu--button only--small"
                tabindex="0"
                tier="tertiary"
                no-label
                icon-start="${this.isOpen ? 'close' : 'menu'}"
              ></ui--button>
            </section>
          </div>
        </nav>

        ${this.isOpen
          ? html`<!-- <div class="layout--container--grid layout--lining only--small only--open">
                <ui--separator
                  no-label
                  style="color: var(--palette--darkest);"
                ></ui--separator>
              </div> -->

              <aside
                class="sitemap layout--container--grid layout--bleeding layout--lining only--small only--open"
              >
                <div class="overlay">
                  ${Object.entries(this.sitemap).map(
                    ([group, links]) => html`
                      <div>
                        <span class="token--label--default">${group}</span>
                        <ul>
                          ${Object.entries(links).map(
                            ([name, url]) =>
                              html`<li>
                                <a
                                  href="${url}"
                                  class="page ${this.currentPage === url
                                    ? 'current-page'
                                    : ''}"
                                  >${name}</a
                                >
                              </li>`,
                          )}
                        </ul>
                      </div>
                    `,
                  )}
                </div>
              </aside>

              <div
                class="only--small only--open"
                style="height: var(--m4);"
              ></div>`
          : ''}
      </header>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [NAME]: SiteHeader
  }
}
