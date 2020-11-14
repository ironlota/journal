import React from 'react'
import { Tag } from 'db'

import {
  Box,
  Button,
  Heading,
  Icon,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalContent,
  ModalProps,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/core'
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai'

import { TagOrName } from 'utils/type'

type JournalModalSuccessProps = Omit<ModalProps, 'size' | 'children'> & {
  error?: boolean
  action: 'edit' | 'new' | 'delete'
  message?: string
} & TagOrName

const JournalModalSuccess = ({
  action,
  message,
  error = false,
  tag,
  name,
  ...props
}: JournalModalSuccessProps) => {
  const messageDefault = React.useMemo(() => {
    const additional = error ? 'failed' : 'succeed'
    if (action === 'edit') {
      return `Edit '${tag ? tag.name : name}' tag ${additional}!`
    }

    if (action === 'delete') {
      return `Delete '${tag ? tag.name : name}' tag ${additional}!`
    }

    return `Create '${tag ? tag.name : name}' tag ${additional}!`
  }, [tag, name, error, action])

  const size = useBreakpointValue({ base: 'xs', md: 'lg' })
  const errorColor = useColorModeValue('red.500', 'red.300')
  const successColor = useColorModeValue('green.500', 'green.300')

  return (
    <Modal blockScrollOnMount isCentered size={size} {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Icon
            as={error ? AiOutlineCloseCircle : AiOutlineCheckCircle}
            color={error ? errorColor : successColor}
            mr={2}
            mb="2px"
          />
          {error ? 'Error!' : 'Success!'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>{messageDefault}</Box>
          {message && (
            <Box mt={2}>
              <Heading as="h3" size="sm">
                Message:
              </Heading>
              <Text
                fontSize="sm"
                fontFamily="journal"
                dangerouslySetInnerHTML={{ __html: message }}
              />
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme={error ? 'red' : 'green'} onClick={props.onClose}>
            OK
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default JournalModalSuccess
