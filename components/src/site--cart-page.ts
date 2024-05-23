import { html, css, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'

export type CartItem = {
  label: string
  href: string
  cost: number
  price_id: string
  quantity?: number
}

const NAME = 'site--cart-page'
export const tagName = NAME
@customElement(NAME)
export class SiteCartPage extends LitElement {
  static styles = css``

  connectedCallback(): void {
    super.connectedCallback()
    document.addEventListener('cartUpdated', () => {
      this.requestUpdate()
    })
  }

  handleCheckout() {
    const items = Object.values(
      document.querySelector('site--header')?.cart_items ?? {},
    )
    if (!items.length) return
    const data = items.map(({ price_id, quantity }) => ({
      price: price_id,
      quantity: quantity ?? 1,
    }))
    if (document.querySelector('site--header')?.user_profile) {
      open(
        '/.netlify/functions/checkout?line_items=' + JSON.stringify(data),
        '_self',
      )
    } else {
      document.dispatchEvent(
        new CustomEvent('login', {
          bubbles: true,
        }),
      )
    }
  }

  #updateQuantity(price_id: string, change: number) {
    document.dispatchEvent(
      new CustomEvent('updateQuantity', {
        detail: { price_id, change },
        bubbles: true,
      }),
    )
  }

  render() {
    const items = Object.values(
      document.querySelector('site--header')?.cart_items ?? {},
    )
    return html`
      <link href="/library/styles.css" rel="stylesheet" />
      <main
        class="layout--span--copy layout--container--grid --article layout--leading--thick"
      >
        <div
          id="cart--table"
          class="layout--leading layout--spacing"
          style="
          display: grid;
          grid-template-columns: 1fr auto auto auto;
          align-items: center;
        "
        >
          <div class="layout--container--contents">
            <span class="token--label--default">Product</span>
            <span class="token--label--default" style="text-align: end;"
              >Price</span
            >
            <span class="token--label--default" style="text-align: end;"
              >Quantity</span
            >
            <span class="token--label--default" style="text-align: end;"
              >Total</span
            >
          </div>

          <ui--separator style="grid-column: 1 / -1;"></ui--separator>

          ${items.length
            ? items.map(
                (item) => html`<div
                  class="layout--container--contents"
                  data--price-id=${item.price_id}
                >
                  <span class="token--value">${item.label}</span>
                  <span class="token--value">${item.cost.toFixed(2)}</span>

                  ${item.quantity
                    ? html`<span
                        class="layout--container--flex layout--spacing--none"
                      >
                        <ui--button
                          class="remove"
                          tier="secondary"
                          tabindex="0"
                          no-label
                          icon-start="remove"
                          @click=${() => {
                            this.#updateQuantity(item.price_id, -1)
                          }}
                        ></ui--button>
                        <ui--textinput
                          class="quantity"
                          tabindex="0"
                          alignment="end"
                          stretch
                          style="
                            width: 5ch; 
                            margin-inline: -0.0625rem;
                          "
                          >1</ui--textinput
                        >
                        <ui--button
                          class="add"
                          tier="secondary"
                          tabindex="0"
                          no-label
                          icon-start="add"
                          @click=${() => {
                            this.#updateQuantity(item.price_id, +1)
                          }}
                        ></ui--button>
                      </span>`
                    : html`<span
                        class="layout--container--flex layout--spacing--thin"
                        style="justify-self: end;"
                      >
                        <span class="token--value">1</span>
                        <ui--button
                          class="remove"
                          tier="secondary"
                          tabindex="0"
                          no-label
                          icon-start="close"
                          @click=${() => {
                            this.#updateQuantity(item.price_id, -1)
                          }}
                        ></ui--button>
                      </span>`}

                  <span class="token--value"
                    >${(item.cost * (item.quantity ?? 1)).toFixed(2)}</span
                  >
                </div>`,
              )
            : html`<span class="token--value">No items in cart.</span>`}

          <ui--separator style="grid-column: 1 / -1;"></ui--separator>
        </div>

        <aside class="layout--leading">
          <div
            id="cart--total"
            class="layout--leading--thin layout--spacing"
            style="
            display: grid;
            grid-template-columns: 1fr auto;
            align-items: center;
          "
          >
            <span class="token--label--default">Net Total</span>
            <span class="token--value"
              >${items
                .reduce((total, item) => total + item.cost, 0)
                .toFixed(2)}</span
            >
          </div>

          <ui--button
            id="cart--submit"
            tier="primary"
            featured
            stretch
            tabindex="0"
            @click=${this.handleCheckout}
            ?disabled=${!items.length}
            >${document.querySelector('site--header')?.user_profile
              ? 'Checkout with Stripe'
              : 'Log in to checkout'}</ui--button
          >
        </aside>
      </main>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [NAME]: SiteCartPage
  }
}
