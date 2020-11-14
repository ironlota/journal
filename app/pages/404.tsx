import { Head } from 'blitz'

import { Flex, Box, Heading, Icon } from '@chakra-ui/core'
import { MdArrowBack } from 'react-icons/md'

import Layout from 'app/layouts/Layout'

import Link from 'app/components/Link'

// ------------------------------------------------------
// This page is rendered if a route match is not found
// ------------------------------------------------------
export default function Page404() {
  const statusCode = 404
  const title = 'This page could not be found'
  return (
    <Layout>
      <Head>
        <title>
          {statusCode}: {title}
        </title>
      </Head>
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
          <Box align="center">
            <Heading as="h1" size="4xl" mb="4">
              {statusCode}
            </Heading>
            <Heading
              as="h2"
              size="md"
              mb="3"
              textTransform="uppercase"
              opacity={0.8}
            >
              {title}
            </Heading>
            <Link href="/" textTransform="uppercase">
              <Heading
                as="h3"
                size="md"
                textTransform="uppercase"
                opacity={0.8}
              >
                <Icon as={MdArrowBack} mr={1} />
                go home
              </Heading>
            </Link>
            {/* <ErrorComponent statusCode={statusCode} title={title} /> */}
            {/* <Link href="/api/auth">
              <a>
                <Button as="div" marginTop="1rem" marginBottom="1rem">
                  <strong>LOGIN</strong>
                </Button>
              </a>
            </Link> */}
          </Box>
        </Box>
      </Flex>
    </Layout>
  )
}
