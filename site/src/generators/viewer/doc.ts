import { html } from "code-tag"
import { writeFile } from "../../utilities.js"
import base from "../../templates/base.js"

const slug = "viewer/doc"

export const template = () => {
  return html`
    ${base({
      title: `Wabisabi Project · Cart`,
      body: html`
        <main>
          <embed--doc></embed--doc>
          <script>
            const getCookie = (name) => {
              const cookie = Object.fromEntries(
                document.cookie
                  .split(';')
                  .map(v => {
                    const [key, val] = v.split('=')
                    return [decodeURIComponent(key?.trim() ?? ''), decodeURIComponent(val?.trim() ?? '')]
                  })
              )
              return cookie[name]
            }

            const src = getCookie('src') ?? (new URLSearchParams(location.search)).get("src") ?? ''
            if (src) {
              document.querySelector("embed--doc").src = src
            }
          </script>
        </main>
      `,
    })}
  `
}

export default () => {
  const path = `./dist/${slug}.html`;
  console.log(`Generating ${path}`);
  writeFile(`./dist/${slug}.html`, template());
}
