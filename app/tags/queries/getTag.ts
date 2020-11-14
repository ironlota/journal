import { Ctx, NotFoundError } from 'blitz'
import db, { FindFirstTagArgs } from 'db'

type GetTagInput = Pick<FindFirstTagArgs, 'where'>

export default async function getTag({ where }: GetTagInput, ctx: Ctx) {
  ctx.session.authorize(['super-admin', 'admin', 'journal-reader'])

  const tag = await db.tag.findFirst({
    where,
    include: {
      journals: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 15,
      },
    },
  })

  if (!tag) throw new NotFoundError()

  const count = await db.journal.count({
    where: {
      tags: {
        some: {
          id: tag.id,
        },
      },
    },
  })

  return { ...tag, journalTotal: count }
}
