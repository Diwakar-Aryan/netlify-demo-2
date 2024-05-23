import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

type OptionType = 'check' | 'fill'
type Tier = 'primary' | 'secondary' | 'tertiary' | 'quaternary'
type Layout = 'stack' | 'inline' | 'block'
type Alignment = 'start' | 'center' | 'end'
enum Icon {
  EMPTY = 'radio_button_unchecked',
  CHECK = 'task_alt',
  FILL = 'radio_button_checked',
}

const NAME = 'ui--option'
export const tagName = NAME
@customElement(NAME)
export class UIOption extends LitElement {
  static styles = css`
    :host {
      ----paper: var(
        --ui--option--palette--paper,
        var(--palette--primary--paper)
      );
      ----ink: var(--ui--option--palette--ink, var(--palette--primary--ink));
      ----gap: var(--ui--option--gap, var(--m-1));
      ----margin: var(--ui--option--margin, var(--m0));

      display: grid;
      gap: var(----gap);
    }

    :host([error]) {
      ----paper: var(--palette--error);
    }
    :host([disabled]) {
      opacity: 50%;
      pointer-events: none;
    }

    :host([layout='inline']) {
      grid-auto-flow: column;
    }

    :host([layout='stack']) > * {
      grid-area: 1 / 1 / -1 / -1;
    }

    #button {
      --ui--base--palette--paper: var(----paper);
      --ui--base--palette--ink: var(----ink);

      z-index: 100;
    }

    :host([layout='stack']) > #button {
      margin: var(----margin);
    }

    :host > #button {
      justify-self: start;
    }
    :host([justify='center']) > #button {
      justify-self: center;
    }
    :host([justify='end']) > #button {
      justify-self: end;
      order: 100;
    }

    :host > #button {
      align-self: start;
    }
    :host([align='center']) > #button {
      align-self: center;
    }
    :host([align='end']) > #button {
      align-self: end;
      order: 100;
    }
  `

  @property({ type: String })
  type: OptionType = 'check'

  @property({ type: String })
  tier: Tier = 'primary'
  @property({ type: Boolean })
  featured = false

  @property({ type: String })
  layout: Layout = 'block'
  @property({ type: String })
  justify: Alignment = 'start'
  @property({ type: String })
  align: Alignment = 'start'

  @property({ type: String })
  label?: string

  @property({ type: Boolean, reflect: true })
  error = false
  @property({ type: Boolean, reflect: true })
  disabled = false
  @property({ type: Boolean, reflect: true })
  value = false

  render() {
    return html`
      <ui--button
        id="button"
        tabindex="0"
        tier="${this.tier}"
        ?featured="${this.featured}"
        ?no-label="${!this.label}"
        icon-start="${!this.value
          ? Icon.EMPTY
          : this.type === 'fill'
          ? Icon.FILL
          : Icon.CHECK}"
        ?focused="${this.value}"
        @click=${() => {
          this.value = !this.value
          this.dispatchEvent(
            new CustomEvent('toggle', {
              detail: this.value,
              bubbles: true,
            }),
          )
        }}
        >${this.label || ''}</ui--button
      >
      <div id="slot" align="start">
        <!-- Just so we can use the attribute align at the host level -->
        <slot></slot>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [NAME]: UIOption
  }
}
