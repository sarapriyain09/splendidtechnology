"use client";

import { motion } from "framer-motion";

const pipelineCards = [
  { stage: "Inbound", value: "42", trend: "+18%" },
  { stage: "Qualified", value: "27", trend: "+11%" },
  { stage: "Proposal", value: "14", trend: "+9%" },
  { stage: "Won", value: "8", trend: "+23%" },
];

const assistantLogs = [
  "Auto-followup sent to 14 leads",
  "Twilio SMS reminder triggered",
  "Meeting summary synced to CRM",
  "Pipeline dashboard refreshed",
];

export function HomeHeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative w-full max-w-xl"
    >
      <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-[#00b894]/25 blur-3xl" />
      <div className="absolute -bottom-10 -left-8 h-40 w-40 rounded-full bg-[#1f6dff]/20 blur-3xl" />

      <div className="relative overflow-hidden rounded-3xl border border-[#d7e4ff] bg-white p-5 shadow-[0_30px_80px_rgba(17,71,191,0.15)]">
        <div className="flex items-center justify-between border-b border-[#ecf3ff] pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#5b6580]">Demo CRM</p>
            <p className="text-sm font-semibold text-[#0e1629]">Sales Pipeline</p>
          </div>
          <span className="rounded-full bg-[#ecf3ff] px-2.5 py-1 text-xs font-semibold text-[#1147bf]">Live</span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {pipelineCards.map((item, idx) => (
            <motion.div
              key={item.stage}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + idx * 0.06, duration: 0.35 }}
              className="rounded-2xl border border-[#e4edff] bg-[#f7faff] p-3"
            >
              <p className="text-[11px] uppercase tracking-wider text-[#5b6580]">{item.stage}</p>
              <p className="mt-1 text-2xl font-bold text-[#0e1629]">{item.value}</p>
              <p className="text-xs font-semibold text-[#00a87f]">{item.trend}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-[#d8f3ec] bg-[#f0fffa] p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[#137b64]">AI Assistant</p>
          <ul className="mt-2 space-y-1.5">
            {assistantLogs.map((log, idx) => (
              <motion.li
                key={log}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25 + idx * 0.08, duration: 0.3 }}
                className="text-sm text-[#1f2e4e]"
              >
                {log}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
