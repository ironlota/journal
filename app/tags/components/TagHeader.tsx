import React from 'react'

import {
  Box,
  Button,
  Flex,
  Heading,
  // Tag as TagC,
  // useColorMode,
} from '@chakra-ui/core'

import Link from 'app/components/Link'
import Logo from 'app/components/Logo'

import { TagWithJournals } from 'utils/type'

import { useCurrentUser } from 'app/hooks/useCurrentUser'
import useMainColor from 'app/hooks/useMainColor'

type TagHeaderProps = {
  tag?: TagWithJournals
}

const TagHeader: React.FC<TagHeaderProps> = ({ tag, children }) => {
  const user = useCurrentUser()
  const color = useMainColor()

  // const { colorMode } = useColorMode()

  return (
    <Flex
      direction="column"
      // justify="space-between"
      pb={{ base: 0, md: 4 }}
      mr={{ base: 0, md: 8 }}
      height={{ md: 'full' }}
    >
      {user?.roles.includes('super-admin') && (
        <Box mb={{ base: 4, md: 3 }}>
          <Link
            href="/tags/new"
            marginLeft="auto"
            color={color}
            _hover={{
              textDecoration: 'none',
            }}
          >
            <Button width="full">New</Button>
          </Link>
        </Box>
      )}
      {tag && (
        <Flex
          mt={2}
          direction={{ md: 'column' }}
          justify="center"
          // justify={{ base: 'space-between' }}
          align="center"
        >
          <Flex
            mx={{ md: 'auto' }}
            direction="row"
            align="center"
            mb={{ md: 4 }}
          >
            <Logo aria-label="Number of Jounrals" mr={2} boxSize={8} />{' '}
            <Heading>{tag.journalTotal}</Heading>
          </Flex>
          {/* <Box alignItems="center" textAlign="center">
            <TagC
              size="lg"
              mx="auto"
              fontWeight="700"
              color={colorMode === 'dark' ? tag.darkColor : tag.lightColor}
            >
              COLOR
            </TagC>
          </Box> */}
        </Flex>
      )}
      {children}
    </Flex>
  )
}

export default TagHeader
