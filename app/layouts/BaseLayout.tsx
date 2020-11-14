import { ReactNode } from 'react'

import { Flex } from '@chakra-ui/core'

import { Chakra } from 'app/components/Chakra'
import Suspense from 'app/components/Suspense'

export type BaseLayoutProps = {
  cookies?: string
  title?: string
  children: ReactNode
}

const BaseLayout = ({ children, cookies }: BaseLayoutProps) => {
  return (
    <Chakra cookies={cookies}>
      <Flex flexDirection="column">
        {/* <ThemeToggler /> */}
        <Suspense>{children}</Suspense>
      </Flex>
    </Chakra>
  )
}

export default BaseLayout
