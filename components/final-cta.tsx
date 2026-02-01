'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Send, Heart, MessageCircle } from 'lucide-react'
import { VK_URL } from '@/lib/config'
import { generateSimpleTelegramLink } from '@/lib/utils'
import Image from 'next/image'
import { IMAGES } from '@/lib/config'

export default function FinalCTA() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      {/* Фоновое изображение */}
      <div className="absolute inset-0 opacity-10">
        <Image
          src={IMAGES?.decor?.palette ?? ''}
          alt=""
          fill
          className="object-cover"
        />
      </div>

      <div className="container-main relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <Heart className="w-12 h-12 text-[hsl(340,60%,55%)] mx-auto mb-6 animate-pulse" />
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Готовы создать <span className="text-gradient">особенный подарок</span>?
          </h2>
          
          <p className="text-lg text-gray-600 mb-8">
            Напишите нам в Telegram, прикрепите фото — и мы создадим уникальный портрет, 
            который будет радовать долгие годы.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a
              href={generateSimpleTelegramLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center justify-center gap-2 text-lg py-4 px-8"
            >
              <Send className="w-5 h-5" />
              Написать в Telegram
            </a>
            <a
              href={VK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex items-center justify-center gap-2 text-lg py-4 px-8"
            >
              <MessageCircle className="w-5 h-5" />
              Мы во ВКонтакте
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <span>📱 @portretna5</span>
            <span>🛡️ Гарантия возврата</span>
            <span>🚚 Доставка по России</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
