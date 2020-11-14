import React from 'react'

import { Box, Button, Flex, Heading, useBreakpointValue } from '@chakra-ui/core'

import Link from 'app/components/Link'

import useMainColor from 'app/hooks/useMainColor'
import { useCurrentUser } from 'app/hooks/useCurrentUser'

import { getDate, leadingZero, monthStr } from 'utils/date'
import { JournalOrDate } from 'utils/type'

type JournalHeaderProps = JournalOrDate

const JournalHeader = ({ date: givenDate, journal }: JournalHeaderProps) => {
  const user = useCurrentUser()
  const color = useMainColor()
  const size = useBreakpointValue({ base: '2xl', md: '4xl' })
  const isSm = useBreakpointValue({ base: true, md: false })

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const date = React.useMemo(() => getDate(journal || givenDate!), [
    journal,
    givenDate,
  ])

  return (
    <Flex
      direction="column"
      justify="space-between"
      pb={{ base: 0, md: 4 }}
      mr={{ base: 0, md: 8 }}
    >
      <Flex
        direction="column"
        align="center"
        justify={{ base: 'space-between', md: 'normal' }}
      >
        <Box mb={{ base: 4, md: 2 }}>
          {isSm ? (
            <Heading
              as="h2"
              marginLeft="auto"
              color={color}
              size={size}
              textTransform="uppercase"
            >
              {date.date()}{' '}
              <Link
                href={`/${date.year()}/${leadingZero(date.month() + 1)}`}
                marginLeft="auto"
                color={color}
              >
                {monthStr(date.month())}
              </Link>{' '}
              <Link href={`/${date.year()}`} marginLeft="auto" color={color}>
                {date.year()}
              </Link>
            </Heading>
          ) : (
            <Flex direction={{ base: 'row', md: 'column' }}>
              <Heading
                as="h2"
                marginLeft="auto"
                size={size}
                textTransform="uppercase"
                mb={2}
                color={color}
              >
                {date.date()}
              </Heading>
              <Link
                href={`/${date.year()}/${leadingZero(date.month() + 1)}`}
                marginLeft="auto"
                color={color}
              >
                <Heading
                  as="h2"
                  color={color}
                  size={size}
                  textTransform="uppercase"
                  mb={2}
                >
                  {monthStr(date.month())}
                </Heading>
              </Link>
              <Link href={`/${date.year()}`} marginLeft="auto" color={color}>
                <Heading as="h2" color={color} size={size}>
                  {date.year()}
                </Heading>
              </Link>
            </Flex>
          )}
        </Box>
        {user?.roles.includes('super-admin') && (
          <Box mb={{ base: 4, md: 2 }} width="full">
            <Link
              href="/new"
              marginLeft="auto"
              display="flex"
              color={color}
              _hover={{
                textDecoration: 'none',
              }}
            >
              <Button width="full">New</Button>
            </Link>
          </Box>
        )}
      </Flex>
    </Flex>
  )
}

export default JournalHeader
