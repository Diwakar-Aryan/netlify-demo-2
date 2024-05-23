import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

type Mode = 'item'

const NAME = 'site--program'
export const tagName = NAME
@customElement(NAME)
export class SiteProgram extends LitElement {
  static styles = css`
    :host {
      ----cover-position: var(--site--program--cover-position, center);
      display: block;
      max-width: 15rem;
    }

    .item {
      width: 100%;
    }

    .item #button {
      display: grid;
      gap: 1rem;
    }

    #cover img {
      width: 100%;
      aspect-ratio: 20 / 32;
      object-fit: cover;
      object-position: var(----cover-position);
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

  @property({ type: String })
  mode: Mode = 'item'

  @property({ attribute: 'no-grading', type: Boolean })
  noGrading = false

  render() {
    return html`
      <link href="/library/styles.css" rel="stylesheet" />
      <main class="${this.mode}">
        <ui--button id="button" link href="${this.href}" tier="quinary" align>
          ${this.noGrading
            ? html`<div id="cover"><img src=${this.cover ?? ''} alt=""></img></div>`
            : html`
              <color--grading 
                id="cover"
                no-normal no-multiply no-addition
                ?no-color=${this.noGrading} 
                ?no-lighten=${this.noGrading} 
                ?no-darken=${this.noGrading}
              >
                <img src=${this.cover ?? ''} alt=""></img>
              </color--grading>
            `}
          <h1 class="token--label--big">${this.title}</h1>
          <p class="token--caption">${this.locations.join(', ')}</p>
        </ui--button>
      </main>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [NAME]: SiteProgram
  }
}
