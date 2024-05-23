import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

type Mode = 'item' | 'excerpt'

const NAME = 'site--excursion'
export const tagName = NAME
@customElement(NAME)
export class SiteExcursion extends LitElement {
  static styles = css`
    :host {
      display: block;
      /* max-width: 20rem; */
    }

    #cover img {
      width: 100%;
      aspect-ratio: 32 / 20;
      object-fit: cover;
    }

    .item {
      width: 100%;
    }

    .item #button {
      display: grid;
    }

    .excerpt {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      column-gap: var(--m1);
      grid-auto-flow: dense;
      color: var(--palette--primary);
    }

    .excerpt #cover {
      grid-column: 2 / span 2;
    }

    .excerpt #slot {
      margin-block: var(--m-h);
    }

    @media (max-width: 714px) {
      .excerpt {
        grid-template-columns: 1fr;
      }

      .excerpt #cover {
        grid-row: span 1;
        grid-column: span 1;
      }
    }
  `

  @property({ type: String })
  title = 'Placeholder'

  @property({ type: String })
  href = '#'

  @property({ type: String })
  cover = 'https://picsum.photos/seed/b/1920/1080'

  @property({ type: Object })
  locations = ['Somewhere']

  @property({ type: Number })
  duration = 2

  @property({ type: String })
  mode: Mode = 'item'

  @property({ attribute: 'no-grading', type: Boolean })
  noGrading = false

  render() {
    return html`
      <link href="/library/styles.css" rel="stylesheet" />
      ${this.mode === 'item'
        ? html` <main class="${this.mode}">
            <ui--button
              id="button"
              link
              href="${this.href}"
              tier="quinary"
              align
              stretch
            >
              <color--grading 
                id="cover"
                no-normal no-multiply no-addition
                ?no-color=${this.noGrading} 
                ?no-lighten=${this.noGrading} 
                ?no-darken=${this.noGrading}
              >
                <img src=${this.cover ?? ''} alt=""></img>
              </color--grading>
              <h1 class="token--label--big">${this.title}</h1>
              <p class="token--caption">
                ${this.locations.join(', ')} · ${this.duration}hr
              </p>
            </ui--button>
          </main>`
        : ''}
      ${this.mode === 'excerpt'
        ? html` <main class="${this.mode} layout--span--copy">
            <section id="cover">
              <color--grading
                no-normal no-multiply no-addition
                ?no-color=${this.noGrading} 
                ?no-lighten=${this.noGrading} 
                ?no-darken=${this.noGrading}
              >
                <img src=${this.cover ?? ''} alt=""></img>
              </color--grading>
            </section>
            <section id="content">
              <h1 class="token--label--big">${this.title}</h1>
              <p class="token--caption">
              ${this.locations.join(', ')} · ${this.duration}hr
              </p>
              <section id="slot"><slot></slot></section>
              <ui--button
                id="button"
                link
                href="${this.href}"
                tier="secondary"
                icon-end="arrow_forward"
              >
                Visit Excursion
              </ui--button>
            </section>
          </main>`
        : ''}
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [NAME]: SiteExcursion
  }
}
