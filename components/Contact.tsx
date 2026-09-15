"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Send, Check } from "lucide-react";
import { CONTACT } from "@/lib/data";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm({ name: "", email: "", message: "" });
    }, 2500);
  }

  return (
    <section id="contact" className="relative px-6 py-32">
      <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-8 text-center"
        >
          <h2 className="mb-2 text-2xl font-bold">Let&apos;s Build Reliable Infrastructure Together</h2>
          <p className="mb-6 text-sm text-text-secondary">
            Currently accepting select freelance projects.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
            <textarea
              placeholder="Message"
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-[#7c3aed] py-3 text-sm font-semibold text-white"
            >
              {sent ? (
                <motion.span initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                  <Check size={16} /> Sent!
                </motion.span>
              ) : (
                <>
                  <Send size={16} /> Start a Conversation
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="glass flex flex-col gap-4 rounded-3xl p-8"
        >
          <h3 className="mb-2 text-lg font-bold">Or reach me directly</h3>
          <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-3 text-sm hover:text-primary">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-[#60a5fa]">
              <Mail size={16} />
            </span>
            {CONTACT.email}
          </a>
          <a href={CONTACT.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:text-primary">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-[#60a5fa]">
              <Github size={16} />
            </span>
            GitHub
          </a>
          <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:text-primary">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-[#60a5fa]">
              <Linkedin size={16} />
            </span>
            LinkedIn
          </a>
        </motion.div>
      </div>
    </section>
  );
}
