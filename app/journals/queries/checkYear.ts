import { Ctx, NotFoundError } from 'blitz'
import db from 'db'

type GetYearsInput = { year: number }

export default async function checkYear({ year }: GetYearsInput, ctx: Ctx) {
  ctx.session.authorize(['super-admin', 'admin', 'journal-reader'])

  const result = await db.journal.findFirst({
    where: { year },
  })

  if (!result) throw new NotFoundError()
}
