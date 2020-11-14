import { invalidateQuery } from 'blitz'
// import { queryCache } from 'react-query'

import { Journal, Tag } from 'db'

import getJournalsByYear from 'app/journals/queries/getJournalsByYear'
import getJournalsByYearMonth from 'app/journals/queries/getJournalsByYearMonth'
import getJournalByDate from 'app/journals/queries/getJournalByDate'

import getTags from 'app/tags/queries/getTags'
import getTag from 'app/tags/queries/getTag'

export const invalidateJournalQueries = async (journal: Journal) => {
  //   await queryCache.invalidateQueries()
  await invalidateQuery(getJournalsByYear, journal)
  await invalidateQuery(getJournalsByYearMonth, journal)
  await invalidateQuery(getJournalByDate, journal)
}

export const invalidateTagQueries = async (tag: Tag) => {
  //   await queryCache.invalidateQueries()
  await invalidateQuery(getTags, { where: tag })
  await invalidateQuery(getTag, { where: tag })
}
