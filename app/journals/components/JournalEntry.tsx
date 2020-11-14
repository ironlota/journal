/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react'

import { Journal } from 'db'

import {
  Box,
  IconButton,
  Flex,
  Heading,
  Icon,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Tag as TagC,
  useBreakpointValue,
  useDisclosure,
  useColorMode,
} from '@chakra-ui/core'
import { FiEdit2 } from 'react-icons/fi'
import { HiOutlineTrash } from 'react-icons/hi'

import { useMainColor } from 'app/hooks/useMainColor'

import Link from 'app/components/Link'
import Markdown from 'app/components/Markdown'

import { getDate, getDayOfWeek, leadingZero } from 'utils/date'
import { JournalWithTags } from 'utils/type'

import { useCurrentUser } from 'app/hooks/useCurrentUser'

import JournalHeader from './JournalHeader'
import JournalDeleteConfirm from './JournalDeleteConfirm'

export type JournalEntryProps = {
  journal: JournalWithTags
}

const JournalEntry = ({ journal }: JournalEntryProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { colorMode } = useColorMode()
  const color = useMainColor()
  const user = useCurrentUser()
  const dayOfWeekSize = useBreakpointValue({ base: 'sm', md: 'xl' })
  const updatedAtSize = useBreakpointValue({ base: 'xs', md: 'sm' })
  const isSm = useBreakpointValue({ base: true, md: false })

  const date = getDate({
    year: journal.year,
    month: journal.month,
    day: journal.day,
  })
  const updatedAt = getDate(journal.updatedAt)

  return (
    <Flex width="full" height="full" direction={{ base: 'column', md: 'row' }}>
      <JournalHeader journal={journal} />
      <Flex direction="column" width="full">
        <Flex
          // direction={{ base: 'row-reverse', md: 'column' }}
          justify="space-between"
          align="center"
          mb={4}
          // align={{ base: 'center', md: 'flex-end' }}
        >
          <Heading
            as="h3"
            //   lineHeight="1.5rem"
            size={dayOfWeekSize}
            textTransform="uppercase"
          >
            {getDayOfWeek(date)}
          </Heading>
          <Heading
            as="h3"
            opacity={0.7}
            size={updatedAtSize}
            textTransform="uppercase"
          >
            <Icon as={FiEdit2} pb={1} />{' '}
            {updatedAt.format('DD/MM/YYYY hh:mm:ss')}
          </Heading>
        </Flex>
        {journal.tags.length > 0 && (
          <Flex mb={4} wrap="wrap">
            {journal.tags.map((tag) => {
              const tagColor =
                colorMode === 'dark' ? tag.darkColor : tag.lightColor
              return (
                <TagC
                  key={tag.id}
                  size="lg"
                  color={tagColor}
                  textTransform="uppercase"
                  variant="subtle"
                  mr={4}
                  mb={2}
                >
                  {tag.name}
                </TagC>
              )
            })}
          </Flex>
        )}
        {user && user.roles.includes('super-admin') && (
          <>
            <JournalDeleteConfirm
              journal={journal}
              isOpen={isOpen}
              onClose={onClose}
            />
            <Flex mb={4} justify="space-between">
              <IconButton
                // href="/edit"
                colorScheme="red"
                //   color={color}
                size="lg"
                aria-label="Delete Journal"
                icon={<HiOutlineTrash />}
                onClick={onOpen}
              />
              <Link
                href={`/${journal.year}/${leadingZero(
                  journal.month + 1,
                )}/${leadingZero(journal.day)}/edit`}
              >
                <IconButton
                  size="lg"
                  color={color}
                  variant="solid"
                  aria-label="Edit Journal"
                  icon={<FiEdit2 />}
                />
              </Link>
            </Flex>
          </>
        )}
        <Box>
          {isSm && (
            <Tabs
              isFitted
              variant="enclosed-colored"
              colorScheme="teal"
              // variant="unstyled"
              // _selected={{
              //   bg: color,
              // }}
              isLazy
            >
              <TabList mb={1}>
                <Tab>DAY</Tab>
                <Tab>NIGHT</Tab>
              </TabList>
              <TabPanels>
                <TabPanel px={0}>
                  <Box as="article" maxW="full" color="gray" order={3}>
                    <Markdown>
                      {journal.am ? journal.am : 'NO ENTRY :('}
                    </Markdown>
                  </Box>
                </TabPanel>
                <TabPanel px={0}>
                  <Box as="article" maxW="full">
                    <Markdown>
                      {journal.pm ? journal.pm : 'NO ENTRY :('}
                    </Markdown>
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          )}
          {!isSm && (
            <>
              <Flex direction="column" mb={6}>
                <Flex
                  mb={3}
                  _after={{
                    ml: 4,
                    alignSelf: 'center',
                    content: '""',
                    borderBottom: '1px solid',
                    flexGrow: 1,
                  }}
                >
                  <Heading as="h4" size="lg" textTransform="uppercase">
                    Day
                  </Heading>
                </Flex>
                <Box as="article" maxW="full" color="gray" order={3}>
                  <Markdown>{journal.am ? journal.am : 'NO ENTRY :('}</Markdown>
                </Box>
              </Flex>
              <Flex direction="column">
                <Flex
                  mb={3}
                  _after={{
                    ml: 4,
                    alignSelf: 'center',
                    content: '""',
                    borderBottom: '1px solid',
                    flexGrow: 1,
                  }}
                >
                  <Heading as="h4" size="lg" textTransform="uppercase">
                    Night
                  </Heading>
                </Flex>
                <Box as="article" maxW="full">
                  <Markdown>{journal.pm ? journal.pm : 'NO ENTRY :('}</Markdown>
                </Box>
              </Flex>{' '}
            </>
          )}
        </Box>
      </Flex>
    </Flex>
  )
}

export default JournalEntry
