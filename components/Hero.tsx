// "use client";

// import { motion } from "framer-motion";
// import Image from "next/image";
// import { Download, Route, Rocket } from "lucide-react";
// import { PROFILE } from "@/lib/data";
// import InfrastructureBackground from "./InfrastructureBackground";
// import TypingWords from "./TypingWords";

// const fadeUp = {
//   hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
//   show: (delay: number) => ({
//     opacity: 1,
//     y: 0,
//     filter: "blur(0px)",
//     transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
//   }),
// };

// export default function Hero() {
//   return (
//     <section
//       id="top"
//       className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 pt-32 text-center"
//     >
//       <InfrastructureBackground />

//       <motion.span
//         variants={fadeUp}
//         initial="hidden"
//         animate="show"
//         custom={0}
//         className="glass relative z-10 mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold text-[#a78bfa]"
//       >
//         {PROFILE.badge}
//       </motion.span>

//       <motion.div
//         variants={fadeUp}
//         initial="hidden"
//         animate="show"
//         custom={0.1}
//         className="relative z-10 flex flex-wrap items-center justify-center gap-6"
//       >
//         <span className="text-[clamp(2rem,6vw,3.6rem)] font-extrabold tracking-tight">CLOUD</span>

//         <motion.div
//           animate={{ y: [0, -14, 0] }}
//           transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
//           whileHover={{ scale: 1.03 }}
//           className="relative w-[clamp(220px,28vw,420px)] aspect-square flex-shrink-0"
//         >
//         </motion.div>

//         <span className="text-[clamp(2rem,6vw,3.6rem)] font-extrabold tracking-tight">ENGINEER</span>
//       </motion.div>

//       <motion.p
//         variants={fadeUp}
//         initial="hidden"
//         animate="show"
//         custom={0.2}
//         className="relative z-10 mt-6 text-text-secondary"
//       >
//         {PROFILE.role}
//       </motion.p>

//       <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0.3} className="relative z-10 mt-4 h-7">
//         <TypingWords words={PROFILE.typingWords} />
//       </motion.div>

//       <motion.div
//         variants={fadeUp}
//         initial="hidden"
//         animate="show"
//         custom={0.4}
//         className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-4"
//       >
//         <a href={PROFILE.resumeUrl} className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5">
//           <Download size={16} /> Download Resume
//         </a>
//         <a href="#journey" className="flex items-center gap-2 rounded-full border border-white/10 px-6 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5">
//           <Route size={16} /> Explore Journey
//         </a>
//         <a href="#dworker" className="flex items-center gap-2 rounded-full border border-white/10 px-6 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5">
//           <Rocket size={16} /> Explore D-Worker
//         </a>
//       </motion.div>

//       <motion.div
//         variants={fadeUp}
//         initial="hidden"
//         animate="show"
//         custom={0.5}
//         className="relative z-10 mt-14 flex gap-10"
//       >
//         {PROFILE.stats.map((s) => (
//           <div key={s.label} className="flex flex-col items-center">
//             <span className="gradient-text text-2xl font-bold">{s.value}</span>
//             <span className="text-xs text-text-secondary">{s.label}</span>
//           </div>
//         ))}
//       </motion.div>
//     </section>
//   );
// }



// "use client";

// import { motion } from "framer-motion";
// import Image from "next/image";
// import { Download, Route, Rocket } from "lucide-react";
// import { PROFILE } from "@/lib/data";
// import InfrastructureBackground from "./InfrastructureBackground";
// import TypingWords from "./TypingWords";

// const fadeUp = {
//   hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
//   show: (delay: number) => ({
//     opacity: 1,
//     y: 0,
//     filter: "blur(0px)",
//     transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
//   }),
// };

// export default function Hero() {
//   return (
//     <section
//       id="top"
//       className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 pt-32 text-center"
//     >
//       <InfrastructureBackground />

//       <motion.span
//         variants={fadeUp}
//         initial="hidden"
//         animate="show"
//         custom={0}
//         className="glass relative z-10 mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold text-[#a78bfa]"
//       >
//         {PROFILE.badge}
//       </motion.span>

