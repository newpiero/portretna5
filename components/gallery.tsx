'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ChevronLeft, ChevronRight, ArrowLeftRight } from 'lucide-react'
import { IMAGES } from '@/lib/config'
import Image from 'next/image'

function BeforeAfterSlider({ before, after, alt }: { before: string; after: string; alt: string }) {
  const [sliderPosition, setSliderPosition] = useState(50)

  return (
    <div className="before-after-slider relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
      {/* After image (background) */}
      <div className="absolute inset-0">
        <Image src={after} alt={`${alt} - после`} fill className="object-cover" />
      </div>
      
      {/* Before image (clipped) */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <Image src={before} alt={`${alt} - до`} fill className="object-cover" />
      </div>

      {/* Slider line */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-20"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
          <ArrowLeftRight className="w-5 h-5 text-[hsl(340,60%,55%)]" />
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full z-10">
        До
      </div>
      <div className="absolute top-4 right-4 bg-[hsl(340,60%,55%)]/90 text-white text-sm px-3 py-1 rounded-full z-10">
        После
      </div>

      {/* Slider input */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={(e) => setSliderPosition(Number(e.target.value))}
        className="absolute inset-0 w-full h-full cursor-ew-resize opacity-0 z-30"
      />
    </div>
  )
}

export default function Gallery() {
  const [activeTab, setActiveTab] = useState<'gallery' | 'beforeAfter'>('gallery')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const galleryImages = IMAGES?.gallery ?? []
  const beforeAfterImages = IMAGES?.beforeAfter ?? []

  const nextSlide = () => {
    if (activeTab === 'gallery') {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil((galleryImages?.length ?? 0) / 3))
    } else {
      setCurrentSlide((prev) => (prev + 1) % (beforeAfterImages?.length ?? 1))
    }
  }

  const prevSlide = () => {
    if (activeTab === 'gallery') {
      setCurrentSlide((prev) => (prev - 1 + Math.ceil((galleryImages?.length ?? 0) / 3)) % Math.ceil((galleryImages?.length ?? 0) / 3))
    } else {
      setCurrentSlide((prev) => (prev - 1 + (beforeAfterImages?.length ?? 1)) % (beforeAfterImages?.length ?? 1))
    }
  }

  return (
    <section id="gallery" className="section-padding bg-white">
      <div className="container-main">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Наши <span className="text-gradient">работы</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Каждый портрет — это уникальное произведение искусства
          </p>

          {/* Табы */}
          <div className="inline-flex bg-[hsl(340,20%,96%)] rounded-xl p-1">
            <button
              onClick={() => { setActiveTab('gallery'); setCurrentSlide(0); }}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'gallery'
                  ? 'bg-white text-[hsl(340,60%,55%)] shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Галерея
            </button>
            <button
              onClick={() => { setActiveTab('beforeAfter'); setCurrentSlide(0); }}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'beforeAfter'
                  ? 'bg-white text-[hsl(340,60%,55%)] shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              До / После
            </button>
          </div>
        </motion.div>

        {/* Контент */}
        <div className="relative">
          {/* Кнопки навигации */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          <AnimatePresence mode="wait">
            {activeTab === 'gallery' ? (
              <motion.div
                key="gallery"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8"
              >
                {galleryImages?.slice?.(currentSlide * 3, currentSlide * 3 + 3)?.map?.((image, index) => (
                  <motion.div
                    key={image?.src ?? index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
                  >
                    <Image
                      src={image?.src ?? ''}
                      alt={image?.alt ?? 'Портрет'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-white/90 text-gray-800 text-sm px-3 py-1 rounded-full">
                          {image?.category ?? 'Портрет'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )) ?? null}
              </motion.div>
            ) : (
              <motion.div
                key="beforeAfter"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-md mx-auto px-8"
              >
                {beforeAfterImages?.[currentSlide] && (
                  <BeforeAfterSlider
                    before={beforeAfterImages[currentSlide]?.before ?? ''}
                    after={beforeAfterImages[currentSlide]?.after ?? ''}
                    alt={beforeAfterImages[currentSlide]?.alt ?? 'Трансформация'}
                  />
                )}
                <p className="text-center text-gray-500 mt-4">
                  Потяните слайдер, чтобы увидеть разницу
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Индикаторы */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ 
              length: activeTab === 'gallery' 
                ? Math.ceil((galleryImages?.length ?? 0) / 3) 
                : (beforeAfterImages?.length ?? 0) 
            }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentSlide === i
                    ? 'bg-[hsl(340,60%,55%)] w-6'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
