import { html, css, LitElement } from 'lit'
import {
  customElement,
  property,
  query,
  queryAssignedElements,
} from 'lit/decorators.js'
import { UIButton } from './ui--button.js'

type Tier = 'primary' | 'secondary' | 'tertiary'

const NAME = 'ui--select'
export const tagName = NAME
@customElement(NAME)
export class UISelect extends LitElement {
  static styles = css`
    :host {
      ----paper: var(
        --ui--select--palette--paper,
        var(--palette--primary--paper)
      );
      ----ink: var(--ui--select--palette--ink, var(--palette--primary--ink));
      --ui--base--palette--paper: var(----paper);
      --ui--base--palette--ink: var(----ink);
      width: fit-content;
    }
    :host([active]) {
      z-index: 1000;
    }
    :host([stretch]) {
      width: 100%;
    }

    :host([error]) {
      ----paper: var(--palette--error);
    }
    :host([disabled]) {
      opacity: 50%;
      pointer-events: none;
    }

    dialog {
      opacity: 0;
      position: unset;
      margin: 0;
      padding: 0;
      display: grid;
      place-items: stretch;
      border: none;
      width: 100%;
      height: 0px;
      z-index: 100;
      background: #111d;
    }
    :host(*:not([active])) > dialog {
      overflow-y: hidden;
    }

    @media (max-width: 714px) {
      :host([active]) > dialog {
        width: 100% !important;
        height: 100%;
      }
      dialog {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 1000;
        display: grid;
        place-items: center;
        backdrop-filter: blur(0.2rem);
        outline: none;
        overscroll-behavior: none;
        overflow: auto;
        --ui--base--palette--paper: #fff;
        --ui--base--palette--ink: #000;
      }

      dialog > :where(.scrim, .tint) {
        display: none;
      }

      dialog > .items {
        // font-size: 1.5em;
        backdrop-filter: none !important;
      }

      dialog > .items > .item.selected {
        opacity: unset;
      }
    }

    dialog > * {
      grid-area: 1 / 1 / -1 / -1;
    }

    dialog > .scrim {
      place-self: stretch;
      background: var(--palette--lightest);
      filter: blur(var(--m-2));
      opacity: 75%;
      z-index: -100;
      padding: var(--m-2);
      margin: calc(-1 * var(--m-2));
    }

    dialog > .tint {
      place-self: stretch;
      background: var(--palette--highlight);
      transition: opacity ease-out 200ms;
      opacity: 33%;
    }

    dialog > .items {
      display: grid;
      backdrop-filter: blur(0.2rem);
      --ui--base--padding--right: 1em;
      border: 1px solid var(----paper);
    }

    dialog > .items > .item.selected {
      opacity: 85%;
    }
  `

  @property({ type: String })
  tier: Tier = 'primary'
  @property({ type: Boolean })
  stretch = false
  @property({ type: Boolean, reflect: true })
  fit = false
  @property({ type: Boolean, reflect: true })
  error = false
  @property({ type: Boolean, reflect: true })
  disabled = false
  @property({ type: String, reflect: true })
  value?: string

  @query(':host > ui--button')
  mainButton$!: HTMLElement
  @query(':host .tint')
  tint$!: HTMLElement
  @query('dialog')
  dialog$!: HTMLElement
  @queryAssignedElements()
  slotItems!: Array<HTMLElement>

  @property({ type: Boolean, reflect: true })
  active = false
  duration = 100

  async activate() {
    if (this.active) return
    this.active = !this.active
    this.dialog$
      .querySelector('.items')
      ?.childNodes.forEach((item) => ((item as HTMLElement).tabIndex = 0))
    ;(
      this.dialog$
        .querySelector('.items')
        ?.querySelector('.selected') as HTMLElement
    )?.focus()
    this.dialog$
      .getAnimations({ subtree: true })
      .forEach((animation) => animation.finish())
    this.dialog$.animate(
      {
        opacity: ['0', '1'],
      },
      {
        duration: this.duration * 2,
        easing: 'ease-out',
        fill: 'forwards',
      },
    )
    this.tint$
      .getAnimations({ subtree: true })
      .forEach((animation) => animation.finish())
    this.tint$.animate(
      {
        opacity: ['33%', '0'],
      },
      {
        duration: this.duration * 2,
        easing: 'ease-in',
        fill: 'forwards',
      },
    )
  }

