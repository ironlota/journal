/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BlitzApiRequest,
  BlitzApiResponse,
  ConnectMiddleware,
  isLocalhost,
  SessionContext,
  connectMiddleware,
  getAllMiddlewareForModule,
  handleRequestWithMiddleware,
  //   BlitzPassportConfig,
  Middleware,
  MiddlewareRequest,
  MiddlewareResponse,
  VerifyCallbackResult,
} from '@blitzjs/core'

import { log } from '@blitzjs/display'

import cookieSession from 'cookie-session'
import passport, { AuthenticateOptions, Strategy } from 'passport'
import { Strategy as Auth0Strategy } from 'passport-auth0'

import db from 'db'

import assert from './assert'

type BlitzPassportConfig = {
  successRedirectUrl?: string
  errorRedirectUrl?: string
  authenticateOptions?: AuthenticateOptions
  strategy: Required<Strategy>
  secureProxy?: boolean
}

// import { Middleware, MiddlewareRequest, MiddlewareResponse } from './types'

export const secureProxyMiddleware: Middleware = function (
  req: MiddlewareRequest,
  _res: MiddlewareResponse,
  next: (error?: Error) => void,
) {
  req.protocol = getProtocol(req)
  next()
}

function getProtocol(req: MiddlewareRequest) {
  // For some reason there is no encrypted on socket while it is expected
  if ((req.connection as any).encrypted) {
    return 'https'
  }
  const forwardedProto =
    req.headers && (req.headers['x-forwarded-proto'] as string)
  if (forwardedProto) {
    return forwardedProto.split(/\s*,\s*/)[0]
  }
  return 'http'
}

const isVerifyCallbackResult = (
  value: unknown,
): value is VerifyCallbackResult =>
  typeof value === 'object' && value !== null && 'publicData' in value

const INTERNAL_REDIRECT_URL_KEY = '_redirectUrl'

