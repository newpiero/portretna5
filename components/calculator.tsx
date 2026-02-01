'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Sparkles, Send, Minus, Plus, Check, Clock, Gift, Info } from 'lucide-react'
import { SIZES, OPTIONS, DISCOUNT, BONUS_TIMER_MINUTES } from '@/lib/config'
import { formatPrice, calculatePrice, generateTelegramLink, generateSimpleTelegramLink, isDiscountDay, STORAGE_KEYS, type CalculatorState } from '@/lib/utils'

export default function Calculator() {
  const [state, setState] = useState<CalculatorState>({
    sizeId: '40x60',
    varnish: false,
    backgroundChange: false,
    angleClothesChange: false,
    extraPeople: 0,
    giftWrap: false,
  })

  const [discountActive, setDiscountActive] = useState(false)
  const [discountDeadline, setDiscountDeadline] = useState<Date | null>(null)
  const [discountTimeLeft, setDiscountTimeLeft] = useState('')
  
  const [bonusActive, setBonusActive] = useState(false)
  const [bonusDeadline, setBonusDeadline] = useState<Date | null>(null)
  const [bonusTimeLeft, setBonusTimeLeft] = useState('')

  const [isDiscountDayToday, setIsDiscountDayToday] = useState(false)
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  // Проверка дня скидки и загрузка таймеров
  useEffect(() => {
    const today = isDiscountDay()
    setIsDiscountDayToday(today)

    // Загрузка таймера скидки
    try {
      const savedDiscount = localStorage.getItem(STORAGE_KEYS.discountTimer)
      if (savedDiscount && today) {
        const deadline = new Date(savedDiscount)
        if (deadline > new Date()) {
          setDiscountActive(true)
          setDiscountDeadline(deadline)
        } else {
          localStorage.removeItem(STORAGE_KEYS.discountTimer)
        }
      }

      // Загрузка таймера бонуса
      const savedBonus = localStorage.getItem(STORAGE_KEYS.bonusTimer)
      if (savedBonus) {
        const deadline = new Date(savedBonus)
        if (deadline > new Date()) {
          setBonusActive(true)
          setBonusDeadline(deadline)
        } else {
          localStorage.removeItem(STORAGE_KEYS.bonusTimer)
        }
      } else {
        // Запускаем таймер бонуса при первом посещении
        const newDeadline = new Date(Date.now() + BONUS_TIMER_MINUTES * 60 * 1000)
        localStorage.setItem(STORAGE_KEYS.bonusTimer, newDeadline.toISOString())
        setBonusActive(true)
        setBonusDeadline(newDeadline)
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }, [])

  // Обновление таймеров
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()

      if (discountDeadline) {
        const diff = discountDeadline.getTime() - now.getTime()
        if (diff <= 0) {
          setDiscountActive(false)
          setDiscountDeadline(null)
          setDiscountTimeLeft('')
          try { localStorage.removeItem(STORAGE_KEYS.discountTimer) } catch (e) {}
        } else {
          const mins = Math.floor(diff / 60000)
          const secs = Math.floor((diff % 60000) / 1000)
          setDiscountTimeLeft(`${mins}:${secs.toString().padStart(2, '0')}`)
        }
      }

      if (bonusDeadline) {
        const diff = bonusDeadline.getTime() - now.getTime()
        if (diff <= 0) {
          setBonusActive(false)
          setBonusDeadline(null)
          setBonusTimeLeft('')
          try { localStorage.removeItem(STORAGE_KEYS.bonusTimer) } catch (e) {}
        } else {
          const mins = Math.floor(diff / 60000)
          const secs = Math.floor((diff % 60000) / 1000)
          setBonusTimeLeft(`${mins}:${secs.toString().padStart(2, '0')}`)
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [discountDeadline, bonusDeadline])

  const activateDiscount = () => {
    const deadline = new Date(Date.now() + DISCOUNT.timerMinutes * 60 * 1000)
    setDiscountActive(true)
    setDiscountDeadline(deadline)
    try {
      localStorage.setItem(STORAGE_KEYS.discountTimer, deadline.toISOString())
    } catch (e) {}
    // Яндекс.Метрика: ym(XXXXXXXX, 'reachGoal', 'discount_activated');
  }

  const result = calculatePrice(state, discountActive)
  const selectedSize = SIZES?.find(s => s.id === state.sizeId)

  const handleSizeChange = (sizeId: string) => {
    setState(prev => ({ ...prev, sizeId }))
    // Яндекс.Метрика: ym(XXXXXXXX, 'reachGoal', 'calculator_change');
  }

  const handleExtraPeopleChange = (delta: number) => {
    setState(prev => ({
      ...prev,
      extraPeople: Math.max(0, Math.min(OPTIONS.maxExtraPeople, prev.extraPeople + delta))
    }))
  }

  // Визуальное превью размера
  const getCanvasPreviewSize = () => {
    const sizes: Record<string, { w: number; h: number }> = {
      '30x40': { w: 60, h: 80 },
      '40x60': { w: 80, h: 120 },
      '50x70': { w: 100, h: 140 },
      '60x90': { w: 120, h: 180 },
      '70x100': { w: 140, h: 200 },
      '80x120': { w: 160, h: 240 },
      '100x140': { w: 200, h: 280 },
      '140x250': { w: 280, h: 400 },
    }
    const base = sizes[state.sizeId] ?? { w: 80, h: 120 }
    // Масштабируем для превью
    const maxH = 150
    const scale = Math.min(1, maxH / base.h)
    return { w: Math.round(base.w * scale), h: Math.round(base.h * scale) }
  }

  const previewSize = getCanvasPreviewSize()

  return (
    <section id="calculator" className="section-padding bg-white">
      <div className="container-main">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Рассчитайте <span className="text-gradient">стоимость</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Выберите параметры и узнайте точную цену
          </p>
        </motion.div>

        {/* Баннер скидки */}
        {isDiscountDayToday && !discountActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto mb-8 bg-gradient-to-r from-[hsl(340,60%,55%)] to-[hsl(340,70%,45%)] rounded-2xl p-6 text-white text-center shadow-xl"
          >
            <Sparkles className="w-10 h-10 mx-auto mb-2" />
            <h3 className="text-2xl font-bold mb-2">🎉 Сегодня скидка 20%!</h3>
            <p className="text-white/90 mb-4">
              Только сегодня у вас есть возможность зафиксировать скидку на 60 минут
            </p>
            <button
              onClick={activateDiscount}
              className="bg-white text-[hsl(340,60%,45%)] font-bold py-3 px-8 rounded-xl hover:bg-white/90 transition-colors"
            >
              Зафиксировать скидку
            </button>
          </motion.div>
        )}

        {/* Таймер активной скидки */}
        {discountActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto mb-8 bg-green-50 border-2 border-green-200 rounded-2xl p-4 text-center"
          >
            <div className="flex items-center justify-center gap-3">
              <Check className="w-6 h-6 text-green-600" />
              <span className="text-green-800 font-semibold">
                Скидка 20% активирована!
              </span>
              <span className="bg-green-600 text-white px-3 py-1 rounded-full font-mono">
                {discountTimeLeft}
              </span>
            </div>
          </motion.div>
        )}

        {/* Таймер бонуса */}
        {bonusActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto mb-8 bg-[hsl(45,90%,95%)] border-2 border-[hsl(45,80%,60%)] rounded-2xl p-4 text-center"
          >
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Gift className="w-6 h-6 text-[hsl(45,80%,40%)]" />
              <span className="text-[hsl(45,80%,30%)] font-semibold">
                Закажите в течение {bonusTimeLeft} — бесплатное покрытие лаком!
              </span>
            </div>
          </motion.div>
        )}

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Левая часть - параметры */}
            <div className="card-pastel">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Параметры портрета</h3>

              {/* Размер */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Размер холста
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SIZES?.map?.((size) => (
                    <button
                      key={size.id}
                      onClick={() => handleSizeChange(size.id)}
                      className={`relative p-3 rounded-xl border-2 text-left transition-all ${
                        state.sizeId === size.id
                          ? 'border-[hsl(340,60%,55%)] bg-[hsl(340,60%,97%)]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {size.popular && (
                        <span className="absolute -top-2 -right-2 bg-[hsl(340,60%,55%)] text-white text-xs px-2 py-0.5 rounded-full">
                          Хит
                        </span>
                      )}
                      <div className="font-medium text-gray-900">{size.label}</div>
                      <div className="text-sm text-gray-500">{formatPrice(size.price)}</div>
                    </button>
                  )) ?? null}
                </div>
              </div>

              {/* Доп. опции */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={state.varnish}
                    onChange={(e) => setState(prev => ({ ...prev, varnish: e.target.checked }))}
                    className="w-5 h-5 rounded border-gray-300 text-[hsl(340,60%,55%)] focus:ring-[hsl(340,60%,55%)]"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Покрытие лаком</div>
                    <div className="text-sm text-gray-500">+{formatPrice(selectedSize?.varnish ?? 0)}</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={state.backgroundChange}
                    onChange={(e) => setState(prev => ({ ...prev, backgroundChange: e.target.checked }))}
                    className="w-5 h-5 rounded border-gray-300 text-[hsl(340,60%,55%)] focus:ring-[hsl(340,60%,55%)]"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Изменение фона</div>
                    <div className="text-sm text-gray-500">+{formatPrice(OPTIONS.backgroundChange)}</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={state.angleClothesChange}
                    onChange={(e) => setState(prev => ({ ...prev, angleClothesChange: e.target.checked }))}
                    className="w-5 h-5 rounded border-gray-300 text-[hsl(340,60%,55%)] focus:ring-[hsl(340,60%,55%)]"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Другой ракурс / замена одежды</div>
                    <div className="text-sm text-gray-500">+{formatPrice(OPTIONS.angleClothesChange)}</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={state.giftWrap}
                    onChange={(e) => setState(prev => ({ ...prev, giftWrap: e.target.checked }))}
                    className="w-5 h-5 rounded border-gray-300 text-[hsl(340,60%,55%)] focus:ring-[hsl(340,60%,55%)]"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Подарочная упаковка</div>
                    <div className="text-sm text-gray-500">+{formatPrice(OPTIONS.giftWrap)}</div>
                  </div>
                </label>

                {/* Доп. люди */}
                <div className="p-3 rounded-xl border-2 border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Доп. люди на холсте</div>
                      <div className="text-sm text-gray-500">+{formatPrice(OPTIONS.extraPersonPrice)} за человека</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleExtraPeopleChange(-1)}
                        disabled={state.extraPeople <= 0}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center disabled:opacity-50 hover:bg-gray-200 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center font-semibold">{state.extraPeople}</span>
                      <button
                        onClick={() => handleExtraPeopleChange(1)}
                        disabled={state.extraPeople >= OPTIONS.maxExtraPeople}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center disabled:opacity-50 hover:bg-gray-200 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Правая часть - итог */}
            <div className="card-pastel flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ваш заказ</h3>

              {/* Превью размера */}
              <div className="flex items-center justify-center mb-6 p-4 bg-[hsl(340,20%,97%)] rounded-xl">
                <div className="text-center">
                  <div 
                    className="canvas-preview mx-auto mb-2 rounded"
                    style={{ width: previewSize.w, height: previewSize.h }}
                  />
                  <p className="text-sm text-gray-600">{selectedSize?.label ?? ''}</p>
                </div>
              </div>

              {/* Детализация */}
              <div className="space-y-2 text-sm flex-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Основа ({result?.sizeLabel ?? ''})</span>
                  <span className="font-medium">{formatPrice(result?.basePrice ?? 0)}</span>
                </div>
                {state.varnish && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Покрытие лаком</span>
                    <span className="font-medium">+{formatPrice(result?.varnishPrice ?? 0)}</span>
                  </div>
                )}
                {state.backgroundChange && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Изменение фона</span>
                    <span className="font-medium">+{formatPrice(result?.backgroundPrice ?? 0)}</span>
                  </div>
                )}
                {state.angleClothesChange && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Другой ракурс/одежда</span>
                    <span className="font-medium">+{formatPrice(result?.angleClothesPrice ?? 0)}</span>
                  </div>
                )}
                {state.extraPeople > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Доп. люди ({state.extraPeople})</span>
                    <span className="font-medium">+{formatPrice(result?.extraPeoplePrice ?? 0)}</span>
                  </div>
                )}
                {state.giftWrap && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Подарочная упаковка</span>
                    <span className="font-medium">+{formatPrice(result?.giftWrapPrice ?? 0)}</span>
                  </div>
                )}

                <div className="border-t border-gray-200 my-3" />

                {discountActive && (result?.discountAmount ?? 0) > 0 ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Без скидки</span>
                      <span className="font-medium line-through text-gray-400">{formatPrice(result?.total ?? 0)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Скидка 20%</span>
                      <span className="font-medium">-{formatPrice(result?.discountAmount ?? 0)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-900 pt-2">
                      <span>К оплате</span>
                      <span className="text-gradient">{formatPrice(result?.finalPrice ?? 0)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Итого</span>
                    <span className="text-gradient">{formatPrice(result?.total ?? 0)}</span>
                  </div>
                )}
              </div>

              {/* Кнопки */}
              <div className="mt-6 space-y-3">
                <a
                  href={result ? generateTelegramLink(state, result, discountDeadline ?? undefined) : generateSimpleTelegramLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full flex items-center justify-center gap-2"
                  // Яндекс.Метрика: ym(XXXXXXXX, 'reachGoal', 'click_tg_with_calc');
                >
                  <Send className="w-5 h-5" />
                  Заказать в Telegram
                </a>
                <a
                  href={generateSimpleTelegramLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full flex items-center justify-center gap-2"
                  // Яндекс.Метрика: ym(XXXXXXXX, 'reachGoal', 'click_tg_no_calc');
                >
                  <Send className="w-5 h-5" />
                  Написать без расчёта
                </a>
              </div>

              <p className="text-xs text-gray-500 mt-4 text-center">
                Предоплата 500₽ • Доставка рассчитывается отдельно
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
