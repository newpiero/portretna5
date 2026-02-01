'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Clock, ArrowDown, Send } from 'lucide-react'
import { IMAGES } from '@/lib/config'
import { generateSimpleTelegramLink } from '@/lib/utils'
import Image from 'next/image'

export default function Hero() {
  const [ordersToday, setOrdersToday] = useState(0)

  useEffect(() => {
    // Генерируем случайное число заказов на клиенте
    setOrdersToday(Math.floor(Math.random() * 8) + 8) // 8-15 заказов
  }, [])

  const scrollToCalculator = () => {
    const element = document.getElementById('calculator')
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Фоновое изображение с параллаксом */}
      <div className="absolute inset-0 z-0">
        <Image
          src={IMAGES.hero}
          alt="Портрет на холсте"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/90" />
      </div>

      {/* Контент */}
      <div className="relative z-10 container-main pt-24 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          {/* Бейдж срочности */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg mb-6"
          >
            <Clock className="w-4 h-4 text-[hsl(340,60%,55%)]" />
            <span className="text-sm font-medium text-gray-700">
              Сегодня заказали уже <span className="text-[hsl(340,60%,55%)] font-bold">{ordersToday}</span> портретов
            </span>
          </motion.div>

          {/* Заголовок */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
          >
            Портрет на холсте по фото — <br />
            <span className="text-gradient">подарок, который запоминают</span>
          </motion.h1>

          {/* Подзаголовок */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Превратим любимое фото в произведение искусства на настоящем холсте. 
            Идеально для подарка на день рождения, годовщину или просто без повода.
          </motion.p>

          {/* CTA кнопки */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <button
              onClick={scrollToCalculator}
              className="btn-primary flex items-center justify-center gap-2 text-lg py-4 px-8"
            >
              <Sparkles className="w-5 h-5" />
              Рассчитать стоимость
            </button>
            <a
              href={generateSimpleTelegramLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex items-center justify-center gap-2 text-lg py-4 px-8"
              // Яндекс.Метрика: ym(XXXXXXXX, 'reachGoal', 'click_tg_no_calc');
            >
              <Send className="w-5 h-5" />
              Написать в Telegram
            </a>
          </motion.div>

          {/* Преимущества в строку */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm text-gray-500"
          >
            <span className="flex items-center gap-1">
              <span className="text-[hsl(340,60%,55%)]">✓</span> Бесплатные правки
            </span>
            <span className="flex items-center gap-1">
              <span className="text-[hsl(340,60%,55%)]">✓</span> От 7 дней
            </span>
            <span className="flex items-center gap-1">
              <span className="text-[hsl(340,60%,55%)]">✓</span> Доставка по России
            </span>
            <span className="flex items-center gap-1">
              <span className="text-[hsl(340,60%,55%)]">✓</span> Гарантия возврата
            </span>
          </motion.div>
        </div>

        {/* Стрелка вниз */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <button
            onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })}
            className="animate-bounce text-[hsl(340,60%,55%)] hover:text-[hsl(340,60%,45%)] transition-colors"
          >
            <ArrowDown className="w-8 h-8" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
