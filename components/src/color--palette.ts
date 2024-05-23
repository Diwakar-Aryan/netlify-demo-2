import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import * as blend from 'color-blend'

export interface RGB {
  r: number
  g: number
  b: number
}
export interface RGBA extends RGB {
  a: number
}
export type Blender = (a: RGBA, b: RGBA) => RGBA

export const convertRGBAFromHex = (hex: string) => {
  const [r, g, b, a] = hex.match(/[0-9A-F]{2}/gi) || []
  return {
    r: parseInt(r ?? '0', 16),
    g: parseInt(g ?? '0', 16),
    b: parseInt(b ?? '0', 16),
    a: parseInt(a ?? 'ff', 16) / 255,
  } as RGBA
}
const rgba = convertRGBAFromHex

export const setAlpha = (rgba: RGBA, alpha: number) => {
  return { ...rgba, a: alpha }
}
const a = setAlpha

export const convertRGBAToHex = (rgba: RGBA) => {
  const r = rgba.r.toString(16).padStart(2, '0')
  const g = rgba.r.toString(16).padStart(2, '0')
  const b = rgba.r.toString(16).padStart(2, '0')
  const a = Math.round(rgba.a * 255)
    .toString(16)
    .padStart(2, '0')
  return `#${r}${g}${b}${a}`
}

