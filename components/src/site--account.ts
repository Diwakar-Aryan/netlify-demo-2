import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

const NAME = 'site--account'
export const tagName = NAME
@customElement(NAME)
export class SiteAccount extends LitElement {
  static styles = css``

  @property({ state: true, type: Boolean })
  isLoggedIn = false

  static parseJWT(token: string) {
    var base64Url = token.split('.')[1]
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )
    return JSON.parse(jsonPayload)
  }

  static login(force = false) {
    if (force || !localStorage.getItem('user_profile')) {
      window.location.assign(
        '/.netlify/functions/login?thru=' + location.pathname,
      )
    }
  }

  static logout() {
    document.cookie =
      'user_id' + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    localStorage.removeItem('user_profile')
    window.location.assign('/.netlify/functions/logout')
  }

  static logthru() {
    const params = new URLSearchParams(location.search)
    if (params.has('id_token')) {
      const id_token = params.get('id_token') ?? ''

      const url = new URL(location.toString())
      params.delete('id_token')
      url.search = params.toString()
      window.history.replaceState({}, document.title, url.href)

      const user_profile = SiteAccount.parseJWT(id_token)
      delete user_profile.sub
      delete user_profile.sid
      localStorage.setItem('user_profile', JSON.stringify(user_profile))
    }

    document.dispatchEvent(
      new CustomEvent('loggedthru', {
        detail: JSON.parse(localStorage.getItem('user_profile') ?? 'null'),
        bubbles: true,
      }),
    )
  }

  connectedCallback(): void {
    super.connectedCallback()
    document.addEventListener('login', (event) => {
      SiteAccount.login((event as CustomEvent).detail)
    })
    document.addEventListener('logout', () => {
      SiteAccount.logout()
    })
    document.addEventListener('loggedthru', () => {
      this.isLoggedIn = !!localStorage.getItem('user_profile')
      this.requestUpdate()
    })

    SiteAccount.logthru()
  }

  render() {
    return html`
      <link href="/library/styles.css" rel="stylesheet" />
      <main>
        <ui--button
          class="account--button"
          tabindex="0"
          tier="tertiary"
          no-label
          icon-start="${this.isLoggedIn ? 'account_circle' : 'login'}"
          link
          href="/account"
          target="_self"
        ></ui--button>
      </main>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [NAME]: SiteAccount
  }
}
