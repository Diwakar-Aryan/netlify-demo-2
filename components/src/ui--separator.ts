import { html, css, LitElement } from 'lit'
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js'

type Alignment = 'start' | 'center' | 'end'

const NAME = 'ui--separator'
export const tagName = NAME
@customElement(NAME)
export class UISeparator extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    hr {
      flex-basis: 5%;
    }
  `

  @property({ attribute: 'custom', type: Boolean })
  custom = false
  @property()
  alignment: Alignment = 'start'
  @property({ attribute: 'heavy', type: Boolean })
  heavy = false
  @property({ attribute: 'no-line', type: Boolean })
  noLine = false

  @queryAssignedElements()
  slotItems!: Array<HTMLElement>

  render() {
    return html`
      <link href="/library/styles.css" rel="stylesheet" />
      <main
        class="
          ui--separator
          ${this.heavy ? '--heavy' : ''}
          ${this.noLine ? '--no-line' : ''}
        "
      >
        ${this.custom
          ? html`
              <slot></slot>
              <hr />
              <slot name="sub"></slot>
            `
          : html`
              ${this.alignment === 'start' ? '' : html`<hr />`}
              ${this.slotItems.length
                ? html`<span class="token--label--small">
                    <slot>Section</slot>
                  </span>`
                : ''}
              ${this.alignment === 'end' ? '' : html`<hr />`}
            `}
      </main>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [NAME]: UISeparator
  }
}
