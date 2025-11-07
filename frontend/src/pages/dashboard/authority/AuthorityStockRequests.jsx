import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FiClipboard, FiSend, FiCheckCircle, FiX } from "react-icons/fi";

const INITIAL_REQUESTS = [
  { id: "r1", centre: "Dhaka Medical Centre", vaccine: "COVID-19 Booster", amount: 500, status: "Pending", date: "2025-11-28" },
  { id: "r2", centre: "Chittagong Urban Clinic", vaccine: "Hepatitis B", amount: 300, status: "Pending", date: "2025-11-27" },
  { id: "r3", centre: "Rajshahi Health Point", vaccine: "Influenza Seasonal", amount: 200, status: "Pending", date: "2025-11-26" },
];

const AuthorityStockRequests = () => {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);

  const setStatus = (id, status) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#081F2E]/15 text-[#081F2E] ring-1 ring-[#081F2E]/25">
          <FiClipboard />
        </div>
        <h2 className="text-xl font-semibold text-[#081F2E]">Stock Requests</h2>
      </div>

      <div className="rounded-2xl bg-white/70 backdrop-blur-md shadow-sm ring-1 ring-[#081F2E]/10 p-6">
        <div className="rounded-xl bg-white ring-1 ring-[#081F2E]/10 overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-[#081F2E]/5">
              <tr>
                <th className="text-left text-xs font-semibold text-[#081F2E] px-4 py-3">Centre Name</th>
                <th className="text-left text-xs font-semibold text-[#081F2E] px-4 py-3">Vaccine Name</th>
                <th className="text-left text-xs font-semibold text-[#081F2E] px-4 py-3">Amount</th>
                <th className="text-left text-xs font-semibold text-[#081F2E] px-4 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-[#081F2E] px-4 py-3">Action</th>
              </tr>
            </thead>
            <AnimatePresence>
              <motion.tbody initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="divide-y divide-[#081F2E]/10">
                {requests.map((r, idx) => {
                  const badgeClass =
                    r.status === "Pending"
                      ? "bg-[#FFF7E6] text-[#A05A00] ring-[#EAB308]/30"
                      : r.status === "Approved"
                      ? "bg-[#E9F9EE] text-[#1a8a35] ring-[#2FC94E]/30"
                      : "bg-[#FDECEC] text-[#F04E36] ring-[#F04E36]/30";
                  return (
                    <motion.tr
                      key={r.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="hover:bg-[#081F2E]/3"
                    >
                      <td className="px-4 py-3 text-[#081F2E] font-medium">{r.centre}</td>
                      <td className="px-4 py-3 text-[#0c2b40]">{r.vaccine}</td>
                      <td className="px-4 py-3 text-[#081F2E] font-semibold">{r.amount}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-2 text-xs rounded-md px-2 py-1 ring-1 ${badgeClass}`}>
                          {r.status === "Pending" ? <FiSend /> : r.status === "Approved" ? <FiCheckCircle /> : <FiX />}
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setStatus(r.id, "Approved")}
                            className="inline-flex items-center gap-2 text-xs rounded-md px-3 py-1.5 bg-[#E9F9EE] text-[#1a8a35] ring-1 ring-[#2FC94E]/30 hover:bg-[#D7F3E2]"
                          >
                            <FiSend /> Send
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setStatus(r.id, "Rejected")}
                            className="inline-flex items-center gap-2 text-xs rounded-md px-3 py-1.5 bg-[#FDECEC] text-[#F04E36] ring-1 ring-[#F04E36]/30 hover:bg-[#F9D9D4]"
                          >
                            <FiX /> Reject
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </motion.tbody>
            </AnimatePresence>
          </table>
        </div>
      </div>
    </motion.section>
  );
};

export default AuthorityStockRequests;