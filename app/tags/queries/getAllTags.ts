import { Ctx } from 'blitz'
import db from 'db'

export default async function getAllTags(_, ctx: Ctx) {
  ctx.session.authorize(['super-admin', 'admin', 'journal-reader'])

  const tags = await db.tag.findMany()

  return tags
}
