import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

const NAME = 'ui--notification-dot'
export const tagName = NAME
@customElement(NAME)
export class UINotificationDot extends LitElement {
  static styles = css``

  @property({ type: Boolean })
  hide = false

  bounce() {
    this.shadowRoot?.querySelector('.dot')?.animate(
      {
        transform: ['translateY(0)', 'translateY(-0.5em)', 'translateY(0)'],
      },
      {
        duration: 250,
        easing: 'ease-out',
        fill: 'forwards',
        iterations: 2,
      },
    )
  }

  render() {
    return html`
      <link href="/library/styles.css" rel="stylesheet" />
      <main class="ui--notification-dot ${this.hide ? 'hide' : ''}">
        <slot>Test</slot>
        <div class="dot"></div>
      </main>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [NAME]: UINotificationDot
  }
}
