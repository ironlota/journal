import React from 'react'

import {
  useRouter,
  useQuery,
  useMutation,
  useParam,
  CustomBlitzPage,
  GetServerSideProps,
  // invokeWithMiddleware,
} from 'blitz'

import { useDisclosure } from '@chakra-ui/core'

import { getCookies, redirect404 } from 'utils/server'

import Layout from 'app/layouts/Layout'

import { leadingZero, monthStr } from 'utils/date'

import getAllTags from 'app/tags/queries/getAllTags'

import getJournalByDate from 'app/journals/queries/getJournalByDate'
import updateJournal from 'app/journals/mutations/updateJournal'

import JournalEditForm from 'app/journals/components/JournalEditForm'
import JournalModal from 'app/journals/components/JournalModal'

type EditJournalProps = {
  year: number
  month: number
  day: number
}

export const EditJournal = ({ year, month, day }: EditJournalProps) => {
  const router = useRouter()

  const [journal, { setQueryData }] = useQuery(getJournalByDate, {
    year,
    month,
    day,
  })
  const [tags] = useQuery(getAllTags, {})
  const [updateJournalMutation] = useMutation(updateJournal)
  const message = React.useRef<string>()

  const route = React.useMemo(
    () =>
      `/${journal.year}/${leadingZero(journal.month + 1)}/${leadingZero(
        journal.day,
      )}`,
    [journal],
  )

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
      <JournalEditForm
        journal={journal}
        tags={tags}
        onSubmit={async (data) => {
          try {
            const updated = await updateJournalMutation({
              where: { id: journal.id },
              data: {
                ...data,
                tags: {
                  connect: data.tags.map((tag) => ({
                    id: tag.id,
                  })),
                },
              },
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
      <JournalModal
        action="edit"
        message={`Will redirect to ${route} after closing this dialog`}
        journal={journal}
        isOpen={isOpenSucceed}
        onClose={onCloseSucceed}
      />
      <JournalModal
        error
        action="edit"
        message={message.current}
        journal={journal}
        isOpen={isOpenError}
        onClose={onCloseError}
      />
    </>
  )
}

const EditJournalPage: CustomBlitzPage = ({ cookies }) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const year = useParam('year', 'number')!
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const month = useParam('month', 'number')! - 1
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const dayString = useParam('day', 'number')!

  const monthString = monthStr(month, 'MMMM')
  const day = Number(dayString)

  return (
    <Layout
      title={`Edit ${day} ${monthString.toUpperCase()} ${year}`}
      cookies={cookies}
    >
      <EditJournal year={year} month={month} day={day} />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<
  { cookies?: string },
  {
    year: string
    month: string
    day: string
  }
> = async ({ req, res, params }) => {
  if (res && params) {
    // const year = Number(params.year)
    const month = Number(params.month) - 1
    const day = Number(params.day)
    if (month < 10 && !params.month.includes('0')) {
      redirect404(res)
      return { props: {} }
    }
    if (day < 10 && !params.day.includes('0')) {
      redirect404(res)
      return { props: {} }
    }
    // try {
    //   await invokeWithMiddleware(
    //     getJournalByDate,
    //     { year, month, day },
    //     { req, res },
    //   )
    // } catch {
    //   redirect404(res)
    //   return { props: {} }
    // }
  }
  return {
    props: {
      cookies: getCookies(req),
    },
  }
}

// EditJournalPage.getLayout = (page) => (
//   <Layout title={'Edit Journal'}>{page}</Layout>
// )

export default EditJournalPage
