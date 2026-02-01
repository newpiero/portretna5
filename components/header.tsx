'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, Heart, Send } from 'lucide-react'
import { TELEGRAM_USERNAME } from '@/lib/config'
import { generateSimpleTelegramLink } from '@/lib/utils'
import Image from 'next/image'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: 'smooth' })
    setIsMobileMenuOpen(false)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container-main">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Логотип */}
          <a href="#" className="flex items-center gap-2" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
            <div className="relative w-10 h-10">
              <Image
                src="/favicon.svg"
                alt="Портрет на 5"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-bold text-lg text-gradient hidden sm:block">Портрет на 5</span>
          </a>

          {/* Навигация desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection('gallery')}
              className="text-sm font-medium text-gray-700 hover:text-[hsl(340,60%,55%)] transition-colors"
            >
              Примеры работ
            </button>
            <button
              onClick={() => scrollToSection('calculator')}
              className="text-sm font-medium text-gray-700 hover:text-[hsl(340,60%,55%)] transition-colors"
            >
              Калькулятор
            </button>
            <button
              onClick={() => scrollToSection('reviews')}
              className="text-sm font-medium text-gray-700 hover:text-[hsl(340,60%,55%)] transition-colors"
            >
              Отзывы
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-sm font-medium text-gray-700 hover:text-[hsl(340,60%,55%)] transition-colors"
            >
              FAQ
            </button>
          </nav>

          {/* CTA кнопка */}
          <div className="flex items-center gap-3">
            <a
              href={generateSimpleTelegramLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 btn-primary text-sm py-2 px-4"
            >
              <Send className="w-4 h-4" />
              Написать в Telegram
            </a>

            {/* Мобильное меню */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Мобильное меню */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white/95 backdrop-blur-md border-t shadow-lg"
        >
          <nav className="container-main py-4 flex flex-col gap-3">
            <button
              onClick={() => scrollToSection('gallery')}
              className="text-left py-2 px-4 rounded-lg hover:bg-[hsl(340,60%,95%)] transition-colors"
            >
              Примеры работ
            </button>
            <button
              onClick={() => scrollToSection('calculator')}
              className="text-left py-2 px-4 rounded-lg hover:bg-[hsl(340,60%,95%)] transition-colors"
            >
              Калькулятор
            </button>
            <button
              onClick={() => scrollToSection('reviews')}
              className="text-left py-2 px-4 rounded-lg hover:bg-[hsl(340,60%,95%)] transition-colors"
            >
              Отзывы
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-left py-2 px-4 rounded-lg hover:bg-[hsl(340,60%,95%)] transition-colors"
            >
              FAQ
            </button>
            <a
              href={generateSimpleTelegramLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 btn-primary mt-2"
            >
              <Send className="w-4 h-4" />
              Написать в Telegram
            </a>
          </nav>
        </motion.div>
      )}
    </header>
  )
}
