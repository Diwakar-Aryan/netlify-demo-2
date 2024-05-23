import { html } from 'code-tag'
import content from '../content.js'
import { parseMdBlock, writeFile, uniques, capitalize } from '../utilities.js'
import base from '../templates/base.js'
import page from '../templates/page.js'
import coverPartial from '../partials/cover.js'
import Stripe from 'stripe'

const slug = 'notes'
const notes = content.cms.singletons.notes
const languages = uniques(
  Object.values(content.cms.notes).map((note) => note.data.language),
)
const topics = uniques(
  Object.values(content.cms.notes).flatMap(
    (note) => note.data.topics,
  ) as string[],
)

export const registerProducts = async () => {
  if (!process.env.STRIPE_SECRET) {
    console.warn('No Stripe key found. Skipping product registration')
    return
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET, {
    // @ts-ignore
    apiVersion: null,
  })

  for (let key in content.cms.notes) {
    const value = content.cms.notes[key]
    const id = `notes__${key}`
    let product
    try {
      // Check if the product exists
      product = await stripe.products.retrieve(id)
      let price_id = product.default_price as string
      if (price_id) {
        // Generate a new default price if changed
        let price = await stripe.prices.retrieve(price_id)
        if (price?.unit_amount !== value.data.cost * 100) {
          price = await stripe.prices.create({
            currency: 'inr',
            unit_amount: value.data.cost * 100,
            product: id,
          })
          price_id = price.id
        }
      }
      // Update the product
      product = await stripe.products.update(id, {
        name: `Note · ${value.data.title}`,
        default_price: price_id,
      })
      value.data.price_id = price_id
    } catch (error) {
      // Create the product if new
      product = await stripe.products.create({
        id,
        name: `Note · ${value.data.title}`,
        default_price_data: {
          currency: 'inr',
          unit_amount: value.data.cost * 100,
        },
      })
      value.data.price_id = product.default_price as string
    }
  }
}

