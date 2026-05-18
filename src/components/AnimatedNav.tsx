import { motion, useReducedMotion } from 'framer-motion';
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

export default function AnimatedNav({ activePath }: AnimatedNavProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="site-nav-shell">
      <motion.a
        href="/"
        className="logo"
        aria-label="Keagan Luttrell home"
        whileHover={reduceMotion ? undefined : { scale: 1.06, rotate: -2 }}
        whileTap={reduceMotion ? undefined : { scale: 0.98 }}
        transition={motionTransitions.fast}
      >
        <span className="logo-text">kl</span>
      </motion.a>

      <nav aria-label="Primary navigation" className="nav-links">
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
    </div>
  );
}
