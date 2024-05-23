import { Handler } from '@netlify/functions'

const SITEURL = process.env.URL as string

const parseJWT = (token: string) =>
  JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())

const handler: Handler = async (event, _context) => {
  console.log(event, _context)
  const params = new URLSearchParams(event.body ?? '')

  const error = params.get('error') ?? ''
  const error_description = params.get('error_description') ?? ''

  if (error) {
    console.error({ error, error_description })

    if (error_description === 'Please verify your email before logging in.') {
      const url = new URL(`${SITEURL}/401/email`)

      return {
        statusCode: 302,
        headers: {
          'Set-Cookie': '',
          Location: url.href,
        },
      }
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error, error_description }),
    }
  }

  const id_token = params.get('id_token') ?? ''
  const thru = event.queryStringParameters?.thru ?? ''

  const url = new URL(`${SITEURL}${thru}`)
  url.search = new URLSearchParams({
    id_token,
  }).toString()

  const user_profile = parseJWT(id_token)

  return {
    statusCode: 302,
    headers: {
      'Set-Cookie': `user_id=${user_profile.sub}; Path=/; Secure; HttpOnly`,
      Location: url.href,
    },
  }
}

export { handler }
