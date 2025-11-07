import { motion } from "framer-motion";
import { FiBarChart2 } from "react-icons/fi";

const DEMAND = [
  { month: "Dec", forecast: 180, capacity: 220 },
  { month: "Jan", forecast: 240, capacity: 220 },
  { month: "Feb", forecast: 210, capacity: 220 },
  { month: "Mar", forecast: 260, capacity: 240 },
];

const CentreForecast = () => {
  const max = Math.max(...DEMAND.map(d => Math.max(d.forecast, d.capacity)));
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#081F2E]/15 text-[#081F2E] ring-1 ring-[#081F2E]/25">
          <FiBarChart2 />
        </div>
        <h2 className="text-xl font-semibold text-[#081F2E]">Demand Forecasting</h2>
      </div>

      <div className="rounded-2xl bg-white/70 backdrop-blur-md shadow-sm ring-1 ring-[#081F2E]/10 p-6">
        <div className="flex justify-between text-xs text-[#0c2b40]/80 mb-2">
          <span>Forecast vs Capacity</span>
          <span>Next 4 months</span>
        </div>
        <div className="grid grid-cols-4 gap-6 items-end h-40">
          {DEMAND.map((d, idx) => (
            <div key={d.month} className="flex flex-col items-center">
              <div className="relative w-8 h-32 bg-[#081F2E]/10 rounded-md overflow-hidden">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.round((d.capacity / max) * 100)}%` }}
                  transition={{ delay: idx * 0.08 }}
                  className="absolute bottom-0 left-0 right-0 bg-[#081F2E]/25"
                />
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.round((d.forecast / max) * 100)}%` }}
                  transition={{ delay: idx * 0.08 + 0.05 }}
                  className="absolute bottom-0 left-1 right-1 bg-[#EAB308] rounded-sm"
                />
              </div>
              <div className="mt-2 text-xs text-[#081F2E] font-medium">{d.month}</div>
              <div className="text-[11px] text-[#0c2b40]/80">{d.forecast} req</div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-xs text-[#0c2b40]/80">
          <span className="inline-block mr-4">
            <span className="inline-block w-3 h-3 bg-[#EAB308] rounded-sm mr-1" /> Forecast
          </span>
          <span>
            <span className="inline-block w-3 h-3 bg-[#081F2E]/25 rounded-sm mr-1" /> Capacity
          </span>
        </div>
      </div>
    </motion.section>
  );
};

export default CentreForecast;