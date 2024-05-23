import { checkLibrary } from './lib/auth0-m2m.js'

export default async (request, context) => {
  const pattern = new URLPattern({ pathname: '/media/notes/:id.pdf' })
  if (!pattern.test(request.url)) return undefined

  const user_id = context.cookies.get('user_id')
  if (!user_id) return context.rewrite('/403')

  const id = pattern.exec(request.url).pathname.groups.id
  const inLibrary = await checkLibrary(user_id, 'notes', id)
  if (inLibrary) return undefined

  return context.rewrite('/403')
}

export const config = { path: ['/media/notes/*'] }
