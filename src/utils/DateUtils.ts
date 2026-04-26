import type {CalendarDate} from "@internationalized/date";

export function toLocalDateTimeString(value?: CalendarDate): string | null {
    if (!value) return null

    return `${value.year}-${String(value.month).padStart(2, '0')}-${String(value.day).padStart(2, '0')}T09:00:00`
}

export const formatLocalDateTime = (dateTimeString: string): string => {
    const date = new Date(dateTimeString)

    return date.toLocaleString('en-US', {
        month: 'short',   // Mar
        day: '2-digit',   // 23
        year: '2-digit',  // 26
        hour: '2-digit',  // 12
        minute: '2-digit',// 30
        hour12: false     // 24-hour format
    })
}