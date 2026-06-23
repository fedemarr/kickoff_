import dynamic from 'next/dynamic'
import { TopBar } from '@/components/store/TopBar'
import { Navbar } from '@/components/store/Navbar'
import { Footer } from '@/components/store/Footer'
import { CartDrawer } from '@/components/store/CartDrawer'

const SplashScreen = dynamic(
  () => import('@/components/store/SplashScreen').then(m => ({ default: m.SplashScreen })),
  { ssr: false }
)

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <SplashScreen />
      <TopBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  )
}
