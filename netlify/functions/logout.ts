import { Handler } from '@netlify/functions'

const SITEURL = process.env.URL as string
const DOMAIN = process.env.AUTH0_DOMAIN as string
const CLIENTID = process.env.AUTH0_WEB_ID as string

const handler: Handler = async (_event, _context) => {
  const url = new URL(`https://${DOMAIN}/v2/logout`)
  url.search = new URLSearchParams({
    client_id: CLIENTID,
    returnTo: `${SITEURL}`,
  }).toString()

  return {
    statusCode: 302,
    headers: {
      'Set-Cookie': `user_id=; Path=/; Secure; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`,
      Location: url.href,
    },
  }
}

export { handler }
