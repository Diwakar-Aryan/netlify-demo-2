import { Handler } from '@netlify/functions'

const handler: Handler = async (event, _context) => {
  console.log(event)
  const { name = 'World' } = JSON.parse(event.body || '{}')

  return {
    statusCode: 200,
    body: JSON.stringify({ message: `Hullo ${name}!` }),
  }
}

export { handler }
