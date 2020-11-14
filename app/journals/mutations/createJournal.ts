import { Ctx } from 'blitz'
import db, { JournalCreateArgs } from 'db'

type CreateJournalInput = Pick<JournalCreateArgs, 'data'>
export default async function createJournal(
  { data }: CreateJournalInput,
  ctx: Ctx,
) {
  ctx.session.authorize(['super-admin'])

  console.log(data)

  const exist = await db.journal.findFirst({
    where: {
      year: data.year,
      month: data.month,
      day: data.day,
    },
  })

  if (exist) throw Error('Journal with specified date is exist!')

  const journal = await db.journal.create({ data })

  return journal
}
