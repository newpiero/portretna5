'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Shield, RefreshCw, Package, Heart } from 'lucide-react'

export default function Guarantee() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-br from-[hsl(340,60%,55%)] to-[hsl(340,70%,45%)] rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden">
            {/* Декоративные круги */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10" />
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Гарантия 100%
              </h2>

              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Если макет не понравится — вернём предоплату. 
                Без вопросов и объяснений.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 rounded-2xl p-6">
                  <RefreshCw className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-1">Бесплатные правки</h3>
                  <p className="text-sm text-white/80">До полного утверждения</p>
                </div>
                <div className="bg-white/10 rounded-2xl p-6">
                  <Package className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-1">Надёжная упаковка</h3>
                  <p className="text-sm text-white/80">Защитим портрет при доставке</p>
                </div>
                <div className="bg-white/10 rounded-2xl p-6">
                  <Heart className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-1">С любовью</h3>
                  <p className="text-sm text-white/80">Каждый портрет уникален</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
