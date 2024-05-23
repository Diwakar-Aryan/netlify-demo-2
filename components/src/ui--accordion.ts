import { html, css, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'
import { UIDetails } from './ui--details.js'

const NAME = 'ui--accordion'
export const tagName = NAME
@customElement(NAME)
export class UIAccordion extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    ui--separator > span.token--icon {
      margin-inline: -0.2em;
      opacity: 85%;
    }
  `

  #slottedDetails: Element[] = []
  #handleSlotChange(event: Event) {
    const handleToggle = (event: Event) => {
      const target = event.target as HTMLElement
      const open = (event as CustomEvent).detail
      if (!open) return
      this.#slottedDetails.forEach((detail) => {
        const detail_ = detail as UIDetails
        if (detail_ != target && detail_.open) {
          detail_.toggle()
        }
      })
    }

    this.#slottedDetails.forEach((detail) =>
      detail.removeEventListener('toggle', handleToggle),
    )

    this.#slottedDetails =
      (event.target as HTMLSlotElement)
        ?.assignedElements({ flatten: true })
        .filter((element) => element.tagName === 'UI--DETAILS') || []

    this.#slottedDetails.forEach((detail) =>
      detail.addEventListener('toggle', handleToggle),
    )
  }

  render() {
    return html`
      <link href="/library/styles.css" rel="stylesheet" />
      <slot @slotchange=${this.#handleSlotChange}></slot>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [NAME]: UIAccordion
  }
}
