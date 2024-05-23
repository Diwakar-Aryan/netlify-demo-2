import { html } from 'code-tag'

export default ({
  cover,
  title,
  subtitle,
  tall = false,
  heading = 1,
}: {
  cover: string
  title: string
  subtitle?: string
  tall?: boolean
  heading?: number
}) =>
  html`
    <section class="partial--cover layout--container--stack">
      <color--grading no-normal no-color no-addition>
        <img src="${cover}" alt=""></img>
      </color--grading>

      <div class="layout--container--grid layout--bleeding">
        <ui--separator custom heavy>
          <h${heading?.toString() ?? '1'}>${title}</h${
    heading?.toString() ?? '1'
  }>
          ${subtitle ? html`<h5 slot="sub">${subtitle}</h5>` : ''}
        </ui--separator>
      </div>

      <style>
        .partial--cover {
          align-items: center;
          color: var(--palette--lightest);
        }
        .partial--cover img {
          aspect-ratio: ${tall ? '16 / 9' : '3 / 1'};
          object-fit: cover;
        }
        @media (max-width: 714px) {
          .partial--cover img {
            aspect-ratio: ${tall ? '1 / 1' : '2 / 1'};
          }
        }
      </style>
    </section>
  `
