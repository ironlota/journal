import React from 'react'

import {
  Box,
  Flex,
  Tag as TagC,
  Text,
  VStack,
  Icon,
  SimpleGrid,
  useColorMode,
} from '@chakra-ui/core'
import { FaRegSadTear } from 'react-icons/fa'

import type { Tag } from 'db'

import useMainColor from 'app/hooks/useMainColor'

import Link from 'app/components/Link'

type JournalListProps = {
  tags: Tag[]
}

const TagList: React.FC<JournalListProps> = ({ tags }) => {
  const color = useMainColor()
  const { colorMode } = useColorMode()

  return (
    <Flex direction="column" width="full" height={{ md: 'full' }}>
      {tags.length > 0 ? (
        <SimpleGrid columns={{ base: 2, md: 5 }}>
          {tags.map((tag) => {
            const tagColor =
              colorMode === 'dark' ? tag.darkColor : tag.lightColor
            return (
              <Box key={tag.id} mb={6} mr={{ base: 0, md: 2 }}>
                <Link
                  href={`/tags/${tag.id}`}
                  _hover={{
                    color: tagColor,
                    textDecor: 'underline',
                    textDecoration: 'none',
                  }}
                >
                  <TagC
                    textTransform="uppercase"
                    size="lg"
                    variant="subtle"
                    color={tagColor}
                  >
                    {tag.name}
                  </TagC>
                </Link>
              </Box>
            )
          })}
        </SimpleGrid>
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

export default TagList
