// // "use client";

// // import { motion, AnimatePresence } from "framer-motion";

// // interface TooltipProps {
// //   visible: boolean;
// //   text?: string;
// // }

// // export default function Tooltip({ visible, text }: TooltipProps) {
// //   if (!text) return null;
// //   return (
// //     <foreignObject x={-90} y={-108} width={180} height={60} style={{ overflow: "visible" }}>
// //       <AnimatePresence>
// //         {visible && (
// //           <motion.div
// //             initial={{ opacity: 0, y: 4 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             exit={{ opacity: 0, y: 4 }}
// //             transition={{ duration: 0.15 }}
// //             className="glass pointer-events-none rounded-xl px-3 py-2 text-center text-[11px] leading-snug text-text-secondary shadow-xl"
// //           >
// //             {text}
// //           </motion.div>
// //         )}
// //       </AnimatePresence>
// //     </foreignObject>
// //   );
// // }


// "use client";

// import { motion, AnimatePresence } from "framer-motion";
// import { Info, ArrowRight } from "lucide-react";

// interface TooltipProps {
//   visible: boolean;
//   text?: string;
// }

// export default function Tooltip({
//   visible,
//   text,
// }: TooltipProps) {
//   if (!text) return null;

//   return (
//     <foreignObject
//       x={-120}
//       y={-170}
//       width={240}
//       height={140}
//       style={{
//         overflow: "visible",
//       }}
//     >
//       <AnimatePresence mode="wait">
//         {visible && (
//           <motion.div
//             initial={{
//               opacity: 0,
//               y: 15,
//               scale: 0.92,
//             }}
//             animate={{
//               opacity: 1,
//               y: 0,
//               scale: 1,
//             }}
//             exit={{
//               opacity: 0,
//               y: 10,
//               scale: 0.94,
//             }}
//             transition={{
//               duration: 0.22,
//               ease: "easeOut",
//             }}
//             className="pointer-events-none relative rounded-2xl border border-white/10 bg-slate-900/90 backdrop-blur-xl shadow-2xl overflow-hidden"
//           >
//             {/* Animated Glow */}
//             <motion.div
//               className="absolute inset-0"
//               style={{
//                 background:
//                   "radial-gradient(circle at top, rgba(59,130,246,.18), transparent 70%)",
//               }}
//               animate={{
//                 opacity: [0.35, 0.6, 0.35],
//               }}
//               transition={{
//                 duration: 3,
//                 repeat: Infinity,
//               }}
//             />

//             {/* Header */}
//             <div className="relative flex items-center gap-2 border-b border-white/10 px-4 py-3">
//               <div className="rounded-lg bg-sky-500/15 p-1.5">
//                 <Info
//                   size={14}
//                   className="text-sky-400"
//                 />
//               </div>

//               <span className="text-xs font-semibold tracking-wide text-white">
//                 Module Information
//               </span>
//             </div>

//             {/* Description */}
//             <div className="relative px-4 py-3">
//               <p className="text-[12px] leading-6 text-slate-300">
//                 {text}
//               </p>
//             </div>

//             {/* Footer */}
//             <div className="relative flex items-center justify-between border-t border-white/10 px-4 py-3">
//               <span className="text-[10px] uppercase tracking-[0.25em] text-sky-400">
//                 D-Worker
//               </span>

//               <div className="flex items-center gap-1 text-[10px] text-slate-400">
//                 Explore
//                 <ArrowRight
//                   size={12}
//                   className="text-sky-400"
//                 />
//               </div>
//             </div>

//             {/* Arrow */}
//             <div
//               className="absolute left-1/2 top-full h-4 w-4 -translate-x-1/2 -translate-y-2 rotate-45 border-r border-b border-white/10 bg-slate-900"
//             />
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </foreignObject>
//   );
// }