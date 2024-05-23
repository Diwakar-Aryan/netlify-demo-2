import { html } from 'code-tag'
import content from '../content.js'
import { parseMdBlock, writeFile, attr } from '../utilities.js'
import base from '../templates/base.js'
import page from '../templates/page.js'
import coverPartial from '../partials/cover.js'
import pandemicPartial from '../partials/pandemic.js'

const slug = 'workshops'
const workshops = content.cms.singletons.workshops

export const template = () => {
  return html`
    ${base({
      title: `Wabisabi Project · Workshops`,
      description: workshops.data.description,
      body: page({
        body: html`
          <main>
            ${coverPartial({ cover: workshops.data.cover, title: 'Workshops' })}

            <section
              id="blurb"
              class="layout--container--grid --article layout--bleeding layout--leading--thick layout--lining--thick"
            >
              <div class="layout--container--grid --article">
                <blockquote>${parseMdBlock(workshops.data.blurb)}</blockquote>

                ${parseMdBlock(workshops.content)}
              </div>

              <aside>${parseMdBlock(workshops.data.callout)}</aside>

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
                id="workshops"
                class="layout--container--grid layout--bleeding layout--leading--thick layout--lining--thick"
              >
                <nav style="display: grid; gap: var(--m1);">
                  <ui--separator custom heavy>
                    <ui--switch
                      id="workshops--location"
                      tier="quaternary"
                      value="any"
                    >
                      <h3 data-switch-value="any">All</h3>
                      ${Object.values(content.cms.locations)
                        .map(
                          (location) =>
                            html`<h3 data-switch-value="${location.data.slug}">
                              ${location.data.title}
                            </h3>`,
                        )
                        .join('')}
                    </ui--switch>
                    <h5 slot="sub">Location</h5>
                  </ui--separator>
                </nav>

                <ui--separator custom>
                  <h1 class="token--label--small">Programs</h1>
                </ui--separator>
                <div
                  id="workshops--programs"
                  class="layout--container--flexgrid"
                  data-container-empty
                >
                  ${Object.values(content.cms.programs)
                    .map(
                      (program) =>
                        html`
                          <site--program
                            title="${program.data.title}"
                            cover="${program.data.cover}"
                            href="/workshops/${program.data.slug}"
                            ${attr(
                              'locations',
                              program.data.locations.map(
                                (location: string) =>
                                  content.cms.locations[location].data.title,
                              ),
                            )}
                            data-location
                            ${program.data.locations
                              .map(
                                (location: string) =>
                                  `data-location-${location}`,
                              )
                              .join(' ')}
                            data-duration=${JSON.stringify(
                              [
                                ...Object.values(content.cms.workshops).map(
                                  (workshop) => workshop.data.duration,
                                ),
                              ].sort(),
                            )}
                            no-grading
                            style="--site--program--cover-position: ${program
                              .data.coverposition ?? 'center'}"
                          ></site--program>
                        `,
                    )
                    .join('\n')}
                  <span data-empty class="utility--hide"
                    >No Programs found</span
                  >
                </div>

                <ui--separator custom>
                  <h1 class="token--label--small">Excursions</h1>
                </ui--separator>
                <div
                  id="workshops--excursions"
                  class="layout--container--flexgrid"
                  data-container-empty
                >
                  ${Object.values(content.cms.excursions)
                    .map(
                      (excursion) =>
                        html`
                          <site--excursion
                            title="${excursion.data.title}"
                            cover="${excursion.data.cover}"
                            href="/workshops/${excursion.data.slug}"
                            ${attr(
                              'locations',
                              excursion.data.locations.map(
                                (location: string) =>
                                  content.cms.locations[location].data.title,
                              ),
                            )}
                            duration="${excursion.data.duration}"
                            data-location
                            ${excursion.data.locations
                              .map(
                                (location: string) =>
                                  `data-location-${location}`,
                              )
                              .join(' ')}
                            mode="item"
                            no-grading
                          ></site--excursion>
                        `,
                    )
                    .join('\n')}
                  <span data-empty class="utility--hide"
                    >No Excursions found</span
                  >
                </div>

                <script>
                  //Workshop details filtering by location
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
                    if (location === 'any') {
                      // Show content with location
                      document
                        .querySelectorAll('#workshops [data-location]')
                        .forEach(($) => {
                          $.classList.remove('utility--hide')
                        })
                    } else {
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
                    }
                  }
                  document
                    .querySelector('#workshops--location')
                    .addEventListener('switch', handleWorkshopsLocationSwitch)
                  document.addEventListener('readystatechange', (event) => {
                    if (document.readyState === 'complete')
                      handleWorkshopsLocationSwitch()
                  })
                </script>

                <style>
                  @media (min-width: 728px) {
                    #workshops--programs {
                      --layout--container--flexgrid--max-width: 20ch;
                    }
                    #workshops--excursions {
                      --layout--container--flexgrid--max-width: 32ch;
                    }
                  }

                  #workshops [data-empty] {
                    opacity: 50%;
                  }
                </style>
              </section>
            </color--palette>

            <div id="workshop--fluff">
              <div 
                class="layout--container--stack"
              >
                <color--grading no-color no-lighten no-addition>
                  <img src="/media/galleries/workshops/fluff/fluff_01.jpg">
                </color--grading>
                <div class="workshop--fluff--slide layout--container--grid layout--bleeding layout--lining--thick layout--leading--thin">
                  <span class="token--featured">Observation First, Intervention Later</span>
                  <p>We note that a teacher needs to be good listener.</p>
                  <p>Our pursuit is to consciously nurture a space for you to observe, understand and introspect via the crafts and its local practices.</p>
                </div>
              </div>
              <div 
                class="layout--container--stack"
              >
                <color--grading no-color no-lighten no-addition>
                  <img src="/media/galleries/workshops/fluff/fluff_02.jpg">
                </color--grading>
                <div class="workshop--fluff--slide layout--container--grid layout--bleeding layout--lining--thick layout--leading--thin">
                  <span class="token--featured">Tools</span>
                  <p>A large spectrum of craft tools at your disposal will enable translation of your thoughts and styles into a form on a cloth.</p>
                </div>
              </div>
              <div 
                class="layout--container--stack"
              >
                <color--grading no-color no-lighten no-addition>
                  <img src="/media/galleries/workshops/fluff/fluff_03.jpg">
                </color--grading>
                <div class="workshop--fluff--slide layout--container--grid layout--bleeding layout--lining--thick layout--leading--thin">
                  <span class="token--featured">Take Away</span>
                  <p>Take home what you make.</p>
                  <p>Cost of the workshops includes: course worksheet, dyeing fabric, dyestuff, chai with cool breezes in the fields</p>
                </div>
              </div>
              <div 
                class="layout--container--stack"
              >
                <color--grading no-color no-lighten no-addition>
                  <img src="/media/galleries/workshops/fluff/fluff_04.jpg">
                </color--grading>
                <div class="workshop--fluff--slide layout--container--grid layout--bleeding layout--lining--thick layout--leading--thin">
                  <span class="token--featured">Our Studio</span>
                  <p>The countryside location of our studio is designed to be healthy, comfortable, and welcoming. The design prioritizes open spaces for people can move around and socialize freely without feeling confined.</p>
                </div>
              </div>
              <div 
                class="layout--container--stack"
              >
                <color--grading no-color no-lighten no-addition>
                  <img src="/media/galleries/workshops/fluff/fluff_05.jpg">
                </color--grading>
                <div class="workshop--fluff--slide layout--container--grid layout--bleeding layout--lining--thick layout--leading--thin">
                  <span class="token--featured">At Your Schedule</span>
                  <p>Tell us your preferred dates and we will organise a workshop for you.</p>
                  <p>We never really crowd up our workshops with too many people. We keep a threshold of 3-4 participants. Our experience is that more interactions with people with similar interests during the workshop enhances learning for all the participants.</p>
                </div>
              </div>
              <div 
                class="layout--container--stack"
              >
                <color--grading no-color no-lighten no-addition>
                  <img src="/media/galleries/workshops/fluff/fluff_08.jpg">
                </color--grading>
                <div class="workshop--fluff--slide layout--container--grid layout--bleeding layout--lining--thick layout--leading--thin">
                  <span class="token--featured">Curious Case of a Designer</span>
                  <p>Are you a designer trying to make sense of the complex structural maze of craft production in India? The sheer degree of diversity and specialisation of works can be daunting.</p>
                  <p>Relax.</p>
                  <p>Our most extensive (eight-day) program will demystify it all for you.</p>
                </div>
              </div>
              <div 
                class="layout--container--stack"
              >
                <color--grading no-color no-lighten no-addition>
                  <img src="/media/galleries/workshops/fluff/fluff_11.jpg">
                </color--grading>
                <div class="workshop--fluff--slide layout--container--grid layout--bleeding layout--lining--thick layout--leading--thin">
                  <span class="token--featured">Group Learning</span>
                  <p>We encourage a learning space that ­enables one not only to learn but also to share, question, laugh and develop deep intersubjective relations with it’s co-learners from varied backgrounds.</p>
                </div>
              </div>
              <div 
                class="layout--container--stack"
              >
                <color--grading no-color no-lighten no-addition>
                  <img src="/media/galleries/workshops/fluff/fluff_12.jpg">
                </color--grading>
                <div class="workshop--fluff--slide layout--container--grid layout--bleeding layout--lining--thick layout--leading--thin">
                  <span class="token--featured">What Does Not Look Glamorous</span>
                  <p>...but should be done in a workshop!</p>
                  <p>The process of ‘making’ is best understood when exposed to a variety of facets.</p>
                </div>
              </div>
            </div>
            <style>
              @media (width >= 714px) {
                #workshop--fluff {
                  --workshop--fluff--height: 80vh;
                  scroll-snap-type: y mandatory;
                  display: grid;
                  gap: var(--m4);
                  background: var(--palette--secondary-accent);
                  color: var(--palette--neutral-1);
                }
                #workshop--fluff > * {
                  height: var(--workshop--fluff--height);
                  scroll-snap-align: center;
                }
                #workshop--fluff color--grading {
                  --color--grading--intensity: 0.5;
                }
                #workshop--fluff img {
                  width: 100%;
                  height: var(--workshop--fluff--height);
                  object-fit: cover;
                }
              }
              @media (width < 714px) {
                #workshop--fluff {
                  scroll-snap-type: y mandatory;
                  background: var(--palette--secondary-accent);
                  color: var(--palette--neutral-1);
                }
                #workshop--fluff > * {
                  scroll-snap-align: center;
                  display: unset;
                }
                #workshop--fluff color--grading {
                  --color--grading--intensity: 0.1;
                }
                #workshop--fluff img {
                  width: 100%;
                  aspect-ratio: 1300 / 752;
                  object-fit: cover;
                }
              }

              #workshop--fluff .workshop--fluff--slide {
                z-index: 100;
                align-content: center;
                justify-content: center;
                justify-items: center;
                text-align: center;
              }
              #workshop--fluff .workshop--fluff--slide > .token--featured {
                font-size: 1.5em;
                margin-bottom: var(--m1);
              }
              #workshop--fluff .workshop--fluff--slide > p {
                max-width: 24rem;
                line-height: 1.5em;
              }
            </style>

            ${pandemicPartial()}
          </main>
        `,
        currentPage: `/${slug}`,
      }),
    })}
  `
}

export const data = () => {
  return Object.fromEntries(
    Object.entries(content.cms.workshops).map(([key, value]) => [
      key,
      value.data,
    ]),
  )
}

export default () => {
  // html
  const path = `./dist/${slug}/index.html`
  console.log(`Generating ${path}`)
  writeFile(path, template())
  // data
  writeFile(`./dist/data/workshops.json`, JSON.stringify(data(), null, 2))
}
