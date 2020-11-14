import { PropsWithChildren } from 'react'
import { LinkProps as BlitzLinkProps } from 'next/link'
import {
  Link as ChakraLink,
  LinkProps as ChakraLinkProps,
} from '@chakra-ui/core'

import { Link as BlitzLink } from 'blitz'

export type LinkProps = PropsWithChildren<
  BlitzLinkProps & Omit<ChakraLinkProps, 'as' | 'isExternal' | 'href'>
> & {
  disabled?: boolean
}

export default function CustomLink({
  href,
  as,
  replace,
  scroll,
  shallow,
  prefetch,
  children,
  disabled,
  ...props
}: LinkProps) {
  if (disabled) {
    return <>{children}</>
  }
  return (
    <BlitzLink
      passHref
      href={href}
      as={as}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      prefetch={prefetch}
    >
      <ChakraLink {...props} isExternal={false}>
        {children}
      </ChakraLink>
    </BlitzLink>
  )
}
