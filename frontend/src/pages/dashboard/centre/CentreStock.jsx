import { motion, AnimatePresence } from "framer-motion";
import { FiDatabase, FiPackage } from "react-icons/fi";

const STOCK = [
  { id: "s1", vaccine: "COVID-19 Booster", batch: "CB-2025-11", available: 120, min: 80 },
  { id: "s2", vaccine: "Influenza Seasonal", batch: "FLU-25-A", available: 40, min: 60 },
  { id: "s3", vaccine: "Hepatitis B", batch: "HB-25", available: 200, min: 100 },
];

const CentreStock = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#081F2E]/15 text-[#081F2E] ring-1 ring-[#081F2E]/25">
          <FiDatabase />
        </div>
        <h2 className="text-xl font-semibold text-[#081F2E]">Vaccine Stock</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STOCK.map((item, idx) => {
          const low = item.available < item.min;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className={`rounded-2xl p-5 ring-1 shadow-sm backdrop-blur-md ${low ? "bg-[#F04E36]/10 ring-[#F04E36]/30" : "bg-white/70 ring-[#081F2E]/10"}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-[#081F2E] font-semibold">{item.vaccine}</div>
                <div className={`inline-flex items-center gap-2 text-xs rounded-md px-2 py-1 ${low ? "bg-[#F04E36]/15 text-[#F04E36] ring-1 ring-[#F04E36]/25" : "bg-[#28a745]/15 text-[#1a8a35] ring-1 ring-[#28a745]/25"}`}>
                  <FiPackage />
                  <span>{low ? "Low" : "Healthy"}</span>
                </div>
              </div>
              <div className="text-sm text-[#0c2b40]/80">Batch: <span className="font-medium text-[#081F2E]">{item.batch}</span></div>
              <div className="mt-3">
                <div className="flex justify-between text-sm text-[#0c2b40]/80">
                  <span>Available</span>
                  <span className="font-semibold text-[#081F2E]">{item.available}</span>
                </div>
                <div className="flex justify-between text-sm text-[#0c2b40]/80">
                  <span>Minimum</span>
                  <span className="font-semibold text-[#081F2E]">{item.min}</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-[#081F2E]/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, Math.round((item.available / Math.max(item.min, 1)) * 100))}%` }}
                    transition={{ delay: idx * 0.06 + 0.1 }}
                    className={`h-full ${low ? "bg-[#F04E36]" : "bg-[#081F2E]"}`}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

export default CentreStock;