import { html } from 'code-tag'
import content from '../content.js'
import {
  parseMdBlock,
  parseMd,
  rootToCwd,
  writeFile,
  readFile,
  cpDir,
  uniques,
  attr,
} from '../utilities.js'
import base from '../templates/base.js'
import page from '../templates/page.js'
import coverPartial from '../partials/cover.js'
import { previewGallery, galleryPage } from '../partials/gallery.js'
import pandemicPartial from '../partials/pandemic.js'

const GALLERYSIZE = 8

export const program = (slug: string) => {
  const workshops = content.cms.workshops
  const program = content.cms.programs[slug]
  const programWorkshops = Object.values(workshops)
    .filter((workshop) => workshop.data.programs.includes(program.data.slug))
    .sort((a, b) => a.data.duration - b.data.duration)
  const programCustom = content.custom.programs[slug] ?? ''
  const getProgramLocations = (program: any) => {
    const programLocations = [
      ...(Object.values(content.cms.workshops)
          .filter((workshop: any) => workshop.data.programs.includes(program.data.slug))
          .map((workshop: any) => workshop.data.locations)
        ),
      // ...(program.data.excursions?.map(
      //   (slug: string) => content.cms.excursions[slug].data.locations,
      // ) ?? []),
    ]
    return uniques(programLocations.flatMap((locations) => locations))
      .sort()
  }

  return html`
    ${base({
      title: `Wabisabi Project · ${program.data.title}`,
      description: program.data.description,
      body: page({
        body: html`
          <main id="program">
            ${coverPartial({
              cover: program.data.cover,
              title: program.data.title,
              subtitle: 'Program',
              tall: true,
            })}

            <section
              id="blurb"
              class="layout--container--grid --article layout--bleeding layout--lining--thick layout--leading--thick"
            >
              <blockquote>${parseMdBlock(program.data.blurb)}</blockquote>

              <h3>Recommended by</h3>

              <div id="blurb--sources" class="layout--container--flexgrid">
                ${content.cms.singletons.accolades.data.sources
                  .map(
                    ({
                      title,
                      link,
                      identity,
                    }: {
                      title: string
                      link: string
                      identity: string
                    }) => html` <a href="${link}" title="${title}">
                      ${readFile(rootToCwd(identity))}
                    </a>`,
                  )
                  .join('\n')}
              </div>

              <ui--button
                id="blurb--brochure"
                link
                href="${program.data.brochure}"
                tabindex="0"
                featured
                tier="primary"
                class="layout--span--minute --end"
                stretch
                >Download Brochure</ui--button
              >

              <style>
                #blurb {
                  background: var(--palette--primary);
                  color: var(--palette--lightest);
                }
                #blurb--sources {
                  --layout--container--flexgrid--min-width: 5rem;
                  align-items: center;
                }
                @media (max-width: 714px) {
                  #blurb--sources {
                    opacity: 90%;
                    --layout--container--flexgrid--min-width: 1fr;
                    row-gap: 2rem;
                    padding-block: 2rem;
                  }
                }
                #blurb--sources a {
                  width: fit-content;
                  height: fit-content;
                }
                #blurb--sources svg {
                  /* margin: -5%; */
                  height: auto;
                }
                #blurb--brochure {
                  --ui--base--palette--paper: var(--palette--lightest);
                  --ui--base--palette--ink: var(--palette--primary);
                  align-self: center;
                }
              </style>
            </section>

            <section
              id="workshops"
              class="layout--container--grid layout--bleeding layout--lining--thick layout--leading--thick"
            >
              ${program.data.locations.length >= 2
                ? html` <nav>
                    <ui--separator custom heavy>
                      <ui--switch
                        id="workshops--location"
                        tier="quaternary"
                        value="${program.data.locations[0]}"
                      >
                        ${program.data.locations
                          .map(
                            (location: string) =>
                              html`<h3 data-switch-value="${location}">
                                ${content.cms.locations[location].data.title}
                              </h3>`,
                          )
                          .join('')}
                      </ui--switch>
                      <h5 slot="sub">Location</h5>
                    </ui--separator>
                  </nav>`
                : ''}

              <ui--accordion
                id="workshops--details"
                class="layout--container--grid"
              >
                ${programWorkshops
                  .map(
                    (workshop, i) => html`<ui--details
                      no-hotspot
                      data-location
                      ${workshop.data.locations.length <= 1 && i === 0 ? 'open' : ''}
                      ${workshop.data.locations
                        .map((location: string) => `data-location-${location}`)
                        .join(' ')}
                    >
                      <h3 slot="summary">${workshop.data.title}</h3>
                      <article class="layout--container--grid --article">
                        <div class="layout--container--grid">
                          ${parseMdBlock(workshop.content)}
                          <div class="workshops--info">
                            <section class="workshops--detail">
                              <div>
                                <div class="token--featured">
                                ${workshop.data.costIndividual ? workshop.data.costIndividual + ' INR' : '—'}
                                </div>
                                <div class="token--label--small">
                                  Individual Cost
                                </div>
                              </div>
                              <div>
                                <div class="token--featured">
                                  ${workshop.data.costGroup} INR
                                </div>
                                <div class="token--label--small">
                                  Group Cost per Person <strong>(≥${workshop.data.minGroup})</strong>
                                </div>
                              </div>
                              <div>
                                <div class="token--featured">
                                  ${workshop.data.date ?? 'Per request'}
                                </div>
                                <div class="token--label--small">
                                  Date
                                </div>
                              </div>
                              <div>
                                <div class="token--featured">
                                  ${workshop.data.time ?? '6 hours per day'}
                                </div>
                                <div class="token--label--small">
                                  Time
                                </div>
                              </div>
                              <div>
                                <div class="token--featured">
                                  ${workshop.data.locations.map((location: string) => content.cms.locations[location].data.title).join(', ')}
                                </div>
                                <div class="token--label--small">
                                  Offered at
                                </div>
                              </div>
                              <div style="grid-column: 1 / -1;">
                                <div class="token--featured">
                                  ${
                      workshop.data.programs
                        .map(
                          (slug: string) =>
                            html`<a href="/workshops/${slug}"
                                                        >${content.cms.programs[slug].data
                                .title}</a
                                                      >`,
                        )
                        .join('')}
                                                ${workshop.data.excursions
                        ?.map(
                          (slug: string) =>
                            html`<a href="/workshops/${slug}"
                                                        >${content.cms.excursions[slug].data
                                .title}</a
                                                      >`,
                        )
                      .join('') ?? ''
                                  }
                                </div>
                                <div class="token--label--small">
                                  Programs Included
                                </div>
                              </div>
                              <div style="grid-column: 1 / -1;">
                                <div class="token--featured">
                                  ${
                      (() => {
                        const excursions = Object.values(
                          content.cms.excursions,
                        )
                          .filter((excursion) =>
                            excursion.data.locations.some(
                              (location: string) =>
                                workshop.data.locations.includes(location),
                            ),
                          )
                          .filter(
                            (excursion) =>
                              !workshop.data.excursions?.includes(
                                excursion.data.slug,
                              ) ?? true,
                          )
                        return excursions.length
                          ? excursions
                            .map(
                              (excursion) =>
                                html`<a
                                                              href="/workshops/${excursion.data
                                    .slug}"
                                                              data-location
                                                              ${excursion.data.locations.map(
                                      (location: string) =>
                                        `data-location-${location}`,
                                    )}
                                                              >${excursion.data.title}</a
                                                            >`,
                            )
                            .join('')
                          : html`<span>—</span>`
                      })()
                      }
                                </div>
                                <div class="token--label--small">
                                  Optional Excursions
                                </div>
                              </div>
                            </section>
                            <div style="display: grid; gap: 1em;">${parseMdBlock(workshop.data.blurb)}</div>
                          </div>
                        </div>
                        <aside 
                          class="layout--container--grid" 
                          style="
                            align-self: stretch;
                            grid-template-rows: min-content 1fr;
                            align-items: stretch;
                          "
                        >
                          <ui--button
                            tier="primary"
                            featured
                            stretch
                            link
                            href="/contact?topic=workshop&workshop=${workshop
                              .data.slug}#form"
                            target="_blank"
                            class="workshops--register"
                          >
                            Register!
                          </ui--button>
                          ${workshop.data.decor ? html`
                              <div
                                style="
                                  background: var(--palette--secondary);
                                "
                              >
                                <div 
                                  style="
                                    height: 100%;
                                    mix-blend-mode: multiply;
                                  "
                                >
                                  <color--grading
                                    fill
                                    no-normal no-addition no-darken no-multiply
                                    style="
                                      opacity: 66%;
                                    "
                                  >
                                    <embed--filler-image
                                      src="${workshop.data.decor}"
                                      style="background: white;"
                                    ></embed--filler-image>
                                  </color--grading>
                                </div>
                              </div>
                            ` : ''}
                        </aside>
                      </article>
                    </ui--details>`,
                  )
                  .join('')}
              </ui--accordion>

              <script>
                const handleWorkshopsLocationSwitch = () => {
                  const location = document.querySelector(
                    '#workshops--location',
                  ).value
                  // Hide every empty placeholder
                  document
                    .querySelectorAll('#workshops [data-empty]')
                    .forEach(($) => {
                      $.classList.add('utility--hide')
                    })
                  // Hide every content with location
                  document
                    .querySelectorAll('#workshops [data-location]')
                    .forEach(($) => {
                      $.classList.add('utility--hide')
                    })
                  // Show only the content at current location
                  document
                    .querySelectorAll(
                      '#workshops [data-location-' + location + ']',
                    )
                    .forEach(($) => {
                      $.classList.remove('utility--hide')
                    })
                  // Show the empty placeholders if there's no content to show
                  document
                    .querySelectorAll('#workshops [data-container-empty]')
                    .forEach((container) => {
                      if (
                        container.querySelectorAll(
                          '[data-location-' + location + ']',
                        ).length === 0
                      )
                        container
                          .querySelectorAll('[data-empty]')
                          .forEach(($) => {
                            $.classList.remove('utility--hide')
                          })
                    })
                  // Pick a Workshop to show if the current one is hidden
                  if (
                    document
                      .querySelector('#workshops--details > [open]')
                      ?.classList.contains('utility--hide') ??
                    true
                  ) {
                    document.querySelector(
                      '#workshops--details > :not(.utility--hide)',
                    ).open = true
                  }
                  // Show the current location's blurb
                  document
                    .querySelectorAll(
                      '#location--content ui--details[data-location-' +
                        location +
                        ']',
                    )
                    .forEach((details) => {
                      if (!details.open) details.toggle()
                    })
                }
                document
                  .querySelector('#workshops--location')
                  ?.addEventListener('switch', handleWorkshopsLocationSwitch)

                document.addEventListener('readystatechange', (event) => {
                  if (document.readyState === 'complete') {
                    handleWorkshopsLocationSwitch()
                  }
                })

                document
                  .querySelectorAll('.workshops--register')
                  .forEach((element) =>
                    element.addEventListener('click', (event) => {
                      event.preventDefault()
                      const url = new URL(
                        event.target.getAttribute('href'),
                        document.location.origin,
                      )
                      if (document.querySelector('#workshops--location'))
                        url.searchParams.set(
                          'location',
                          document.querySelector('#workshops--location').value,
                        )
                      window.open(url.href, '_blank')
                    }),
                  )
              </script>

              <style>
                #workshops {
                  background: var(--palette--secondary);
                  color: var(--palette--primary);
                }
                .workshops--detail {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: var(--m0);
                }
                .workshops--detail > * {
                  display: grid;
                  gap: 0.33em;
                }
                .workshops--detail a {
                  text-decoration: none;
                }
                .workshops--detail a:not(:last-of-type)::after {
                  content: ', ';
                }
                .workshops--info {
                  display: grid;
                  align-items: start;
                  grid-template-columns: 1fr 1fr;
                  grid-gap: var(--m1);
                }
                @media (max-width: 714px) {
                  .workshops--detail {
                    grid-template-columns: 1fr;
                  }
                  .workshops--info {
                    grid-template-columns: 1fr;
                  }
                }
              </style>
            </section>

            <!-- Custom content, if any -->
            ${programCustom}
            <!-- End of custom content -->

            <color--palette
              id="secondary-content"
              primary="${content.cms.singletons.palettes.data.neutral.primary}"
              secondary="${content.cms.singletons.palettes.data.neutral
                .secondary}"
            >
              <section
                id="asides"
                class="layout--container--grid layout--bleeding layout--lining--thick layout--leading--thick"
              >
                ${previewGallery({
                  content: program,
                  parentPage: '/workshops',
                  limit: GALLERYSIZE,
                })}
                ${program.data?.quotes.length
                  ? html`
                      <section
                        id="asides--quotes"
                        class="layout--container--grid layout--leading--thick"
                      >
                        <ui--separator custom>
                          <h1 class="token--label--small">Quotes from You</h1>
                        </ui--separator>
                        <div class="layout--container--flexgrid">
                          ${program.data?.quotes
                            .map(
                              ({
                                author: { title, avatar },
                                workshop,
                                quote,
                              }: {
                                author: {
                                  title: string
                                  avatar: string
                                }
                                workshop: string
                                quote: string
                              }) => html`
                                <ui--blockquote
                                  source="${title}"
                                  context="${workshops[workshop].data.title}"
                                  identity="${avatar}"
                                  stretch
                                >
                                  ${parseMdBlock(quote)}
                                </ui--blockquote>
                              `,
                            )
                            .join('\n')}
                        </div>
                        <style>
                          #asides--quotes {
                            --layout--container--flexgrid--min-width: 20rem;
                          }
                          @media (max-width: 714px) {
                            #asides--quotes {
                              --layout--container--flexgrid--min-width: 1fr;
                            }
                          }
                        </style>
                      </section>
                    `
                  : ''}
                ${program.data?.excursions?.length
                  ? html`
                      <section
                        id="asides--excursions"
                        class="layout--container--grid layout--leading--thick"
                      >
                        <ui--separator custom>
                          <h1 class="token--label--small">
                            Recommended Excursions
                          </h1>
                        </ui--separator>
                        <div
                          class="layout--container--grid layout--leading--thick"
                        >
                          ${program.data.excursions
                            .map(
                              (slug: string) =>
                                content.cms.excursions[slug].data,
                            )
                            .map(
                              ({
                                slug,
                                title,
                                cover,
                                locations,
                                blurb,
                              }: {
                                slug: string
                                title: string
                                cover: string
                                locations: string[]
                                blurb: string
                              }) =>
                                html`
                                  <site--excursion
                                    title="${title}"
                                    cover="${cover}"
                                    href="/workshops/${slug}"
                                    locations="${(JSON.stringify(locations.map(location => content.cms.locations[location].data.title)) as any).replaceAll(`"`, '&quot;')}"
                                    mode="excerpt"
                                    no-grading
                                  >
                                    ${parseMd(blurb)}
                                  </site--excursion>
                                `,
                            )
                            .join('\n')}
                        </div>
                      </section>
                    `
                  : ''}
                ${program.data?.programs?.length
                  ? html`
                      <section
                        id="asides--programs"
                        class="layout--container--grid layout--leading--thick"
                      >
                        <ui--separator custom>
                          <h1 class="token--label--small">
                            Recommended Programs
                          </h1>
                        </ui--separator>
                        <div class="layout--container--flexgrid">
                          ${program.data.programs
                            .map(
                              (slug: string) => content.cms.programs[slug].data,
                            )
                            .map(
                              ({
                                slug,
                                title,
                                cover,
                                coverposition,
                                locations,
                              }: {
                                slug: string
                                title: string
                                cover: string
                                coverposition?: string
                                locations: string[]
                              }) =>
                                html`
                                  <site--program
                                    title="${title}"
                                    cover="${cover}"
                                    href="/workshops/${slug}"
                                    ${attr(
                                      'locations',
                                      locations.map(
                                        (location: string) =>
                                          content.cms.locations[location].data
                                            .title,
                                      ),
                                    )}
                                    no-grading
                                    style="--site--program--cover-position: ${coverposition ??
                                    'center'}"
                                  ></site--program>
                                `,
                            )
                            .join('\n')}
                        </div>
                        <style>
                          #asides--programs {
                            --layout--container--flexgrid--min-width: min(
                              33vw,
                              12.5rem
                            );
                          }
                        </style>
                      </section>
                    `
                  : ''}
                ${programCustom
                  ? html`
                      <style>
                        #asides {
                          background: var(--palette--neutral-1--paper);
                        }
                      </style>
                    `
                  : ''}
              </section>

              ${pandemicPartial()}

              <section id="location" class="layout--container--stack">
                <div id="location--background"></div>
                <div
                  id="location--content"
                  class="layout--container--grid layout--bleeding layout--lining layout--lining--thick"
                >
                  <ui--accordion
                    class="layout--container--grid layout--leading--thick"
                  >
                    ${program.data.locations
                      .map((slug: string) => content.cms.locations[slug])
                      .map(
                        (location: any, i: number) => html`
                          <ui--details
                            no-hotspot
                            ${i === 0 ? 'open' : ''}
                            data-location-${location.data.slug}
                          >
                            <h3 slot="summary">${location.data.title}</h3>
                            <article
                              class="layout--container--grid --article layout--lining"
                            >
                              ${parseMdBlock(location.content)}
                            </article>
                          </ui--details>
                        `,
                      )
                      .join('\n')}
                  </ui--accordion>
                </div>
                <style>
                  #location {
                    color: var(--palette--lightest);
                  }
                  #location--background {
                    z-index: -1000;
                    background: var(--palette--darkest);
                    opacity: 66%;
                  }
                </style>
              </section>

              <style>
                #secondary-content img {
                  filter: saturate(50%);
                }
              </style>
            </color--palette>
          </main>
        `,
        palette: program.data.palette,
        currentPage: '/workshops',
      }),
    })}
  `
}

export const gallery = (slug: string) => {
  const program = content.cms.programs[slug]

  return galleryPage({
    content: program,
    currentPage: '/workshops',
    parentPage: '/workshops',
  })
}

export const data = () => {
  return Object.fromEntries(
    Object.entries(content.cms.programs).map(([key, value]) => [
      key,
      value.data,
    ]),
  )
}

export default () => {
  // html
  Object.keys(content.cms.programs).forEach((slug) => {
    const programPath = `./dist/workshops/${slug}`
    console.log(`Generating ${programPath}`)
    writeFile(`${programPath}/index.html`, program(slug))
    if (content.custom.programs[slug]) {
      cpDir(`../content/programs/${slug}`, programPath)
    }
    const galleryPath = `./dist/workshops/${slug}/gallery.html`
    console.log(`Generating ${galleryPath}`)
    writeFile(`./dist/workshops/${slug}/gallery.html`, gallery(slug))
  })
  // data
  writeFile(`./dist/data/programs.json`, JSON.stringify(data(), null, 2))
}