// <motion.div
//   variants={fadeUp}
//   initial="hidden"
//   animate="show"
//   custom={0.1}
//   className="relative z-10 flex flex-wrap items-center justify-center gap-3"
// >
//   <span className="text-[clamp(2rem,6vw,3.6rem)] font-extrabold tracking-tight">DINESH KANNAN</span>
//   <span className="text-[clamp(2rem,6vw,3.6rem)] font-extrabold tracking-tight">DEVOPS ENGINEER</span>
// </motion.div>

//       <motion.p
//         variants={fadeUp}
//         initial="hidden"
//         animate="show"
//         custom={0.2}
//         className="relative z-10 mt-6 text-text-secondary"
//       >
//         {PROFILE.role}
//       </motion.p>

//       <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0.3} className="relative z-10 mt-4 h-7">
//         <TypingWords words={PROFILE.typingWords} />
//       </motion.div>

//       <motion.div
//         variants={fadeUp}
//         initial="hidden"
//         animate="show"
//         custom={0.4}
//         className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-4"
//       >
//         <a href={PROFILE.resumeUrl} className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5">
//           <Download size={16} /> Download Resume
//         </a>
//         <a href="#journey" className="flex items-center gap-2 rounded-full border border-white/10 px-6 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5">
//           <Route size={16} /> Explore Journey
//         </a>
//         <a href="#dworker" className="flex items-center gap-2 rounded-full border border-white/10 px-6 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5">
//           <Rocket size={16} /> Explore D-Worker
//         </a>
//       </motion.div>

//       <motion.div
//         variants={fadeUp}
//         initial="hidden"
//         animate="show"
//         custom={0.5}
//         className="relative z-10 mt-14 flex gap-10"
//       >
//         {PROFILE.stats.map((s) => (
//           <div key={s.label} className="flex flex-col items-center">
//             <span className="gradient-text text-2xl font-bold">{s.value}</span>
//             <span className="text-xs text-text-secondary">{s.label}</span>
//           </div>
//         ))}
//       </motion.div>
//     </section>
//   );
// }


"use client";

import { motion } from "framer-motion";
import { Download, Route, Rocket } from "lucide-react";
import { PROFILE } from "@/lib/data";
import InfrastructureBackground from "./InfrastructureBackground";
import TypingWords from "./TypingWords";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24,
    filter: "blur(6px)",
  },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-32 text-center"
    >
      <InfrastructureBackground />

      {/* Badge */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={0}
        className="relative z-10"
      >
        <span className="glass inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-5 py-2 text-sm font-semibold text-primary">
          🚀 Building D-Worker
        </span>
      </motion.div>

      {/* Hero Heading */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={0.1}
        className="relative z-10 mt-8 flex flex-col items-center"
      >
        <h1 className="text-[clamp(3.5rem,8vw,6.8rem)] font-black uppercase leading-[0.9] tracking-[-0.05em] text-white">
          DINESH KANNAN
        </h1>

        <h2 className="mt-5 text-[clamp(1.3rem,2.6vw,2rem)] font-semibold uppercase tracking-[0.35em] text-primary">
          Cloud &amp; DevOps Engineer
        </h2>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={0.2}
        className="relative z-10 mt-6 max-w-3xl text-lg leading-8 text-text-secondary"
      >
        Cloud Engineer • Platform Engineer • Automation Enthusiast
      </motion.p>

      {/* Typing Animation */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={0.3}
        className="relative z-10 mt-6 h-8 text-lg font-medium text-primary"
      >
        <TypingWords words={PROFILE.typingWords} />
      </motion.div>

      {/* Buttons */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={0.4}
        className="relative z-10 mt-12 flex flex-wrap items-center justify-center gap-5"
      >
        <a
          href={PROFILE.resumeUrl}
          className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/30"
        >
          <Download size={16} />
          Download Resume
        </a>

        <a
          href="#journey"
          className="flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm font-semibold backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/50"
        >
          <Route size={16} />
          Explore Journey
        </a>

        <a
          href="#dworker"
          className="flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm font-semibold backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/50"
        >
          <Rocket size={16} />
          Explore D-Worker
        </a>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={0.5}
        className="relative z-10 mt-16 flex flex-wrap items-center justify-center gap-12"
      >
        {PROFILE.stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center">
            <span className="gradient-text text-3xl font-bold">
              {stat.value}
            </span>
            <span className="mt-1 text-sm text-text-secondary">
              {stat.label}
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}