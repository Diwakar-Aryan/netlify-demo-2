import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

const NAME = 'embed--filler-image'
export const tagName = NAME
@customElement(NAME)
export class EmbedFillerImage extends LitElement {
  static styles = css`
    :host {
      display: grid;
    }
    main {
    }
  `

  @property({ type: String })
  src = ''

  @property({ type: String })
  position = ''

  @property({ type: String })
  fit = ''

  render() {
    return html`
      <main 
        style="
          background-repeat: no-repeat;
          background-image: url(${this.src || '/media/brands/logo.black.icon.png'});
          background-position: ${this.position || 'center'};
          background-size: ${this.fit || 'contain'};
        "
      ></main>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [NAME]: EmbedFillerImage
  }
}
