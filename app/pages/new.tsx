import React from 'react'
import { useRouter, useMutation, CustomBlitzPage, useQuery } from 'blitz'

import { useDisclosure } from '@chakra-ui/core'

import createJournal from 'app/journals/mutations/createJournal'

import JournalModal from 'app/journals/components/JournalModal'
import JournalCreateForm from 'app/journals/components/JournalCreateForm'

import getAllTags from 'app/tags/queries/getAllTags'

import Layout from 'app/layouts/Layout'

import { getServerSideProps as baseGetServerSideProps } from 'utils/server'
// import { getDate, leadingZero } from 'utils/date'

const NewJournal = () => {
  const router = useRouter()

  const [tags] = useQuery(getAllTags, {})
  const [createJournalMutation] = useMutation(createJournal)

  const message = React.useRef<string>()

  const rawDate = React.useMemo(() => new Date(), [])
  // const date = React.useMemo(() => getDate(rawDate), [rawDate])

  const route = React.useMemo(() => '/', [])
  // const succeedRoute = React.useMemo(
  //   () =>
  //     `/${date.year()}/${leadingZero(date.month() + 1)}/${leadingZero(
  //       date.date(),
  //     )}`,
  //   [date],
  // )

  // const redirectFailed = React.useCallback(() => {
  //   setTimeout(() => router.push(failedRoute), 200)
  // }, [router, failedRoute])

  // const redirectSucceed = React.useCallback(() => {
  //   setTimeout(() => router.push(succeedRoute), 200)
  // }, [router, succeedRoute])

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
      <JournalCreateForm
        tags={tags}
        onSubmit={async (data) => {
          try {
            await createJournalMutation({
              data: {
                ...data,
                year: Number(data.year),
                month: Number(data.month) - 1,
                day: Number(data.day),
                // year: rawDate.getFullYear(),
                // month: rawDate.getMonth(),
                // day: rawDate.getDate(),
                tags: {
                  connect: data.tags.map((tag) => ({
                    id: tag.id,
                  })),
                },
              },
            })
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
      <JournalModal
        action="new"
        message={`Will redirect to ${route} after closing this dialog`}
        date={rawDate}
        isOpen={isOpenSucceed}
        onClose={onCloseSucceed}
      />
      <JournalModal
        error
        action="new"
        message={message.current}
        date={rawDate}
        isOpen={isOpenError}
        onClose={onCloseError}
      />
    </>
  )
}

const NewJournalPage: CustomBlitzPage = ({ cookies }) => {
  return (
    <Layout title="Create New Journal" cookies={cookies}>
      <NewJournal />
    </Layout>
  )
}

export const getServerSideProps = baseGetServerSideProps

export default NewJournalPage
