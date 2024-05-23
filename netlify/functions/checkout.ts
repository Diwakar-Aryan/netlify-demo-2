import { Handler } from '@netlify/functions'
import { getAuth0User } from './lib/auth0-m2m.js'
import { stripe } from './lib/stripe.js'

const cookie = require('cookie')

const SITEURL = process.env.URL as string

const LIBRARY_ELIGIBLE_CATEGORIES = ['notes']

const handler: Handler = async (event, _context) => {
  const cookies = cookie.parse(event.headers.cookie)

  const user_id = cookies.user_id
  const line_items: Array<{ price: string; quantity: number }> = []
  const library: Record<string, Array<string>> = {}

  let auth0_user: any = {}
  try {
    auth0_user = await getAuth0User(user_id)
  } catch (error) {
    console.error(error)
  }

  await Promise.all(
    JSON.parse(event.queryStringParameters?.line_items ?? '[]').map(
      async (item: { price: string; quantity: number }) => {
        try {
          const price_id = await stripe.prices.retrieve(item.price)

          const product = price_id.product.match(/^(?<category>.+)__(?<id>.+)$/)
          if (product) {
            const category: string = product.groups.category
            const id: string = product.groups.id

            // add product to checkout
            if (!auth0_user?.app_metadata?.library?.[category]?.includes(id)) {
              line_items.push(item)
            }

            // add library eligible products to metadata
            if (LIBRARY_ELIGIBLE_CATEGORIES.includes(category)) {
              if (!library[category]) library[category] = []
              library[category].push(id)
            }
          }
        } catch (error) {
          console.error(error)
        }
      },
    ),
  )

  if (!line_items.length) {
    return {
      statusCode: 302,
      headers: {
        Location: `${SITEURL}/cart.html?checkthru`,
      },
    }
  }

  const session = await stripe.checkout.sessions.create({
    line_items,
    // NOTE: Metadata can only hold 50 entries, 40 character keys, and 500 character values: https://stripe.com/docs/api/metadata
    metadata: {
      user_id,
      library: JSON.stringify(library),
    },
    mode: 'payment',
    success_url: `${SITEURL}/account.html?checkthru`,
    cancel_url: `${SITEURL}/cart.html`,
  })

  return {
    statusCode: 302,
    headers: {
      Location: session.url,
    },
  }
}

export { handler }
