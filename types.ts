// import React from 'react'

import {
  DefaultCtx,
  SessionContext,
  DefaultPublicData,
  BlitzPage as DefaultBlitzPage,
} from 'blitz'

import ReactMarkdown, {
  ReactMarkdownPropsBase,
  ChildrenProp,
  AllowedTypesProp,
  DisallowedTypesProp,
  EscapeHtmlProp,
  SkipHtmlProp,
  AllowDangerousHtmlProp,
} from 'react-markdown'

import { User } from 'db'

declare module 'blitz' {
  export interface Ctx extends DefaultCtx {
    session: SessionContext
  }
  export interface PublicData extends DefaultPublicData {
    userId: User['id']
  }
  export type PageProps = {
    cookies?: string
  }
  export type CustomBlitzPage = DefaultBlitzPage<PageProps>
}

declare module 'react-markdown' {
  interface CustomDisallowedTypesProp {
    readonly disallowedTypes?: NodeType[]
  }

  export type CustomReactMarkdownProps = ReactMarkdownPropsBase &
    ChildrenProp &
    CustomDisallowedTypesProp &
    AllowDangerousHtmlProp
}
