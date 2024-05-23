import { html } from 'code-tag'
import content from '../content.js'
import { parseMd, parseMdBlock, writeFile, cpDir } from '../utilities.js'
import base from '../templates/base.js'
import page from '../templates/page.js'
import coverPartial from '../partials/cover.js'
import { previewGallery, galleryPage } from '../partials/gallery.js'
import pandemicPartial from '../partials/pandemic.js'

const GALLERYSIZE = 8

export const template = (slug: string) => {
  const excursion = content.cms.excursions[slug]

  return html`
    ${base({
      title: `Wabisabi Project · ${excursion.data.title}`,
      description: excursion.data.description,
      body: page({
        body: html`
          <main id="excursion">
            ${coverPartial({
              cover: excursion.data.cover,
              title: excursion.data.title,
              subtitle: 'Excursion',
              tall: true,
            })}

            <section
              id="blurb"
              class="layout--container--grid --article layout--bleeding layout--leading--thick layout--lining--thick"
              style="
                background: var(--palette--primary--paper);
                color: var(--palette--primary--ink);
              "
            >
              <div class="layout--container--grid --article">
                <blockquote>${parseMdBlock(excursion.data.blurb)}</blockquote>
              </div>

              <ui--button
                tier="primary"
                featured
                stretch
                link
                href="/contact?topic=excursion&location=${excursion.data
                  .locations[0]}&excursion=${excursion.data.slug}#form"
                target="_blank"
                class="layout--span--minute --end"
                style="
                  --ui--base--palette--paper: var(--palette--primary--ink);
                  --ui--base--palette--ink: var(--palette--primary--paper);
                  align-self: end;
                "
              >
                Register
              </ui--button>
            </section>

            <!-- Custom content, if any -->
            <article id="custom">
              <section
                class="layout--container--grid layout--bleeding layout--leading--thick layout--lining--thick"
                style="
                  background: var(--palette--neutral-1--paper);
                  color: var(--palette--neutral--ink);
                "
              >
                <div id="top" class="layout--container--grid">
                  <div class="layout--span--half">
                    <h2 id="excursion--subtitle" style="margin-bottom: 1em">
                      ${parseMd(excursion.data.top.title ?? '???')}
                    </h2>
                    <blockquote>
                      ${parseMdBlock(excursion.data.top.text ?? '???')}
                    </blockquote>
                    <section class="workshops--detail">
                      <div>
                        <div id="excursion--cost" class="token--featured">
                          ${excursion.data.cost ?? '???'} INR
                        </div>
                        <div class="token--label--small">
                          Individual Cost
                        </div>
                      </div>
                      <div>
                        <div id="excursion--duration" class="token--featured">
                          ${excursion.data.duration ?? '???'} ${excursion.data.duration === "1" ? "hour" : "hours"}
                        </div>
                        <div class="token--label--small">
                          Duration
                        </div>
                      </div>
                      <div>
                        <div id="excursion--locations" class="token--featured">
                          ${excursion.data.locations
                            .map(
                              (location: string) =>
                                content.cms.locations[location].data.title,
                              )
                            .join(', ') ?? '???'
                          }
                        </div>
                        <div class="token--label--small">
                          Locations
                        </div>
                      </div>
                    </section>
                  </div>

                  <img
                    src="${excursion.data.top.poster.src ?? ''}"
                    alt="${excursion.data.top.poster.alt ?? '???'}"
                    class="layout--span--half"
                    style="background: currentColor;"
                  />
                </div>
              </section>

              <section
                class="layout--container--grid layout--bleeding layout--leading--thick layout--lining--thick"
                style="color: var(--palette--neutral--ink)"
              >    
                <div id="excursion--verso"
                  class="layout--container--grid layout--leading layout--spacing custom--layout--container--split"
                >
                  <div
                    class="layout--span--four layout--container--flexblock layout--leading"
                  >
                    ${parseMdBlock(excursion.data.verso.text ?? '???')}

                    <video muted autoplay loop controls disablepictureinpicture class="media--thin">
                      <source src="${excursion.data.verso.video.src ?? ''}" />
                    </video>
                  </div>

                  <div
                    class="layout--span--four layout--container--flexblock layout--leading"
                  >
                    <img
                      src="${excursion.data.verso.image1.src ?? ''}"
                      alt="${excursion.data.verso.image1.alt ?? '???'}"
                      style="aspect-ratio: 3 / 2"
                    />
                    <img
                      src="${excursion.data.verso.image2.src ?? ''}"
                      alt="${excursion.data.verso.image2.alt ?? '???'}"
                      style="aspect-ratio: 3 / 2"
                    />
                  </div>
                </div>

                <div id="excursion--recto"
                  class="layout--container--grid layout--leading layout--spacing custom--layout--container--split"
                >
                  <div
                    class="layout--span--four layout--container--flexblock layout--leading"
                  >
                    <img
                      src="${excursion.data.recto.image1.src ?? ''}"
                      alt="${excursion.data.recto.image1.alt ?? '???'}"
                      style="aspect-ratio: 3 / 2"
                    />
                  </div>
                  <div
                    class="layout--span--four layout--container--flexblock layout--leading"
                  >
                    ${parseMdBlock(excursion.data.recto.text ?? '???')}

                    <p><strong>Wabisabi Project</strong></p>
                    <img src="/media/brands/signature.avinash+kriti.png" style="width: 20ch; opacity: 50%; filter: contrast(0.5) sepia(1);">
                  </div>
                </div>

                <div id="excursion--bottom" class="layout--container--grid layout--leading--thick">
                  <img
                    src="${excursion.data.bottom.image1.src ?? ''}"
                    alt="${excursion.data.bottom.image1.alt ?? '???'}"
                    class="layout--span--four layout--container--flexblock layout--leading"
                    style="aspect-ratio: 3 / 2"
                  />
                  <img
                    src="${excursion.data.bottom.image2.src ?? ''}"
                    alt="${excursion.data.bottom.image2.alt ?? '???'}"
                    class="layout--span--eight"
                    style="aspect-ratio: 4 / 3"
                  />
                </div>
              </section>

              <style>
                #custom img {
                  width: 100%;
                  object-fit: cover;
                }

                @media (width > 714px) {
                  #custom .media--thin {
                    width: 66%;
                  }
                }

                @media (width > 1160px) {
                  #custom .custom--layout--container--split {
                    grid-column: 4 / -4;
                  }
                }

                @media (width > 714px) {
                  #custom .custom--layout--container--split > *:nth-child(2n + 1) {
                    align-items: end;
                    text-align: end;
                  }
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

                @media (width > 714px) {
                  #excursion--verso video {
                    margin-bottom: -6rem;
                  }
                  #excursion--recto > *:nth-child(1) {
                    margin-top: 6rem;
                  }
                }

                @media (width > 1160px) {
                  #top > *:nth-child(1) {
                    grid-column: auto / span 4;
                  }
                  #top > *:nth-child(2) {
                    grid-column: auto / span 8;
                  }
                }
              </style>
            </article>

            <!-- End of custom content -->

            ${excursion.data?.quotes.length || excursion.data?.gallery?.[0]?.our.length
              ? html`
                  <color--palette
                    id="secondary-content"
                    primary="${content.cms.singletons.palettes.data.neutral
                      .primary}"
                    secondary="${content.cms.singletons.palettes.data.neutral
                      .secondary}"
                  >
                    <section
                      id="asides"
                      class="layout--container--grid layout--bleeding layout--lining--thick layout--leading--thick"
                      style="background: var(--palette--neutral-1);"
                    >
                      ${previewGallery({
                        content: excursion,
                        parentPage: '/workshops',
                        limit: GALLERYSIZE,
                      })}
                      ${excursion.data?.quotes.length
              ? html`
                            <section
                              id="asides--quotes"
                              class="layout--container--grid layout--leading--thick"
                            >
                              <ui--separator custom>
                                <h1 class="token--label--small">Quotes from You</h1>
                              </ui--separator>
                              <div class="layout--container--flexgrid">
                                ${excursion.data?.quotes
                  .map(
                    ({
                      author: { title, avatar },
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
                    </section>
                  </color--palette>
                `
              : ''}

            <color--palette
              id="secondary-content"
              primary="${content.cms.singletons.palettes.data.neutral.primary}"
              secondary="${content.cms.singletons.palettes.data.neutral
                .secondary}"
            >
              ${pandemicPartial()}
            </color--palette>
          </main>
        `,
        palette: excursion.data.palette,
        currentPage: '/workshops',
      }),
    })}
  `
}

export const gallery = (slug: string) => {
  const excursion = content.cms.excursions[slug]

  return galleryPage({
    content: excursion,
    currentPage: '/workshops',
    parentPage: '/workshops',
  })
}

export const data = () => {
  return Object.fromEntries(
    Object.entries(content.cms.excursions).map(([key, value]) => [
      key,
      value.data,
    ]),
  )
}

export default () => {
  // html
  Object.keys(content.cms.excursions).forEach((slug) => {
    const path = `./dist/workshops/${slug}`
    console.log(`Generating ${path}`)
    if (content.custom.excursions[slug]) {
      cpDir(`../content/excursions/${slug}`, path)
    }
    writeFile(`${path}/index.html`, template(slug))
    const galleryPath = `./dist/workshops/${slug}/gallery.html`
    console.log(`Generating ${galleryPath}`)
    writeFile(`./dist/workshops/${slug}/gallery.html`, gallery(slug))
  })
  // data
  writeFile(`./dist/data/excursions.json`, JSON.stringify(data(), null, 2))
}
