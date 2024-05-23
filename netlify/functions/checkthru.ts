import { Handler } from '@netlify/functions'
import { getAuth0User, setAuth0User } from './lib/auth0-m2m.js'
import { stripe, WEBHOOK_SECRET } from './lib/stripe.js'

const handler: Handler = async (event, _context) => {
  // Validate signature
  let stripe_event
  try {
    stripe_event = stripe.webhooks.constructEvent(
      event.body,
      event.headers['stripe-signature'],
      WEBHOOK_SECRET,
    )
  } catch (err) {
    return {
      statusCode: 400,
      body: 'signature invalid',
    }
  }

  const user_id: string = stripe_event.data.object.metadata.user_id ?? ''
  const library: Record<string, Array<string>> = JSON.parse(
    stripe_event.data.object.metadata.library,
  ) ?? {}

  if (!user_id) {
    return {
      statusCode: 401,
      body: 'user not provided',
    }
  }

  try {
    const auth0_user: any = await getAuth0User(user_id)
    const auth0_user_ = {
      app_metadata: {
        library: auth0_user?.app_metadata?.library ?? {},
      },
    }
    Object.keys(library).forEach((category) => {
      if (!auth0_user_.app_metadata.library[category]) {
        auth0_user_.app_metadata.library[category] = []
      }
      auth0_user_.app_metadata.library[category] = [
        ...auth0_user_.app_metadata.library[category],
        ...library[category],
      ]
    })
    await setAuth0User(user_id, auth0_user_)
  } catch (error) {
    return {
      statusCode: 401,
      body: 'user invalid',
    }
  }

  return {
    statusCode: 200,
  }
}

export { handler }
