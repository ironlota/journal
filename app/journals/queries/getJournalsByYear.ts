import { Ctx } from 'blitz'
import db, { Journal, Tag, FindManyJournalArgs } from 'db'

type GetJournalsByYearInput = Pick<
  FindManyJournalArgs,
  'orderBy' | 'skip' | 'take'
> & {
  year: number
}

export default async function getJournalsByYear(
  { year, orderBy, skip = 0, take }: GetJournalsByYearInput,
  ctx: Ctx,
) {
  ctx.session.authorize(['super-admin', 'admin', 'journal-reader'])

  const journals = ((await db.journal.findMany({
    where: {
      year,
    },
    // select: {
    //   id: true,
    //   day: true,
    //   month: true,
    //   year: true,
    //   tags: true,
    // },
    orderBy,
    take,
    skip,
  })) as unknown[]) as (Journal & { tags: Tag[] })[]

  await journals.forEach(async (journal) => ({
    tags: await db.tag.findMany({
      where: {
        id: journal.id,
      },
    }),
  }))

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
