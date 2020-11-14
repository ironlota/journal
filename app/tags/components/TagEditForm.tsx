import React from 'react'

import { Tag } from 'db'

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  IconButton,
  Input,
  Tag as TagC,
  useBreakpointValue,
  useColorMode,
  useDisclosure,
} from '@chakra-ui/core'
import { useForm, SubmitHandler } from 'react-hook-form'
import { FiEdit2 } from 'react-icons/fi'
import { HiOutlineTrash } from 'react-icons/hi'

import { getDate } from 'utils/date'
import { TagWithJournals } from 'utils/type'

import TagDeleteConfirm from './TagDeleteConfirm'

import TagHeader from './TagHeader'

type TagEditFormProps = {
  tag: TagWithJournals
  onSubmit: SubmitHandler<Tag>
}

const TagEditForm = ({ tag, onSubmit }: TagEditFormProps) => {
  const { register, handleSubmit } = useForm({
    defaultValues: tag,
  })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const updatedAtSize = useBreakpointValue({ base: 'xs', md: 'sm' })

  const { colorMode } = useColorMode()
  const tagColor = React.useMemo(
    () => (colorMode === 'dark' ? tag.darkColor : tag.lightColor),
    [tag, colorMode],
  )

  const updatedAt = getDate(tag.updatedAt)

  return (
    <Flex width="full" height="full" direction={{ base: 'column', md: 'row' }}>
      <TagHeader tag={tag} />
      <Flex direction="column" width="full">
        <Flex justify="space-between" align="center" mb={4}>
          <TagC
            textTransform="uppercase"
            size="lg"
            variant="subtle"
            color={tagColor}
          >
            {tag.name}
          </TagC>
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
        <TagDeleteConfirm tag={tag} isOpen={isOpen} onClose={onClose} />
        <Flex direction="column" width="full">
          <Box>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSubmit(onSubmit)(e)
              }}
            >
              <Flex direction="column" mb={4}>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    ref={register}
                    name="name"
                    rows={8}
                    placeholder="Name of Tag"
                    // defaultValue={journal.am || undefined}
                  />
                </FormControl>

                <FormControl mt={2}>
                  <FormLabel>Dark Color</FormLabel>
                  <Input
                    ref={register}
                    name="darkColor"
                    rows={8}
                    placeholder="Dark color of Tag"
                    // defaultValue={journal.pm || undefined}
                  />
                </FormControl>

                <FormControl mt={2}>
                  <FormLabel>Light Color</FormLabel>
                  <Input
                    ref={register}
                    name="lightColor"
                    rows={8}
                    placeholder="Light color of Tag"
                    // defaultValue={journal.pm || undefined}
                  />
                </FormControl>
              </Flex>
              <Flex mb={4} justify="space-between">
                <Button colorScheme="blue" variant="solid" type="submit">
                  Submit
                </Button>
                <IconButton
                  href="/edit"
                  colorScheme="red"
                  aria-label="Delete Journal"
                  icon={<HiOutlineTrash />}
                  onClick={onOpen}
                />
              </Flex>
            </form>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default TagEditForm
