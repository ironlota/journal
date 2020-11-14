import { Ctx } from 'blitz'
import db, { JournalDeleteArgs } from 'db'

type DeleteJournalInput = Pick<JournalDeleteArgs, 'where'>

export default async function deleteJournal(
  { where }: DeleteJournalInput,
  ctx: Ctx,
) {
  ctx.session.authorize(['super-admin'])

  const journal = await db.journal.delete({ where })

  return journal
}
