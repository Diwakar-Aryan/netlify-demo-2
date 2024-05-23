import { html, css, LitElement } from 'lit'
import {
  customElement,
  property,
  query,
  queryAssignedElements,
} from 'lit/decorators.js'
import { UIButton } from './ui--button.js'

type Tier = 'primary' | 'quaternary'

const NAME = 'ui--switch'
export const tagName = NAME
@customElement(NAME)
export class UISwitch extends LitElement {
  static styles = css`
    :host {
      ----paper: var(
        --ui--switch--palette--paper,
        var(--palette--primary--paper)
      );
      ----ink: var(--ui--switch--palette--ink, var(--palette--primary--ink));
      --ui--base--palette--paper: var(----paper);
      --ui--base--palette--ink: var(----ink);
      width: fit-content;
    }

    :host > main > .tint {
      background: var(--palette--highlight);
      transition: opacity ease-out 200ms;
      opacity: 0;
    }
    :host(:active) > main > .tint {
      opacity: 33%;
    }

    :host > main > .content {
      z-index: 10;
      row-gap: 0;
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

    @media (width > 714px) {
      :host > main > .content > * {
        flex-basis: fit-content;
      }
    }

    :host(:not([tier='quaternary'])) .background {
      background: var(----paper);
      opacity: 10%;
      pointer-events: none;
    }

    :host(:not([tier='quaternary'])) .content {
      width: 100%;
      border: 1px solid var(----paper);
      justify-content: center;
    }

    :host([align]) .content {
      justify-content: start;
    }

    :host(:not([tier='quaternary'])) .content > * {
      margin-block: -1px;
    }

    :host([tier='tertiary']) .background {
      display: none;
    }

    :host([tier='tertiary']) .content {
      border: none;
    }

    :host([tier='tertiary']) .content > * {
      margin: unset;
    }

    :host([tier='quaternary']) {
      ----paper: currentColor;
    }

    :host([tier='quaternary']) .content {
      flex-wrap: wrap;
      gap: var(--m-h);
    }

    :host([tier='quaternary']) .item {
      opacity: 50%;
      transition: opacity 0.2s ease-in-out;
      --ui--base--padding--inline: 0.25rem;
    }
    :host([tier='quaternary']) .item:hover {
      opacity: 66%;
    }
    :host([tier='quaternary']) .item.selected {
      opacity: 90%;
    }
    :host([tier='quaternary']) .item.selected:hover {
      opacity: 100%;
    }

    :host([tier='quaternary']) .item--separator {
      font-size: var(--m1h);
      opacity: 10%;
    }

    :host([tier='quaternary'][heavy]) .item--separator {
      font-weight: bold;
    }
  `

  @property({ type: String })
  tier: Tier = 'primary'
  @property({ type: Boolean })
  stretch = false
  @property({ type: Boolean })
  align = false
  @property({ type: Boolean, reflect: true })
  heavy = false
  @property({ type: Boolean, reflect: true })
  error = false
  @property({ type: Boolean, reflect: true })
  disabled = false
  @property({ type: String, reflect: true })
  value?: string

  @query(':host .tint')
  tint$!: HTMLElement
  duration = 100

  @queryAssignedElements()
  slotItems!: Array<HTMLElement>
  #handleSlotChange() {
    if (this.slotItems.some((item) => !!item.tagName.match(/^H[1-6]/)))
      this.heavy = true
    this.requestUpdate()
  }

  #handleItemClick(event: Event) {
    let value_
    if (this.tier === 'quaternary') {
      value_ =
        ((event?.target as HTMLButtonElement).children[0] as HTMLElement)
          .dataset.switchValue ?? undefined
    } else {
      value_ =
        (event?.target as HTMLButtonElement).dataset.switchValue ?? undefined
    }
    if (value_) this.value = value_
    else return
    this.requestUpdate()
    this.dispatchEvent(
      new CustomEvent('switch', {
        detail: this.value,
        bubbles: true,
      }),
    )
  }

  render() {
    return html`
      <link href="/library/styles.css" rel="stylesheet" />

      ${this.tier === 'quaternary'
        ? html`<main class="layout--container--stack">
            <div class="layout--container--flex content">
              ${this.slotItems
                .filter((item) => !item.classList.contains('utility--hide'))
                .flatMap(
                  (item, i) => html`
                    <ui--button
                      tabindex="0"
                      tier=${this.tier}
                      align
                      class="
                      item
                      ${this.value === item.dataset.switchValue
                        ? 'selected'
                        : ''}
                    "
                      @click=${this.#handleItemClick}
                    >
                      ${item.cloneNode(true)}
                    </ui--button>
                    ${i < this.slotItems.length - 1
                      ? html`<div class="item--separator">/</div>`
                      : ''}
                  `,
                )}
            </div>
          </main>`
        : html`<main
            class="layout--container--stack"
            @click=${() => {
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
            }}
          >
            <div class="background"></div>
            <div class="tint"></div>
            <div class="content layout--container--flex">
              ${this.slotItems
                .filter((item) => !item.classList.contains('utility--hide'))
                .flatMap(
                  (item, i) => html`
                    <ui--button
                      tabindex="0"
                      tier=${this.value === item.dataset.switchValue
                        ? 'primary'
                        : 'tertiary'}
                      ?focused=${this.value === item.dataset.switchValue}
                      icon-start=${(item as UIButton).iconStart}
                      icon-end=${(item as UIButton).iconEnd}
                      align
                      stretch
                      data-switch-value=${item.dataset.switchValue ?? i}
                      class="
                      item
                      ${this.value === item.dataset.switchValue
                        ? 'selected'
                        : ''}
                    "
                      @click=${this.#handleItemClick}
                    >
                      ${item.innerText}
                    </ui--button>
                  `,
                )}
            </div>
          </main>`}

      <slot style="display: none;" @slotchange=${this.#handleSlotChange}></slot>
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
        if (slotItem.dataset.switchValue === this.value) {
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
    [NAME]: UISwitch
  }
}
