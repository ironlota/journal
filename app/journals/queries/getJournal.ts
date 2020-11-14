import { Ctx, NotFoundError } from 'blitz'
import db, { FindFirstJournalArgs } from 'db'

type GetJournalInput = Pick<FindFirstJournalArgs, 'where'>

export default async function getJournal({ where }: GetJournalInput, ctx: Ctx) {
  ctx.session.authorize(['super-admin', 'admin', 'journal-reader'])

  try {
    const journal = await db.journal.findFirst({ where })

    if (!journal) throw new NotFoundError()

    return journal
  } catch (e) {
    throw new NotFoundError()
  }
}
