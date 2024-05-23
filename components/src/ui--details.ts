import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

const NAME = 'ui--details'
export const tagName = NAME
@customElement(NAME)
export class UIDetails extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      --ui--base--palette--paper: currentColor;
    }
    ui--separator > .token--icon {
      margin-right: -0.25em;
      opacity: 85%;
    }
    details.heavy > main {
      padding-top: 1em;
      /*overflow-y: hidden;*/
    }
    details > summary > ui--button {
      --ui--base--padding--inline: 0.25rem;
    }
  `

  @property({ attribute: 'no-line', type: Boolean })
  noLine = false
  @property({ type: Boolean, reflect: true })
  open = false
  @property({ state: true })
  heavy = false
  @property({ attribute: 'no-hotspot', type: Boolean })
  noHotspot = false

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
    const icon = this.shadowRoot?.querySelector(
      'ui--separator > span.token--icon',
    ) as HTMLElement
    icon.innerHTML = icon?.innerHTML === 'add' ? 'remove' : 'add'
    this.dispatchEvent(
      new CustomEvent('toggle', {
        detail: this.shadowRoot?.querySelector('details')?.open,
        bubbles: true,
      }),
    )
  }

  #handleSummarySlotChange(event: Event) {
    const summary = (event.target as HTMLSlotElement)?.assignedElements({
      flatten: true,
    })[0]
    this.heavy = !!summary.tagName.match(/^H[1-6]/)
  }
  #handleContentClick(event: Event) {
    if (!this.noHotspot) {
      event.preventDefault()
      this.toggle()
    }
  }

  render() {
    return html`
      <link href="/library/styles.css" rel="stylesheet" />
      <details
        .open=${this.open}
        @toggle=${this.#handleToggle}
        class="${this.heavy ? 'heavy' : ''}"
      >
        <summary tabindex="-1" @click=${this.toggle}>
          <ui--button tabindex="0" tier="quaternary" align stretch>
            <ui--separator custom ?heavy=${this.heavy} ?no-line=${this.noLine}>
              <slot name="summary" @slotchange=${this.#handleSummarySlotChange}>
                <h1>Placeholder Summary</h1>
              </slot>
              <span slot="sub" class="token--icon">add</span>
            </ui--separator>
          </ui--button>
        </summary>
        <main @click=${this.#handleContentClick}>
          <slot></slot>
        </main>
      </details>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [NAME]: UIDetails
  }
}
