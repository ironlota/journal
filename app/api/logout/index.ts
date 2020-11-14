import { BlitzApiRequest, BlitzApiResponse } from 'blitz'
import { getSessionContext } from '@blitzjs/server'
import querystring from 'query-string'

export default async function logout(
  req: BlitzApiRequest,
  res: BlitzApiResponse,
) {
  const session = await getSessionContext(req, res)
  const hostname = req.headers.host
  const protocol = req.headers.referer?.split('://')[0] || 'http'
  const returnTo = protocol + '://' + hostname
  const logoutURL = new URL(`https://${process.env.AUTH0_DOMAIN}/v2/logout`)
  const searchString = querystring.stringify({
    client_id: process.env.AUTH0_CLIENT_ID,
    returnTo: returnTo,
  })
  logoutURL.search = searchString
  await session.revoke()
  res.redirect(logoutURL.toString())
}
