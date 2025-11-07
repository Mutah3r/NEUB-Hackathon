import { motion } from "framer-motion";
import { FiUsers, FiPlus } from "react-icons/fi";

const STAFF = [
  { id: "st1", name: "Dr. Kamal Hassan", role: "Physician", shift: "Morning" },
  { id: "st2", name: "Nadia Rahman", role: "Nurse", shift: "Evening" },
  { id: "st3", name: "Omar Siddiqui", role: "Admin", shift: "Full-day" },
];

const CentreStaff = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#081F2E]/15 text-[#081F2E] ring-1 ring-[#081F2E]/25">
          <FiUsers />
        </div>
        <h2 className="text-xl font-semibold text-[#081F2E]">Staff Management</h2>
      </div>

      <div className="rounded-2xl bg-white/70 backdrop-blur-md shadow-sm ring-1 ring-[#081F2E]/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-[#0c2b40]/80">Manage staff roster and roles</div>
          <button className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md bg-[#081F2E] text-white hover:bg-[#0c2b40]">
            <FiPlus />
            Add Staff
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STAFF.map((s, idx) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="rounded-xl bg-white ring-1 ring-[#081F2E]/10 p-4"
            >
              <div className="text-[#081F2E] font-semibold">{s.name}</div>
              <div className="text-sm text-[#0c2b40]/80">{s.role}</div>
              <div className="mt-2 inline-flex items-center gap-2 text-xs rounded-md px-2 py-1 bg-[#EAB308]/15 text-[#EAB308] ring-1 ring-[#EAB308]/30">
                Shift: {s.shift}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default CentreStaff;