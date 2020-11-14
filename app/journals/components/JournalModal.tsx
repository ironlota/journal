import React from 'react'

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

import { monthStr, getDate } from 'utils/date'
import { JournalOrDate } from 'utils/type'

type JournalModalSuccessProps = Omit<ModalProps, 'size' | 'children'> & {
  error?: boolean
  action: 'edit' | 'new' | 'delete'
  message?: string
} & JournalOrDate

const JournalModalSuccess = ({
  action,
  message,
  error = false,
  date: givenDate,
  journal,
  ...props
}: JournalModalSuccessProps) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const date = React.useMemo(() => getDate(journal || givenDate!), [
    journal,
    givenDate,
  ])

  const journalFormat = React.useMemo(
    () => `${date.date()} ${monthStr(date.month(), 'MMMM')} ${date.year()}`,
    [date],
  )
  const messageDefault = React.useMemo(() => {
    const additional = error ? 'failed' : 'succeed'
    if (action === 'edit') {
      return `Edit journal at ${journalFormat} ${additional}!`
    }

    if (action === 'delete') {
      return `Delete journal at ${journalFormat} ${additional}!`
    }

    return `Create journal at ${journalFormat} ${additional}!`
  }, [journalFormat, error, action])

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
