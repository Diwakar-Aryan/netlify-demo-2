import { html } from 'code-tag'
import content from '../content.js'
import {
  parseMd,
  parseMdBlock,
  writeFile,
  uniques,
  attr,
} from '../utilities.js'
import base from '../templates/base.js'
import page from '../templates/page.js'
import coverPartial from '../partials/cover.js'
import pandemicPartial from '../partials/pandemic.js'

const slug = 'contact'
const contact = content.cms.singletons.contact

const getWorkshopLocation = (workshop: any) => {
  const programLocations = [
    ...(workshop.data.programs?.map(
      (slug: string) => content.cms.programs[slug].data.locations,
    ) ?? []),
    ...(workshop.data.excursions?.map(
      (slug: string) => content.cms.excursions[slug].data.locations,
    ) ?? []),
  ]
  const virtual = programLocations.every((locations) =>
    locations.includes('virtual'),
  )
  return uniques(programLocations.flatMap((locations) => locations))
    .sort()
    .filter((location: string) => virtual || location !== 'virtual')
}

export const template = () => {
  return html`
    ${base({
      title: `Wabisabi Project · Contact Us`,
      description: contact.data.description,
      body: page({
        body: html`
          <main id="contact">
            ${coverPartial({ cover: contact.data.cover, title: 'Contact Us' })}

            <section
              id="blurb"
              class="layout--container--grid --article layout--bleeding layout--leading--thick layout--lining--thick"
            >
              <div class="layout--container--grid --article">
                <blockquote>${parseMdBlock(contact.data.blurb)}</blockquote>

                ${parseMdBlock(contact.content)}
              </div>

              <aside>${parseMdBlock(contact.data.callout)}</aside>

              <style>
                #blurb {
                  background: var(--palette--primary);
                  color: var(--palette--lightest);
                }
              </style>
            </section>

            <section
              id="form"
              class="layout--container--grid --article layout--bleeding layout--lining--thick layout--leading--thick"
            >
              <div
                class="layout--span--copy layout--container--grid --article layout--leading--thick"
              >
                <div class="layout--container--grid">
                  <div class="layout--container--grid layout--leading--thin">
                    <span class="token--label--default">Name*</span>
                    <ui--textinput
                      id="form--name"
                      tabindex="0"
                      stretch
                      aria-label="Your name (required)"
                    ></ui--textinput>
                  </div>

                  <div
                    class="layout--span--five layout--container--grid layout--leading--thin"
                  >
                    <span class="token--label--default">Email*</span>
                    <ui--textinput
                      id="form--email"
                      tabindex="0"
                      stretch
                      aria-label="Your email address (required)"
                    ></ui--textinput>
                  </div>

                  <div
                    class="layout--span--three layout--container--grid layout--leading--thin"
                  >
                    <span class="token--label--default">Country</span>
                    <ui--textinput
                      id="form--country"
                      tier="secondary"
                      tabindex="0"
                      stretch
                      aria-label="Your country of residence"
                    ></ui--textinput>
                  </div>
                </div>

                <aside>
                  <p>
                    ${parseMd(
                      content.cms.singletons.contact.data.comments.personal,
                    )}
                  </p>
                </aside>
              </div>

              <ui--separator class="layout--span--copy"></ui--separator>

              <div class="layout--span--copy layout--container--grid --article">
                <div class="layout--container--grid layout--leading--thin">
                  <span class="token--label--default">Topic</span>
                  <ui--switch
                    id="form--topic"
                    tier="secondary"
                    align
                    stretch
                    tabindex="0"
                    value="misc"
                  >
                    <ui--button data-switch-value="workshop"
                      >Workshops</ui--button
                    >
                    <ui--button data-switch-value="excursion"
                      >Excursions</ui--button
                    >
                    <ui--button data-switch-value="collections"
                      >Collections</ui--button
                    >
                    <ui--button data-switch-value="misc"
                      >Just a Message</ui--button
                    >
                  </ui--switch>
                </div>
                <aside>
                  <p>
                    ${parseMd(
                      content.cms.singletons.contact.data.comments.topic,
                    )}
                  </p>
                </aside>
              </div>

              <div
                id="form--workshop"
                class="layout--span--copy layout--container--grid --article layout--leading--thick"
              >
                <div
                  class="layout--span--copy layout--container--grid --article layout--leading--thick"
                >
                  <div class="layout--container--grid layout--leading--thin">
                    <span class="token--label--default"
                      >Preferred Dates*</span
                    >
                    <ui--textinput id="form--workshop--date" tabindex="0" stretch="" aria-label="Your preferred dates (required)"></ui--textinput>
                  </div>
                </div>
                
                <div
                  class="layout--span--five layout--container--grid layout--leading--thin"
                >
                  <span class="token--label--default">Location*</span>
                  <ui--switch
                    id="form--workshop--location"
                    tier="secondary"
                    align
                    stretch
                    tabindex="0"
                    value="any"
                  >
                    <ui--button data-switch-value="any">Any</ui--button>
                    ${Object.values(content.cms.locations)
                      .map(
                        (location) =>
                          html`<ui--button
                            data-switch-value="${location.data.slug}"
                            >${location.data.title}</ui--button
                          >`,
                      )
                      .join('\n')}
                  </ui--switch>
                </div>

                <div
                  class="layout--span--three layout--container--grid layout--leading--thin"
                >
                  <span class="token--label--default">Workshop*</span>
                  <ui--select
                    id="form--workshop--workshop"
                    tier="secondary"
                    tabindex="0"
                    value="none"
                    stretch
                  >
                    ${Object.values(content.cms.workshops)
                      .sort((a, b) => a.data.duration - b.data.duration)
                      .map(
                        (workshop) =>
                          html`<ui--button
                            data-select-value="${workshop.data.slug}"
                            data-location
                            ${workshop.data.locations
                              .map(
                                (location: string) =>
                                  html`data-location-${location}`,
                              )
                              .join(' ')}
                            data-locations=${JSON.stringify(workshop.data.locations)}
                            >${workshop.data.title}</ui--button
                          >`,
                      )
                      .join('\n')}
                  </ui--select>
                </div>

                <aside id="form--workshop--programmings">
                  <!-- <p data-empty>Please select a Workshop from the list.</p> -->
                  ${Object.values(content.cms.workshops)
                    .map(
                      (workshop) =>
                        html`
                          <p
                            data-workshop-${workshop.data.slug}
                            class="utility--hide"
                          >
                            This Workshop features:
                            ${[
                              workshop.data.programs
                                .map(
                                  (slug: string) =>
                                    html`<a href="/workshops/${slug}"
                                      >${content.cms.programs[slug].data
                                        .title}</a
                                    >`,
                                )
                                .join(''),
                              workshop.data.excursions
                                ?.map(
                                  (slug: string) =>
                                    html`<a
                                      href="/workshops/${slug}"
                                      data-location
                                      ${content.cms.excursions[
                                        slug
                                      ].data.locations.map(
                                        (location: string) =>
                                          `data-location-${location}`,
                                      )}
                                      >${content.cms.excursions[slug].data
                                        .title}</a
                                    >`,
                                )
                                .join('') ?? '',
                            ].join('\n')}
                          </p>
                        `,
                    )
                    .join('\n')}

                  <style>
                    #form--workshop--programmings a {
                      text-decoration: none;
                      font-weight: bold;
                      content: ', ';
                    }
                    #form--workshop--programmings a:not(:last-of-type)::after {
                      content: ', ';
                    }
                  </style>
                </aside>

                <div
                  id="form--workshop--excursion"
                  class="layout--span--copy layout--container--grid --article layout--leading--thick"
                >
                  <div class="layout--container--grid layout--leading--thin">
                    <span class="token--label--default"
                      >Optional Excursions</span
                    >
                    <ui--optionset
                      id="form--workshop--excursion--excursion"
                      class="layout--container--flexgrid layout--leading--thick"
                      style="
                        --ui--option--palette--paper: var(--palette--primary--ink);
                        --ui--option--palette--ink: var(--palette--primary--paper);
                      "
                    >
                      ${Object.values(content.cms.excursions)
                        .map(
                          (excursion) =>
                            html`
                              <ui--option
                                featured
                                label="Select"
                                layout="stack"
                                data-option-value="${excursion.data.slug}"
                                data-location
                                ${excursion.data.locations.map(
                                  (location: string) =>
                                    `data-location-${location}`,
                                )}
                                ${Object.values(content.cms.workshops)
                                  .filter(
                                    (workshop) =>
                                      workshop.data.excursions?.includes(
                                        excursion.data.slug,
                                      ) ?? false,
                                  )
                                  .map(
                                    (workshop) =>
                                      `data-workshop-${workshop.data.slug}`,
                                  )
                                  .join(' ')}
                              >
                                <site--excursion
                                  title="${excursion.data.title}"
                                  cover="${excursion.data.cover}"
                                  href="/workshops/${excursion.data.slug}"
                                  ${attr(
                                    'locations',
                                    excursion.data.locations.map(
                                      (location: string) =>
                                        content.cms.locations[location].data
                                          .title,
                                    ),
                                  )}
                                  data-location
                                  ${excursion.data.locations.map(
                                    (location: string) =>
                                      `data-location-${location}`,
                                  )}
                                  mode="item"
                                  no-grading
                                >
                                  ${parseMd(excursion.data.blurb)}
                                </site--excursion>
                              </ui--option>
                            `,
                        )
                        .join('\n')}
                    </ui--optionset>
                  </div>

                  <aside>
                    <p>
                      ${parseMd(
                        content.cms.singletons.contact.data.comments[
                          'optional-excursions'
                        ],
                      )}
                    </p>
                  </aside>
                </div>
              </div>

              <div
                id="form--excursion"
                class="layout--span--copy layout--container--grid --article layout--leading--thick"
              >
                <div
                  class="layout--span--copy layout--container--grid --article layout--leading--thick"
                >
                  <div class="layout--container--grid layout--leading--thin">
                    <span class="token--label--default"
                      >Preferred Date*</span
                    >
                    <ui--textinput id="form--excursion--date" tabindex="0" stretch="" aria-label="Your preferred dates (required)"></ui--textinput>
                  </div>
                </div>

                <div class="layout--container--grid layout--leading--thin">
                  <span class="token--label--default">Location*</span>
                  <ui--switch
                    id="form--excursion--location"
                    tier="secondary"
                    align
                    stretch
                    tabindex="0"
                    value="any"
                  >
                    <ui--button data-switch-value="any">Any</ui--button>
                    ${Object.values(content.cms.locations)
                      .map(
                        (location) =>
                          html`<ui--button
                            data-switch-value="${location.data.slug}"
                            >${location.data.title}</ui--button
                          >`,
                      )
                      .join('\n')}
                  </ui--switch>
                </div>

                <div class="layout--container--grid layout--leading--thin">
                  <span class="token--label--default">Excursions*</span>
                  <ui--optionset
                    id="form--excursion--excursion"
                    class="layout--container--flexgrid layout--leading--thick"
                    style="
                        --ui--option--palette--paper: var(--palette--primary--ink);
                        --ui--option--palette--ink: var(--palette--primary--paper);
                      "
                  >
                    ${Object.values(content.cms.excursions)
                      .map(
                        (excursion) =>
                          html`
                            <ui--option
                              featured
                              label="Select"
                              layout="stack"
                              data-option-value="${excursion.data.slug}"
                              data-location
                              ${excursion.data.locations.map(
                                (location: string) =>
                                  `data-location-${location}`,
                              )}
                            >
                              <site--excursion
                                title="${excursion.data.title}"
                                cover="${excursion.data.cover}"
                                href="/workshops/${excursion.data.slug}"
                                ${attr(
                                  'locations',
                                  excursion.data.locations.map(
                                    (location: string) =>
                                      content.cms.locations[location].data
                                        .title,
                                  ),
                                )}
                                mode="item"
                                no-grading
                              >
                                ${parseMd(excursion.data.blurb)}
                              </site--excursion>
                            </ui--option>
                          `,
                      )
                      .join('\n')}
                  </ui--optionset>
                </div>
              </div>

              <div
                id="form--collections"
                class="layout--span--copy layout--container--grid --article layout--leading--thick"
              >
                <div
                  class="layout--span--three layout--container--grid layout--leading--thin"
                >
                  <span class="token--label--default">Collection*</span>
                  <ui--select
                    id="form--collections--collection"
                    tier="secondary"
                    tabindex="0"
                    value="none"
                    stretch
                  >
                    ${Object.values(content.cms.collections)
                      .map(
                        (collection) =>
                          html`<ui--button
                            data-select-value="${collection.data.slug}"
                            >${collection.data.title}</ui--button
                          >`,
                      )
                      .join('\n')}
                  </ui--select>
                </div>
              </div>

              <div
                class="layout--span--copy layout--container--grid --article layout--leading--thick"
              >
                <div class="layout--container--grid layout--leading--thin">
                  <span class="token--label--default">Message</span>
                  <ui--textinput
                    id="form--message"
                    tabindex="0"
                    stretch
                    area
                    rows="8"
                    aria-label="Your message, if any"
                  ></ui--textinput>
                </div>
                <aside>
                  <ui--button
                    id="form--submit"
                    tier="primary"
                    featured
                    stretch
                    tabindex="0"
                    >Send Message</ui--button
                  >
                </aside>
                <style>
                  #form--submit.progress {
                    animation: 500ms ease-in-out 0s infinite alternate
                      pulse-opacity;
                  }
                  @keyframes pulse-opacity {
                    from {
                      opacity: 80%;
                    }
                    to {
                      opacity: 20%;
                    }
                  }
                  #form--submit.failure {
                    animation: 1s pulse-opacity;
                  }
                  @keyframes pulse-opacity {
                    0% {
                      transform: translateX(0);
                    }
                    10% {
                      transform: translateX(-1ch);
                      animation-timing-function: ease-in;
                    }
                    30% {
                      transform: translateX(1ch);
                      animation-timing-function: ease-in;
                    }
                    50% {
                      transform: translateX(-1ch);
                      animation-timing-function: ease-in;
                    }
                    70% {
                      transform: translateX(1ch);
                      animation-timing-function: ease-in;
                    }
                    100% {
                      transform: translateX(0);
                      animation-timing-function: ease-in;
                    }
                  }
                </style>
              </div>

              <script>
                // Topic filtering
                const handleTopicSwitch = () => {
                  const topic = document.querySelector('#form--topic').value
                  const workshop = document.querySelector('#form--workshop')
                  const excursion = document.querySelector('#form--excursion')
                  const collections = document.querySelector('#form--collections')

                  workshop.classList.add('utility--hide')
                  excursion.classList.add('utility--hide')
                  collections.classList.add('utility--hide')

                  if (topic === 'workshop') {
                    workshop.classList.remove('utility--hide')
                    handleWorkshopLocationSwitch()
                  }
                  if (topic === 'excursion') {
                    excursion.classList.remove('utility--hide')
                    handleExcursionLocationSwitch()
                  }
                  if (topic === 'collections') {
                    collections.classList.remove('utility--hide')
                  }
                }
                document
                  .querySelector('#form--topic')
                  .addEventListener('switch', handleTopicSwitch)

                // Workshop details filtering by location
                const handleWorkshopLocationSwitch = () => {
                  const location = document.querySelector(
                    '#form--workshop--location',
                  ).value
                  if (location === 'any') {
                    // Show content with location
                    document
                      .querySelectorAll(
                        '#form--workshop--workshop [data-location]',
                      )
                      .forEach(($) => {
                        $.classList.remove('utility--hide')
                      })
                  } else {
                    // Hide every content with location
                    document
                      .querySelectorAll(
                        '#form--workshop--workshop [data-location]',
                      )
                      .forEach(($) => {
                        $.classList.add('utility--hide')
                      })
                    // Show only the content at current location
                    document
                      .querySelectorAll(
                        '#form--workshop--workshop [data-location-' +
                          location +
                          ']',
                      )
                      .forEach(($) => {
                        $.classList.remove('utility--hide')
                      })
                  }
                  // Remember to handle the persistent workshop if any
                  setTimeout(handleWorkshopSelect, 100) // A pause is required because the component needs a frame to unset itself
                }
                document
                  .querySelector('#form--workshop--location')
                  .addEventListener('switch', handleWorkshopLocationSwitch)

                // Programming details and optional Excursions details filtering by workshop
                const handleWorkshopSelect = () => {
                  const workshop = document.querySelector(
                    '#form--workshop--workshop',
                  ).value
                  const locations = JSON.parse(
                    document.querySelector(
                      '#form--workshop--workshop > [data-select-value=' +
                        workshop +
                        ']',
                    )?.dataset.locations ?? '[]',
                  )
                  // Hide all the programmings
                  document
                    .querySelectorAll(
                      '#form--workshop--programmings > p:not([data-empty])',
                    )
                    .forEach(($) => {
                      $.classList.add('utility--hide')
                    })
                  // Show only the selected Workshop's programming
                  document
                    .querySelectorAll(
                      '#form--workshop--programmings > p[data-workshop-' +
                        workshop +
                        ']',
                    )
                    .forEach(($) => {
                      $.classList.remove('utility--hide')
                    })
                  // Show the empty placeholders if there's no content to show
                  if (
                    document.querySelectorAll(
                      '#form--workshop--programmings > p:not([data-empty]):not(.utility--hide)',
                    ).length === 0
                  ) {
                    document
                      .querySelectorAll(
                        '#form--workshop--programmings > [data-empty]',
                      )
                      .forEach(($) => {
                        $.classList.remove('utility--hide')
                      })
                  } else {
                    document
                      .querySelectorAll(
                        '#form--workshop--programmings > [data-empty]',
                      )
                      .forEach(($) => {
                        $.classList.add('utility--hide')
                      })
                  }
                  // Hide all optional Excursions
                  document
                    .querySelectorAll(
                      '#form--workshop--excursion--excursion > *',
                    )
                    .forEach(($) => {
                      $.classList.add('utility--hide')
                    })
                  // Show Excursions offered at current Workshop's locations
                  locations.forEach((location) => {
                    document
                      .querySelectorAll(
                        '#form--workshop--excursion--excursion > [data-location-' +
                          location +
                          ']',
                      )
                      .forEach(($) => {
                        $.classList.remove('utility--hide')
                      })
                  })
                  // Hide excrusion if already included in the current workshop
                  document
                    .querySelectorAll(
                      '#form--workshop--excursion--excursion > ui--option[data-workshop-' +
                        workshop +
                        ']',
                    )
                    .forEach(($) => {
                      $.classList.add('utility--hide')
                    })
                  // If no optional Excursions remain, hide the container
                  if (
                    document.querySelectorAll(
                      '#form--workshop--excursion--excursion > ui--option:not(.utility--hide)',
                    ).length === 0
                  ) {
                    document
                      .querySelectorAll('#form--workshop--excursion')
                      .forEach(($) => {
                        $.classList.add('utility--hide')
                      })
                  } else {
                    document
                      .querySelectorAll('#form--workshop--excursion')
                      .forEach(($) => {
                        $.classList.remove('utility--hide')
                      })
                  }
                }
                document
                  .querySelector('#form--workshop--workshop')
                  .addEventListener('select', handleWorkshopSelect)

                // Excursions details filtering by location
                const handleExcursionLocationSwitch = () => {
                  const location = document.querySelector(
                    '#form--excursion--location',
                  ).value
                  // Hide every empty placeholder
                  document
                    .querySelectorAll('#form--excursion [data-empty]')
                    .forEach(($) => {
                      $.classList.add('utility--hide')
                    })
                  if (location === 'any') {
                    // Show content with location
                    document
                      .querySelectorAll('#form--excursion [data-location]')
                      .forEach(($) => {
                        $.classList.remove('utility--hide')
                      })
                  } else {
                    // Hide every content with location
                    document
                      .querySelectorAll('#form--excursion [data-location]')
                      .forEach(($) => {
                        $.classList.add('utility--hide')
                      })
                    // Show only the content at current location
                    document
                      .querySelectorAll(
                        '#form--excursion [data-location-' + location + ']',
                      )
                      .forEach(($) => {
                        $.classList.remove('utility--hide')
                      })
                    // Show the empty placeholders if there's no content to show
                    document
                      .querySelectorAll(
                        '#form--excursion [data-container-empty]',
                      )
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
                  .querySelector('#form--excursion--location')
                  .addEventListener('switch', handleExcursionLocationSwitch)

                // Form submit
                const handleSubmit = async () => {
                  const $ = {
                    form: document.querySelector('#form'),
                    button: document.querySelector('#form--submit'),
                    thanks: document.querySelector('#thanks'),
                    name: document.querySelector('#form--name'),
                    email: document.querySelector('#form--email'),
                    country: document.querySelector('#form--country'),
                    topic: document.querySelector('#form--topic'),
                    workshopDate: document.querySelector(
                      '#form--workshop--date',
                    ),
                    workshopLocation: document.querySelector(
                      '#form--workshop--location',
                    ),
                    workshopWorkshop: document.querySelector(
                      '#form--workshop--workshop',
                    ),
                    workshopExcursions: document.querySelector(
                      '#form--workshop--excursion--excursion',
                    ),
                    excursionDate: document.querySelector(
                      '#form--excursion--date',
                    ),
                    excursionLocation: document.querySelector(
                      '#form--excursion--location',
                    ),
                    excursionExcursions: document.querySelector(
                      '#form--excursion--excursion',
                    ),
                    message: document.querySelector('#form--message'),
                  }

                  const data = {
                    name: $.name.value, // required
                    email: $.email.value, // required, validated
                    country: $.country.value,
                    topic: $.topic.value, // required
                    workshopDate: $.workshopDate.value, // required
                    workshopLocation: $.workshopLocation.value, // required
                    workshopWorkshop: $.workshopWorkshop.value, // required
                    workshopExcursions: $.workshopExcursions.value,
                    excursionDate: $.excursionDate.value, // required
                    excursionLocation: $.excursionLocation.value, // required
                    excursionExcursions: $.excursionExcursions.value, // required, validated: min one
                    message: $.message.value,
                  }

                  try {
                    // Validation

                    Object.values($).forEach((element) => {
                      element.error = false
                    })

                    let error = false

                    ;['name', 'email', 'topic'].forEach((datum) => {
                      if (!data[datum]) {
                        $[datum].error = true
                        $[datum].scrollIntoView({
                          behavior: 'smooth',
                          block: 'center',
                        })
                        throw new Error('Field ' + datum + ' is required')
                      }
                    })

                    const emailRegex =
                      /^(([\\w-\\.]+)(\\+[\\w-\\.]+)*)@(([\\w-]+\\.)+[\\w-]{2,4})$/gi
                    if (!data.email.match(emailRegex)) {
                      $.email.error = true
                      $.email.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                      })
                      throw new Error('Email is invalid')
                    }

                    if (data.topic === 'workshop') {
                      ;['workshopDate', 'workshopLocation', 'workshopWorkshop'].forEach(
                        (datum) => {
                          if (!data[datum]) {
                            $[datum].error = true
                            $[datum].scrollIntoView({
                              behavior: 'smooth',
                              block: 'center',
                            })
                            throw new Error('Field ' + datum + ' is required')
                          }
                        },
                      )
                    }

                    if (data.topic === 'excursion') {
                      ;['excursionDate', 'excursionLocation', 'excursionExcursions'].forEach(
                        (datum) => {
                          if (!data[datum]) {
                            $[datum].error = true
                            error = true
                          }
                        },
                      )
                      if (data.excursionExcursions.length < 1) {
                        $.excursionExcursions.error = true
                        $.excursionExcursions.scrollIntoView({
                          block: 'center',
                        })
                        throw new Error('At least one Excursion is required')
                      }
                    }

                    if (error) throw new Error('Form contains errors')

                    // Animate
                    $.button.getAnimations().forEach((animation) => {
                      animation.cancel()
                    })
                    $.button.animate(
                      {
                        opacity: [0, 1, 0],
                        easing: ['ease-in-out', 'ease-in-out'],
                      },
                      {
                        duration: 1000,
                        iterations: Infinity,
                      },
                    )

                    // Send to API
                    const response = await fetch(
                      '/.netlify/functions/contact',
                      {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                      },
                    ).then((response) => response.json())

                    // Set effects
                    $.form.classList.add('utility--hide')
                    $.thanks.classList.remove('utility--hide')
                  } catch (error) {
                    console.error('Form submission error.\\n', error)

                    $.button.getAnimations().forEach((animation) => {
                      animation.cancel()
                    })
                    $.button.animate(
                      {
                        transform: [
                          'translateX(0)',
                          'translateX(-1ch)',
                          'translateX(1ch)',
                          'translateX(-1ch)',
                          'translateX(1ch)',
                          'translateX(0)',
                        ],
                        offset: [0, 0.1, 0.3, 0.5, 0.7, 1],
                        easing: [
                          'ease-in',
                          'ease-in',
                          'ease-in',
                          'ease-in',
                          'ease-in',
                        ],
                      },
                      {
                        duration: 1000,
                      },
                    )
                  }
                }
                document
                  .querySelector('#form--submit')
                  .addEventListener('click', handleSubmit)

                // Setup
                document.addEventListener('readystatechange', (event) => {
                  if (document.readyState === 'complete') {
                    const params = new URLSearchParams(location.search)

                    if (params.has('topic'))
                      document.querySelector('#form--topic').value =
                        params.get('topic')
                    if (params.has('location')) {
                      document.querySelector(
                        '#form--workshop--location',
                      ).value = params.get('location')
                      document.querySelector(
                        '#form--excursion--location',
                      ).value = params.get('location')
                    }
                    if (params.has('workshop'))
                      document.querySelector(
                        '#form--workshop--workshop',
                      ).value = params.get('workshop')
                    if (params.has('excursion'))
                      document.querySelector(
                        '#form--excursion--excursion',
                      ).value = params.get('excursion')
                    if (params.has('collection'))
                      document.querySelector(
                        '#form--collections--collection',
                      ).value = params.get('collection')

                    handleTopicSwitch()
                  }
                })
              </script>

              <style>
                @media (min-width: 728px) {
                  #form aside {
                    padding-top: 1em;
                  }
                }
              </style>
            </section>

            <section
              id="thanks"
              class="layout--container--grid --article layout--bleeding layout--lining--thick layout--leading--thick utility--hide"
            >
              <blockquote>
                <p>Thank you for reaching out to us.</p>
                <p>We will get back to you as soon as possible!</p>
              </blockquote>
            </section>

            ${pandemicPartial()}
          </main>
        `,
        palette: content.cms.singletons.palettes.data.neutral,
        currentPage: `/${slug}`,
      }),
    })}
  `
}

export default () => {
  const path = `./dist/${slug}.html`
  console.log(`Generating ${path}`)
  writeFile(`./dist/${slug}.html`, template())
}
