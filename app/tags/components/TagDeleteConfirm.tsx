import React from 'react'

import { useMutation, useRouter } from 'blitz'

import { Tag } from 'db'

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

import deleteTag from 'app/tags/mutations/deleteTag'

import { invalidateTagQueries } from 'app/journals/utils/cache'

import TagModal from './TagModal'

const TagDeleteConfirm = ({
  tag,
  onClose,
  ...props
}: Omit<
  AlertDialogProps,
  'size' | 'isCentered' | 'leastDestructiveRef' | 'children'
> & {
  tag: Tag
}) => {
  const router = useRouter()
  const [deleteTagMutation] = useMutation(deleteTag)

  const size = useBreakpointValue({ base: 'xs', md: 'lg' })
  const cancelRef = React.useRef<HTMLButtonElement>(null)
  const message = React.useRef<string>()

  const failedRoute = React.useMemo(() => `/tags/${tag.id}`, [tag])
  const redirectIfFailed = React.useCallback(() => {
    onClose()
    setTimeout(() => router.push(failedRoute), 1000)
  }, [router, onClose, failedRoute])

  const succeedRoute = React.useMemo(() => '/tags', [])
  const redirectIfSucceed = React.useCallback(async () => {
    onClose()
    invalidateTagQueries(tag).then(() => {
      setTimeout(() => router.push(succeedRoute), 1000)
    })
  }, [router, onClose, tag, succeedRoute])

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
      await deleteTagMutation({
        where: {
          id: tag.id,
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
  }, [deleteTagMutation, tag, onOpenSucceed, onOpenError, failedRoute])

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
          <AlertDialogHeader>Delete Tag</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure to delete tag id <strong>{tag.id}</strong> with name{' '}
            <strong>{tag.name}</strong> ?
            <br />
            <br />
            <strong>
              This will disconnect all journals from the deleted tag
            </strong>
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
      <TagModal
        action="delete"
        message={`Will redirect to ${succeedRoute} after closing this dialog`}
        tag={tag}
        isOpen={isOpenSucceed}
        onClose={onCloseSucceed}
      />
      <TagModal
        error
        action="delete"
        message={message.current}
        tag={tag}
        isOpen={isOpenError}
        onClose={onCloseError}
      />
    </>
  )
}

export default TagDeleteConfirm
