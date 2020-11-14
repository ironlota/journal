import dayjs from 'dayjs'

export type DateType = {
  year: number
  month: number
  day: number
}

export function getDate(date_: Date | DateType) {
  if (Object.prototype.toString.call(date_) === '[object Date]') {
    const date = date_ as Date
    return dayjs(date)
  }

  const date = date_ as DateType
  return dayjs().year(date.year).month(date.month).date(date.day)
}

export function monthStr(num: number, format = 'MMM') {
  return dayjs().month(num).format(format)
}

export function yearMonthStr(year: number, num: number, format = 'MMMM YYYY') {
  return dayjs().year(year).month(num).format(format)
}

export function yearMonthDayStr(
  year: number,
  month: number,
  day: number,
  format = 'dddd, DD MMMM YYYY',
) {
  return getDate({ year, month, day }).format(format)
}

export function getDayOfWeek(date: dayjs.Dayjs, short = false) {
  const day = date.day()

  switch (day) {
    case 0:
      return short ? 'Sun' : 'Sunday'
    case 1:
      return short ? 'Mon' : 'Monday'
    case 2:
      return short ? 'Tue' : 'Tuesday'
    case 3:
      return short ? 'Wed' : 'Wednesday'
    case 4:
      return short ? 'Thur' : 'Thursday'
    case 5:
      return short ? 'Fri' : 'Friday'
    default:
      return short ? 'Sat' : 'Saturday'
  }
}

export function leadingZero(n: number) {
  return n < 10 ? '0' + n : '' + n
}
