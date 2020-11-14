import React from 'react'
import { useRouter, useMutation, CustomBlitzPage } from 'blitz'

import { useDisclosure } from '@chakra-ui/core'

import createTag from 'app/tags/mutations/createTag'

import TagModal from 'app/tags/components/TagModal'
import TagCreateForm from 'app/tags/components/TagCreateForm'

import Layout from 'app/layouts/Layout'

import { getServerSideProps as baseGetServerSideProps } from 'utils/server'

const NewTagPage: CustomBlitzPage = ({ cookies }) => {
  const router = useRouter()
  const [createTagMutation] = useMutation(createTag)

  const message = React.useRef<string>()
  const name = React.useRef<string>('')

  const route = React.useMemo(() => '/tags', [])

  const redirect = React.useCallback(() => {
    setTimeout(() => router.push(route), 200)
  }, [router, route])

  const {
    isOpen: isOpenSucceed,
    onOpen: onOpenSucceed,
    onClose: onCloseSucceed,
  } = useDisclosure({
    onClose: redirect,
  })

  const {
    isOpen: isOpenError,
    onOpen: onOpenError,
    onClose: onCloseError,
  } = useDisclosure({
    onClose: redirect,
  })

  return (
    <Layout title="Create New Tag" cookies={cookies}>
      <TagCreateForm
        onSubmit={async (data) => {
          try {
            const newTag = await createTagMutation({
              data: {
                ...data,
                name: data.name.toLowerCase(),
              },
            })
            name.current = newTag.name
            onOpenSucceed()
          } catch (error) {
            message.current = `
              Will redirect to ${route} after closing this dialog <br />
              ${(error as Error).message}
            `
            onOpenError()
          }
        }}
      />
      <TagModal
        action="new"
        message={`Will redirect to ${route} after closing this dialog`}
        name={name.current}
        isOpen={isOpenSucceed}
        onClose={onCloseSucceed}
      />
      <TagModal
        error
        action="new"
        name={name.current}
        message={message.current}
        isOpen={isOpenError}
        onClose={onCloseError}
      />
    </Layout>
  )
}

export const getServerSideProps = baseGetServerSideProps

export default NewTagPage
