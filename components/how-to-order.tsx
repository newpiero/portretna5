'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Send, MessageCircle, Eye, CreditCard, Package, LucideIcon } from 'lucide-react'
import { ORDER_STEPS } from '@/lib/config'

const iconMap: Record<string, LucideIcon> = {
  Send,
  MessageCircle,
  Eye,
  CreditCard,
  Package,
}

export default function HowToOrder() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="how-to-order" className="section-padding gradient-pink">
      <div className="container-main">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Как <span className="text-gradient">заказать</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Всего 5 простых шагов до идеального портрета
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Линия связи */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-[hsl(340,60%,85%)] via-[hsl(340,60%,75%)] to-[hsl(340,60%,85%)]" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {ORDER_STEPS?.map?.((step, index) => {
              const Icon = iconMap[step.icon] || Send
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative text-center"
                >
                  {/* Номер шага */}
                  <div className="relative z-10 w-16 h-16 mx-auto bg-white rounded-2xl shadow-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-[hsl(340,60%,55%)] rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {step.step}
                    </div>
                    <Icon className="w-7 h-7 text-[hsl(340,60%,55%)]" />
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {step.description}
                  </p>
                </motion.div>
              )
            }) ?? null}
          </div>
        </div>
      </div>
    </section>
  )
}
