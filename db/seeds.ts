/*
 * This seed function is executed when you run `blitz db seed`.
 */
import Chance from 'chance'

import db, { Tag } from './index'

const seed = async () => {
  const chance = new Chance()

  const num = 200
  const years = [2019, 2020]

  const color = ['gray', 'red', 'yellow', 'green', 'blue']
  const darkColor = [50, 100, 200, 300, 400]
  const lightColor = [500, 600, 700]

  const tagPromises: Promise<any>[] = []

  for (let i = 0; i < 10; i++) {
    tagPromises.push(
      db.tag.create({
        data: {
          name: chance.string({ length: 5, pool: 'abcefgh' }),
          lightColor: `${chance.pickone(color)}.${chance.pickone(lightColor)}`,
          darkColor: `${chance.pickone(color)}.${chance.pickone(darkColor)}`,
        },
      }),
    )
  }

  const tags = (await Promise.all(tagPromises)) as Tag[]

  const promises = years.map((year) => {
    const result: Promise<any>[] = []
    // for (const year of years) {
    // const year = (yearr as unknown) as number
    for (let i = 0; i < num; i++) {
      const date = chance.date({ year }) as Date
      result.push(
        db.journal.create({
          data: {
            day: date.getDate(),
            month: date.getMonth(),
            year,
            am: chance.paragraph({ sentences: 7 }),
            pm: chance.paragraph({ sentences: 7 }),
            tags: {
              connect: chance.pickset(tags, 4).map((tag) => ({
                id: tag.id,
              })),
            },
            // tags: {
            // connect: {},

            //   chance.pickset(tags, 5).map((tag) => ({
            //   tag.id
            // })),
            // },
          },
        }),
      )
    }

    return result
  })

  await Promise.all(promises.flat())

  // for (const promise of promises) {
  //   await Promise.all(promise)
  // }

  // await promises.forEach(async (promise) => {
  //   await Promise.all(promise).then(() => console.log('ho'))
  // })
  // for (const promise in promises) await Promise.all(promise)

  // await Promise.all(
  // promises.map(promises => )
  // )
}

export default seed
