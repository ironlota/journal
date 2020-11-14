import { Ctx, NotFoundError } from 'blitz'

import db from 'db'

type GetJournalByDateInput = {
  day: number
  month: number
  year: number
}

export default async function getJournalByDate(
  { day, month, year }: GetJournalByDateInput,
  ctx: Ctx,
) {
  ctx.session.authorize(['super-admin', 'admin', 'journal-reader'])

  const journal = await db.journal.findFirst({
    where: { day, month, year },
    include: {
      tags: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (!journal) throw new NotFoundError()

  return journal
}
