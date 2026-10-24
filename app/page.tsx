"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import Hero from "@/components/hero/Hero";
import About from "@/components/About";
import Journey from "@/components/Journey";
import DesignLab from "@/components/DesignLab";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const SEEN_KEY = "cloud-odyssey-intro-seen";

/**
 * Cloud Odyssey landing flow:
 * Hero → About → Journey → Design Lab → Projects → Contact
 * (Skills, Experience and Certifications live inside About;
 *  D-Worker lives on its own /dworker route.)
 *
 * The loading intro plays once per browser session, so coming back from
 * /dworker (e.g. "Portfolio" → /#projects) goes straight to the page.
 */
export default function Home() {
  const [ready, setReady] = useState(false); // sessionStorage checked
  const [skipIntro, setSkipIntro] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useLayoutEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      /* storage unavailable: just play the intro */
    }
    if (seen) {
      setSkipIntro(true);
      setLoaded(true);
    }
    setReady(true);
  }, []);

  const finishIntro = () => {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
    setLoaded(true);
  };

  // arriving with a #hash (e.g. back from /dworker): jump to that section once it exists.
  // Tried twice because the Journey section settles its height just after mount.
  useEffect(() => {
    if (!loaded) return;
    const id = window.location.hash.slice(1);
    if (!id) return;
    const jump = () =>
      document.getElementById(id)?.scrollIntoView({ behavior: "instant" as ScrollBehavior });
    const raf = requestAnimationFrame(jump);
    const timer = setTimeout(jump, 450);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [loaded]);

  if (!ready) return null;

  return (
    <>
      {!skipIntro && <LoadingScreen onDone={finishIntro} />}
      {loaded && (
        <>
          <Navbar />
          <main>
            <Hero />
            <About />
            <Journey />
            <DesignLab />
            <Projects />
            <Contact />
          </main>
          <Footer />
        </>
      )}
    </>
  );
}
