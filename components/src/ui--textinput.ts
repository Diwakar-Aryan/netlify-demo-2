import { html, css, LitElement } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'

type Alignment = 'start' | 'center' | 'end'

const NAME = 'ui--textinput'
export const tagName = NAME
@customElement(NAME)
export class UITextinput extends LitElement {
  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  }

  static styles = css`
    :host {
      ----paper: var(
        --ui--textinput--palette--paper,
        var(--palette--primary--paper)
      );
      ----ink: var(--ui--textinput--palette--ink, var(--palette--primary--ink));
      --ui--base--palette--paper: var(----paper);
      --ui--base--palette--ink: var(----ink);
      outline: none;
    }

    :host([error]) {
      ----paper: var(--palette--error);
    }
    :host([disabled]) {
      opacity: 50%;
      pointer-events: none;
    }

    ::slotted(*),
    slot {
      display: none;
    }

    input {
      margin-block: -0.25rem;
    }
  `

  @property({ type: Number })
  tabindex = -1
  @property({ type: Boolean })
  autofocus = false

  @property({ attribute: 'icon-start', type: String })
  iconStart = undefined
  @property({ attribute: 'icon-end', type: String })
  iconEnd = undefined

  @property({ type: String })
  suffix = ''

  @property({ type: Boolean })
  area = false
  @property({ type: Number })
  cols = 5
  @property({ type: Number })
  rows = 3

  @property()
  alignment: Alignment = 'start'

  @property({ attribute: 'aria-label', type: String })
  ariaLabel = ''

  @property({ type: Boolean, reflect: true })
  error = false
  @property({ type: Boolean, reflect: true })
  disabled = false
  @property({ state: true, type: String }) // FIXME: After the value actually changes, setting the property doesn't update the element
  value = ''
  @property({ state: true, type: Boolean })
  selected = false

  @query('.ui--token--tint')
  tint$!: HTMLElement

  duration = 100

  render() {
    return html`
      <link href="/library/styles.css" rel="stylesheet" />
      <slot
        @slotchange=${(event: Event) => {
          this.value =
            (event?.target as HTMLSlotElement).assignedNodes({
              flatten: true,
            })[0].textContent ?? ''
        }}
      ></slot>
      <main
        class="
          ui--textinput
          ${this.iconStart ? '--icon-start' : ''} 
          ${this.iconEnd ? '--icon-End' : ''} 
          ${this.selected ? '--selected --focused' : ''}
          ${this.area ? '--area' : ''}
        "
      >
        <div class="ui--token--background">
          <div class="ui--token--background--background"></div>
          <div class="ui--token--background--border"></div>
        </div>
        <div class="ui--token--tint"></div>
        <div class="ui--token--content">
          ${this.iconStart
            ? html`<span class="token--icon">${this.iconStart}</span>`
            : ''}
          ${this.area
            ? html`<textarea
                aria-label="${this.ariaLabel}"
                cols="${this.cols}"
                rows="${this.rows}"
                tabindex="${this.tabindex}"
                ?autofocus="${this.autofocus}"
                class="token--value ui--token--content--input"
                @focusin=${(event: Event) => {
                  this.tint$
                    .getAnimations({ subtree: true })
                    .forEach((animation) => animation.finish())
                  this.tint$.animate(
                    {
                      opacity: ['33%', '0'],
                    },
                    {
                      duration: this.duration * 5,
                      easing: 'ease-in',
                      fill: 'forwards',
                    },
                  )
                  this.selected = true
                  ;(event.target as HTMLTextAreaElement).select()
                }}
                @focusout=${() => {
                  this.selected = false
                }}
                @change=${(event: Event) => {
                  this.value = (event?.target as HTMLInputElement).value
                }}
              >
${this.value}</textarea
              >` // Note: The linting is broken, and whitespace is significant inside textareas. SMH!
            : html`<input
                aria-label="${this.ariaLabel}"
                size="1"
                type="text"
                value="${this.value}"
                tabindex="${this.tabindex}"
                ?autofocus="${this.autofocus}"
                class="token--value ui--token--content--input"
                style="text-align: ${this.alignment};"
                @focusin=${() => {
                  this.tint$
                    .getAnimations({ subtree: true })
                    .forEach((animation) => animation.finish())
                  this.tint$.animate(
                    {
                      opacity: ['33%', '0'],
                    },
                    {
                      duration: this.duration * 5,
                      easing: 'ease-in',
                      fill: 'forwards',
                    },
                  )
                  this.selected = true
                }}
                @focusout=${() => {
                  this.selected = false
                }}
                @change=${(event: Event) => {
                  this.value = (event?.target as HTMLInputElement).value
                }}
              />`}
          ${this.area
            ? ''
            : html`${this.suffix
                ? html`<span class="token--value ui--token--content--suffix"
                    >${this.suffix}</span
                  >`
                : ''}
              ${this.iconEnd
                ? html`<span class="token--icon">${this.iconEnd}</span>`
                : ''}`}
        </div>
        <div class="ui--token--border"></div>
      </main>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [NAME]: UITextinput
  }
}
