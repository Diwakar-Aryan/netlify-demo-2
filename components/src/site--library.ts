import { html, css, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'
import { until } from 'lit/directives/until.js'

export type CartItem = {
  label: string
  href: string
  cost: number
  price_id: string
  quantity?: number
}

const NAME = 'site--library'
export const tagName = NAME
@customElement(NAME)
export class SiteLibrary extends LitElement {
  static styles = css``

  render() {
    const library: Record<string, Array<string>> = document.querySelector(
      'site--header',
    )?.user_profile?.app_metadata?.library
    const notes: Record<string, any> = fetch('/data/notes.json').then(
      (response) => response.json(),
    )
    return html`
      <link href="/library/styles.css" rel="stylesheet" />
      <main
        class="layout--span--copy layout--container--grid layout--leading--thick"
      >
        ${library?.['notes'].length
          ? html`<div
              id="notes--index"
              class="layout--container--grid"
              data-container-empty
            >
              ${Object.values(library?.['notes'] ?? []).map((id) =>
                until(
                  notes.then((notes: Record<string, any>) => {
                    const note = notes[id]
                    if (!note) return ''
                    return html`
                      <site--note
                        id="notes__${note.slug}"
                        title="${note.title}"
                        cover="${note.cover}"
                        language="${note.language}"
                        topics=${JSON.stringify(note.topics)}
                        ${note.topics
                          .map((topic: string) => `data-topic-${topic}`)
                          .join(' ')}
                        pdf="${note.pdf}"
                        cost="${note.cost}"
                        price_id="${note.price_id}"
                        ?locked=${false}
                      >
                      </site--note>
                    `
                  }),
                  html`Loading`,
                ),
              )}
            </div>`
          : html`<span>Your library is empty</span>`}
      </main>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [NAME]: SiteLibrary
  }
}
