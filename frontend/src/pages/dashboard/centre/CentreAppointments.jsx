import { AnimatePresence, motion } from "framer-motion";
import { FiClipboard, FiFilter } from "react-icons/fi";

const APPOINTMENTS = [
  { id: "c1", citizen: "Rahim U.", vaccine: "COVID-19 Booster", time: "2025-12-02 09:30", status: "scheduled" },
  { id: "c2", citizen: "Sara N.", vaccine: "Hepatitis B", time: "2025-12-02 11:00", status: "requested" },
  { id: "c3", citizen: "Imran K.", vaccine: "Influenza Seasonal", time: "2025-12-02 13:15", status: "done" },
  { id: "c4", citizen: "Aisha R.", vaccine: "Tetanus", time: "2025-12-02 14:45", status: "cancelled" },
];

const STATUS_META = {
  requested: { label: "Requested", classes: "bg-[#EAB308]/15 text-[#EAB308] ring-1 ring-[#EAB308]/25" },
  scheduled: { label: "Scheduled", classes: "bg-[#081F2E]/10 text-[#081F2E] ring-1 ring-[#081F2E]/20" },
  done: { label: "Done", classes: "bg-[#28a745]/15 text-[#1a8a35] ring-1 ring-[#28a745]/25" },
  cancelled: { label: "Cancelled", classes: "bg-[#F04E36]/15 text-[#F04E36] ring-1 ring-[#F04E36]/25" },
};

const CentreAppointments = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAB308]/20 text-[#EAB308] ring-1 ring-[#EAB308]/30">
          <FiClipboard />
        </div>
        <h2 className="text-xl font-semibold text-[#081F2E]">View Appointments</h2>
      </div>

      <div className="rounded-2xl bg-white/70 backdrop-blur-md shadow-sm ring-1 ring-[#081F2E]/10 p-6">
        <div className="flex items-center gap-2 text-sm text-[#0c2b40]/80 mb-4">
          <FiFilter className="text-[#081F2E]/70" />
          <span>Today</span>
        </div>
        <div className="rounded-xl bg-white ring-1 ring-[#081F2E]/10 overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-[#081F2E]/5">
              <tr>
                <th className="text-left text-xs font-semibold text-[#081F2E] px-4 py-3">Citizen</th>
                <th className="text-left text-xs font-semibold text-[#081F2E] px-4 py-3">Vaccine</th>
                <th className="text-left text-xs font-semibold text-[#081F2E] px-4 py-3">Time</th>
                <th className="text-left text-xs font-semibold text-[#081F2E] px-4 py-3">Status</th>
              </tr>
            </thead>
            <AnimatePresence>
              <motion.tbody initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="divide-y divide-[#081F2E]/10">
                {APPOINTMENTS.map((a, idx) => (
                  <motion.tr key={a.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="hover:bg-[#081F2E]/3">
                    <td className="px-4 py-3 text-[#081F2E] font-medium">{a.citizen}</td>
                    <td className="px-4 py-3 text-[#0c2b40]">{a.vaccine}</td>
                    <td className="px-4 py-3 text-[#0c2b40]">{a.time}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs ${STATUS_META[a.status].classes}`}>{STATUS_META[a.status].label}</span>
                    </td>
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

export default CentreAppointments;