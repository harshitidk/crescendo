import { useState, useEffect, useCallback } from 'react'
import { subscribeToActivity } from '../lib/arcadeDB'
import './ArcadeToast.css'

interface Toast {
  id: string
  message: string
}

export default function ArcadeToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string) => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev.slice(-3), { id, message }])
    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  useEffect(() => {
    const sub = subscribeToActivity((newRow: { message: string }) => {
      if (newRow?.message) {
        addToast(newRow.message)
      }
    })

    return () => { sub.unsubscribe() }
  }, [addToast])

  if (toasts.length === 0) return null

  return (
    <div className="arcade-toast-container">
      {toasts.map((t) => (
        <div key={t.id} className="arcade-toast">
          <span className="toast-chevron">›</span> {t.message}
        </div>
      ))}
    </div>
  )
}
