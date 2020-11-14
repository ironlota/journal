import React from 'react'
import { usePaginatedQuery, useRouter } from 'blitz'

import {
  Box,
  Button,
  Flex,
  Text,
  HStack,
  useBreakpointValue,
} from '@chakra-ui/core'

import type { JournalWhereInput } from 'db'

import getJournals from 'app/journals/queries/getJournals'

import Link from 'app/components/Link'
import JournalList from 'app/journals/components/JournalList'

import { useMainColor } from 'app/hooks/useMainColor'
import { useCurrentUser } from 'app/hooks/useCurrentUser'

const ITEMS_PER_PAGE = 15

export type JournalListPaginationProps = {
  pathname: string
  header?: React.ComponentType<{ color: string; size?: string }>
  where?: JournalWhereInput
}

const JournalListPagination = ({
  pathname,
  header: Header,
  where,
}: JournalListPaginationProps) => {
  const user = useCurrentUser()
  const router = useRouter()
  const color = useMainColor()
  const dateSize = useBreakpointValue({ base: '2xl', md: '4xl' })
  const page = Number(router.query.page) || 0
  const [{ journals, hasMore, count }] = usePaginatedQuery(getJournals, {
    where,
    orderBy: [{ day: 'desc' }, { month: 'desc' }, { year: 'desc' }],
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const header = React.useMemo(() => {
    return Header ? (
      <Box mb={{ base: 4, md: 2 }}>
        <Header color={color} size={dateSize} />
      </Box>
    ) : null
  }, [Header, color, dateSize])

  const startEntry = ITEMS_PER_PAGE * page + 1
  const lastEntry = (page + 1) * ITEMS_PER_PAGE

  return (
    <Flex width="full" height="full" direction={{ base: 'column', md: 'row' }}>
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
              href="/new"
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
        <Flex
          direction="column"
          align={{ base: 'center', md: 'normal' }}
          justify={{ base: 'space-between', md: 'normal' }}
          mb={{ base: 0, md: 3 }}
        >
          {header}

          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            align="right"
            mr={{ md: 1 }}
            opacity={0.5}
          >
            {count > 0 ? (
              <strong>
                {startEntry} - {lastEntry > count ? count : lastEntry} / {count}
              </strong>
            ) : (
              <strong>0</strong>
            )}{' '}
            entries
          </Text>
        </Flex>
        {count > 0 && (
          <HStack mx="auto" spacing={4} display={{ base: 'none', md: 'flex' }}>
            <Link
              disabled={page === 0}
              href={{ pathname, query: { page: page - 1 } }}
              // as={{ pathname, query: { page: page - 1 } }}
              _hover={{
                textDecoration: 'none',
              }}
            >
              <Button disabled={page === 0}>Prev</Button>
            </Link>
            <Link
              disabled={!hasMore}
              href={{ pathname, query: { page: page + 1 } }}
              // as={{ pathname, query: { page: page + 1 } }}
              _hover={{
                textDecoration: 'none',
              }}
            >
              <Button disabled={!hasMore}>Next</Button>
            </Link>
          </HStack>
        )}
      </Flex>
      <JournalList journals={journals} />
      {count > 0 && (
        <HStack
          mx="auto"
          my={6}
          spacing={8}
          display={{ base: 'flex', md: 'none' }}
        >
          <Link
            disabled={page === 0}
            href={{ pathname, query: { page: page - 1 } }}
            // as={{ pathname, query: { page: page - 1 } }}
          >
            <Button disabled={page === 0}>Prev</Button>
          </Link>
          <Link
            disabled={!hasMore}
            href={{ pathname, query: { page: page + 1 } }}
            // as={{ pathname, query: { page: page + 1 } }}
          >
            <Button disabled={!hasMore}>Next</Button>
          </Link>
        </HStack>
      )}
    </Flex>
  )
}

export default JournalListPagination
