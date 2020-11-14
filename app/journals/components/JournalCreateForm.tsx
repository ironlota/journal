import React from 'react'

import { Tag } from 'db'

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useBreakpointValue,
} from '@chakra-ui/core'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'

import { useCurrentDate } from 'app/hooks/useCurrentDate'

import JournalSelectTags from 'app/journals/components/JournalSelectTags'

import { getDate, getDayOfWeek } from 'utils/date'
import { JournalWithTags } from 'utils/type'

import JournalHeader from './JournalHeader'

type JournalCreateFormProps = {
  tags?: Tag[]
  onSubmit: SubmitHandler<JournalWithTags>
}

const JournalCreateForm = ({ tags, onSubmit }: JournalCreateFormProps) => {
  const dayOfWeekSize = useBreakpointValue({ base: 'sm', md: 'xl' })

  const rawDate = useCurrentDate()

  const { register, handleSubmit, control } = useForm<JournalWithTags>({
    defaultValues: {
      year: rawDate.getFullYear(),
      month: rawDate.getMonth(),
      day: rawDate.getDate(),
      tags: [],
    },
  })

  const date = React.useMemo(
    () =>
      getDate({
        year: rawDate.getFullYear(),
        month: rawDate.getMonth(),
        day: rawDate.getDate(),
      }),
    [rawDate],
  )

  return (
    <Flex width="full" height="full" direction={{ base: 'column', md: 'row' }}>
      <JournalHeader date={rawDate} />
      <Flex direction="column" width="full">
        <Flex justify="space-between" align="center" mb={4}>
          <Heading as="h3" size={dayOfWeekSize} textTransform="uppercase">
            {getDayOfWeek(date)}
          </Heading>
        </Flex>
        <Flex direction="column" width="full">
          <Box>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Flex direction="column" mb={4}>
                {tags && tags.length > 0 && (
                  <Controller
                    name="tags"
                    // ref={register}
                    control={control}
                    render={(props) => (
                      <JournalSelectTags mb={4} items={tags} {...props} />
                    )}
                  />
                )}
                <FormControl>
                  <FormLabel>Year</FormLabel>
                  <NumberInput defaultValue={date.year()}>
                    <NumberInputField
                      placeholder="Input Journal Year"
                      ref={register}
                      name="year"
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl mt={2}>
                  <FormLabel>Month</FormLabel>
                  <NumberInput
                    keepWithinRange
                    defaultValue={date.month() + 1}
                    min={1}
                    max={12}
                  >
                    <NumberInputField
                      placeholder="Input Journal Month"
                      ref={register}
                      name="month"
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl mt={2}>
                  <FormLabel>Date</FormLabel>
                  <NumberInput defaultValue={date.date()} min={1} max={31}>
                    <NumberInputField
                      keepWithinRange
                      placeholder="Input Journal Date"
                      ref={register}
                      name="day"
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl mt={2}>
                  <FormLabel>Day</FormLabel>
                  <Textarea
                    ref={register}
                    name="am"
                    rows={8}
                    placeholder="Input Day Journal"
                  />
                </FormControl>
                <FormControl mt={2}>
                  <FormLabel>Night</FormLabel>
                  <Textarea
                    ref={register}
                    name="pm"
                    rows={8}
                    placeholder="Input Night journal"
                  />
                </FormControl>
              </Flex>
              <Flex mb={4} justify="space-between">
                <Button colorScheme="blue" variant="solid" type="submit">
                  Submit
                </Button>
              </Flex>
            </form>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default JournalCreateForm
