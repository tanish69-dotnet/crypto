import { useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import useCryptoStore from '../../store/useCryptoStore';

function debounce(fn, delay) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

export default function Navbar() {
  const { theme, toggleTheme, currency, setCurrency, toggleShowWatchlist, showWatchlist, searchQuery, setSearchQuery } = useCryptoStore();

  const handleSearch = useCallback(
    debounce((v) => setSearchQuery(v), 280),
    []
  );

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="nav-inner">
        {/* Logo */}
        <div className="nav-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" stroke="url(#nl)" strokeWidth="1.5"/>
              <path d="M13 20L20 13L27 20L20 27Z" fill="url(#nl2)"/>
              <path d="M20 13L20 7" stroke="url(#nl)" strokeWidth="2" strokeLinecap="round"/>
              <path d="M27 20L33 20" stroke="url(#nl)" strokeWidth="2" strokeLinecap="round"/>
              <path d="M20 27L20 33" stroke="url(#nl)" strokeWidth="2" strokeLinecap="round"/>
              <path d="M13 20L7 20" stroke="url(#nl)" strokeWidth="2" strokeLinecap="round"/>
              <defs>
                <linearGradient id="nl" x1="0" y1="0" x2="40" y2="40">
                  <stop offset="0%" stopColor="#e84118"/>
                  <stop offset="100%" stopColor="#ff7a3d"/>
                </linearGradient>
                <linearGradient id="nl2" x1="0" y1="0" x2="40" y2="40">
                  <stop offset="0%" stopColor="#e84118" stopOpacity="0.7"/>
                  <stop offset="100%" stopColor="#ffb347" stopOpacity="0.7"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="logo-text">Crypto<span className="logo-accent">Nova</span></span>
        </div>

        {/* Search */}
        <div className="nav-center">
          <div className="search-wrap">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search coins…"
              defaultValue={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              autoComplete="off"
            />
            <span className="search-kbd">⌘K</span>
          </div>
        </div>

        {/* Right controls */}
        <div className="nav-right">
          <select
            className="currency-select"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="usd">🇺🇸 USD</option>
            <option value="inr">🇮🇳 INR</option>
            <option value="eur">🇪🇺 EUR</option>
            <option value="btc">₿ BTC</option>
            <option value="eth">Ξ ETH</option>
          </select>

          <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
            <svg className="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
            <svg className="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>

          <button className={`wl-btn ${showWatchlist ? 'active' : ''}`} onClick={toggleShowWatchlist}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className="wl-label">Watchlist</span>
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
