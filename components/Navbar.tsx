"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { NAV_LINKS, PROFILE } from "@/lib/data";

function MagneticButton({ children, href }: { children: React.ReactNode; href: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    x.set(relX * 0.25);
    y.set(relY * 0.35);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a ref={ref} href={href} target="_blank" rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shadow-[0_0_0_0_rgba(59,130,246,0.5)] transition-shadow hover:shadow-[0_0_24px_4px_rgba(59,130,246,0.45)]"
    >
      Resume
    </motion.a>
  );
}

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState("top");
  const lastY = useRef(0);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      if (y <= 60) {
        setHidden(false);
      } else if (y > lastY.current + 4) {
        setHidden(true);
      } else if (y < lastY.current - 4) {
        setHidden(false);
      }
      lastY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.href.slice(1))).filter(
      Boolean
    ) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.4, rootMargin: "-80px 0px -50% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed inset-x-0 top-4 z-[100] flex justify-center px-4 pointer-events-none">
      <AnimatePresence>
        {!hidden && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="glass pointer-events-auto flex max-w-[92vw] items-center gap-4 overflow-x-auto rounded-full px-5 py-2.5"
          >
            <div className="flex flex-shrink-0 items-center gap-2">
              <Image
                src={PROFILE.photo}
                alt={PROFILE.name}
                width={30}
                height={30}
                className="h-[30px] w-[30px] flex-shrink-0 rounded-full object-cover"
              />
              <span className="whitespace-nowrap text-sm font-bold">{PROFILE.name}</span>
            </div>

            <div className="flex flex-shrink-0 items-center gap-4">
              {NAV_LINKS.map((link) => {
                const isActive = active === link.href.slice(1);
                return (
                  <a key={link.href} href={link.href} className={`relative whitespace-nowrap text-xs font-medium transition-colors ${isActive ? "text-text" : "text-text-secondary hover:text-text"}`}>
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-1 left-0 h-[2px] w-full bg-gradient-to-r from-primary to-[#7c3aed]"
                      />
                    )}
                  </a>
                );
              })}
            </div>

            <MagneticButton href={PROFILE.resumeUrl}>Resume</MagneticButton>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
