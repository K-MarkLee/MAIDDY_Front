'use client'

import Calendar from '@/containers/calendar/CalendarPage'
import ProtectedRoute from '@/containers/auth/ProtectedRoute'

export default function Page() {
  return (
    <ProtectedRoute>
      <Calendar />
    </ProtectedRoute>
  );
}