  async deactivate() {
    if (!this.active) return
    this.mainButton$.focus()
    this.dialog$
      .querySelector('.items')
      ?.childNodes.forEach((item) => ((item as HTMLElement).tabIndex = -1))
    this.dialog$
      .getAnimations({ subtree: true })
      .forEach((animation) => animation.finish())
    this.dialog$
      .animate(
        {
          opacity: ['1', '0'],
        },
        {
          duration: this.duration,
          easing: 'ease-out',
          fill: 'forwards',
        },
      )
      .addEventListener('finish', () => {
        this.active = false
      })
  }

  connectedCallback(): void {
    super.connectedCallback()
    document.addEventListener('click', () => {
      this.deactivate()
    })
  }

  render() {
    return html`
      <link href="/library/styles.css" rel="stylesheet" />

      <ui--button
        tier=${this.tier}
        icon-end="arrow_downward"
        tabindex="0"
        ?stretch=${true}
        ?align=${true}
        @click=${(event: Event) => {
          event.stopPropagation()
          if (this.active) this.deactivate()
          else this.activate()
        }}
      >
        ${(
          this.shadowRoot?.querySelector(
            `dialog .item[data-select-value=${this.value}]`,
          ) as HTMLElement
        )?.innerText ?? 'Select'}
      </ui--button>

      <dialog
        tabindex="-1"
        @keydown=${(event: KeyboardEvent) => {
          if (!this.active) return
          switch (event.key) {
            case 'Enter':
            case 'Escape':
              this.deactivate()
              break
          }
        }}
      >
        <div class="scrim"></div>
        <div class="tint"></div>
        <div class="items">
          ${this.slotItems
            .filter((item) => !item.classList.contains('utility--hide'))
            .flatMap((item, i) => {
              return html`
                <ui--button
                  tabindex="-1"
                  tier=${this.value === item.dataset.selectValue
                    ? 'primary'
                    : 'tertiary'}
                  ?focused=${this.value === item.dataset.selectValue}
                  icon-start=${(item as UIButton).iconStart}
                  icon-end=${(item as UIButton).iconEnd}
                  data-select-value=${item.dataset.selectValue ?? i}
                  ?stretch=${true}
                  ?align=${true}
                  ?light=${(item as UIButton).light}
                  class="
                    item 
                    ${this.value === item.dataset.selectValue ? 'selected' : ''}
                  "
                  @click=${(event: Event) => {
                    const item = event.currentTarget as UIButton
                    this.value = item.dataset.selectValue ?? i.toString()
                    this.dispatchEvent(
                      new CustomEvent('select', {
                        detail: this.value,
                        bubbles: true,
                      }),
                    )
                    this.deactivate()
                  }}
                  @keydown=${(event: KeyboardEvent) => {
                    if (!this.active) return
                    const target = event?.target as HTMLElement
                    switch (event.key) {
                      case 'ArrowLeft':
                      case 'ArrowUp':
                        ;(target.previousElementSibling as HTMLElement)?.focus()
                        event.preventDefault()
                        break
                      case 'ArrowRight':
                      case 'ArrowDown':
                        ;(target.nextElementSibling as HTMLElement)?.focus()
                        event.preventDefault()
                        break
                      case 'Enter':
                        target.click()
                        break
                    }
                  }}
                >
                  ${item.innerText}
                </ui--button>
              `
            })}
        </div>
      </dialog>

      <slot
        style="display: none;"
        @slotchange=${() => this.requestUpdate()}
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
      for (let slotItem of this.slotItems) {
        if (slotItem.dataset.selectValue === this.value) {
          if (slotItem.classList.contains('utility--hide')) {
            this.value = undefined
            break
          }
        }
      }
      this.requestUpdate()
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
    [NAME]: UISelect
  }
}
