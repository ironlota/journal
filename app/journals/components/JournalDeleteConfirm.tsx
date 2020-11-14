import React from 'react'

import { useMutation, useRouter } from 'blitz'

import { Journal } from 'db'

import {
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogProps,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/core'

import deleteJournal from 'app/journals/mutations/deleteJournal'

import { invalidateJournalQueries } from 'app/journals/utils/cache'

import { leadingZero, monthStr } from 'utils/date'

import JournalModal from './JournalModal'

const JournalDeleteConfirm = ({
  journal,
  onClose,
  ...props
}: Omit<
  AlertDialogProps,
  'size' | 'isCentered' | 'leastDestructiveRef' | 'children'
> & {
  journal: Journal
}) => {
  const router = useRouter()
  const [deleteJournalMutation] = useMutation(deleteJournal)

  const size = useBreakpointValue({ base: 'xs', md: 'lg' })
  const cancelRef = React.useRef<HTMLButtonElement>(null)
  const message = React.useRef<string>()

  const failedRoute = React.useMemo(
    () =>
      `/${journal.year}/${leadingZero(journal.month + 1)}/${leadingZero(
        journal.day,
      )}`,
    [journal],
  )
  const redirectIfFailed = React.useCallback(() => {
    onClose()
    setTimeout(() => router.push(failedRoute), 1000)
  }, [router, onClose, failedRoute])

  const succeedRoute = React.useMemo(() => '/', [])
  const redirectIfSucceed = React.useCallback(async () => {
    onClose()
    invalidateJournalQueries(journal).then(() => {
      setTimeout(() => router.push(succeedRoute), 1000)
    })
  }, [router, onClose, journal, succeedRoute])

  const {
    isOpen: isOpenSucceed,
    onOpen: onOpenSucceed,
    onClose: onCloseSucceed,
  } = useDisclosure({
    onClose: redirectIfSucceed,
  })

  const {
    isOpen: isOpenError,
    onOpen: onOpenError,
    onClose: onCloseError,
  } = useDisclosure({
    onClose: redirectIfFailed,
  })

  const deleteAction = React.useCallback(async () => {
    try {
      await deleteJournalMutation({
        where: {
          id: journal.id,
        },
      })
      onOpenSucceed()
    } catch (error) {
      message.current = `
        Will redirect to ${failedRoute} after closing this dialog <br />
        ${(error as Error).message}
      `
      onOpenError()
    }
  }, [deleteJournalMutation, journal, onOpenSucceed, onOpenError, failedRoute])

  return (
    <>
      <AlertDialog
        motionPreset="slideInBottom"
        {...props}
        onClose={onClose}
        leastDestructiveRef={cancelRef as any}
        isCentered
        size={size}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Delete Journal</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure to delete journal at
            <br />
            <strong>
              {journal.day} {monthStr(journal.month, 'MMMM')} {journal.year}
            </strong>{' '}
            ?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" ml={3} onClick={deleteAction}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <JournalModal
        action="delete"
        message={`Will redirect to ${succeedRoute} after closing this dialog`}
        journal={journal}
        isOpen={isOpenSucceed}
        onClose={onCloseSucceed}
      />
      <JournalModal
        error
        action="delete"
        message={message.current}
        journal={journal}
        isOpen={isOpenError}
        onClose={onCloseError}
      />
    </>
  )
}

export default JournalDeleteConfirm
