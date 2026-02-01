import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { SIZES, OPTIONS, DISCOUNT, TELEGRAM_USERNAME } from './config'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Форматирование цены
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
}

// Получить информацию о размере
export function getSizeInfo(sizeId: string) {
  return SIZES.find(s => s.id === sizeId) ?? null;
}

// Расчёт стоимости
export interface CalculatorState {
  sizeId: string;
  varnish: boolean;
  backgroundChange: boolean;
  angleClothesChange: boolean;
  extraPeople: number;
  giftWrap: boolean;
}

export interface CalculatorResult {
  basePrice: number;
  varnishPrice: number;
  backgroundPrice: number;
  angleClothesPrice: number;
  extraPeoplePrice: number;
  giftWrapPrice: number;
  total: number;
  discountAmount: number;
  finalPrice: number;
  sizeLabel: string;
}

export function calculatePrice(state: CalculatorState, hasDiscount: boolean): CalculatorResult | null {
  const size = getSizeInfo(state.sizeId);
  if (!size) return null;

  const basePrice = size.price;
  const varnishPrice = state.varnish ? size.varnish : 0;
  const backgroundPrice = state.backgroundChange ? OPTIONS.backgroundChange : 0;
  const angleClothesPrice = state.angleClothesChange ? OPTIONS.angleClothesChange : 0;
  const extraPeoplePrice = Math.min(state.extraPeople, OPTIONS.maxExtraPeople) * OPTIONS.extraPersonPrice;
  const giftWrapPrice = state.giftWrap ? OPTIONS.giftWrap : 0;

  const total = basePrice + varnishPrice + backgroundPrice + angleClothesPrice + extraPeoplePrice + giftWrapPrice;
  const discountAmount = hasDiscount ? Math.round(total * DISCOUNT.percent / 100) : 0;
  const finalPrice = total - discountAmount;

  return {
    basePrice,
    varnishPrice,
    backgroundPrice,
    angleClothesPrice,
    extraPeoplePrice,
    giftWrapPrice,
    total,
    discountAmount,
    finalPrice,
    sizeLabel: size.label,
  };
}

// Генерация Telegram ссылки
export function generateTelegramLink(state: CalculatorState, result: CalculatorResult, discountDeadline?: Date): string {
  const size = getSizeInfo(state.sizeId);
  if (!size || !result) return `https://t.me/${TELEGRAM_USERNAME}`;

  let message = `Хочу заказать портрет на холсте.\n\n`;
  message += `Размер: ${result.sizeLabel}\n`;
  message += `Покрытие лаком: ${state.varnish ? 'да' : 'нет'}${state.varnish ? ` (+${result.varnishPrice} ₽)` : ''}\n`;
  message += `Изменение фона: ${state.backgroundChange ? 'да' : 'нет'}${state.backgroundChange ? ` (+${result.backgroundPrice} ₽)` : ''}\n`;
  message += `Другой ракурс/одежда: ${state.angleClothesChange ? 'да' : 'нет'}${state.angleClothesChange ? ` (+${result.angleClothesPrice} ₽)` : ''}\n`;
  message += `Доп. люди: ${state.extraPeople}${state.extraPeople > 0 ? ` (${state.extraPeople}×500 ₽ = ${result.extraPeoplePrice} ₽)` : ''}\n`;
  message += `Подарочная упаковка: ${state.giftWrap ? 'да' : 'нет'}${state.giftWrap ? ` (+${result.giftWrapPrice} ₽)` : ''}\n\n`;
  message += `Итого: ${formatPrice(result.total)}\n`;

  if (result.discountAmount > 0 && discountDeadline) {
    message += `\nСкидка 20%: -${formatPrice(result.discountAmount)}\n`;
    message += `К оплате: ${formatPrice(result.finalPrice)}\n`;
    message += `Дедлайн оплаты: ${discountDeadline.toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}\n`;
  }

  return `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(message)}`;
}

export function generateSimpleTelegramLink(): string {
  const message = 'Хочу заказать портрет на холсте.';
  return `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(message)}`;
}

// Проверка даты акции (Europe/Moscow)
export function isDiscountDay(): boolean {
  const now = new Date();
  // Получаем дату в московском времени
  const moscowTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Moscow' }));
  const month = moscowTime.getMonth();
  const day = moscowTime.getDate();
  
  return DISCOUNT.activeDates.some(d => d.month === month && d.day === day);
}

// localStorage ключи
export const STORAGE_KEYS = {
  discountTimer: 'portret5_discount_timer',
  bonusTimer: 'portret5_bonus_timer',
  quizCompleted: 'portret5_quiz_completed',
  quizAnswers: 'portret5_quiz_answers',
} as const;
