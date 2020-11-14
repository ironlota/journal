import React from 'react'

import {
  Flex,
  FlexProps,
  HStack,
  Tag as TagC,
  Text,
  VStack,
  Icon,
  useColorMode,
} from '@chakra-ui/core'
import { FaRegSadTear } from 'react-icons/fa'

import type { Journal, Tag } from 'db'

import useMainColor from 'app/hooks/useMainColor'

import Link from 'app/journals/components/JournalLink'

import { yearMonthDayStr, leadingZero } from 'utils/date'

type JournalListProps = Omit<FlexProps, 'children'> & {
  journals: (Pick<Journal, 'id' | 'day' | 'month' | 'year'> & {
    tags?: Tag[]
  })[]
}

const JournalList: React.FC<JournalListProps> = ({ journals, ...props }) => {
  const color = useMainColor()
  const { colorMode } = useColorMode()

  return (
    <Flex {...props} direction="column" width="full" height={{ md: 'full' }}>
      {journals.length > 0 ? (
        journals.map((journal) => {
          return (
            <Flex
              key={journal.id}
              justifyContent="space-between"
              direction={{ base: 'column', md: 'row' }}
              my={{ base: 4, md: 0 }}
              mb={{ base: 0, md: 3 }}
            >
              <Link
                href={`/${journal.year}/${leadingZero(
                  journal.month + 1,
                )}/${leadingZero(journal.day)}`}
              >
                {yearMonthDayStr(journal.year, journal.month, journal.day)}
              </Link>
              <HStack spacing={{ base: 2, md: 3 }}>
                {journal.tags &&
                  journal.tags.map((tag) => {
                    const tagColor =
                      colorMode === 'dark' ? tag.darkColor : tag.lightColor
                    return (
                      <Link
                        key={tag.id}
                        href={`/tags/${tag.id}`}
                        _hover={{
                          color: tagColor,
                          textDecor: 'underline',
                          textDecoration: 'none',
                        }}
                      >
                        <TagC
                          textTransform="uppercase"
                          size="md"
                          variant="subtle"
                          color={tagColor}
                        >
                          {tag.name}
                        </TagC>
                      </Link>
                    )
                  })}
              </HStack>
            </Flex>
          )
        })
      ) : (
        <VStack
          mt={{ base: 8, md: 2 }}
          spacing={10}
          direction="column"
          align="start"
        >
          <Icon alignSelf="center" as={FaRegSadTear} boxSize={24} />
          <Text color={color} fontSize="lg">
            <strong>The sadness...</strong>
          </Text>
          <Text color={color} fontSize="lg">
            <strong>Nothing is here yet, I guess...</strong>
          </Text>
        </VStack>
      )}
    </Flex>
  )
}

export default JournalList
