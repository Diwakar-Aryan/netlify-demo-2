import { html } from 'code-tag'

type Data = {
  title?: string
  description?: string
  head?: string
  body: string
}

export default ({ title, description, head, body }: Data) => html`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <title>${title ?? 'Wabisabi Project'}</title>
      <meta 
        name="description" 
        content="${description ?? 'We are Wabisabi Project; visit us at Bagru Jaipur for jajam, traditional textiles, natural dye, and block printing related workshops and creations'}"
      >

      <link rel="icon" type="image/svg+xml" href="/media/favicon.svg" />
      <link rel="mask-icon" href="/media/favicon.svg" color="#FFFFFF" />
      <meta name="theme-color" content="#ffffff" />

      <link rel="preload" href="/library/styles.css" as="style" />
      <link href="/library/styles.css" rel="stylesheet" />

      <script src="https://cdn.jsdelivr.net/npm/container-query-polyfill@1/dist/container-query-polyfill.modern.js"></script>

      <script type="module" src="/library/components.es.js"></script>

      ${head ?? ''}

      <script>
        /* FOUC */

        document.addEventListener('readystatechange', (event) => {
          if (document.readyState === 'interactive') {
            document.body.style.opacity = '1'
          }
        })

        /**/
      </script>
    </head>

    <body style="opacity: 0; transition: opacity 500ms">
      ${body ?? ''}
    </body>
  </html>
`
