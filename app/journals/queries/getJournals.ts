import { Ctx } from 'blitz'
import db, { FindManyJournalArgs } from 'db'

type GetJournalsInput = Pick<
  FindManyJournalArgs,
  'where' | 'orderBy' | 'skip' | 'take'
>

export default async function getJournals(
  { where, orderBy, skip = 0, take }: GetJournalsInput,
  ctx: Ctx,
) {
  ctx.session.authorize(['super-admin', 'admin', 'journal-reader'])

  const journals = await db.journal.findMany({
    // select: {},
    include: {
      // id: true,
      // day: true,
      // month: true,
      // year: true,
      tags: true,
    },
    where,
    orderBy,
    take,
    skip,
  })

  const count = await db.journal.count({ where })
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
