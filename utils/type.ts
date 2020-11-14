import { Journal, Tag } from 'db'

export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }
export type XOR<T, U> = T | U extends Record<string, unknown>
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U

export type JournalOrDate = XOR<
  {
    date: Date
  },
  { journal: Journal }
>

export type JournalWithTags = Journal & {
  tags: Tag[]
}

export type JournalWithTagsOrDate = XOR<
  { journal: JournalWithTags },
  { date: Date }
>

export type TagWithJournals = Tag & {
  journals: Journal[]
  journalTotal: number
}

export type TagOrName = XOR<
  {
    tag: Tag
  },
  { name: string }
>
