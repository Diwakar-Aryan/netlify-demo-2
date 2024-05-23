import { html, md } from 'code-tag'
import content from '../content.js'
import { attr } from '../utilities.js'

const sitemap = {
  Projects: Object.fromEntries(
    Object.entries(content.custom.projects)
      .map(([slug, data]) => [(data as any).data.title, `/projects/${slug}`])
  ),
  Platform: Object.fromEntries(
    content.cms.singletons.links.data.platform.map(
      ({ title, link }: { title: string; link: string }) => [title, link],
    ),
  ),
}

const links = [
  Object.fromEntries(
    content.cms.singletons.links.data.social.map(
      ({ title, link }: { title: string; link: string }) => [title, link],
    ),
  ),
  Object.fromEntries(
    content.cms.singletons.links.data.info.map(
      ({ title, link }: { title: string; link: string }) => [title, link],
    ),
  ),
]

const blurb = md`
Over the years, working with Nature has helped us realise 'less is more and usually more effective'. We intend to continue working hard to make simple systems more sophisticated.`

type Data = {
  body?: string
  currentPage?: string
  palette?: {
    primary: string
    secondary: string
  }
}

export default ({ body, currentPage, palette }: Data) => {
  return html`
    <color--palette
      primary=${palette?.primary ?? '#972E34'}
      secondary=${palette?.secondary ?? '#E1CCB4'}
      style="
        display: grid;
        min-height: 100vh;
        align-content: space-between;
      "
    >
      <site--header
        ${attr('sitemap', sitemap)}
        current-page=${currentPage ?? ''}
      ></site--header>

      ${body ?? ''}

      <site--footer ${attr('sitemap', sitemap)} ${attr('links', links)}>
        ${blurb}
      </site--footer>
    </color--palette>
  `
}
