import { Ctx } from 'blitz'
import db, { TagDeleteArgs } from 'db'

type DeleteTagInput = Pick<TagDeleteArgs, 'where'>

export default async function deleteTag({ where }: DeleteTagInput, ctx: Ctx) {
  ctx.session.authorize(['super-admin'])

  const tag = await db.tag.delete({ where })

  return tag
}
