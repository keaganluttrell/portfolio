import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { motionTransitions, motionVariants, navStagger } from '../lib/motion';

type AnimatedNavProps = {
  activePath: string;
};

const links = [
  { href: '/', label: 'home' },
  { href: '/about', label: 'about' },
  { href: '/projects', label: 'projects' },
  { href: 'mailto:keaganluttrell7@gmail.com', label: 'contact' },
];

function isActive(activePath: string, href: string) {
  if (href.startsWith('mailto:')) return false;
  if (href === '/') return activePath === '/';
  return activePath === href || activePath === `${href}/`;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    setIsMobile(mq.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isMobile;
}

export default function AnimatedNav({ activePath }: AnimatedNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const openMenu = useCallback(() => setMobileOpen(true), []);
  const closeMenu = useCallback(() => setMobileOpen(false), []);
  const toggleMenu = useCallback(() => setMobileOpen((prev) => !prev), []);

  // Close on outside click
  useEffect(() => {
    if (!mobileOpen) return;

    function handleOutsideClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        closeMenu();
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [mobileOpen, closeMenu]);

  // Close on Escape
  useEffect(() => {
    if (!mobileOpen) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        closeMenu();
        buttonRef.current?.focus();
      }
    }

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [mobileOpen, closeMenu]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <div className="site-nav-shell">
      <motion.a
        href="/"
        className="logo"
        aria-label="Keagan Luttrell home"
        whileHover={reduceMotion || isMobile ? undefined : { scale: 1.06, rotate: -2 }}
        whileTap={reduceMotion || isMobile ? undefined : { scale: 0.98 }}
        transition={motionTransitions.fast}
      >
        <span className="logo-text">kl</span>
      </motion.a>

      {/* Hamburger button — visible only on mobile */}
      <button
        ref={buttonRef}
        className="nav-toggle"
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
        aria-controls="mobile-nav"
        onClick={toggleMenu}
      >
        <span className={`hamburger-line ${mobileOpen ? 'open' : ''}`} />
        <span className={`hamburger-line ${mobileOpen ? 'open' : ''}`} />
        <span className={`hamburger-line ${mobileOpen ? 'open' : ''}`} />
      </button>

      {/* Desktop nav — hidden on mobile */}
      <nav aria-label="Primary navigation" className="nav-links nav-links--desktop">
        {links.map((link, index) => {
          const active = isActive(activePath, link.href);

          return (
            <motion.a
              key={link.href}
              href={link.href}
              className="nav-link"
              aria-current={active ? 'page' : undefined}
              transition={{ ...motionTransitions.fast, delay: navStagger * index }}
            >
              {active && !reduceMotion ? (
                <motion.span
                  className="nav-active-pill"
                  layoutId="nav-active-pill"
                  transition={motionTransitions.normal}
                />
              ) : active ? (
                <span className="nav-active-pill" />
              ) : null}
              {link.label}
            </motion.a>
          );
        })}
      </nav>

      {/* Mobile nav overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            ref={menuRef}
            id="mobile-nav"
            className="nav-links nav-links--mobile"
            aria-label="Primary navigation"
            initial={reduceMotion ? undefined : { opacity: 0, y: -12 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
            transition={motionTransitions.normal}
          >
            {links.map((link, index) => {
              const active = isActive(activePath, link.href);

              return (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="nav-link"
                  aria-current={active ? 'page' : undefined}
                  initial={reduceMotion ? undefined : { opacity: 0, x: -16 }}
                  animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                  transition={{
                    ...motionTransitions.fast,
                    delay: reduceMotion ? 0 : navStagger * index * 2,
                  }}
                  onClick={closeMenu}
                >
                  {active && !reduceMotion ? (
                    <motion.span
                      className="nav-active-pill"
                      layoutId="nav-active-pill-mobile"
                      transition={motionTransitions.normal}
                    />
                  ) : active ? (
                    <span className="nav-active-pill" />
                  ) : null}
                  {link.label}
                </motion.a>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
