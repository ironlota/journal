import { Ctx } from 'blitz'
import db, { FindManyJournalArgs } from 'db'

type GetJournalsByYearMonthInput = Pick<
  FindManyJournalArgs,
  'orderBy' | 'skip' | 'take'
> & {
  year: number
  month: number
}

export default async function getJournalsByYearMonth(
  { year, month, orderBy, skip = 0, take }: GetJournalsByYearMonthInput,
  ctx: Ctx,
) {
  ctx.session.authorize(['super-admin', 'admin', 'journal-reader'])

  const journals = await db.journal.findMany({
    where: {
      year,
      month,
    },
    orderBy,
    take,
    skip,
  })

  const count = await db.journal.count()
  const hasMore = typeof take === 'number' ? skip + take < count : false
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const nextPage = hasMore ? { take, skip: skip + take! } : null

  return {
    journals,
    nextPage,
    hasMore,
    count,
  }
}
