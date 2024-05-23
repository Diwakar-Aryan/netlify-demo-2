import fetch from 'node-fetch'

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN as string
const AUTH0_ID = process.env.AUTH0_M2M_ID as string
const AUTH0_SECRET = process.env.AUTH0_M2M_SECRET as string

export async function getAuth0Token(): Promise<string | undefined> {
  try {
    const response = await fetch(`https://${AUTH0_DOMAIN}/oauth/token`, {
      method: 'POST',
      // cache: 'no-cache',
      // cors: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: `${AUTH0_ID}`,
        client_secret: `${AUTH0_SECRET}`,
        audience: `https://${AUTH0_DOMAIN}/api/v2/`,
      }).toString(),
    })
    return ((await response.json()) as any).access_token as string
  } catch (error) {
    console.error(error)
  }
  return
}

export async function getAuth0User(user_id: string): Promise<any> {
  try {
    const access_token = await getAuth0Token()
    const response = await fetch(
      `https://${AUTH0_DOMAIN}/api/v2/users/${encodeURI(user_id)}`,
      {
        // cache: 'no-cache',
        // cors: 'no-cors',
        headers: {
          authorization: `Bearer ${access_token}`,
          'content-type': 'application/json',
        },
      },
    )
    return await response.json()
  } catch (error) {
    console.error(error)
  }
}

export async function setAuth0User(user_id: string, user: any) {
  try {
    const access_token = await getAuth0Token()
    const response = await fetch(
      `https://${AUTH0_DOMAIN}/api/v2/users/${encodeURI(user_id)}`,
      {
        method: 'PATCH',
        // cache: 'no-cache',
        // cors: 'no-cors',
        headers: {
          authorization: `Bearer ${access_token}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify(user),
      },
    )
    return await response.json()
  } catch (error) {
    console.error(error)
  }
}
