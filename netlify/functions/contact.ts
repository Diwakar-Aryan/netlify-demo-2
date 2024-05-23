import { Handler } from '@netlify/functions'
import { html } from 'code-tag'
import fetch from 'node-fetch'

const URL = 'https://api.sendinblue.com/v3/smtp/email'
const KEY = process.env.SENDINBLUE_API_KEY ?? ''
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? ''
const TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? ''
const TO_NAME = 'Wabisabi Project'

const handler: Handler = async (event, _context) => {
  const data = JSON.parse(event.body || '{}')
  const { name, email } = data

  const options = {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': KEY,
    },
    method: 'POST',
    body: JSON.stringify({
      sender: { name, email: FROM_EMAIL },
      replyTo: { name, email },
      to: [{ name: TO_NAME, email: TO_EMAIL }],
      tags: ['contact'],
      subject:
        data.topic === 'workshop'
          ? 'Interested in a Workshop'
          : data.topic === 'excursion'
          ? 'Interested in Excursions'
          : 'A message',
      htmlContent: html`
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              dl {
                font-size: 0.85em;
                display: grid;
                grid-template-columns: auto 1fr;
                gap: 0.5em 2em;
              }
              dl > dt {
                font-weight: bold;
              }
              dl > dd {
                margin-inline-start: unset;
              }
            </style>
          </head>
          <body>
            <dl>
              <dt>Name</dt>
              <dd>${name}</dd>
              <dt>Email</dt>
              <dd>${email}</dd>
              ${data.country
                ? html`<dt>Country</dt>
                    <dd>${data.country}</dd>`
                : ''}
              ${data.topic === 'workshop'
                ? html`
                    <dt>Location</dt>
                    <dd>${data.workshopLocation}</dd>
                    <dt>Workshop</dt>
                    <dd>${data.workshopWorkshop}</dd>
                    <dt>Preferred Dates</dt>
                    <dd>${data.workshopDate}</dd>
                    <dt>Optional Excursions</dt>
                    <dd>${data.workshopExcursions.join(', ') || 'n/a'}</dd>
                  `
                : data.topic === 'excursion'
                ? html`
                    <dt>Location</dt>
                    <dd>${data.excursionLocation}</dd>
                    <dt>Excursions</dt>
                    <dd>${data.excursionExcursions.join(', ') || 'n/a'}</dd>
                    <dt>Preferred Dates</dt>
                    <dd>${data.excursionDate}</dd>
                  `
                : ''}
            </dl>
            <p>${data.message}</p>
          </body>
        </html>
      `,
    }),
  }

  try {
    const response: any = await fetch(URL, options).then((res) => res.json())

    if (response.code)
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: `Message failed with: ${response.message}`,
        }),
      }
    else
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: `Message submitted succesfully with ID: ${response.messageId}`,
        }),
      }
  } catch (_error) {}

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: 'Message failed for unspecified reasons',
    }),
  }
}

export { handler }
