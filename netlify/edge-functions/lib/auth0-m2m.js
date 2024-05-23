const DOMAIN = Deno.env.get('AUTH0_DOMAIN')
const M2M_ID = Deno.env.get('AUTH0_M2M_ID')
const M2M_SECRET = Deno.env.get('AUTH0_M2M_SECRET')

export async function getAuth0Token() {
  try {
    const response = await fetch(`https://${DOMAIN}/oauth/token`, {
      method: 'POST',
      // cache: 'no-cache',
      // cors: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: `${M2M_ID}`,
        client_secret: `${M2M_SECRET}`,
        audience: `https://${DOMAIN}/api/v2/`,
      }).toString(),
    })
    return (await response.json()).access_token
  } catch (error) {
    console.error(error)
  }
}

export async function getAuth0User(user_id) {
  try {
    const auth0_token = await getAuth0Token()
    const response = await fetch(
      `https://${DOMAIN}/api/v2/users/${encodeURI(user_id)}`,
      {
        // cache: 'no-cache',
        // cors: 'no-cors',
        headers: {
          authorization: `Bearer ${auth0_token}`,
          'content-type': 'application/json',
        },
      },
    )
    return await response.json()
  } catch (error) {
    console.error(error)
  }
}

export async function checkLibrary(user_id, category, id) {
  try {
    const auth0_user = await getAuth0User(user_id)
    return auth0_user?.app_metadata?.library?.[category]?.includes(id) ?? false
  } catch (error) {
    console.error(error)
  }
  return false
}
