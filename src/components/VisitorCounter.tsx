'use client'

import { useState, useEffect } from 'react'

export default function VisitorCounter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const storedCount = localStorage.getItem('visitorCount')
    const currentCount = storedCount ? parseInt(storedCount, 10) : 0
    const newCount = currentCount + 1
    localStorage.setItem('visitorCount', newCount.toString())
    setCount(newCount)
  }, [])

  return (
    <div className="text-text-secondary/60 text-xs">
      Visitors: {count.toLocaleString()}
    </div>
  )
}
