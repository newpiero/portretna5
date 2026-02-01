'use client'

import { Send, Heart } from 'lucide-react'
import { TELEGRAM_USERNAME, VK_URL } from '@/lib/config'
import { generateSimpleTelegramLink } from '@/lib/utils'
import Image from 'next/image'

export default function Footer() {
  const currentYear = 2026 // Фиксированный год для гидратации

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container-main">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Лого */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src="/favicon.svg"
                alt="Портрет на 5"
                fill
                className="object-contain brightness-0 invert"
              />
            </div>
            <span className="font-bold text-xl">Портрет на 5</span>
          </div>

          {/* Контакты */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a
              href={generateSimpleTelegramLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-[hsl(340,60%,65%)] transition-colors"
            >
              <Send className="w-5 h-5" />
              @{TELEGRAM_USERNAME}
            </a>
            <a
              href={VK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-[hsl(340,60%,65%)] transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.576-1.496c.588-.19 1.341 1.26 2.14 1.818.605.422 1.064.33 1.064.33l2.137-.03s1.117-.071.587-.964c-.043-.073-.308-.661-1.588-1.87-1.34-1.264-1.16-1.059.453-3.246.983-1.332 1.376-2.145 1.253-2.493-.117-.332-.84-.244-.84-.244l-2.406.015s-.178-.025-.31.056c-.13.079-.212.262-.212.262s-.382 1.03-.89 1.907c-1.07 1.85-1.499 1.948-1.674 1.834-.407-.267-.305-1.075-.305-1.648 0-1.793.267-2.54-.52-2.733-.262-.065-.454-.107-1.123-.114-.858-.009-1.585.003-1.996.208-.274.136-.485.44-.356.457.159.022.519.099.71.363.246.341.237 1.107.237 1.107s.142 2.11-.33 2.371c-.325.18-.77-.187-1.725-1.865-.489-.859-.859-1.81-.859-1.81s-.07-.176-.198-.272c-.154-.115-.37-.151-.37-.151l-2.286.015s-.343.01-.469.163c-.112.136-.009.418-.009.418s1.781 4.232 3.8 6.361c1.851 1.952 3.949 1.824 3.949 1.824h.952z" />
              </svg>
              ВКонтакте
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p className="flex items-center justify-center gap-1">
            © {currentYear} Портрет на 5. Сделано с <Heart className="w-4 h-4 text-[hsl(340,60%,55%)]" /> в России
          </p>
        </div>
      </div>
    </footer>
  )
}
