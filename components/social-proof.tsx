'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, X } from 'lucide-react'
import { SOCIAL_PROOF_MESSAGES } from '@/lib/config'

export default function SocialProof() {
  const [notification, setNotification] = useState<typeof SOCIAL_PROOF_MESSAGES[number] | null>(null)
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (dismissed) return

    const showNotification = () => {
      const messagesLength = SOCIAL_PROOF_MESSAGES?.length ?? 0
      if (messagesLength < 1) return
      
      const randomIndex = Math.floor(Math.random() * messagesLength)
      const message = SOCIAL_PROOF_MESSAGES?.[randomIndex] ?? null
      setNotification(message)
      setVisible(true)

      // Скрыть через 5 сек
      setTimeout(() => {
        setVisible(false)
      }, 5000)
    }

    // Первое уведомление через 10 сек
    const firstTimeout = setTimeout(showNotification, 10000)

    // Повторять каждые 25-40 сек
    const interval = setInterval(() => {
      const randomDelay = Math.random() * 15000 + 25000 // 25-40 сек
      setTimeout(showNotification, randomDelay)
    }, 40000)

    return () => {
      clearTimeout(firstTimeout)
      clearInterval(interval)
    }
  }, [dismissed])

  const dismiss = () => {
    setVisible(false)
    setDismissed(true)
  }

  return (
    <AnimatePresence>
      {visible && notification && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className="fixed bottom-20 md:bottom-6 left-4 z-40 max-w-xs"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-4 border border-gray-100">
            <button
              onClick={dismiss}
              className="absolute -top-2 -right-2 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <X className="w-3 h-3 text-gray-500" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[hsl(340,60%,90%)] rounded-full flex items-center justify-center flex-shrink-0">
                <ShoppingCart className="w-5 h-5 text-[hsl(340,60%,55%)]" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {notification.name} из {notification.city}
                </p>
                <p className="text-xs text-gray-500">
                  заказала портрет {notification.size}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