export const convertRGBAToCSS = (rgba: RGBA) => {
  return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`
}
const c = convertRGBAToCSS

const MAGENTA = '#ff00ff'
const WHITE = '#ffffff'
const BLACK = '#000000'
const YELLOW = '#ffd232'
const RED = '#ff003d'
const BROWN = '#972e34'
const BEIGE = '#e1ccb4'
const DARKGRAY = '#656565'
const LIGHTGRAY = '#dfdfdf'

const saturation = (alpha: number) => a(rgba(MAGENTA), alpha)

const layer = (...layers: (RGBA | Blender)[]) => {
  let result = layers[0] as RGBA
  for (let i = 1; i < layers.length; i += 2) {
    result = (layers[i] as Blender)(result as RGBA, layers[i + 1] as RGBA)
  }
  return result
}

const NAME = 'color--palette'
export const tagName = NAME
@customElement(NAME)
export class ColorPalette extends LitElement {
  @property({ reflect: true, type: String })
  preset = 'base'
  presets: Record<string, { primary: string; secondary: string }> = {
    base: {
      primary: BROWN,
      secondary: BEIGE,
    },
    neutral: {
      primary: DARKGRAY,
      secondary: LIGHTGRAY,
    },
  }

  @property({ type: String })
  primary?: string
  @property({ type: String })
  secondary?: string
  @property({ type: String })
  highlight?: string
  @property({ type: String })
  error?: string

  palette: { light: Record<string, RGBA>; dark: Record<string, RGBA> } = {
    light: {},
    dark: {},
  }

  static generatePalette(
    primary: RGBA,
    secondary: RGBA,
    highlight: RGBA = convertRGBAFromHex(YELLOW),
    error: RGBA = convertRGBAFromHex(RED),
    lightest: RGBA = convertRGBAFromHex(WHITE),
    darkest: RGBA = convertRGBAFromHex(BLACK),
  ) {
    const palette: { light: Record<string, RGBA>; dark: Record<string, RGBA> } =
      {
        light: {
          ['primary']: primary,
          ['secondary']: secondary,
          ['highlight']: highlight,
          ['error']: error,
          ['lightest']: lightest,
          ['darkest']: darkest,
        },
        dark: {
          ['primary-accent']: primary,
          ['lightest']: darkest,
          ['darkest']: lightest,
        },
      }

    palette.light['primary-accent'] = layer(
      primary,
      blend.luminosity,
      a(secondary, 0.33),
      blend.saturation,
      saturation(0.5),
    )
    palette.light['secondary-accent'] = layer(
      darkest,
      blend.normal,
      a(primary, 0.33),
      blend.normal,
      a(secondary, 0.165),
    )

    palette.light['neutral-1'] = layer(
      lightest,
      blend.normal,
      a(secondary, 0.25),
      blend.normal,
      a(primary, 0.0),
    )
    palette.light['neutral-2'] = layer(
      lightest,
      blend.normal,
      a(secondary, 0.25),
      blend.normal,
      a(primary, 0.04),
    )
    palette.light['neutral-3'] = layer(
      lightest,
      blend.normal,
      a(secondary, 0.25),
      blend.normal,
      a(primary, 0.08),
    )
    palette.light['neutral-4'] = layer(
      lightest,
      blend.normal,
      a(secondary, 0.25),
      blend.normal,
      a(primary, 0.12),
    )
    palette.light['neutral-5'] = a(
      layer(
        lightest,
        blend.normal,
        a(secondary, 0.25),
        blend.normal,
        a(primary, 0.16),
      ),
      1.0, // Needed due to rounding errors
    )

    palette.light['primary-accent--ink'] = a(darkest, 0.8)
    palette.light['mark'] = a(highlight, 0.68627)
    palette.light['selection'] = a(primary, 0.68627)
    palette.light['shade'] = a(darkest, 0.0627)

    palette.dark['primary'] = layer(
      primary,
      blend.luminosity,
      a(secondary, 0.33),
      blend.saturation,
      saturation(0.33),
    )

    palette.dark['secondary'] = layer(
      darkest,
      blend.normal,
      a(primary, 0.33),
      blend.normal,
      a(secondary, 0.165),
      blend.normal,
      a(secondary, 0.125),
    )
    palette.dark['secondary-accent'] = layer(
      secondary,
      blend.normal,
      a(
        layer(
          darkest,
          blend.normal,
          a(primary, 0.33),
          blend.normal,
          a(secondary, 0.165),
        ),
        0.25,
      ),
    )

    palette.dark['neutral-1'] = layer(
      darkest,
      blend.normal,
      a(secondary, 0.25),
      blend.normal,
      a(primary, 0.0),
    )
    palette.dark['neutral-2'] = layer(
      darkest,
      blend.normal,
      a(secondary, 0.25),
      blend.normal,
      a(primary, 0.04),
    )
    palette.dark['neutral-3'] = layer(
      darkest,
      blend.normal,
      a(secondary, 0.25),
      blend.normal,
      a(primary, 0.08),
    )
    palette.dark['neutral-4'] = layer(
      darkest,
      blend.normal,
      a(secondary, 0.25),
      blend.normal,
      a(primary, 0.12),
    )
    palette.dark['neutral-5'] = a(
      layer(
        darkest,
        blend.normal,
        a(secondary, 0.25),
        blend.normal,
        a(primary, 0.16),
      ),
      1.0, // Needed due to rounding errors
    )

    palette.dark['primary-accent--ink'] = a(lightest, 0.8)
    palette.dark['selection'] = a(palette.dark['primary'], 0.68627)

    return palette
  }

  static styles = css`
    :host {
      display: contents;
    }
  `

  render() {
    const primary =
      this.primary ?? this.presets[this.preset as string].primary ?? BROWN
    const secondary =
      this.secondary ?? this.presets[this.preset as string].secondary ?? BEIGE
    const highlight = this.highlight ?? YELLOW
    const error = this.error ?? RED
    this.palette = ColorPalette.generatePalette(
      rgba(primary),
      rgba(secondary),
      rgba(highlight),
      rgba(error),
    )
    const { light, dark } = this.palette
    return html`
      <style>
        :host {
          --palette--primary: ${c(light['primary'])};
          --palette--secondary: ${c(light['secondary'])};

          --palette--lightest: ${c(light['lightest'])};
          --palette--darkest: ${c(light['darkest'])};
          --palette--highlight: ${c(light['highlight'])};
          --palette--error: ${c(light['error'])};

          --palette--primary-accent: ${c(light['primary-accent'])};
          --palette--secondary-accent: ${c(light['secondary-accent'])};

          --palette--neutral-1: ${c(light['neutral-1'])};
          --palette--neutral-2: ${c(light['neutral-2'])};
          --palette--neutral-3: ${c(light['neutral-3'])};
          --palette--neutral-4: ${c(light['neutral-4'])};
          --palette--neutral-5: ${c(light['neutral-5'])};

          --palette--bw--paper: var(--palette--lightest);
          --palette--bw--ink: var(--palette--darkest);

          --palette--primary--paper: var(--palette--primary);
          --palette--primary--ink: var(--palette--lightest);

          --palette--primary-accent--paper: var(--palette--primary-accent);
          --palette--primary-accent--ink: var(--palette--darkest);

          --palette--secondary--paper: var(--palette--secondary);
          --palette--secondary--ink: var(--palette--primary);

          --palette--secondary-accent--paper: var(--palette--secondary-accent);
          --palette--secondary-accent--ink: var(--palette--secondary);

          --palette--neutral-1--paper: var(--palette--neutral-1);
          --palette--neutral-2--paper: var(--palette--neutral-2);
          --palette--neutral-3--paper: var(--palette--neutral-3);
          --palette--neutral-4--paper: var(--palette--neutral-4);
          --palette--neutral-5--paper: var(--palette--neutral-5);
          --palette--neutral--ink: var(--palette--secondary-accent);

          --palette--primary-accent--ink: ${c(light['primary-accent--ink'])};
          --palette--mark: ${c(light['mark'])};
          --palette--selection: ${c(light['selection'])};
          --palette--shade: ${c(light['shade'])};
        }

        /* After some deliberateion, I've decided that we do not want the palette to change in dark-mode. */
        /*
        @media (prefers-color-scheme: dark) {
          :host {
            --palette--primary: ${c(dark['primary'])};
            --palette--secondary: ${c(dark['secondary'])};

            --palette--lightest: ${c(dark['lightest'])};
            --palette--darkest: ${c(dark['darkest'])};

            --palette--primary-accent: ${c(dark['primary-accent'])};
            --palette--secondary-accent: ${c(dark['secondary-accent'])};

            --palette--neutral-1: ${c(dark['neutral-1'])};
            --palette--neutral-2: ${c(dark['neutral-2'])};
            --palette--neutral-3: ${c(dark['neutral-3'])};
            --palette--neutral-4: ${c(dark['neutral-4'])};
            --palette--neutral-5: ${c(dark['neutral-5'])};

            --palette--primary-accent--ink: ${c(dark['primary-accent--ink'])};
            --palette--selection: ${c(dark['selection'])};
          }
        }
        */
      </style>
      <slot></slot>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [NAME]: ColorPalette
  }
}
