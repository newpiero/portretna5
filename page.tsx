import Header from '@/components/header'
import Hero from '@/components/hero'
import Benefits from '@/components/benefits'
import Gallery from '@/components/gallery'
import Quiz from '@/components/quiz'
import Calculator from '@/components/calculator'
import HowToOrder from '@/components/how-to-order'
import Reviews from '@/components/reviews'
import FAQ from '@/components/faq'
import Guarantee from '@/components/guarantee'
import FinalCTA from '@/components/final-cta'
import Footer from '@/components/footer'
import SocialProof from '@/components/social-proof'
import StickyButton from '@/components/sticky-button'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Benefits />
      <Gallery />
      <Quiz />
      <Calculator />
      <HowToOrder />
      <Reviews />
      <FAQ />
      <Guarantee />
      <FinalCTA />
      <Footer />
      
      {/* Всплывающие элементы */}
      <SocialProof />
      <StickyButton />
    </main>
  )
}
