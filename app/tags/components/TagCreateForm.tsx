import React from 'react'

import { Tag } from 'db'

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/core'
import { useForm, SubmitHandler } from 'react-hook-form'

type TagCreateFormProps = {
  onSubmit: SubmitHandler<Tag>
}

const TagCreateForm = ({ onSubmit }: TagCreateFormProps) => {
  const { register, handleSubmit } = useForm()

  return (
    <Flex width="full" height="full" direction={{ base: 'column', md: 'row' }}>
      <Flex direction="column" width="full">
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
                  />
                </FormControl>

                <FormControl mt={2}>
                  <FormLabel>Dark Color</FormLabel>
                  <Input
                    ref={register}
                    name="darkColor"
                    rows={8}
                    placeholder="Dark color of Tag"
                  />
                </FormControl>

                <FormControl mt={2}>
                  <FormLabel>Light Color</FormLabel>
                  <Input
                    ref={register}
                    name="lightColor"
                    rows={8}
                    placeholder="Light color of Tag"
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

export default TagCreateForm
