'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ChevronRight, Check, RefreshCw } from 'lucide-react'
import { QUIZ_QUESTIONS, SIZES } from '@/lib/config'
import { STORAGE_KEYS } from '@/lib/utils'

interface QuizAnswers {
  recipient?: string
  occasion?: string
  people?: string
}

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>({})
  const [completed, setCompleted] = useState(false)
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  useEffect(() => {
    // Загрузка сохранённых ответов из localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.quizCompleted)
      const savedAnswers = localStorage.getItem(STORAGE_KEYS.quizAnswers)
      if (saved === 'true' && savedAnswers) {
        setCompleted(true)
        setAnswers(JSON.parse(savedAnswers) ?? {})
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }, [])

  const handleAnswer = (value: string) => {
    const question = QUIZ_QUESTIONS?.[currentQuestion]
    if (!question) return
    
    const newAnswers = { ...answers, [question.id]: value }
    setAnswers(newAnswers)

    if (currentQuestion < (QUIZ_QUESTIONS?.length ?? 0) - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      // Квиз завершён
      setCompleted(true)
      try {
        localStorage.setItem(STORAGE_KEYS.quizCompleted, 'true')
        localStorage.setItem(STORAGE_KEYS.quizAnswers, JSON.stringify(newAnswers))
      } catch (e) {
        // Ignore localStorage errors
      }
      // Яндекс.Метрика: ym(XXXXXXXX, 'reachGoal', 'quiz_completed');
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setCompleted(false)
    try {
      localStorage.removeItem(STORAGE_KEYS.quizCompleted)
      localStorage.removeItem(STORAGE_KEYS.quizAnswers)
    } catch (e) {
      // Ignore localStorage errors
    }
  }

  const getRecommendation = () => {
    const people = answers?.people ?? '1'
    
    if (people === '3+' || people === 'pet') {
      return SIZES?.find(s => s.id === '50x70') ?? SIZES?.[2]
    }
    if (people === '2') {
      return SIZES?.find(s => s.id === '40x60') ?? SIZES?.[1]
    }
    return SIZES?.find(s => s.id === '40x60') ?? SIZES?.[1]
  }

  const scrollToCalculator = () => {
    const element = document.getElementById('calculator')
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  const recommendation = getRecommendation()
  const question = QUIZ_QUESTIONS?.[currentQuestion]

  return (
    <section id="quiz" className="section-padding gradient-lavender">
      <div className="container-main">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Подберём <span className="text-gradient">идеальный размер</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ответьте на 3 вопроса, и мы подскажем оптимальный вариант
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {!completed ? (
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="card-pastel"
              >
                {/* Прогресс */}
                <div className="flex gap-2 mb-6">
                  {QUIZ_QUESTIONS?.map?.((_, i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded-full transition-colors ${
                        i < currentQuestion
                          ? 'bg-[hsl(340,60%,55%)]'
                          : i === currentQuestion
                          ? 'bg-[hsl(340,60%,75%)]'
                          : 'bg-gray-200'
                      }`}
                    />
                  )) ?? null}
                </div>

                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
                  {question?.question ?? ''}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {question?.options?.map?.((option) => (
                    <button
                      key={option?.value ?? ''}
                      onClick={() => handleAnswer(option?.value ?? '')}
                      className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-[hsl(340,60%,65%)] hover:bg-[hsl(340,60%,97%)] transition-all text-left group"
                    >
                      <span className="text-2xl">{option?.emoji ?? ''}</span>
                      <span className="font-medium text-gray-800 group-hover:text-[hsl(340,60%,45%)]">
                        {option?.label ?? ''}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400 ml-auto group-hover:text-[hsl(340,60%,55%)] group-hover:translate-x-1 transition-all" />
                    </button>
                  )) ?? null}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-pastel text-center"
              >
                <div className="w-16 h-16 bg-[hsl(340,60%,55%)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Ваша рекомендация
                </h3>
                
                <div className="inline-block bg-gradient-to-r from-[hsl(340,60%,92%)] to-[hsl(270,40%,92%)] rounded-xl px-6 py-4 mb-4">
                  <p className="text-3xl font-bold text-gradient">{recommendation?.label ?? ''}</p>
                  <p className="text-gray-600 mt-1">
                    от {new Intl.NumberFormat('ru-RU').format(recommendation?.price ?? 0)} ₽
                    {recommendation?.popular && (
                      <span className="ml-2 text-xs bg-[hsl(340,60%,55%)] text-white px-2 py-1 rounded-full">
                        Хит продаж
                      </span>
                    )}
                  </p>
                </div>

                <p className="text-gray-500 text-sm mb-6">
                  Этот размер идеально подойдёт для вашего портрета
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={scrollToCalculator}
                    className="btn-primary"
                  >
                    Рассчитать точную стоимость
                  </button>
                  <button
                    onClick={resetQuiz}
                    className="btn-secondary flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Пройти заново
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
