import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

export type CartItem = {
  label: string
  href: string
  cost: number
  price_id: string
  quantity?: number
}

const NAME = 'site--cart'
export const tagName = NAME
@customElement(NAME)
export class SiteCart extends LitElement {
  static styles = css``

  @property({ reflect: true, type: Object })
  items: Record<string, CartItem> = {}

  #loadCart() {
    this.items = JSON.parse(localStorage.getItem('cart_items') ?? 'null') ?? {}
  }

  #saveCart() {
    localStorage.setItem('cart_items', JSON.stringify(this.items))
    this.requestUpdate()
    this.shadowRoot?.querySelector('ui--notification-dot')?.bounce()
    document.dispatchEvent(
      new CustomEvent('cartUpdated', {
        detail: this.items,
        bubbles: true,
      }),
    )
  }

  #updateCart(item: CartItem, add = true) {
    if (add) {
      this.items[item.price_id] = item
    } else {
      delete this.items[item.price_id]
    }
    this.#saveCart()
  }

  #updateQuantity(price_id: string, change: number) {
    if (!this.items[price_id]) return
    const quantity_ = (this.items[price_id].quantity ?? 1) + change
    if (quantity_ <= 0) delete this.items[price_id]
    else this.items[price_id].quantity = quantity_
    this.#saveCart()
  }

  #checkthru() {
    const params = new URLSearchParams(location.search)
    if (params.has('checkthru')) {
      const url = new URL(location.toString())
      params.delete('checkthru')
      url.search = params.toString()
      window.history.replaceState({}, document.title, url.href)

      this.items = {}
      this.#saveCart()

      window.setTimeout(() => {
        document.dispatchEvent(
          new CustomEvent('login', {
            detail: true,
            bubbles: true,
          }),
        )
      }, 1000)
    }
  }

  connectedCallback(): void {
    super.connectedCallback()

    this.#loadCart()
    this.#checkthru()

    document.addEventListener('addCart', (event) => {
      const item = (event as CustomEvent).detail as CartItem
      this.#updateCart(item, true)
    })

    document.addEventListener('removeCart', (event) => {
      const item = (event as CustomEvent).detail as CartItem
      this.#updateCart(item, false)
    })

    document.addEventListener('updateQuantity', (event) => {
      const price_id = (event as CustomEvent).detail.price_id
      const change = (event as CustomEvent).detail.change
      this.#updateQuantity(price_id, change)
    })
  }

  render() {
    return html`
      <link href="/library/styles.css" rel="stylesheet" />
      <main>
        <ui--notification-dot ?hide=${!Object.keys(this.items).length}>
          <ui--button
            tabindex="0"
            tier="tertiary"
            no-label
            icon-start="shopping_cart"
            link
            href="/cart"
            target="_self"
          ></ui--button>
        </ui--notification-dot>
      </main>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [NAME]: SiteCart
  }
}
