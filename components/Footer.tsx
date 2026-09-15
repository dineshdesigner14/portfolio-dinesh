import { PROFILE } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-10 text-center text-sm text-text-secondary">
      <p className="mb-1 font-semibold text-text">{PROFILE.name}</p>
      <p>Cloud Engineer • DevOps • Platform Engineering</p>
      <p className="mt-2">🚀 Currently Building D-Worker</p>
      <p className="mt-6 text-xs">© {new Date().getFullYear()} {PROFILE.name}</p>
    </footer>
  );
}
