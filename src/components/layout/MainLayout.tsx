import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';
import { useAuth } from '@/hooks/useAuth';

export function MainLayout() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen-safe flex-col bg-gray-50">
      <Header />
      <main className={`flex-1 ${user ? 'pb-16 md:pb-0' : ''}`}>
        <Outlet />
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
