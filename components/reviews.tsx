'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { REVIEWS } from '@/lib/config'

export default function Reviews() {
  const [currentPage, setCurrentPage] = useState(0)
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  
  const reviewsPerPage = 4
  const totalPages = Math.ceil((REVIEWS?.length ?? 0) / reviewsPerPage)
  const currentReviews = REVIEWS?.slice?.(currentPage * reviewsPerPage, (currentPage + 1) * reviewsPerPage) ?? []

  return (
    <section id="reviews" className="section-padding bg-white">
      <div className="container-main">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Отзывы <span className="text-gradient">клиентов</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Нам доверяют сотни счастливых клиентов по всей России
          </p>
        </motion.div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentReviews?.map?.((review, index) => (
              <motion.div
                key={`${review.name}-${currentPage}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-pastel relative"
              >
                <Quote className="absolute top-4 right-4 w-8 h-8 text-[hsl(340,60%,90%)]" />
                
                {/* Звёзды */}
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: review?.rating ?? 5 }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[hsl(45,90%,50%)] text-[hsl(45,90%,50%)]" />
                  ))}
                </div>

                {/* Текст */}
                <p className="text-gray-700 mb-4 leading-relaxed">
                  &laquo;{review?.text ?? ''}&raquo;
                </p>

                {/* Автор */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{review?.name ?? ''}</p>
                    <p className="text-sm text-gray-500">{review?.city ?? ''}</p>
                  </div>
                  <div className="bg-[hsl(340,60%,95%)] text-[hsl(340,60%,45%)] text-sm px-3 py-1 rounded-full">
                    {review?.size ?? ''}
                  </div>
                </div>
              </motion.div>
            )) ?? null}
          </div>

          {/* Навигация */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center disabled:opacity-50 hover:shadow-lg transition-shadow"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentPage === i
                        ? 'bg-[hsl(340,60%,55%)] w-6'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage === totalPages - 1}
                className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center disabled:opacity-50 hover:shadow-lg transition-shadow"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