export const template = () => {
  return html`
    ${base({
      title: `Wabisabi Project · Notes`,
      description: notes.data.description,
      body: page({
        body: html`
          <main>
            ${coverPartial({ cover: notes.data.cover, title: 'Notes' })}

            <section
              id="blurb"
              class="layout--container--grid --article layout--bleeding layout--leading--thick layout--lining--thick"
            >
              <div class="layout--container--grid --article">
                <blockquote>${parseMdBlock(notes.data.blurb)}</blockquote>

                ${parseMdBlock(notes.content)}
              </div>

              <aside>${parseMdBlock(notes.data.callout)}</aside>

              <style>
                #blurb {
                  background: var(--palette--primary);
                  color: var(--palette--lightest);
                }
              </style>
            </section>

            <color--palette
              primary="${content.cms.singletons.palettes.data.neutral.primary}"
              secondary="${content.cms.singletons.palettes.data.neutral
                .secondary}"
            >
              <section
                id="notes"
                class="layout--container--grid layout--bleeding layout--leading--thick layout--lining--thick"
              >
                <nav style="display: grid; gap: var(--m1);">
                  <ui--separator custom heavy>
                    <ui--switch id="notes--topic" tier="quaternary" value="any">
                      <h3 data-switch-value="any">All</h3>
                      ${topics
                        .map(
                          (topic) =>
                            html`<h3 data-switch-value="${topic}">
                              ${capitalize(topic)}
                            </h3>`,
                        )
                        .join('\n')}
                    </ui--switch>
                    <h5 slot="sub">Topic</h5>
                  </ui--separator>
                  <ui--separator custom heavy>
                    <ui--switch
                      id="notes--language"
                      tier="quaternary"
                      value="any"
                    >
                      <h3 data-switch-value="any">All</h3>
                      ${languages
                        .map(
                          (language) =>
                            html`<h3 data-switch-value="${language}">
                              ${language}
                            </h3>`,
                        )
                        .join('\n')}
                    </ui--switch>
                    <h5 slot="sub">Language</h5>
                  </ui--separator>
                  <ui--separator custom heavy>
                    <ui--switch
                      id="notes--access"
                      tier="quaternary"
                      value="any"
                    >
                      <h3 data-switch-value="any">All</h3>
                      <h3 data-switch-value="locked">Locked</h3>
                      <h3 data-switch-value="unlocked">Unlocked</h3>
                    </ui--switch>
                    <h5 slot="sub">Access</h5>
                  </ui--separator>
                </nav>

                <div
                  id="notes--index"
                  class="layout--container--grid"
                  data-container-empty
                >
                  ${Object.values(content.cms.notes)
                    .map(
                      (note) =>
                        html`
                          <site--note
                            locked
                            id="notes__${note.data.slug}"
                            title="${note.data.title}"
                            cover="${note.data.cover}"
                            language="${note.data.language}"
                            topics=${JSON.stringify(note.data.topics)}
                            ${note.data.topics
                              .map((topic: string) => `data-topic-${topic}`)
                              .join(' ')}
                            pdf="${note.data.pdf}"
                            cost="${note.data.cost}"
                            price_id="${note.data.price_id}"
                          >
                            <article class="layout--container--grid --article">
                              ${parseMdBlock(note.content)}
                            </article>
                          </site--note>
                        `,
                    )
                    .join('\n')}
                  <span data-empty class="utility--hide">No Notes found</span>
                </div>

                <script>
                  // Mark owned Notes
                  document.addEventListener('loggedthru', (event) => {
                    const unlockedNotes =
                      document.querySelector('site--header').user_profile
                        ?.app_metadata?.library?.notes ?? []
                    unlockedNotes.forEach((id) => {
                      const note = document.querySelector('#notes__' + id)
                      if (note) {
                        note.locked = false
                      }
                    })
                  })

                  // Workshop details filtering by location
                  const handleNotesFilter = () => {
                    const topic = document.querySelector('#notes--topic').value
                    const language =
                      document.querySelector('#notes--language').value
                    const access =
                      document.querySelector('#notes--access').value

                    // Hide every empty placeholder
                    document
                      .querySelectorAll('#notes--index [data-empty]')
                      .forEach(($) => {
                        $.classList.add('utility--hide')
                      })

                    // Reshow all content
                    document
                      .querySelectorAll('#notes--index site--note')
                      .forEach(($) => {
                        $.classList.remove('utility--hide')
                      })

                    // Hide every content of the wrong topic
                    if (topic !== 'any')
                      document
                        .querySelectorAll(
                          '#notes--index ' +
                            'site--note' +
                            ':not(.utility--hide)' +
                            ':not([data-topic-' +
                            topic +
                            '])',
                        )
                        .forEach(($) => {
                          $.classList.add('utility--hide')
                        })

                    // Hide every content of the wrong language
                    if (language !== 'any')
                      document
                        .querySelectorAll(
                          '#notes--index ' +
                            'site--note' +
                            ':not(.utility--hide)' +
                            ':not([language=' +
                            language +
                            ' i])',
                        )
                        .forEach(($) => {
                          $.classList.add('utility--hide')
                        })

                    // Hide every content of the wrong access
                    if (access !== 'any')
                      document
                        .querySelectorAll(
                          '#notes--index ' +
                            'site--note' +
                            ':not(.utility--hide)' +
                            (access === 'locked'
                              ? ':not([locked])'
                              : '[locked]'),
                        )
                        .forEach(($) => {
                          $.classList.add('utility--hide')
                        })

                    // Show the empty placeholders if there's no content to show
                    if (
                      document.querySelectorAll(
                        '#notes--index site--note:not(.utility--hide)',
                      ).length === 0
                    ) {
                      document
                        .querySelector('#notes [data-empty]')
                        .classList.remove('utility--hide')
                    }
                  }
                  document
                    .querySelector('#notes--topic')
                    .addEventListener('switch', handleNotesFilter)
                  document
                    .querySelector('#notes--language')
                    .addEventListener('switch', handleNotesFilter)
                  document
                    .querySelector('#notes--access')
                    .addEventListener('switch', handleNotesFilter)
                  document.addEventListener('readystatechange', (event) => {
                    if (document.readyState === 'complete') handleNotesFilter()
                  })

                  const handleCartItems = () => {
                    const items =
                      document.querySelector('site--header').cart_items
                    const notes = document.querySelectorAll('site--note')
                    notes.forEach((note) => {
                      if (note.price_id && note.price_id in items)
                        note.selected = true
                    })
                  }
                  document.addEventListener('readystatechange', (event) => {
                    if (document.readyState === 'complete') handleCartItems()
                  })
                </script>
              </section>
            </color--palette>
          </main>
        `,
        currentPage: `/${slug}`,
      }),
    })}
  `
}

export const data = () => {
  return Object.fromEntries(
    Object.entries(content.cms.notes).map(([key, value]) => [key, value.data]),
  )
}

export default async () => {
  // sideeffects
  console.log('Registering Notes as products')
  await registerProducts()
  // html
  const path = `./dist/${slug}/index.html`
  console.log(`Generating ${path}`)
  writeFile(path, template())
  // data
  writeFile(`./dist/data/notes.json`, JSON.stringify(data(), null, 2))
}
