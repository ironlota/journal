import { Head } from 'blitz'

import BaseLayout, { BaseLayoutProps } from './BaseLayout'

import { Flex } from '@chakra-ui/core'

import Header from 'app/components/Header'

type LayoutProps = BaseLayoutProps & {
  title?: string
}

const Layout = ({ title, children, cookies }: LayoutProps) => {
  return (
    <BaseLayout cookies={cookies}>
      <Head>
        <title>{`${title} - Ray Andrew`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Flex
        as="main"
        mt="24px"
        mx={{ base: '24px', md: '32px' }}
        // mx={{ base: 0, md: 6 }}
        alignItems="center"
        height="full"
      >
        {children}
      </Flex>
    </BaseLayout>
  )
}

export default Layout
