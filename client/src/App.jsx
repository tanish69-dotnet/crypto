import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import useCryptoStore from './store/useCryptoStore';
import ThreeBackground from './components/Background/ThreeBackground';
import Cursor from './components/Cursor/Cursor';
import Navbar from './components/Navbar/Navbar';
import Ticker from './components/Ticker/Ticker';
import HeroStats from './components/HeroStats/HeroStats';
import ControlsBar from './components/ControlsBar/ControlsBar';
import Movers from './components/Movers/Movers';
import Watchlist from './components/Watchlist/Watchlist';
import CoinsGrid from './components/CoinCard/CoinsGrid';
import CoinModal from './components/CoinModal/CoinModal';

export default function App() {
  const { showWatchlist, selectedCoin } = useCryptoStore();
  const theme = 'dark'; // Force dark theme since toggle is removed

  // Sync theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Smooth parallax scroll for background orbs
  useEffect(() => {
    const orbs = document.querySelector('.bg-orbs');
    let raf;
    let target = 0;
    let current = 0;

    const onScroll = () => { target = window.scrollY; };

    const loop = () => {
      current += (target - current) * 0.07;   // lerp factor — bigger = snappier
      if (orbs) {
        orbs.style.transform = `translateY(${(-current * 0.22).toFixed(2)}px)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={`app ${theme}-theme`}>
      <ThreeBackground />
      <Cursor />
      <div className="bg-orbs" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
      </div>

      <Navbar />
      <Ticker />

      <main className="main-content">
        <HeroStats />
        <ControlsBar />
        <Movers />
        {showWatchlist && <Watchlist />}
        <CoinsGrid />
      </main>

      <AnimatePresence>
        {selectedCoin && <CoinModal key="modal" />}
      </AnimatePresence>

      <footer className="footer">
        <div className="footer-inner">
          <span>Built with ❤️ — <strong>CryptoNova</strong></span>
          <span>
            Data by{' '}
            <a href="https://www.coingecko.com" target="_blank" rel="noreferrer">
              CoinGecko
            </a>
          </span>
          <span>Auto-refreshes every 30s</span>
        </div>
      </footer>
    </div>
  );
}
