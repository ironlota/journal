import React from 'react'

import {
  useRouter,
  useQuery,
  useMutation,
  useParam,
  CustomBlitzPage,
  GetServerSideProps,
} from 'blitz'

import { useDisclosure } from '@chakra-ui/core'

import { getCookies } from 'utils/server'

import Layout from 'app/layouts/Layout'

import getTag from 'app/tags/queries/getTag'
import updateTag from 'app/tags/mutations/updateTag'

import TagEditForm from 'app/tags/components/TagEditForm'
import TagModal from 'app/tags/components/TagModal'

type EditTagProps = {
  id: number
}

export const EditTag = ({ id }: EditTagProps) => {
  const router = useRouter()

  const [tag, { setQueryData }] = useQuery(getTag, {
    where: { id },
  })
  const [updateTagMutation] = useMutation(updateTag)
  const message = React.useRef<string>()

  const route = React.useMemo(() => `/tags/${id}`, [id])

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
    <>
      <TagEditForm
        tag={tag}
        onSubmit={async (data) => {
          try {
            const updated = await updateTagMutation({
              where: { id: tag.id },
              data,
            })
            await setQueryData(updated as any)
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
        action="edit"
        message={`Will redirect to ${route} after closing this dialog`}
        tag={tag}
        isOpen={isOpenSucceed}
        onClose={onCloseSucceed}
      />
      <TagModal
        error
        action="edit"
        message={message.current}
        tag={tag}
        isOpen={isOpenError}
        onClose={onCloseError}
      />
    </>
  )
}

const EditTagPage: CustomBlitzPage = ({ cookies }) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const id = useParam('id', 'number')!

  return (
    <Layout title={`Edit tag id: ${id}`} cookies={cookies}>
      <EditTag id={id} />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<{
  cookies?: string
}> = async ({ req }) => {
  return {
    props: {
      cookies: getCookies(req),
    },
  }
}

export default EditTagPage
