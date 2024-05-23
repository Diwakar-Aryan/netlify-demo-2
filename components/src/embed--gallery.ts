import { html, css, LitElement } from 'lit'
import {
  customElement,
  property,
  query,
  queryAssignedElements,
} from 'lit/decorators.js'
import sleep from 'sleep-promise'

const NAME = 'embed--gallery'
export const tagName = NAME
@customElement(NAME)
export class EmbedGallery extends LitElement {
  static styles = css`
    :host {
      ----ink: var(--embed--gallery--palette--ink, var(--palette--primary));
      ----min-width-medium: var(--embed--gallery--min-width-medium, 18em);
      ----min-width-small: var(--embed--gallery--min-width-small, 12em);
      display: block;
    }
    :host(*:not([active])) > dialog {
      display: none;
    }

    * {
      box-sizing: border-box;
    }

    main {
      width: 100%;
      --layout--container--flexgrid--min-width: var(----min-width-medium);
    }
    main > *,
    main > .default > * {
      width: 100%;
      height: 100%;
      aspect-ratio: 1.618 / 1;
      object-fit: cover;
    }
    main > .default > * {
      cursor: pointer;
    }
    main .--tall {
      grid-row: span 2;
      aspect-ratio: unset;
    }
    @media (max-width: 714px) {
      main {
        --layout--container--flexgrid--min-width: var(----min-width-small);
      }
      main > *,
      main > .default > * {
        aspect-ratio: 1 / 1;
      }
    }

    nav {
      grid-column-end: -1;
      display: grid;
      justify-content: end;
      align-items: end;
      aspect-ratio: unset;
    }

    dialog {
      opacity: 0;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 1000;
      display: grid;
      backdrop-filter: blur(1rem) contrast(50%);
      background: #111d;
      outline: none;
      overscroll-behavior: none;
      overflow: auto;
      padding: 0;
      border: 0;
    }
    dialog > * {
      grid-area: 1 / 1 / -1 / -1;
    }

    .content {
      padding-inline: 48px;
      overflow: auto hidden;
      scroll-snap-type: x mandatory;
      scrollbar-width: none;

      /* Firefox */
      display: grid;
      grid-auto-columns: auto;
      grid-auto-flow: column;
      gap: var(--m1);
    }
    .content::-webkit-scrollbar {
      display: none;
      /* Safari and Chrome */
    }
    :where(.content, ::slotted(*)) > * {
      object-fit: contain;
      width: 100vw;
      height: 100vh;
      scroll-snap-align: center;
    }
    .content > * {
      max-width: unset;
    }

    .controls {
      display: grid;
      grid-template-columns: 1fr 2fr 1fr;
      pointer-events: none;
    }
    .controls > button {
      grid-row: 1 / -1;
      height: 100%;
      pointer-events: auto;
      cursor: pointer;
      border: none;
      opacity: 0%;
      transition: opacity 0.2s ease-in-out;
      background: transparent;
      color: #fffa;
    }
    @media (any-hover: none) {
      .controls > button {
        display: none;
      }
    }
    .controls > button:hover {
      opacity: 75%;
    }
    .controls > .next {
      grid-column-end: -1;
    }
    .controls > :is(.previous, .next) {
      font-size: 4rem;
    }
    .controls > .close {
      opacity: 50%;
      grid-column-end: -1;
      font-size: 2rem;
      height: 6rem;
      padding: 2rem;
      display: grid;
      align-items: start;
      justify-content: end;
    }

    .token--icon {
      font-family: 'Material Icons Round';
      font-weight: normal;
      font-style: normal;
      font-size: 1em;
      line-height: 1em;
      letter-spacing: normal;
      text-transform: none;
      display: inline-block;
      white-space: nowrap;
      word-wrap: normal;
      direction: ltr;
      font-feature-settings: 'liga';
      -webkit-font-smoothing: antialiased;
      width: 1em;
      height: 1em;
      background: #000c;
      border-radius: 50%;
    }
  `

  @property({ type: String })
  label!: string
  @property({ type: String })
  href = ''

  @query('main')
  main$!: HTMLElement

  @query('dialog')
  dialog$!: HTMLElement
  @query('.content')
  content$!: HTMLElement
  @query('.previous')
  previous$!: HTMLElement
  @query('.next')
  next$!: HTMLElement
  @query('.close')
  close$!: HTMLElement

  @queryAssignedElements()
  slotItems!: Array<HTMLElement>

  manageButtons() {
    const width = window.innerWidth
    if (this.content$.scrollWidth - this.content$.scrollLeft <= width * 1.5) {
      this.next$.style.pointerEvents = 'none'
    } else {
      this.next$.style.pointerEvents = 'auto'
    }
    if (this.content$.scrollLeft <= width) {
      this.previous$.style.pointerEvents = 'none'
    } else {
      this.previous$.style.pointerEvents = 'auto'
    }
  }

  @property({ reflect: true, type: Boolean })
  active = false
  duration = 200

  async activate(event: Event) {
    const target = event.target as HTMLElement
    if (target.classList.contains('--skip')) return

    const index = Array.from(
      (target.parentNode as HTMLElement)?.children,
    ).indexOf(target)

    this.active = true
    await sleep(0)
    this.content$
      .querySelector(`[data-gallery-index="${index}"]`)
      ?.scrollIntoView()
    this.manageButtons()
    this.dialog$.focus()

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
  }

  async deactivate(_: Event) {
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

  render() {
    return html`
      <link href="/library/styles.css" rel="stylesheet" />
      <main class="layout--container--flexgrid">
        <div class="default" style="display: contents;" @click=${this.activate}>
          ${this.slotItems.map((item) => item.cloneNode(true))}
        </div>
        ${this.label
          ? html`<nav>
              <ui--button
                link
                href=${this.href}
                tier="secondary"
                icon-end="arrow_forward"
              >
                ${this.label}
              </ui--button>
            </nav>`
          : ''}
      </main>
      <dialog
        tabindex="0"
        @keydown=${(event: KeyboardEvent) => {
          if (!this.active) return
          switch (event.key) {
            case 'ArrowLeft':
              this.previous$.click()
              break
            case 'ArrowRight':
              this.next$.click()
              break
            case 'Escape':
              this.close$.click()
              break
          }
        }}
      >
        <div class="content">
          ${this.slotItems
            .map((item, index) => {
              if (item.classList.contains('--skip')) return false
              const item_ = item.cloneNode(true) as HTMLElement
              item_.classList.add('--gallery')
              item_.dataset.galleryIndex = index.toString()
              return html`${item_}`
            })
            .filter((item) => item)}
        </div>
        <div class="controls">
          <button
            class="previous"
            @click=${() => {
              this.content$.scrollBy(-window.innerWidth, 0)
              this.manageButtons()
            }}
          >
            <span class="token--icon">keyboard_arrow_left</span>
          </button>
          <button
            class="next"
            @click=${() => {
              this.content$.scrollBy(window.innerWidth, 0)
              this.manageButtons()
            }}
          >
            <span class="token--icon">keyboard_arrow_right</span>
          </button>
          <button class="close" @click=${this.deactivate}>
            <span class="token--icon">close</span>
          </button>
        </div>
      </dialog>
      <slot
        @slotchange=${() => this.requestUpdate()}
        style="display: none;"
      ></slot>
    `
  }

  connected() {
    this.content$.scroll(window.innerWidth / 2, 0)
  }

  updated() {
    this.manageButtons()
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [NAME]: EmbedGallery
  }
}
