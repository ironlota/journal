import React from 'react'
import {
  // Link,
  // useRouter,
  useQuery,
  useParam,
  CustomBlitzPage,
  GetServerSideProps,
  invokeWithMiddleware,
  // useMutation,
} from 'blitz'

import { redirect404, getCookies } from 'utils/server'

import getJournalByDate from 'app/journals/queries/getJournalByDate'

// import getJournal from 'app/journals/queries/getJournal'
// import deleteJournal from 'app/journals/mutations/deleteJournal'

import Layout from 'app/layouts/Layout'

import JournalEntry from 'app/journals/components/JournalEntry'

import { monthStr } from 'utils/date'

type JournalProps = {
  year: number
  month: number
  day: number
}

export const Journal = ({ year, month, day }: JournalProps) => {
  const [journal] = useQuery(getJournalByDate, { year, month, day })

  return <JournalEntry journal={journal} />
}

const ShowJournalPage: CustomBlitzPage = ({ cookies }) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const year = useParam('year', 'number')!
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const month = useParam('month', 'number')! - 1
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const dayString = useParam('day', 'string')!

  const day = Number(dayString)
  const monthString = monthStr(month, 'MMMM')

  return (
    <Layout
      title={`${day} ${monthString.toUpperCase()} ${year}`}
      cookies={cookies}
    >
      <Journal year={year} month={month} day={day} />
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

export default ShowJournalPage
