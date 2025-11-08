import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FiCalendar,
  FiCreditCard,
  FiEye,
  FiEyeOff,
  FiMapPin,
  FiUser,
} from "react-icons/fi";
import CancelModal from "../../components/CancelModal";
import MapModal from "../../components/MapModal";
import PdfModal from "../../components/PdfModal";
import { getAppointmentsByCitizen } from "../../services/appointmentService";
import { getVaccineCentres } from "../../services/centreService";
import { getCurrentUser } from "../../services/userService";

const CitizenDashboard = () => {
  const [profile, setProfile] = useState({
    name: "-",
    nidOrBirth: "",
    tikaRegNo: "-",
    dob: "-",
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const user = await getCurrentUser();
        if (!mounted || !user) return;
        const idNumber = user?.NID_or_Birth
          ? user?.NID_no
          : user?.Birth_Certificate_no;
        const dob = user?.DOB
          ? new Date(user.DOB).toISOString().slice(0, 10)
          : "-";
        setProfile({
          name: user?.name || "-",
          nidOrBirth: idNumber || "-",
          tikaRegNo: user?.reg_no || "-",
          dob,
        });
        const cid =
          user?.citizen_id ||
          user?.id ||
          user?.data?.citizen_id ||
          user?.data?.id ||
          null;
        if (cid) setCitizenId(cid);
      } catch (e) {
        // keep defaults on error
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const [showSensitive, setShowSensitive] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [selectedLoc, setSelectedLoc] = useState({
    lat: 23.8103,
    lng: 90.4125,
    title: "Centre Location",
  });

  const [upcoming, setUpcoming] = useState([]);
  const [citizenId, setCitizenId] = useState(null);
  const [centreMap, setCentreMap] = useState({});

  // Hydrate centres and upcoming appointments
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        // Build centre map for names and coordinates
        const centreRes = await getVaccineCentres();
        const centres = Array.isArray(centreRes)
          ? centreRes
          : Array.isArray(centreRes?.data)
          ? centreRes.data
          : Array.isArray(centreRes?.data?.data)
          ? centreRes.data.data
          : [];
        const map = {};
        centres.forEach((c, idx) => {
          const id = c.id ?? c.vc_id ?? `c-${idx + 1}`;
          map[id] = {
            name: c.name ?? "Unnamed Centre",
            lat: Number(c.lattitude ?? c.latitude ?? 23.8103),
            lng: Number(c.longitude ?? 90.4125),
          };
        });
        if (!mounted) return;
        setCentreMap(map);

        if (!citizenId) return; // wait for citizen id

        // Fetch appointments for citizen
        const res = await getAppointmentsByCitizen(citizenId);
        const list = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.data)
          ? res.data.data
          : [];
        // only show upcoming statuses
        const normalized = list
          .filter((item) =>
            ["requested", "scheduled"].includes(item?.status || "requested")
          )
          .map((item, idx) => {
            const cid =
              item.center_id ||
              item.centre_id ||
              item.centre ||
              item.center ||
              `unknown-${idx}`;
            const centreInfo = map[cid] || {};
            return {
              vaccine: item.vaccine_name || "Unknown",
              centre: centreInfo.name || cid || "-",
              date: item.date || item.time || "-",
              lat:
                typeof centreInfo.lat === "number" ? centreInfo.lat : 23.8103,
              lng:
                typeof centreInfo.lng === "number" ? centreInfo.lng : 90.4125,
            };
          });
        if (!mounted) return;
        setUpcoming(normalized);
      } catch (err) {
        // silent fail for dashboard home; keep empty upcoming
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [citizenId]);

  const history = [
    {
      vaccine: "COVID-19",
      doses: 2,
      lastDate: "2024-09-14",
      lastCentre: "Dhaka Central Vaccination Centre",
    },
    {
      vaccine: "Tetanus",
      doses: 1,
      lastDate: "2023-06-20",
      lastCentre: "Banani Health Complex",
    },
    {
      vaccine: "Hepatitis A",
      doses: 2,
      lastDate: "2022-11-05",
      lastCentre: "Uttara Medical Point",
    },
  ];

  const openMap = (row) => {
    setSelectedLoc({ lat: row.lat, lng: row.lng, title: `${row.centre}` });
    setMapOpen(true);
  };

  const [cancelOpen, setCancelOpen] = useState(false);
  const [toCancel, setToCancel] = useState(null);
  const openCancel = (row, index) => {
    setToCancel({ ...row, index });
    setCancelOpen(true);
  };
  const confirmCancel = () => {
    if (toCancel?.index != null) {
      setUpcoming((prev) => prev.filter((_, i) => i !== toCancel.index));
    }
    setCancelOpen(false);
    setToCancel(null);
  };

  const formatLongDate = (iso) => {
    try {
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
      return `${day}${suffix(day)} ${month}, ${year}`;
    } catch {
      return iso;
    }
  };

  const [pdfOpen, setPdfOpen] = useState(false);
  const pdfUrl = "https://pdfobject.com/pdf/sample.pdf";

  return (
    <div className="relative">
      {/* Floating Action Panel */}
      <motion.aside
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
        className="hidden lg:block fixed right-6 top-24 w-[320px] rounded-2xl bg-white shadow-xl ring-1 ring-[#081F2E]/10 overflow-hidden"
      >
        <div className="relative p-5">
          <div className="absolute -z-10 -top-6 -right-6 w-32 h-32 rounded-full bg-[#F04E36]/10 blur-xl" />
          <div className="absolute -z-10 -bottom-6 -left-6 w-32 h-32 rounded-full bg-[#EAB308]/20 blur-xl" />
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAB308]/20 text-[#EAB308]">
              <FiUser />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#081F2E]">
                {profile.name}
              </h3>
              <p className="text-xs text-[#0c2b40]/70">Citizen</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid gap-1">
              <div className="text-xs font-medium text-[#0c2b40]/70">
                NID / Birth Certificate No
              </div>
              <div className="flex items-center justify-between rounded-xl border border-[#EAB308]/30 bg-white px-3 py-2">
                <div className="font-mono tracking-wide text-sm text-[#081F2E]">
                  {showSensitive ? profile.nidOrBirth : "•••••••••••••"}
                </div>
                <button
                  onClick={() => setShowSensitive((v) => !v)}
                  className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-[#081F2E]/5 text-[#081F2E] hover:bg-[#081F2E]/10"
                  aria-label="Toggle visibility"
                >
                  {showSensitive ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="grid gap-1">
              <div className="text-xs font-medium text-[#0c2b40]/70">
                Tika Registration No
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-[#EAB308]/30 bg-white px-3 py-2">
                <FiCreditCard className="text-[#0c2b40]/60" />
                <div className="font-mono text-sm text-[#081F2E]">
                  {profile.tikaRegNo}
                </div>
              </div>
            </div>

            <div className="grid gap-1">
              <div className="text-xs font-medium text-[#0c2b40]/70">
                Date of Birth
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-[#EAB308]/30 bg-white px-3 py-2">
                <FiCalendar className="text-[#0c2b40]/60" />
                <div className="text-sm text-[#081F2E]">{profile.dob}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="space-y-6 pr-0 lg:pr-[360px]">
        {/* Upcoming Schedule */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 240, damping: 22 }}
          className="rounded-2xl bg-white shadow ring-1 ring-[#F04E36]/10 overflow-hidden hidden"
        >
          <div className="p-5 border-b border-[#081F2E]/10 flex items-center justify-between">
            <h2 className="text-xl font-bold">Upcoming Schedule</h2>
          </div>
          <div className="p-5">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-[#FFF5E6] via-[#fff] to-[#FFEFEA]">
                    <th className="text-left px-4 py-3 text-sm font-semibold text-[#0c2b40]">
                      Vaccine Name
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-[#0c2b40]">
                      Centre Name
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-[#0c2b40]">
                      Date
                    </th>
                    {/* Cancel column removed */}
                  </tr>
                </thead>
                <tbody>
                  {upcoming.map((row, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-t border-[#081F2E]/10 hover:bg-[#081F2E]/3"
                    >
                      <td className="px-4 py-3 text-[#081F2E] font-medium">
                        {row.vaccine}
                      </td>
                      <td className="px-4 py-3 text-[#0c2b40]">
                        <div className="flex items-center gap-2">
                          <span>{row.centre}</span>
                          <button
                            onClick={() => openMap(row)}
                            className="inline-flex items-center gap-1 rounded-lg bg-[#EAB308]/20 text-[#081F2E] px-2 py-1 text-xs hover:bg-[#EAB308]/30"
                          >
                            <FiMapPin /> Map
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#0c2b40]">
                        {formatLongDate(row.date)}
                      </td>
                      {/* Cancel action removed */}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>

        {/* E‑Vaccine Card */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 240, damping: 22 }}
          className="rounded-2xl bg-white shadow ring-1 ring-[#081F2E]/10 overflow-hidden"
        >
          <div className="p-5 border-b border-[#081F2E]/10 flex items-center justify-between">
            <h2 className="text-xl font-bold">E‑Vaccine Card</h2>
            <button
              onClick={() => setPdfOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#EAB308] text-[#081F2E] px-3 py-2 text-sm hover:bg-[#d1a207]"
            >
              View Card
            </button>
          </div>
          <div className="p-5">
            <p className="text-sm text-[#0c2b40]/80">
              Access your digitally signed vaccine card. View and download for
              official use.
            </p>
          </div>
        </motion.section>

        {/* Vaccination History */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 240, damping: 22 }}
          className="rounded-2xl bg-white shadow ring-1 ring-[#081F2E]/10 overflow-hidden"
        >
          <div className="p-5 border-b border-[#081F2E]/10">
            <h2 className="text-xl font-bold">Vaccination History</h2>
          </div>
          <div className="p-5">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-[#FFF5E6] via-[#fff] to-[#FFEFEA]">
                    <th className="text-left px-4 py-3 text-sm font-semibold text-[#0c2b40]">
                      Vaccine Name
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-[#0c2b40]">
                      Dose Count
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-[#0c2b40]">
                      Last Date
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-[#0c2b40]">
                      Last Centre
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((row, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-t border-[#081F2E]/10 hover:bg-[#081F2E]/3"
                    >
                      <td className="px-4 py-3 text-[#081F2E] font-medium">
                        {row.vaccine}
                      </td>
                      <td className="px-4 py-3 text-[#0c2b40]">{row.doses}</td>
                      <td className="px-4 py-3 text-[#0c2b40]">
                        {row.lastDate}
                      </td>
                      <td className="px-4 py-3 text-[#0c2b40]">
                        {row.lastCentre}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Map Modal */}
      <MapModal
        isOpen={mapOpen}
        onClose={() => setMapOpen(false)}
        lat={selectedLoc.lat}
        lng={selectedLoc.lng}
        title={selectedLoc.title}
      />

      {/* Cancel Modal */}
      <CancelModal
        isOpen={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={confirmCancel}
        centre={toCancel?.centre}
        date={toCancel ? formatLongDate(toCancel.date) : ""}
      />

      {/* PDF Modal */}
      <PdfModal
        isOpen={pdfOpen}
        onClose={() => setPdfOpen(false)}
        pdfUrl={pdfUrl}
        title="E‑Vaccine Card"
      />
    </div>
  );
};

export default CitizenDashboard;