export function passportAuth(config: BlitzPassportConfig) {
  return async function authHandler(
    req: BlitzApiRequest,
    res: BlitzApiResponse,
  ) {
    const cookieSessionMiddleware = cookieSession({
      secret: process.env.SESSION_SECRET_KEY || 'default-dev-secret',
      secure: process.env.NODE_ENV === 'production' && !isLocalhost(req),
    })

    const passportMiddleware = passport.initialize()

    const middleware: Middleware[] = [
      connectMiddleware(cookieSessionMiddleware as ConnectMiddleware),
      connectMiddleware(passportMiddleware as ConnectMiddleware),
      connectMiddleware(passport.session()),
    ]

    if (config.secureProxy) {
      middleware.push(secureProxyMiddleware)
    }

    // if (!req.query.auth.length) {
    //   return res.status(404).end()
    // }

    // assert(
    //   config.strategies.length,
    //   'No Passport strategies found! Please add at least one strategy.',
    // )

    // const strategy = config.strategies.find(
    //   (strategy) => strategy.name === req.query.auth[0],
    // )
    // assert(
    //   strategy,
    //   `A passport strategy was not found for: ${req.query.auth[0]}`,
    // )

    const strategy = config.strategy

    passport.use(strategy)

    if (typeof req.query.auth === 'undefined') {
      log.info(`Starting authentication via ${strategy.name}...`)
      if (req.query.redirectUrl) {
        middleware.push(async (req, res, next) => {
          const session = res.blitzCtx.session as SessionContext
          assert(session, 'Missing Blitz sessionMiddleware!')
          await session.setPublicData({
            [INTERNAL_REDIRECT_URL_KEY]: req.query.redirectUrl,
          } as any)
          return next()
        })
      }
      middleware.push(
        connectMiddleware(
          passport.authenticate(strategy.name, {
            ...config.authenticateOptions,
          }),
        ),
      )
    } else if (req.query.auth[0] === 'callback') {
      log.info(`Processing callback for ${strategy.name}...`)
      middleware.push(
        connectMiddleware((req, res, next) => {
          const session = (res as any).blitzCtx.session as SessionContext
          assert(session, 'Missing Blitz sessionMiddleware!')

          passport.authenticate(
            strategy.name,
            async (err: any, result: unknown) => {
              try {
                let error = err

                if (!error) {
                  if (result === false) {
                    log.warning(
                      `Login via ${strategy.name} failed - usually this means the user did not authenticate properly with the provider`,
                    )
                    error = 'Login failed'
                  }
                  assert(
                    typeof result === 'object' && result !== null,
                    `Your '${strategy.name}' passport verify callback returned empty data. Ensure you call 'done(null, {publicData: {userId: 1, roles: ['myRole']}})')`,
                  )
                  assert(
                    (result as any).publicData,
                    `'publicData' is missing from your '${strategy.name}' passport verify callback. Ensure you call 'done(null, {publicData: {userId: 1, roles: ['myRole']}})')`,
                  )
                }

                const redirectUrlFromVerifyResult =
                  result &&
                  typeof result === 'object' &&
                  (result as any).redirectUrl
                let redirectUrl: string =
                  redirectUrlFromVerifyResult ||
                  (session.publicData as never)[INTERNAL_REDIRECT_URL_KEY] ||
                  (error
                    ? config.errorRedirectUrl
                    : config.successRedirectUrl) ||
                  '/'

                if (error) {
                  redirectUrl +=
                    '?authError=' + encodeURIComponent(error.toString())
                  res.setHeader('Location', redirectUrl)
                  res.statusCode = 302
                  res.end()
                  return
                }

                assert(
                  isVerifyCallbackResult(result),
                  'Passport verify callback is invalid',
                )

                delete (result.publicData as never)[INTERNAL_REDIRECT_URL_KEY]

                await session.create(result.publicData, result.privateData)

                res.setHeader('Location', redirectUrl)
                res.statusCode = 302
                res.end()
              } catch (error) {
                console.error(error)
                res.statusCode = 500
                res.end()
              }
            },
          )(req, res, next)
        }),
      )
    }

    const globalMiddleware = getAllMiddlewareForModule({} as never)
    await handleRequestWithMiddleware(req, res, [
      ...globalMiddleware,
      ...middleware,
    ])
  }
}

assert(
  process.env.AUTH0_DOMAIN,
  'You must provide the AUTH0_DOMAIN env variable',
)
assert(
  process.env.AUTH0_CLIENT_ID,
  'You must provide the AUTH0_CLIENT_ID env variable',
)
assert(
  process.env.AUTH0_CLIENT_SECRET,
  'You must provide the AUTH0_CLIENT_SECRET env variable',
)

export default function auth(callbackURL: string) {
  return passportAuth({
    successRedirectUrl: '/',
    authenticateOptions: { scope: 'openid email profile' }, //used for Auth0Strategy - without an empty profile is returned
    strategy: new Auth0Strategy(
      {
        domain: process.env.AUTH0_DOMAIN as string,
        clientID: process.env.AUTH0_CLIENT_ID as string,
        clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
        callbackURL,
        //   process.env.NODE_ENV === "production"
        //     ? "https://auth-example-flybayer.blitzjs.vercel.app/api/auth/auth0/callback"
        //     : "http://localhost:3000/api/auth/auth0/callback",
      },
      async function (_token, _tokenSecret, extraParams, profile, done) {
        const email = profile.emails && profile.emails[0]?.value

        if (!email) {
          // This can happen if you haven't enabled email access in your twitter app permissions
          return done(new Error('Auth0 OAuth response does not have email.'))
        }

        console.log(profile)

        const user = await db.user.upsert({
          where: { email },
          create: {
            email,
            name: profile.displayName,
            roles: profile._json['https://rayandrew.me/roles'] || [],
          },
          update: {
            email,
            name: profile.displayName,
            roles: profile._json['https://rayandrew.me/roles'] || [],
          },
        })

        const publicData = {
          userId: user.id,
          roles: user.roles,
          source: 'auth0',
          githubUsername: profile.username,
        }

        done(undefined, { publicData })
      },
    ),
  })
}
