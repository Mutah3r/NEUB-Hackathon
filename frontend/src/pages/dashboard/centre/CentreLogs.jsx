import { motion, AnimatePresence } from "framer-motion";
import { FiActivity } from "react-icons/fi";

const LOGS = [
  { id: "l1", vaccine: "COVID-19 Booster", citizen: "Rahim U.", staff: "Nadia Rahman", time: "2025-12-01 10:12" },
  { id: "l2", vaccine: "Hepatitis B", citizen: "Aisha R.", staff: "Dr. Kamal", time: "2025-12-01 11:45" },
  { id: "l3", vaccine: "Influenza Seasonal", citizen: "Imran K.", staff: "Omar S.", time: "2025-12-01 13:05" },
];

const CentreLogs = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#081F2E]/15 text-[#081F2E] ring-1 ring-[#081F2E]/25">
          <FiActivity />
        </div>
        <h2 className="text-xl font-semibold text-[#081F2E]">Centre Logs</h2>
      </div>

      <div className="rounded-2xl bg-white/70 backdrop-blur-md shadow-sm ring-1 ring-[#081F2E]/10 p-6">
        <div className="rounded-xl bg-white ring-1 ring-[#081F2E]/10 overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-[#081F2E]/5">
              <tr>
                <th className="text-left text-xs font-semibold text-[#081F2E] px-4 py-3">Vaccine</th>
                <th className="text-left text-xs font-semibold text-[#081F2E] px-4 py-3">Citizen</th>
                <th className="text-left text-xs font-semibold text-[#081F2E] px-4 py-3">Staff</th>
                <th className="text-left text-xs font-semibold text-[#081F2E] px-4 py-3">Time</th>
              </tr>
            </thead>
            <AnimatePresence>
              <motion.tbody initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="divide-y divide-[#081F2E]/10">
                {LOGS.map((row, idx) => (
                  <motion.tr key={row.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="hover:bg-[#081F2E]/3">
                    <td className="px-4 py-3 text-[#081F2E] font-medium">{row.vaccine}</td>
                    <td className="px-4 py-3 text-[#0c2b40]">{row.citizen}</td>
                    <td className="px-4 py-3 text-[#0c2b40]">{row.staff}</td>
                    <td className="px-4 py-3 text-[#0c2b40]">{row.time}</td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </AnimatePresence>
          </table>
        </div>
      </div>
    </motion.section>
  );
};

export default CentreLogs;