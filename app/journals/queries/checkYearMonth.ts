import { Ctx, NotFoundError } from 'blitz'
import db from 'db'

type GetYearsInput = { year: number; month: number }

export default async function checkYearMonth(
  { year, month }: GetYearsInput,
  ctx: Ctx,
) {
  ctx.session.authorize(['super-admin', 'admin', 'journal-reader'])

  const result = await db.journal.findFirst({
    where: { year, month },
  })

  if (!result) throw new NotFoundError()
}
