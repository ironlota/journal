import React from 'react'

import { Tag } from 'db'

import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Textarea,
  useBreakpointValue,
  useDisclosure,
  Button,
  IconButton,
} from '@chakra-ui/core'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { FiEdit2 } from 'react-icons/fi'
import { HiOutlineTrash } from 'react-icons/hi'

import JournalSelectTags from 'app/journals/components/JournalSelectTags'

import { getDate, getDayOfWeek } from 'utils/date'
import { JournalWithTags } from 'utils/type'

import JournalHeader from './JournalHeader'
import JournalDeleteConfirm from './JournalDeleteConfirm'

type JournalEditFormProps = {
  journal: JournalWithTags
  tags?: Tag[]
  onSubmit: SubmitHandler<JournalWithTags>
}

const JournalEditForm = ({ journal, tags, onSubmit }: JournalEditFormProps) => {
  const { register, handleSubmit, control } = useForm({
    defaultValues: journal,
  })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const dayOfWeekSize = useBreakpointValue({ base: 'sm', md: 'xl' })
  const updatedAtSize = useBreakpointValue({ base: 'xs', md: 'sm' })

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
        <Flex justify="space-between" align="center" mb={4}>
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
        <JournalDeleteConfirm
          journal={journal}
          isOpen={isOpen}
          onClose={onClose}
        />
        <Flex direction="column" width="full">
          <Box>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Flex direction="column" mb={4}>
                {tags && tags.length > 0 && (
                  <Controller
                    name="tags"
                    control={control}
                    defaultValue={journal.tags}
                    render={(props) => (
                      <JournalSelectTags mb={4} items={tags} {...props} />
                    )}
                  />
                )}
                <FormControl>
                  <FormLabel>Day</FormLabel>
                  <Textarea
                    ref={register}
                    name="am"
                    rows={8}
                    placeholder="Input Day Journal"
                    // defaultValue={journal.am || undefined}
                  />
                </FormControl>

                <FormControl mt={2}>
                  <FormLabel>Night</FormLabel>
                  <Textarea
                    ref={register}
                    name="pm"
                    rows={8}
                    placeholder="Input Night journal"
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
                  //   color={color}
                  // size="lg"
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

export default JournalEditForm
