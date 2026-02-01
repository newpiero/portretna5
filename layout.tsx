import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://localhost:3000'),
  title: 'Портрет на 5 — Портреты на холсте по фото | Идеальный подарок',
  description: 'Закажите портрет на холсте по фото — уникальный подарок для любимых. Качественная печать на хлопковом холсте, доставка по России за 7-10 дней. Гарантия качества.',
  keywords: 'портрет на холсте, портрет по фото, подарок, картина на холсте, печать на холсте, портрет на заказ',
  openGraph: {
    title: 'Портрет на 5 — Портреты на холсте по фото',
    description: 'Закажите портрет на холсте по фото — уникальный подарок для любимых. Качественная печать, доставка по России.',
    images: ['/og-image.png'],
    type: 'website',
    locale: 'ru_RU',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Портрет на 5 — Портреты на холсте по фото',
    description: 'Закажите портрет на холсте по фото — уникальный подарок для любимых.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js"></script>
        {/* 
          =====================================
          МЕСТО ДЛЯ ЯНДЕКС.МЕТРИКИ
          Вставьте код счётчика сюда:
          =====================================
          <!-- Yandex.Metrika counter -->
          <script type="text/javascript">
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
            ym(XXXXXXXX, "init", {
                 clickmap:true,
                 trackLinks:true,
                 accurateTrackBounce:true,
                 webvisor:true
            });
          </script>
          <noscript><div><img src="https://i.ytimg.com/vi/vGH6OdOgtZs/maxresdefault.jpg" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
          <!-- /Yandex.Metrika counter -->
          =====================================
        */}
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
