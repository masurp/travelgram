import { parse, differenceInMinutes, differenceInHours, differenceInDays, differenceInMonths } from "date-fns"

export function formatTimestamp(timestamp: string | undefined): string {
  if (!timestamp) {
    return "Unknown date"
  }

  console.log(`Formatting timestamp: "${timestamp}"`)

  try {
    // Try parsing with different formats
    const formats = ["M/d/yyyy H:mm:ss", "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", "yyyy-MM-dd HH:mm:ss", "MM/dd/yyyy HH:mm:ss"]

    let date: Date | null = null

    for (const formatStr of formats) {
      date = parse(timestamp, formatStr, new Date())
      if (!isNaN(date.getTime())) break
    }

    // If all parsing attempts fail, try using the JavaScript Date constructor
    if (!date || isNaN(date.getTime())) {
      date = new Date(timestamp)
    }

    if (isNaN(date.getTime())) {
      throw new Error("Invalid date after parsing")
    }

    console.log(`Parsed date: ${date.toISOString()}`)

    const now = new Date()
    const minutesDiff = differenceInMinutes(now, date)
    const hoursDiff = differenceInHours(now, date)
    const daysDiff = differenceInDays(now, date)
    const monthsDiff = differenceInMonths(now, date)

    if (minutesDiff < 60) {
      return `${minutesDiff}min ago`
    } else if (hoursDiff < 24) {
      return `${hoursDiff}h ago`
    } else if (daysDiff < 30) {
      return `${daysDiff} days ago`
    } else if (monthsDiff < 12) {
      return `${monthsDiff} months ago`
    } else {
      return "More than 1 year ago"
    }
  } catch (error) {
    console.error(`Error formatting timestamp: "${timestamp}"`, error)
    return "Unknown date"
  }
}

