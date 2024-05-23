import fs from 'fs'
import path from 'path'
import { marked } from 'marked'
import micromatch from 'micromatch'
import imageSize_ from 'image-size'

export const root = '../'
export const cwd = process.cwd()

export const rootToCwd = (p: string) => `${path.join(root, p)}`
export const cwdToRoot = (p: string) => `${path.relative(root, p)}`

export const rm = (dest: string) => {
  try {
    fs.rmSync(dest, {
      force: true,
      recursive: true,
    })
  } catch (_) {}
}

export const cpDir = (src: string, dest: string, globs?: string[]) => {
  rm(dest)
  fs.cpSync(src, dest, {
    dereference: true,
    recursive: true,
    filter: (s: string, _: string) =>
      globs ? micromatch.isMatch(s, [src, ...globs]) : true,
  })
}

export const cpFile = (src: string, dest: string) => {
  fs.cpSync(src, dest, {
    dereference: true,
    recursive: false,
  })
}

export const writeFile = (dest: string, data: string) => {
  touchPath(dest)
  fs.writeFileSync(dest, data, 'utf8')
}

export const readFile = (src: string) => {
  try {
    return fs.readFileSync(src, 'utf8')
  } catch (error) {
    return ''
  }
}

export const touchPath = (dest: string) =>
  fs.mkdirSync(path.dirname(dest), { recursive: true })

export const parseMd = (markdown: string) =>
  marked.parseInline(markdown, { smartypants: true })

export const parseMdBlock = (markdown: string) =>
  marked.parse(markdown, { smartypants: true })

export const attr = (name: string, data: any) =>
  `${name}='${JSON.stringify(data)}'`

export const imageSize = imageSize_

export const slugify = (s: string) =>
  s
    .trim()
    .toLocaleLowerCase()
    .replace(/ +/g, '_')
    .replace(/[^a-z_]/g, '')

export const uniques = (xs: any[]) => Array.from(new Set(xs))

export const capitalize = (s: string) =>
  s.slice(0, 1).toUpperCase() + s.slice(1)

export const parseJWT = (token: string) => {
  var base64Url = token.split('.')[1]
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join(''),
  )
  return JSON.parse(jsonPayload)
}

export const getCookie = (name: string) => {
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
export const setCookie = (name: string, value: string) => {
  document.cookie = name + '=' + value + '; Path=/;'
}
export const deleteCookie = (name: string) => {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}

export default {
  root,
  cwd,
  rootToCwd,
  cwdToRoot,
  rm,
  cpDir,
  cpFile,
  writeFile,
  readFile,
  touchPath,
  parseMd,
  parseMdBlock,
  attr,
  imageSize,
  slugify,
  uniques,
  parseJWT,
  getCookie,
  setCookie,
  deleteCookie,
}
