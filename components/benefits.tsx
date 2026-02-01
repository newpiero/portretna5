'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Palette, CheckCircle, Clock, Truck, Shield, Gift, LucideIcon } from 'lucide-react'
import { BENEFITS } from '@/lib/config'

const iconMap: Record<string, LucideIcon> = {
  Palette,
  CheckCircle,
  Clock,
  Truck,
  Shield,
  Gift,
}

export default function Benefits() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="benefits" className="section-padding gradient-pink">
      <div className="container-main">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Почему выбирают <span className="text-gradient">нас</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Создаём портреты с любовью и вниманием к деталям
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BENEFITS.map((benefit, index) => {
            const Icon = iconMap[benefit.icon] || CheckCircle
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-pastel group hover:scale-105 transition-transform duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[hsl(340,60%,85%)] to-[hsl(270,40%,85%)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-[hsl(340,60%,45%)]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
