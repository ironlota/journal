import React from 'react'
import {
  useParam,
  CustomBlitzPage,
  // GetServerSideProps,
  // invokeWithMiddleware,
} from 'blitz'

import { Heading } from '@chakra-ui/core'

// import checkYear from 'app/journals/queries/checkYear'

import { getServerSideProps as baseGetServerSideProps } from 'utils/server'

import Layout from 'app/layouts/Layout'

import JournalListPagination from 'app/journals/components/JournalListPagination'

type JournalByYearsProps = {
  year: number
}

export const JournalByYears = ({ year }: JournalByYearsProps) => {
  const Header = React.useCallback(
    ({ color, size }) => (
      <Heading as="h2" color={color} size={size}>
        {year}
      </Heading>
    ),
    [year],
  )

  return (
    <JournalListPagination
      pathname={`/${year}`}
      where={{ year }}
      header={Header}
    />
  )
}

const ShowJournalByYearsPage: CustomBlitzPage = ({ cookies }) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const year = useParam('year', 'number')!

  return (
    <Layout title={`${year}`} cookies={cookies}>
      <JournalByYears year={year} />
    </Layout>
  )
}

// export const getServerSideProps: GetServerSideProps<
//   { cookies?: string },
//   {
//     year: string
//   }
// > = async ({ req, res, params }) => {
//   if (res && params) {
//     const year = Number(params.year)
//     try {
//       await invokeWithMiddleware(checkYear, { year }, { req, res })
//     } catch {
//       redirect404(res)
//       return { props: {} }
//     }
//   }
//   return {
//     props: {
//       cookies: getCookies(req),
//     },
//   }
// }

export const getServerSideProps = baseGetServerSideProps

export default ShowJournalByYearsPage
