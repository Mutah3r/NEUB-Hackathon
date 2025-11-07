import { motion } from "framer-motion";
import { FiMessageSquare, FiRefreshCcw } from "react-icons/fi";

const SUGGESTIONS = [
  "Which vaccine types are most requested this week?",
  "Predict stock-out risk for next month",
  "Peak hours based on recent appointments",
  "Staff allocation recommendations",
  "Anomalies in log entries",
];

const CentreAIInsights = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#081F2E]/15 text-[#081F2E] ring-1 ring-[#081F2E]/25">
          <FiMessageSquare />
        </div>
        <h2 className="text-xl font-semibold text-[#081F2E]">AI Insights</h2>
      </div>

      <div className="rounded-2xl bg-white/70 backdrop-blur-md shadow-sm ring-1 ring-[#081F2E]/10 p-6 space-y-4">
        <div className="text-sm text-[#0c2b40]/80">Try one of the suggested queries:</div>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s, idx) => (
            <motion.button
              key={s}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="px-3 py-1.5 text-sm rounded-md bg-[#081F2E]/10 text-[#081F2E] hover:bg-[#081F2E]/15 ring-1 ring-[#081F2E]/20"
            >
              {s}
            </motion.button>
          ))}
        </div>

        <div className="mt-4 rounded-xl bg-white ring-1 ring-[#081F2E]/10 p-4">
          <div className="text-sm text-[#0c2b40]/80 mb-2">Insight Panel</div>
          <div className="text-[#081F2E] text-sm">Select a query to generate insights. Integration with real AI can be added later.</div>
          <div className="mt-3 inline-flex items-center gap-2 text-xs text-[#0c2b40]/70">
            <FiRefreshCcw />
            <span>Live updates refresh every 15 mins</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default CentreAIInsights;