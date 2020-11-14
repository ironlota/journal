import { Ctx, NotFoundError } from 'blitz'
import db, { FindFirstTagArgs } from 'db'

type GetTagWithoutJournalsInput = Pick<FindFirstTagArgs, 'where'>

export default async function getTagWithoutJournals(
  { where }: GetTagWithoutJournalsInput,
  ctx: Ctx,
) {
  ctx.session.authorize(['super-admin', 'admin', 'journal-reader'])

  const tag = await db.tag.findFirst({
    where,
  })

  if (!tag) throw new NotFoundError()

  return tag
}
