// credits to https://github.com/r-k-b/passport-auth0/blob/typescript-def/index.d.ts
// modified by Ray Andrew (raydreww@gmail.com)

declare module 'passport-auth0' {
  import passport from 'passport'
  import { BlitzApiRequest } from 'blitz'

  // Type definitions for passport-auth0, based on @types/passport-facebook

  type RawJsonT<K extends keyof never> = {
    [P in K]?: unknown
  }

  interface RawJson extends RawJsonT<string> {
    'https://rayandrew.me/roles'?: string[]
  }

  export interface Profile extends passport.Profile {
    id: string
    emails?: { value: string }[]
    displayName: string
    gender?: string
    ageRange?: {
      min: number
      max?: number
    }
    profileUrl?: string
    username?: string
    birthday: string

    _raw: string
    _json: RawJson
  }

  export interface AuthenticateOptions extends passport.AuthenticateOptions {
    clientID: string
    domain: string
    redirectUri: string
    audience: string
    responseType: string
  }

  export interface StrategyOption {
    domain: string
    clientID: string
    clientSecret: string
    callbackURL: string

    scopeSeparator?: string
    enableProof?: boolean
    profileFields?: string[]
  }

  export interface StrategyOptionWithRequest extends StrategyOption {
    passReqToCallback: true
  }

  export interface ExtraVerificationParams {
    audience?: string
    connection?: string
    prompt?: string
  }

  export type VerifyFunction = (
    accessToken: string,
    refreshToken: string,
    extraParams: ExtraVerificationParams,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void,
  ) => void

  export type VerifyFunctionWithRequest = (
    req: express.Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: Error, user?: any, info?: any) => void,
  ) => void

  export class Strategy implements passport.Strategy {
    constructor(
      options: StrategyOptionWithRequest,
      verify: VerifyFunctionWithRequest,
    )
    constructor(options: StrategyOption, verify: VerifyFunction)

    name: string
    authenticate: (
      req: BlitzApiRequest,
      options?: Record<string, unknown>,
    ) => void
  }
}
