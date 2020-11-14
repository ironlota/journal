import React from 'react'

import {
  Box,
  Flex,
  Heading,
  Icon,
  IconButton,
  Tag as TagC,
  // Text,
  useBreakpointValue,
  useColorMode,
  useDisclosure,
} from '@chakra-ui/core'

import { Tag, Journal } from 'db'

import { HiOutlineTrash } from 'react-icons/hi'
import { FiEdit2 } from 'react-icons/fi'

import { getDate } from 'utils/date'

import Link from 'app/components/Link'

import JournalList from 'app/journals/components/JournalList'

import { useCurrentUser } from 'app/hooks/useCurrentUser'
import useMainColor from 'app/hooks/useMainColor'

import { TagWithJournals } from 'utils/type'

import TagHeader from './TagHeader'
import TagDeleteConfirm from './TagDeleteConfirm'

type TagEntryProps = {
  tag: TagWithJournals
}

const TagEntry = ({ tag }: TagEntryProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const color = useMainColor()
  const updatedAtSize = useBreakpointValue({ base: 'xs', md: 'sm' })
  const updatedAt = getDate(tag.updatedAt)

  const { colorMode } = useColorMode()
  const tagColor = React.useMemo(
    () => (colorMode === 'dark' ? tag.darkColor : tag.lightColor),
    [tag, colorMode],
  )
  const user = useCurrentUser()

  return (
    <Flex width="full" height="full" direction={{ base: 'column', md: 'row' }}>
      <TagHeader tag={tag} />
      <Box width="full" mt={{ base: 4, md: 0 }}>
        <Flex mb={4} align="center" justify="space-between">
          <TagC
            textTransform="uppercase"
            size="lg"
            variant="subtle"
            color={tagColor}
          >
            {tag.name}
          </TagC>
          {/* <Heading as="h2" size="lg" textTransform="uppercase">
            {tag.name}
          </Heading> */}
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
        {user && user.roles.includes('super-admin') && (
          <>
            <TagDeleteConfirm tag={tag} isOpen={isOpen} onClose={onClose} />
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
              <Link href={`/tags/${tag.id}/edit`}>
                <IconButton
                  size="lg"
                  color={color}
                  variant="solid"
                  aria-label="Edit Tag"
                  icon={<FiEdit2 />}
                />
              </Link>
            </Flex>
          </>
        )}
        {/* <Flex mb={4} align="center" justify="space-between"></Flex> */}
        <JournalList journals={tag.journals} />
      </Box>
    </Flex>
  )
}

export default TagEntry
