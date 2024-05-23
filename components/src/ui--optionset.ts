import { html, css, LitElement } from 'lit'
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js'
import { UIOption } from './ui--option'

type OptionType = 'any' | 'one'

const NAME = 'ui--optionset'
export const tagName = NAME
@customElement(NAME)
export class UIOptionSet extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    :host([error]) {
      --ui--option--palette--paper: var(--palette--error);
    }
    :host([disabled]) {
      opacity: 50%;
      pointer-events: none;
    }
  `

  @property({ type: String })
  type: OptionType = 'any'
  @property({ type: Boolean, reflect: true })
  error = false
  @property({ type: Boolean, reflect: true })
  disabled = false
  @property({ type: Array<string>, reflect: true })
  value: string[] = []

  @queryAssignedElements({ selector: 'ui--option:not(.utility--hide)' })
  slotOptions!: Array<HTMLElement>

  connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('toggle', (event) => {
      const target = event.target as UIOption

      if (this.type === 'one') {
        if (target.value) {
          // Unset all other options
          this.slotOptions
            .filter((option) => option != target)
            .forEach((option) => {
              ;(option as UIOption).value = false
            })
          // Set new value
          this.value = []
          if (target.dataset.optionValue !== undefined) {
            this.value = [target.dataset.optionValue]
          } else {
            for (let index in this.slotOptions) {
              if (this.slotOptions[index] === target) {
                this.value = [index]
                break
              }
            }
          }
        }
      } else {
        // Set new values
        this.value = []
        for (let index in this.slotOptions) {
          const option = this.slotOptions[index] as UIOption
          if (option.value) {
            if (option.dataset.optionValue !== undefined) {
              this.value.push(option.dataset.optionValue)
            } else {
              this.value.push(index)
            }
          }
        }
      }
    })
  }

  manageSlotOptions() {
    this.slotOptions.forEach((option, index) => {
      const option_ = option as UIOption

      // Normalize all option types
      option_.type = this.type === 'one' ? 'fill' : 'check'

      // Pick default value if non specified
      if (this.type === 'one') {
        if (this.value.length === 0 && index === 0) {
          this.value = [option_.dataset.optionValue ?? index.toString()]
        }
      }

      // Choose all options as per value
      if (option_.dataset.optionValue !== undefined) {
        option_.value = this.value.includes(option_.dataset.optionValue)
      } else {
        option_.value = this.value.includes(index.toString())
      }
    })
  }

  render() {
    this.manageSlotOptions()
    return html`
      <slot
        @slotchange=${() => {
          this.manageSlotOptions()
        }}
      ></slot>
    `
  }

  observer = new MutationObserver((mutations) => {
    let needUpdate = false
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        needUpdate = true
      }
    })
    if (needUpdate) {
      // Set new values
      this.value = []
      for (let index in this.slotOptions) {
        const option = this.slotOptions[index] as UIOption
        if (option.value) {
          if (option.dataset.optionValue !== undefined) {
            this.value.push(option.dataset.optionValue)
          } else {
            this.value.push(index)
          }
        }
      }
      this.manageSlotOptions()
    }
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
    [NAME]: UIOptionSet
  }
}
