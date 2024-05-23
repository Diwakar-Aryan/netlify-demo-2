import { html, css, LitElement } from 'lit'
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js'

const NAME = 'ui--blockquote'
export const tagName = NAME
@customElement(NAME)
export class UIBlockquote extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    figure {
      gap: 1em;
    }

    figure.stretch *:is(blockquote, figcaption) {
      margin-right: unset;
    }

    figcaption {
      font-size: unset;
      margin-right: var(--m4);
    }

    .quote-start,
    .quote-end {
      font-size: 1.2em;
      font-weight: bold;
      line-height: 0;
      opacity: 75%;
    }
    .quote-start {
      margin-left: -1ch;
      padding-right: 0.25ch;
    }
    .quote-end {
      padding-left: 0.25ch;
    }

    .attribution {
      display: flex;
      align-items: center;
      gap: 1ch;
    }
    .attribution img {
      margin-left: -0.5ch;
      /* background: currentColor; */
      width: 3em;
      height: 3em;
      border-radius: 50%;
      filter: brightness(95%) saturate(75%);
    }
  `

  @property({ type: String })
  source = ''

  @property({ type: String })
  context = ''

  @property({ type: String })
  identity = ''

  @property({ attribute: 'no-quotes', type: Boolean })
  noQuotes = false

  @property({ type: Boolean })
  stretch = false

  @property({ type: Boolean })
  custom = false

  @queryAssignedElements()
  slotItems!: Array<HTMLElement>

  #handleSlotChange() {
    this.requestUpdate()
  }

  render() {
    const paragraphs = this.slotItems
      .filter((item) => item.tagName === 'P')
      .filter((item) => !item.classList.contains('utility--hide'))
      .map((item) => item.cloneNode(true))
    if (!this.noQuotes) {
      paragraphs.forEach((item, i) => {
        const item_ = item as Element
        item_.innerHTML = item_.innerHTML.trim()
        if (i === 0) {
          const quote = document.createElement('span')
          quote.classList.add('quote-start')
          quote.innerText = '“'
          item_.prepend(quote)
        }
        if (i === paragraphs.length - 1) {
          const quote = document.createElement('span')
          quote.classList.add('quote-end')
          quote.innerText = '”'
          item_.append(quote)
        }
      })
    }

    return html`
      <link href="/library/styles.css" rel="stylesheet" />
      <figure class="${this.stretch ? 'stretch' : ''}">
        <blockquote>${paragraphs}</blockquote>
        ${!this.custom
          ? this.source
            ? html`<figcaption class="attribution">
                ${this.identity ? html`<img src="${this.identity}" alt=""></img>` : ''}
                <div>
                  <h1 class="token--label--big">${this.source}</h1>
                  ${this.context
                    ? html`<h2 class="token--label--small">${this.context}</h2>`
                    : ''}
                </div>
              </figcaption>`
            : ''
          : html`<figcaption class="attribution">
              <slot name="attribution"></slot>
            </figcaption>`}
        <slot
          style="display: none;"
          @slotchange=${this.#handleSlotChange}
        ></slot>
      </figure>
    `
  }

  observer = new MutationObserver((mutations) => {
    let needUpdate = false
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        needUpdate = true
      }
    })
    if (needUpdate) this.requestUpdate()
  })
  firstUpdated() {
    this.observer.observe(this, {
      subtree: true,
      attributes: true,
      attributeFilter: ['class'],
    })
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [NAME]: UIBlockquote
  }
}
