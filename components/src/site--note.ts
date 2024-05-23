import { html, css, LitElement } from 'lit'
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js'
import { CartItem } from './site--cart'

const NAME = 'site--note'
export const tagName = NAME
@customElement(NAME)
export class SiteNote extends LitElement {
  static styles = css`
    :host {
      display: block;
      color: var(--palette--primary);
    }

    details,
    details > summary {
      opacity: 100% !important;
    }

    main {
      padding-top: var(--m-h);
    }

    #header {
      align-items: center;
      row-gap: var(--m-2);
    }
    #title {
      grid-row: 1;
    }
    #button {
      grid-row: 1;
      grid-column: span 1;
    }
    #cover {
      order: -1;
    }

    @media (min-width: 714px) {
      #header {
        row-gap: 0;
      }
      #title {
        grid-column: 1 / -3;
      }
      #button {
        grid-column: -3 / -1;
      }
      #cover {
        order: unset;
      }
    }
  `

  @property({ type: String })
  title = 'Placeholder'

  @property({ type: String })
  cover = 'https://picsum.photos/seed/b/1920/1080'

  @property({ type: String })
  language = 'English'

  @property({ type: Object })
  topics = []

  @property({ type: String })
  pdf = '#'

  @property({ type: Number })
  cost = 123.45

  @property({ type: String })
  price_id = ''

  @property({ attribute: 'no-grading', type: Boolean })
  noGrading = false

  @property({ type: Boolean, reflect: true })
  open = false

  @property({ type: Boolean, reflect: true })
  locked = false

  @property({ type: Boolean, reflect: true })
  selected = false

  @queryAssignedElements()
  slotItems!: Array<HTMLElement>

  duration = 200
  animation?: Animation
  toggle() {
    if (!this.animation?.finished) this.animation?.finish()
    const main = this.shadowRoot?.querySelector('main')
    if (this.open) {
      this.animation = main?.animate(
        {
          height: [`${main.offsetHeight}px`, '0'],
          paddingTop: [
            getComputedStyle(main).getPropertyValue('padding-top'),
            '0',
          ],
          opacity: [`100%`, '0'],
        },
        {
          duration: this.duration,
          easing: 'ease-out',
        },
      )
      this.animation?.addEventListener('finish', () => (this.open = false))
    } else {
      this.open = true
      this.animation = main?.animate(
        {
          height: ['0', `${main.offsetHeight}px`],
          paddingTop: [
            '0',
            getComputedStyle(main).getPropertyValue('padding-top'),
          ],
          opacity: ['0', `100%`],
        },
        {
          duration: this.duration,
          easing: 'ease-out',
        },
      )
    }
  }

  #handleToggle() {
    this.dispatchEvent(
      new CustomEvent('toggle', {
        detail: this.shadowRoot?.querySelector('details')?.open,
        bubbles: true,
      }),
    )
  }

  #handleSummaryClick(event: Event) {
    event.preventDefault()
    this.toggle()
  }

  #handleButtonClick(event: Event) {
    event.stopPropagation()
    if (this.locked) {
      event.preventDefault()
      this.selected = !this.selected
      if (this.selected && !this.open) this.toggle()
      document.dispatchEvent(
        new CustomEvent(this.selected ? 'addCart' : 'removeCart', {
          detail: {
            label: `Note · ${this.title}`,
            href: '/notes',
            cost: this.cost,
            price_id: this.price_id,
          } as CartItem,
          bubbles: true,
        }),
      )
      this.dispatchEvent(
        new CustomEvent('click', {
          // detail: this,
          bubbles: true,
        }),
      )
    }
  }

  render() {
    return html`
      <link href="/library/styles.css" rel="stylesheet" />

      <details .open=${this.open} @toggle=${this.#handleToggle}>
        <summary
          id="header"
          class="layout--container--grid"
          style="display: grid;"
          @click=${this.#handleSummaryClick}
        >
          <h1 id="title" class="token--label--big">${this.title}</h1>
          <ui--button
            id="button"
            href="/notes/${this.id.split('notes__')[1] ?? 404}"
            tier="${this.locked && this.selected ? 'primary' : 'secondary'}"
            stretch
            ?link=${!this.locked}
            @click=${this.#handleButtonClick}
          >
            ${this.locked
              ? this.selected
                ? 'Added to Cart'
                : `${this.cost.toFixed(2)}INR`
              : 'Read'}
          </ui--button>
          <div>
            <p id="topics" class="token--caption">${this.topics.join(', ')}</p>
          </div>
        </summary>
        <main
          class="layout--container--grid --article"
          style="
            ${this.slotItems.length ? '' : 'display: none;'}
          "
        >
          <div id="excerpt">
            <slot @slotchange=${this.requestUpdate()}></slot>
          </div>
          <aside id="cover">
            ${this.noGrading
              ? html`
              <div>
                <img src=${this.cover ?? ''}></img>
              </div>
            `
              : html`
              <color--grading           
                no-normal no-multiply no-addition
                ?no-color=${this.noGrading} 
                ?no-lighten=${this.noGrading} 
                ?no-darken=${this.noGrading}
              >
                <img src=${this.cover ?? ''}></img>
              </color--grading>
            `}
          </aside>
        </main>
      </details>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [NAME]: SiteNote
  }
}
