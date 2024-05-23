import { html, css, LitElement } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'

type Tier = 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary'

const NAME = 'ui--button'
export const tagName = NAME
@customElement(NAME)
export class UIButton extends LitElement {
  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  }

  static styles = css`
    :host {
      outline: none;
    }
    :host([stretch]) {
      width: 100%;
    }
  `

  @property({ type: Number })
  tabindex = -1
  @property({ type: Boolean })
  autofocus = false
  @property({ type: Boolean, reflect: true })
  focused = false

  @property({ type: String })
  tier: Tier = 'secondary'
  @property({ type: Boolean })
  featured = false
  @property({ type: Boolean })
  stretch = false
  @property({ type: Boolean })
  align = false
  @property({ type: Boolean })
  light = false
  @property({ type: Boolean, reflect: true })
  error = false
  @property({ type: Boolean, reflect: true })
  disabled = false

  @property({ attribute: 'icon-start', type: String })
  iconStart = undefined
  @property({ attribute: 'icon-end', type: String })
  iconEnd = undefined

  @property({ attribute: 'padding-inline', type: Number })
  paddingInline = 0
  @property({ attribute: 'padding-block', type: Number })
  paddingBlock = 0

  @property({ attribute: 'no-label', type: Boolean })
  noLabel = false

  @property({ type: Boolean })
  link = false
  @property({ attribute: 'aria-label', type: String })
  ariaLabel = ''
  @property({ type: String })
  href = '#'
  @property({ type: String })
  target = '_blank'

  @query('.ui--token--tint')
  tint$!: HTMLElement

  duration = 100

  render() {
    const buttonContent = () => html`
      <div class="ui--token--background">
        <div class="ui--token--background--background"></div>
        <div class="ui--token--background--border"></div>
      </div>
      <div class="ui--token--tint"></div>
      <div class="ui--token--content">
        ${this.iconStart
          ? html`<span class="token--icon">${this.iconStart}</span>`
          : ''}
        ${this.noLabel
          ? ''
          : html`<span class="token--label--button"><slot></slot></span>`}
        ${this.iconEnd
          ? html`<span class="token--icon">${this.iconEnd}</span>`
          : ''}
      </div>
      <div class="ui--token--border"></div>
    `

    return html`
      <link href="/library/styles.css" rel="stylesheet" />
      ${this.link
        ? html`<a
            aria-label="${this.ariaLabel}"
            href="${this.href}"
            target="${this.target}"
            tabindex="${this.tabindex}"
            ?autofocus="${this.autofocus}"
            class="
              ui--button 
              --${this.tier} 
              ${this.featured ? '--featured' : ''}
              ${this.stretch ? '--stretch' : ''} 
              ${this.align ? '--align' : ''} 
              ${this.error ? '--error' : ''} 
              ${this.disabled ? '--disabled' : ''} 
              ${this.iconStart ? '--icon-start' : ''} 
              ${this.iconEnd ? '--icon-End' : ''} 
              ${this.focused ? '--focused' : ''}
            "
          >
            ${buttonContent()}
          </a>`
        : html`<button
            aria-label="${this.ariaLabel}"
            tabindex="${this.tabindex}"
            ?autofocus="${this.autofocus}"
            class="
              ui--button 
              --${this.tier}
              ${this.featured ? '--featured' : ''}
              ${this.stretch ? '--stretch' : ''}
              ${this.align ? '--align' : ''}
              ${this.error ? '--error' : ''}
              ${this.disabled ? '--disabled' : ''}
              ${this.light ? '--light' : ''}
              ${this.iconStart ? '--icon-start' : ''}
              ${this.iconEnd ? '--icon-End' : ''}
              ${this.focused ? '--focused' : ''}
            "
            @click=${() => {
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
            }}
          >
            ${buttonContent()}
          </button>`}
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [NAME]: UIButton
  }
}
