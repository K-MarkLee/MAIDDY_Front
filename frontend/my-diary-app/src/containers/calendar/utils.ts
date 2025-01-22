import { CalendarDay } from './types'
import { API_URL } from './constants'

export const getFirstDayOfMonth = (date: Date): number => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  return firstDay === 0 ? 6 : firstDay - 1
}

export const getDaysInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

export const getDaysInPrevMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth(), 0).getDate()
}

export const generateCalendarDays = (currentDate: Date): CalendarDay[] => {
  
  const firstDayOfMonth = getFirstDayOfMonth(currentDate)
  const daysInMonth = getDaysInMonth(currentDate)
  const daysInPrevMonth = getDaysInPrevMonth(currentDate)

  const prevMonthDays = Array.from(
    { length: firstDayOfMonth },
    (_, i) => ({
      day: daysInPrevMonth - firstDayOfMonth + i + 1,
      isCurrentMonth: false
    })
  )

  const currentMonthDays = Array.from(
    { length: daysInMonth },
    (_, i) => ({
      day: i + 1,
      isCurrentMonth: true
    })
  )

  const remainingDays = (7 - ((firstDayOfMonth + daysInMonth) % 7)) % 7
  const nextMonthDays = Array.from(
    { length: remainingDays },
    (_, i) => ({
      day: i + 1,
      isCurrentMonth: false
    })
  )

  return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays]
}

export const formatDate = (year: number, month: number, day: number): string => {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

// export const fetchCalendarData = async () => {
//   const token = localStorage.getItem('accessToken')
//   const response = await fetch(`${API_URL}/api/calendar/`, {
//     headers: {
//       'Authorization': `Bearer ${token}`
//     }
//   })

//   if (!response.ok) {
//     throw new Error('캘린더 데이터를 가져오는데 실패했습니다')
//   }

//   return await response.json()
// }

export const fetchPinnedTodos = async (date: string) => {
  const token = localStorage.getItem('accessToken')
  try {
    const response = await fetch(`${API_URL}/api/todos/pinned?date=${date}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!response.ok) throw new Error('Failed to fetch pinned todos')
    return await response.json()
  } catch (error) {
    console.error('핀 된 일정 가져오기 실패:', error)
    return []
  }
}