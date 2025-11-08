import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiActivity, FiCalendar } from "react-icons/fi";
import { getCurrentUser } from "../../../services/userService";
import { getCitizenLogs } from "../../../services/vaccineService";

const formatDateTime = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  const day = d.getDate();
  const suffix = (n) => {
    if (n % 10 === 1 && n % 100 !== 11) return "st";
    if (n % 10 === 2 && n % 100 !== 12) return "nd";
    if (n % 10 === 3 && n % 100 !== 13) return "rd";
    return "th";
  };
  const month = d.toLocaleString("en-GB", { month: "long" });
  const year = d.getFullYear();
  const time = d.toLocaleString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return `${day}${suffix(day)} ${month}, ${year} • ${time}`;
};

// Data is fetched from API: /vaccine/log/citizen/:citizen_id

const tableVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, ease: "easeOut" },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

const CitizenLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        setError("");
        const user = await getCurrentUser();
        const citizenId =
          user?.citizen_id ||
          user?.id ||
          user?.data?.citizen_id ||
          user?.data?.id;
        if (!citizenId) throw new Error("Citizen identity not found");

        const res = await getCitizenLogs(citizenId);
        // API client returns response.data directly, which is an array of logs
        const list = Array.isArray(res) ? res : [];
        // Normalize logs to ensure consistent keys for rendering
        const normalized = list.map((l) => ({
          id: l._id || l.id || "-",
          citizenId: l.citizen_id || l.citizen || l.citizenId || "-",
          centreId: l.centre_id || l.centre || l.center_id || "-",
          vaccineId: l.vaccine_id || l.vaccineId || "-",
          vaccineName: l.vaccine_name || l.vaccine || "Unknown",
          staffId: l.staff_id || l.staffId || "-",
          staffName: l.staff_name || l.staff || "-",
          date: l.date || l.time || l.time_stamp || null,
        }));
        if (!mounted) return;
        setLogs(normalized);
      } catch (e) {
        if (!mounted) return;
        // Interceptor rejects with { message, status, data }
        setError(e?.data?.message || e?.message || "Failed to load logs");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAB308]/20 text-[#EAB308] ring-1 ring-[#EAB308]/30">
          <FiActivity />
        </div>
        <h2 className="text-xl font-semibold text-[#081F2E]">Logs</h2>
      </div>

      <div className="rounded-2xl bg-white/70 backdrop-blur-md shadow-sm ring-1 ring-[#081F2E]/10 p-6">
        <div className="mb-4 text-sm text-[#0c2b40]/70">
          Review vaccination activity across centres, times, and staff.
        </div>
        <div className="rounded-xl bg-white ring-1 ring-[#081F2E]/10 overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-[#081F2E]/5">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#081F2E]/80">Log ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#081F2E]/80">Citizen ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#081F2E]/80">Centre ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#081F2E]/80">Vaccine ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#081F2E]/80">Vaccine Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#081F2E]/80">Staff ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#081F2E]/80">Staff Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#081F2E]/80">Vaccination Time</th>
              </tr>
            </thead>
            <motion.tbody variants={tableVariants} initial="hidden" animate="show" className="divide-y divide-[#081F2E]/10">
              <AnimatePresence>
                {loading ? (
                  <motion.tr key="loader" variants={rowVariants} className="hover:bg-transparent">
                    <td className="px-4 py-6 text-center text-[#081F2E]" colSpan={8}>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-2">
                        <span className="inline-block h-4 w-4 rounded-full border-2 border-[#EAB308] border-t-transparent animate-spin"></span>
                        <span>Loading logs...</span>
                      </motion.div>
                    </td>
                  </motion.tr>
                ) : error ? (
                  <motion.tr key="error" variants={rowVariants} className="hover:bg-transparent">
                    <td className="px-4 py-4" colSpan={8}>
                      <div className="rounded-md bg-red-50 ring-1 ring-red-200 text-red-700 px-3 py-2">{error}</div>
                    </td>
                  </motion.tr>
                ) : logs.length === 0 ? (
                  <motion.tr key="empty" variants={rowVariants} className="hover:bg-transparent">
                    <td className="px-4 py-6 text-center text-[#0c2b40]/80" colSpan={8}>No logs found.</td>
                  </motion.tr>
                ) : (
                  logs.map((log) => {
                    const {
                      id,
                      citizenId,
                      centreId,
                      vaccineId,
                      vaccineName,
                      staffId,
                      staffName,
                      date,
                    } = log;
                    const rowKey = id !== '-' ? id : `${citizenId}-${date || 'unknown'}`;
                    return (
                      <motion.tr
                        key={rowKey}
                        variants={rowVariants}
                        className="hover:bg-[#081F2E]/3"
                      >
                        <td className="px-4 py-3 text-[#0c2b40]/80">{id}</td>
                        <td className="px-4 py-3 text-[#0c2b40]/80">{citizenId}</td>
                        <td className="px-4 py-3 text-[#0c2b40]/80">{centreId}</td>
                        <td className="px-4 py-3 text-[#0c2b40]/80">{vaccineId}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#EAB308]/20 text-[#EAB308] ring-1 ring-[#EAB308]/30">
                              <FiActivity />
                            </div>
                            <span className="font-medium text-[#081F2E]">{vaccineName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[#0c2b40]/80">{staffId}</td>
                        <td className="px-4 py-3 text-[#0c2b40]/80">{staffName}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-2 text-[#081F2E]">
                            <span className="inline-flex items-center gap-1 rounded-md px-2 py-1 bg-[#081F2E]/10 text-[#081F2E] ring-1 ring-[#081F2E]/15">
                              <FiCalendar />
                              {formatDateTime(date)}
                            </span>
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </motion.tbody>
          </table>
        </div>
      </div>
    </motion.section>
  );
};

export default CitizenLogs;
