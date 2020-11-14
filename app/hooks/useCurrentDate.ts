import React from 'react'

export function useCurrentDate() {
  const now = React.useMemo(() => new Date(), [])
  return now
}
