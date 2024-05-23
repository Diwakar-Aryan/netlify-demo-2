import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

const DEPENDENCIES = [
  {
    src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js',
    deps: [],
  },
  {
    src: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js',
    deps: [],
  },
  {
    src: 'https://cdn.jsdelivr.net/gh/dealfonso/pdfjs-viewer@1.1.1/pdfjs-viewer.min.js',
    deps: ['jQuery', 'pdfjsLib'],
  },
]

const injectScript = (src: string, deps: Array<string>) => {
  if (!deps.map((dep) => !!(window as any)[dep]).every((ready) => ready)) {
    setTimeout(() => injectScript(src, deps), 200)
    return
  }
  const script = document.createElement('script')
  script.setAttribute('async', '')
  script.setAttribute('src', src)
  document.head.appendChild(script)
}
DEPENDENCIES.forEach(({ src, deps }) => {
  injectScript(src, deps)
})

const NAME = 'embed--doc'
export const tagName = NAME
@customElement(NAME)
export class EmbedDoc extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    main {
      max-height: 100vh;
      overflow: auto;
      overflow: overlay;
    }
    #empty {
      width: 100%;
      min-height: 80vh;
      display: grid;
      place-items: center;
    }
  `

  @property({ attribute: 'src', type: String })
  src = ''

  pdfViewer: any

  #init() {
    const PDFjsViewer = (window as any).PDFjsViewer
    if (!PDFjsViewer) {
      setTimeout(() => this.#init(), 200)
      return
    }
    const $ = (window as any).$
    const main = this.shadowRoot?.querySelector('main') as any
    const empty = this.shadowRoot?.querySelector('#empty') as any
    this.pdfViewer = new PDFjsViewer($(main), {
      onDocumentReady: () => {
        this.pdfViewer.setZoom('width')
        empty.style.display = 'none'
      },
    })
    try {
      this.pdfViewer.loadDocument(this.src)
    } catch (e) {}
  }

  render() {
    this.#init()
    return html`
      <link href="/library/styles.css" rel="stylesheet" />
      <link
        href="https://cdn.jsdelivr.net/gh/dealfonso/pdfjs-viewer@1.1.1/pdfjs-viewer.min.css"
        rel="stylesheet"
      />

      <main><span id="empty">Loading document...</span></main>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [NAME]: EmbedDoc
  }
}
