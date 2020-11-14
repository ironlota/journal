import React from 'react'
import { usePaginatedQuery, useRouter } from 'blitz'

import {
  Box,
  Button,
  Flex,
  Text,
  HStack,
  //   useBreakpointValue,
} from '@chakra-ui/core'

import type { TagWhereInput } from 'db'

import getTags from 'app/tags/queries/getTags'

import Link from 'app/components/Link'
import TagList from 'app/tags/components/TagList'

import { useMainColor } from 'app/hooks/useMainColor'
import { useCurrentUser } from 'app/hooks/useCurrentUser'

import TagHeader from './TagHeader'

const ITEMS_PER_PAGE = 100

export type TagListPaginationProps = {
  pathname: string
  //   header?: React.ComponentType<{ color: string; size?: string }>
  where?: TagWhereInput
}

const TagListPagination = ({
  pathname,
  //   header: Header,
  where,
}: TagListPaginationProps) => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ tags, hasMore, count }] = usePaginatedQuery(getTags, {
    where,
    orderBy: { createdAt: 'desc' },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const startEntry = ITEMS_PER_PAGE * page + 1
  const lastEntry = (page + 1) * ITEMS_PER_PAGE

  return (
    <Flex width="full" height="full" direction={{ base: 'column', md: 'row' }}>
      <TagHeader>
        <Flex
          direction="column"
          align={{ base: 'center', md: 'normal' }}
          justify={{ base: 'space-between', md: 'normal' }}
          mb={{ base: 4, md: 3 }}
        >
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
              _hover={{
                textDecoration: 'none',
              }}
            >
              <Button disabled={page === 0}>Prev</Button>
            </Link>
            <Link
              disabled={!hasMore}
              href={{ pathname, query: { page: page + 1 } }}
              _hover={{
                textDecoration: 'none',
              }}
            >
              <Button disabled={!hasMore}>Next</Button>
            </Link>
          </HStack>
        )}
      </TagHeader>
      <TagList tags={tags} />
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

export default TagListPagination
