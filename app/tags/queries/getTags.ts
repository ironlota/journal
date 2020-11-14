import { Ctx } from 'blitz'
import db, { FindManyTagArgs } from 'db'

type GetTagsInput = Pick<FindManyTagArgs, 'where' | 'orderBy' | 'skip' | 'take'>

export default async function getTags(
  { where, orderBy, skip = 0, take }: GetTagsInput,
  ctx: Ctx,
) {
  ctx.session.authorize(['super-admin', 'admin', 'journal-reader'])

  const tags = await db.tag.findMany({
    where,
    orderBy,
    take,
    skip,
  })

  const count = await db.tag.count({ where })
  const hasMore = typeof take === 'number' ? skip + take < count : false
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const nextPage = hasMore ? { take, skip: skip + take! } : null

  return {
    tags,
    nextPage,
    hasMore,
    count,
  }
}
