import { Handler } from '@netlify/functions'

const DEPLOYMENT_CONTEXT = process.env.DEPLOYMENT_CONTEXT 
const INTERNAL_SITEURL = `${process.env.SITE_NAME}.netlify.app`
const EXTERNAL_SITEURL = process.env.URL as string
const SITEURL = process.env.URL as string
const DOMAIN = process.env.AUTH0_DOMAIN as string
const CLIENTID = process.env.AUTH0_WEB_ID as string

const handler: Handler = async (event, _context) => {
  console.log({DEPLOYMENT_CONTEXT, INTERNAL_SITEURL, EXTERNAL_SITEURL})
  const url = new URL(`https://${DOMAIN}/authorize`)
  const thru = event.queryStringParameters?.thru ?? ''
  url.search = new URLSearchParams({
    client_id: CLIENTID,
    nonce: '123456789',
    redirect_uri: `${SITEURL}/.netlify/functions/logthru?thru=${thru}`,
    // connection: 'email', // passwordless auth can't work with social sign in
    response_type: 'id_token',
    response_mode: 'form_post',
    scope: 'openid profile email app_metadata',
  }).toString()

  return {
    statusCode: 302,
    headers: {
      Location: url.href,
    },
  }
}

export { handler }
