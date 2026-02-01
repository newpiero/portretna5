'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Calculator } from 'lucide-react'
import { generateSimpleTelegramLink } from '@/lib/utils'

export default function StickyButton() {
  const [show, setShow] = useState(false)
  const [passedCalculator, setPassedCalculator] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Показывать после прокрутки 500px
      setShow(window.scrollY > 500)

      // Проверяем, прошли ли калькулятор
      const calculator = document.getElementById('calculator')
      if (calculator) {
        const rect = calculator.getBoundingClientRect()
        setPassedCalculator(rect.bottom < 0)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToCalculator = () => {
    const element = document.getElementById('calculator')
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        >
          <div className="bg-white/95 backdrop-blur-md border-t shadow-2xl p-4 safe-area-inset-bottom">
            <div className="flex gap-3">
              {!passedCalculator ? (
                <button
                  onClick={scrollToCalculator}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  <Calculator className="w-5 h-5" />
                  Рассчитать
                </button>
              ) : (
                <a
                  href={generateSimpleTelegramLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Заказать в Telegram
                </a>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
