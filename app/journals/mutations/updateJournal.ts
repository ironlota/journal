import { Ctx } from 'blitz'
import db, { JournalUpdateArgs } from 'db'

type UpdateJournalInput = Pick<JournalUpdateArgs, 'where' | 'data'>

export default async function updateJournal(
  { where, data }: UpdateJournalInput,
  ctx: Ctx,
) {
  ctx.session.authorize(['super-admin'])

  const journal = await db.journal.update({ where, data })

  return journal
}
