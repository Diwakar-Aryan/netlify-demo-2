import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

const NAME = 'color--grading'
export const tagName = NAME
@customElement(NAME)
export class ColorGrading extends LitElement {
  static styles = css`
    ::slotted(*) {
      grid-area: 1 / 1 / -1 / -1;
    }
  `

  @property({ attribute: 'no-color', type: Boolean })
  noColor = false
  @property({ attribute: 'no-normal', type: Boolean })
  noNormal = false
  @property({ attribute: 'no-lighten', type: Boolean })
  noLighten = false
  @property({ attribute: 'no-darken', type: Boolean })
  noDarken = false
  @property({ attribute: 'no-multiply', type: Boolean })
  noMultiply = false
  @property({ attribute: 'no-addition', type: Boolean })
  noAddition = false

  @property({ type: Boolean })
  fill = false

  render() {
    return html`
      <link href="/library/styles.css" rel="stylesheet" />
      <main
        class="color--grading"
        style=${this.fill ? 'width: 100%; height: 100%;' : ''}
      >
        <!-- NOTE: Contents inside <slot> can't be styled from within a custom-element without the ::slotted() pseudo-selector -->
        <slot></slot>
        ${this.noColor ? '' : html`<div class="color"></div>`}
        ${this.noNormal ? '' : html`<div class="normal"></div>`}
        ${this.noLighten ? '' : html`<div class="lighten"></div>`}
        ${this.noDarken ? '' : html`<div class="darken"></div>`}
        ${this.noMultiply ? '' : html`<div class="multiply"></div>`}
        ${this.noAddition ? '' : html`<div class="addition"></div>`}
      </main>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [NAME]: ColorGrading
  }
}
