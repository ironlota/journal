import React from 'react'
import {
  useParam,
  CustomBlitzPage,
  GetServerSideProps,
  // invokeWithMiddleware,
} from 'blitz'

import { Flex, Heading, useBreakpointValue } from '@chakra-ui/core'

import { monthStr, leadingZero } from 'utils/date'
import { redirect404, getCookies } from 'utils/server'

// import checkYearMonth from 'app/journals/queries/checkYearMonth'

import Layout from 'app/layouts/Layout'

import Link from 'app/components/Link'

import JournalListPagination from 'app/journals/components/JournalListPagination'

type JournalByYearMonthsProps = {
  year: number
  month: number
}

export const JournalByYearMonths = ({
  year,
  month,
}: JournalByYearMonthsProps) => {
  const Header = useBreakpointValue({
    base: ({ color, size }) => (
      <Heading
        as="h2"
        marginLeft="auto"
        color={color}
        size={size}
        textTransform="uppercase"
      >
        {monthStr(month)}{' '}
        <Link href={`/${year}`} marginLeft="auto" color={color}>
          {year}
        </Link>
      </Heading>
    ),
    md: ({ color, size }) => (
      <Flex direction={{ base: 'row', md: 'column' }}>
        <Heading
          as="h2"
          marginLeft="auto"
          color={color}
          size={size}
          textTransform="uppercase"
          mb={2}
        >
          {monthStr(month)}
        </Heading>
        <Link href={`/${year}`} marginLeft="auto" color={color}>
          <Heading as="h2" size={size}>
            {year}
          </Heading>
        </Link>
      </Flex>
    ),
  })

  return (
    <JournalListPagination
      pathname={`/${year}/${leadingZero(month + 1)}`}
      where={{ year, month }}
      header={Header}
    />
  )
}

const ShowJournalByYearsPage: CustomBlitzPage = ({ cookies }) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const year = useParam('year', 'number')!
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const month = useParam('month', 'number')! - 1

  const monthString = monthStr(month, 'MMMM')

  return (
    <Layout title={`${monthString.toUpperCase()} ${year}`} cookies={cookies}>
      <JournalByYearMonths year={year} month={month} />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<
  { cookies?: string },
  {
    year: string
    month: string
  }
> = async ({ req, res, params }) => {
  if (res && params) {
    // const year = Number(params.year)
    const month = Number(params.month) - 1
    if (month < 0 || month > 11) {
      redirect404(res)
      return { props: {} }
    } else {
      if (month < 10 && !params.month.includes('0')) {
        redirect404(res)
        return { props: {} }
      }
      // try {
      //   await invokeWithMiddleware(
      //     checkYearMonth,
      //     { year, month },
      //     { req, res },
      //   )
      // } catch {
      //   redirect404(res)
      //   return { props: {} }
      // }
    }
  }
  return {
    props: {
      cookies: getCookies(req),
    },
  }
}

export default ShowJournalByYearsPage
