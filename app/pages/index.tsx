import React from 'react'
import { Link, CustomBlitzPage } from 'blitz'

import { Flex, Button, Box, Heading } from '@chakra-ui/core'

import Layout from 'app/layouts/Layout'

import { useCurrentDate } from 'app/hooks/useCurrentDate'
import { useCurrentUser } from 'app/hooks/useCurrentUser'

import { getServerSideProps as baseGetServerSideProps } from 'utils/server'

import Logo from 'app/components/Logo'

import JournalListPagination from 'app/journals/components/JournalListPagination'

const LoginLogo: typeof Logo = (props) => {
  const size = React.useMemo(() => ['100px', '200px'], [])
  return <Logo {...props} w={size} h={size} />
}

const Content = () => {
  const now = useCurrentDate()
  const currentUser = useCurrentUser()

  const Header = React.useCallback(
    ({ color, size }) => (
      <Heading as="h2" color={color} size={size}>
        {now.getFullYear()}
      </Heading>
    ),
    [now],
  )

  return currentUser ? (
    <JournalListPagination
      pathname="/"
      where={{ year: now.getFullYear() }}
      header={Header}
    />
  ) : (
    <Flex
      position="fixed"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      width="full"
      align="center"
      justifyContent="center"
    >
      <Box p={2}>
        <LoginLogo marginBottom="12px" />
        <Box align="center">
          <Link href="/api/auth">
            <a>
              <Button as="div" marginTop="1rem" marginBottom="1rem">
                <strong>LOGIN</strong>
              </Button>
            </a>
          </Link>
        </Box>
      </Box>
    </Flex>
  )
}

const Home: CustomBlitzPage = ({ cookies }) => {
  return (
    <Layout title="Home" cookies={cookies}>
      <Content />
    </Layout>
  )
}

export const getServerSideProps = baseGetServerSideProps

export default Home
