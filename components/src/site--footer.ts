import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

const NAME = 'site--footer'
export const tagName = NAME
@customElement(NAME)
export class SiteFooter extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    footer a {
      text-decoration: none;
      font-weight: 600;
    }
    footer ul {
      list-style: none;
      margin: 0;
    }

    footer .ui--button {
      --ui--base--palette--paper: var(--palette--lightest);
      --ui--base--palette--ink: var(--palette--darkest);
    }
    footer .token--label--default {
      font-weight: 300;
    }

    footer {
      color: var(--palette--lightest);
    }
    footer .top > * {
    }
    footer .top > .background {
      z-index: -1000;
      background: var(--palette--darkest);
      opacity: 75%;
    }
    footer .top .callout {
      display: flex;
      gap: var(--m2);
    }
    footer .top aside {
      display: flex;
      gap: var(--m2);
      flex-wrap: wrap;
      justify-content: space-between;
    }
    @media (max-width: 1160px) {
      footer .top aside {
        grid-column: copy-start / copy-end;
        display: grid;
        grid-template-columns: 10ch 1fr;
        gap: var(--b0);
      }
      footer .top aside > div {
        display: contents;
      }
      footer .top aside > div ul {
        display: flex;
        flex-wrap: wrap;
        gap: var(--b0);
        padding-top: 0;
      }
    }

    footer .layout--container--grid --article layout--bleeding layout--lining {
      padding-block: var(--m4);
    }

    footer .bottom {
      background: var(--palette--darkest);
      color: var(--palette--lightest);
      padding-block: var(--b0);
    }
    footer .bottom > div {
      display: flex;
      justify-content: space-between;
      gap: var(--m2);
    }
    footer .bottom ul:last-child {
      justify-items: end;
    }
    @media (min-width: 1160px) {
      footer .bottom ul {
        display: flex;
        gap: var(--m2);
      }
    }
  `

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

  @property({ reflect: true, type: Object })
  links = [
    {
      Twitter: '#',
      Instagram: '#',
      'Contact Us': '#',
    },
    {
      Terms: '#',
      'Privacy Policy': '#',
      'Return Policy': '#',
    },
  ]

  render() {
    return html`
      <link href="/library/styles.css" rel="stylesheet" />
      <footer>
        <section class="top layout--container--stack">
          <div class="background"></div>
          <div
            class="layout--container--grid --article layout--bleeding layout--lining"
          >
            <div>
              <blockquote>
                <p>
                  <slot>
                    Over the years, working with Nature has helped us realise 'less is more and usually more effective'. 
                    We intend to continue working hard to keep Nature's simple systems simple.
                  </slot>
                </p>
              </blockquote>
            </div>
            <aside class="sitemap">
              ${Object.entries(this.sitemap).map(
                ([group, links]) => html`
                  <div>
                    <span class="token--label--default">${group}</span>
                    <ul>
                      ${Object.entries(links).map(
                        ([name, url]) =>
                          html`<li><a href="${url}">${name}</a></li>`,
                      )}
                    </ul>
                  </div>
                `,
              )}
            </aside>
          </div>
        </section>

        <section
          class="bottom layout--container--grid layout--bleeding layout--lining"
        >
          <div>
            ${this.links.map(
              (list) =>
                html`<ul>
                  ${Object.entries(list).map(
                    ([name, url]) =>
                      html`<li><a href="${url}">${name}</a></li>`,
                  )}
                </ul>`,
            )}
          </div>
        </section>
      </footer>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [NAME]: SiteFooter
  }
}
