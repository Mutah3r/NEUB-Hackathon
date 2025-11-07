import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { FiUsers, FiMapPin, FiKey, FiPlus, FiX, FiList, FiCheck } from "react-icons/fi";
import MapModal from "../../../components/MapModal";
import GoogleMap from "../../../components/GoogleMap";

// Mock vaccines catalogue used for allowed/not-added lists
const ALL_VACCINES = [
  { id: "v001", name: "COVID-19 Booster" },
  { id: "v002", name: "Hepatitis B" },
  { id: "v003", name: "Influenza Seasonal" },
  { id: "v004", name: "Tetanus" },
  { id: "v005", name: "BCG" },
];

const INITIAL_CENTRES = [
  {
    id: "c001",
    name: "Dhaka Medical Centre",
    address: "Panthapath, Dhaka",
    lat: 23.8103,
    lng: 90.4125,
    password: "",
    allowedVaccines: ["v001", "v002", "v003"],
  },
  {
    id: "c002",
    name: "Chittagong Urban Clinic",
    address: "Agrabad, Chattogram",
    lat: 22.3569,
    lng: 91.7832,
    password: "",
    allowedVaccines: ["v002"],
  },
  {
    id: "c003",
    name: "Rajshahi Health Point",
    address: "Kazla, Rajshahi",
    lat: 24.3740,
    lng: 88.6042,
    password: "",
    allowedVaccines: ["v003", "v004"],
  },
  {
    id: "c004",
    name: "Sylhet Vaccination Hub",
    address: "Amberkhana, Sylhet",
    lat: 24.8949,
    lng: 91.8687,
    password: "",
    allowedVaccines: ["v001", "v005"],
  },
];

const AuthorityCentres = () => {
  const [centres, setCentres] = useState(INITIAL_CENTRES);
  const [mapView, setMapView] = useState({ open: false, lat: null, lng: null, title: "Centre Location" });
  const [pwdModal, setPwdModal] = useState({ open: false, centre: null, pwd: "" });
  const [addOpen, setAddOpen] = useState(false);
  const [newCentre, setNewCentre] = useState({ id: "", name: "", address: "", password: "", lat: 23.8103, lng: 90.4125 });
  const [vaccinesModal, setVaccinesModal] = useState({ open: false, centreId: null, selectedId: "" });

  const nextId = () => {
    const nums = centres
      .map((c) => parseInt(c.id.replace(/\D/g, ""), 10))
      .filter((n) => Number.isFinite(n));
    const max = nums.length ? Math.max(...nums) : 0;
    const next = (max || 0) + 1;
    return `c${String(next).padStart(3, "0")}`;
  };

  const openMap = (c) => setMapView({ open: true, lat: c.lat, lng: c.lng, title: `${c.name} (${c.id})` });
  const closeMap = () => setMapView({ open: false, lat: null, lng: null, title: "Centre Location" });

  const openPwd = (c) => setPwdModal({ open: true, centre: c, pwd: "" });
  const closePwd = () => setPwdModal({ open: false, centre: null, pwd: "" });
  const confirmPwd = () => {
    if (!pwdModal.centre) return;
    setCentres((prev) => prev.map((x) => (x.id === pwdModal.centre.id ? { ...x, password: pwdModal.pwd } : x)));
    closePwd();
  };

  const openAdd = () => {
    setNewCentre({ id: "", name: "", address: "", password: "", lat: 23.8103, lng: 90.4125 });
    setAddOpen(true);
  };
  const closeAdd = () => setAddOpen(false);
  const confirmAdd = () => {
    const id = newCentre.id.trim() || nextId();
    const name = newCentre.name.trim();
    const address = newCentre.address.trim();
    if (!name || !address) return;
    setCentres((prev) => [...prev, { ...newCentre, id, allowedVaccines: [] }]);
    setAddOpen(false);
  };

  const openVaccines = (centreId) => setVaccinesModal({ open: true, centreId, selectedId: "" });
  const closeVaccines = () => setVaccinesModal({ open: false, centreId: null, selectedId: "" });
  const centreById = (id) => centres.find((c) => c.id === id);
  const notAddedOptions = useMemo(() => {
    if (!vaccinesModal.centreId) return [];
    const centre = centreById(vaccinesModal.centreId);
    const allowedSet = new Set(centre?.allowedVaccines || []);
    return ALL_VACCINES.filter((v) => !allowedSet.has(v.id));
  }, [vaccinesModal.centreId, centres]);
  const addVaccineToCentre = () => {
    const vid = vaccinesModal.selectedId;
    if (!vid) return;
    setCentres((prev) =>
      prev.map((c) =>
        c.id === vaccinesModal.centreId && !c.allowedVaccines.includes(vid)
          ? { ...c, allowedVaccines: [...c.allowedVaccines, vid] }
          : c
      )
    );
  };
  const removeVaccineFromCentre = (vid) => {
    if (!vaccinesModal.centreId) return;
    setCentres((prev) =>
      prev.map((c) =>
        c.id === vaccinesModal.centreId
          ? { ...c, allowedVaccines: (c.allowedVaccines || []).filter((x) => x !== vid) }
          : c
      )
    );
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#081F2E]/15 text-[#081F2E] ring-1 ring-[#081F2E]/25">
            <FiUsers />
          </div>
          <h2 className="text-xl font-semibold text-[#081F2E]">Vaccine Centres</h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-[#EAB308] text-[#081F2E] px-3 py-2 text-sm hover:bg-[#d1a207]"
        >
          <FiPlus /> Add Vaccine Centre
        </motion.button>
      </div>

      {/* Centres Grid */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="rounded-2xl bg-white/70 backdrop-blur-md shadow-sm ring-1 ring-[#081F2E]/10 p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {centres.map((c, idx) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-2xl ring-1 ring-[#081F2E]/10 bg-gradient-to-br from-[#F8FAFF] via-white to-[#EFF6FF] p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-semibold text-[#081F2E]">{c.name}</div>
                  <div className="text-xs text-[#0c2b40]/80">{c.address}</div>
                </div>
                <div className="text-xs text-[#0c2b40]/70 font-mono">{c.id}</div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openMap(c)}
                  className="inline-flex items-center justify-center gap-2 text-xs rounded-md px-3 py-2 bg-[#FFF7E6] text-[#A05A00] ring-1 ring-[#EAB308]/30 hover:bg-[#FDECC8]"
                >
                  <FiMapPin /> Map
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openPwd(c)}
                  className="inline-flex items-center justify-center gap-2 text-xs rounded-md px-3 py-2 bg-[#081F2E]/5 text-[#081F2E] ring-1 ring-[#081F2E]/15 hover:bg-[#081F2E]/10"
                >
                  <FiKey /> Update Password
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openVaccines(c.id)}
                  className="inline-flex items-center justify-center gap-2 text-xs rounded-md px-3 py-2 bg-[#E9F9EE] text-[#1a8a35] ring-1 ring-[#2FC94E]/30 hover:bg-[#D7F3E2]"
                >
                  <FiList /> Manage Vaccines
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Map View Modal */}
      <MapModal isOpen={mapView.open} onClose={closeMap} lat={mapView.lat ?? 23.8103} lng={mapView.lng ?? 90.4125} title={mapView.title} />

      {/* Update Password Modal */}
      <AnimatePresence>
        {pwdModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#081F2E]/40 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="w-[92%] max-w-md rounded-2xl bg-white p-5 ring-1 ring-[#081F2E]/10 shadow-xl"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#081F2E]/10 text-[#081F2E] ring-1 ring-[#081F2E]/20">
                    <FiKey />
                  </div>
                  <h4 className="text-lg font-semibold text-[#081F2E]">Update Password</h4>
                </div>
                <button
                  onClick={closePwd}
                  className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-[#081F2E]/5 text-[#081F2E] hover:bg-[#081F2E]/10"
                >
                  <FiX />
                </button>
              </div>
              <div className="text-xs text-[#0c2b40]/80 mb-3">
                Centre: <span className="font-semibold text-[#081F2E]">{pwdModal.centre?.name}</span> (<span className="font-mono">{pwdModal.centre?.id}</span>)
              </div>
              <div>
                <label className="text-xs text-[#0c2b40]/70">New Password</label>
                <input
                  type="password"
                  value={pwdModal.pwd}
                  onChange={(e) => setPwdModal((s) => ({ ...s, pwd: e.target.value }))}
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-md px-3 py-2 ring-1 ring-[#081F2E]/15 bg-[#F8FAFF] focus:outline-none focus:ring-[#081F2E]/30 text-sm"
                />
              </div>
              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  onClick={closePwd}
                  className="text-xs px-3 py-2 rounded-md bg-[#081F2E]/5 text-[#081F2E] ring-1 ring-[#081F2E]/15 hover:bg-[#081F2E]/10"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={confirmPwd}
                  className="text-xs px-3 py-2 rounded-md bg-[#2FC94E] text-white hover:bg-[#28b745]"
                >
                  Save
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Centre Modal */}
      <AnimatePresence>
        {addOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#081F2E]/40 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="w-[94%] max-w-3xl rounded-2xl bg-white p-5 ring-1 ring-[#081F2E]/10 shadow-xl"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAB308]/10 text-[#EAB308] ring-1 ring-[#EAB308]/20">
                    <FiPlus />
                  </div>
                  <h4 className="text-lg font-semibold text-[#081F2E]">Add Vaccine Centre</h4>
                </div>
                <button
                  onClick={closeAdd}
                  className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-[#081F2E]/5 text-[#081F2E] hover:bg-[#081F2E]/10"
                >
                  <FiX />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="text-xs text-[#0c2b40]/70">Name</label>
                  <input
                    type="text"
                    value={newCentre.name}
                    onChange={(e) => setNewCentre((s) => ({ ...s, name: e.target.value }))}
                    placeholder="e.g., Banani Health Centre"
                    className="mt-1 w-full rounded-md px-3 py-2 ring-1 ring-[#081F2E]/15 bg-[#F8FAFF] focus:outline-none focus:ring-[#081F2E]/30 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#0c2b40]/70">ID</label>
                  <input
                    type="text"
                    value={newCentre.id}
                    onChange={(e) => setNewCentre((s) => ({ ...s, id: e.target.value }))}
                    placeholder="optional, auto-generated if empty"
                    className="mt-1 w-full rounded-md px-3 py-2 ring-1 ring-[#081F2E]/15 bg-[#F8FAFF] focus:outline-none focus:ring-[#081F2E]/30 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-[#0c2b40]/70">Address</label>
                  <input
                    type="text"
                    value={newCentre.address}
                    onChange={(e) => setNewCentre((s) => ({ ...s, address: e.target.value }))}
                    placeholder="Full address"
                    className="mt-1 w-full rounded-md px-3 py-2 ring-1 ring-[#081F2E]/15 bg-[#F8FAFF] focus:outline-none focus:ring-[#081F2E]/30 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#0c2b40]/70">Password</label>
                  <input
                    type="password"
                    value={newCentre.password}
                    onChange={(e) => setNewCentre((s) => ({ ...s, password: e.target.value }))}
                    placeholder="••••••••"
                    className="mt-1 w-full rounded-md px-3 py-2 ring-1 ring-[#081F2E]/15 bg-[#F8FAFF] focus:outline-none focus:ring-[#081F2E]/30 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#0c2b40]/70">Latitude / Longitude</label>
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      step="any"
                      value={newCentre.lat}
                      onChange={(e) => setNewCentre((s) => ({ ...s, lat: parseFloat(e.target.value || "0") }))}
                      className="w-full rounded-md px-3 py-2 ring-1 ring-[#081F2E]/15 bg-[#F8FAFF] focus:outline-none focus:ring-[#081F2E]/30 text-sm"
                      placeholder="Latitude"
                    />
                    <input
                      type="number"
                      step="any"
                      value={newCentre.lng}
                      onChange={(e) => setNewCentre((s) => ({ ...s, lng: parseFloat(e.target.value || "0") }))}
                      className="w-full rounded-md px-3 py-2 ring-1 ring-[#081F2E]/15 bg-[#F8FAFF] focus:outline-none focus:ring-[#081F2E]/30 text-sm"
                      placeholder="Longitude"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-xs text-[#0c2b40]/70 mb-2">Select location on map; coordinates will fill automatically.</div>
                <GoogleMap
                  markers={newCentre.lat && newCentre.lng ? [{ id: "new", lat: newCentre.lat, lng: newCentre.lng, title: newCentre.name || "Selected" }] : []}
                  activeId={"new"}
                  showAll={false}
                  onMapClick={({ lat, lng }) => setNewCentre((s) => ({ ...s, lat, lng }))}
                  height={320}
                />
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  onClick={closeAdd}
                  className="text-xs px-3 py-2 rounded-md bg-[#081F2E]/5 text-[#081F2E] ring-1 ring-[#081F2E]/15 hover:bg-[#081F2E]/10"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={confirmAdd}
                  className="text-xs px-3 py-2 rounded-md bg-[#EAB308] text-[#081F2E] hover:bg-[#d1a207]"
                >
                  Add Centre
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manage Vaccines Modal */}
      <AnimatePresence>
        {vaccinesModal.open && vaccinesModal.centreId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#081F2E]/40 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="w-[94%] max-w-2xl rounded-2xl bg-white p-5 ring-1 ring-[#081F2E]/10 shadow-xl"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#081F2E]/10 text-[#081F2E] ring-1 ring-[#081F2E]/20">
                    <FiList />
                  </div>
                  <h4 className="text-lg font-semibold text-[#081F2E]">Allowed Vaccines</h4>
                </div>
                <button
                  onClick={closeVaccines}
                  className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-[#081F2E]/5 text-[#081F2E] hover:bg-[#081F2E]/10"
                >
                  <FiX />
                </button>
              </div>

              <div className="text-xs text-[#0c2b40]/80 mb-3">
                Centre: <span className="font-semibold text-[#081F2E]">{centreById(vaccinesModal.centreId)?.name}</span> (<span className="font-mono">{vaccinesModal.centreId}</span>)
              </div>

              {/* Current allowed vaccines */}
              <div className="rounded-xl ring-1 ring-[#081F2E]/10 bg-[#F8FAFF] p-3">
                <div className="text-xs text-[#0c2b40]/70 mb-2">Available at this centre</div>
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence initial={false}>
                    {(centreById(vaccinesModal.centreId)?.allowedVaccines || []).map((vid, idx) => {
                      const v = ALL_VACCINES.find((x) => x.id === vid);
                      return (
                        <motion.span
                          key={`${vid}-${idx}`}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          layout
                          className="inline-flex items-center gap-2 text-xs rounded-md px-2.5 py-1.5 bg-[#E9F9EE] text-[#1a8a35] ring-1 ring-[#2FC94E]/30"
                        >
                          <FiCheck /> {v?.name || vid}
                          <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => removeVaccineFromCentre(vid)}
                            className="inline-flex items-center gap-1 rounded-sm px-2 py-1 bg-[#FDECEC] text-[#F04E36] ring-1 ring-[#F04E36]/30 hover:bg-[#F9D9D4]"
                            title="Remove access"
                            aria-label={`Remove ${v?.name || vid}`}
                          >
                            <FiX /> Remove
                          </motion.button>
                        </motion.span>
                      );
                    })}
                  </AnimatePresence>
                  {(centreById(vaccinesModal.centreId)?.allowedVaccines || []).length === 0 && (
                    <div className="text-xs text-[#0c2b40]/60">No vaccines assigned yet.</div>
                  )}
                </div>
              </div>

              {/* Add new vaccine */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-end">
                <div>
                  <label className="text-xs text-[#0c2b40]/70">Add vaccine not in centre</label>
                  <select
                    value={vaccinesModal.selectedId}
                    onChange={(e) => setVaccinesModal((s) => ({ ...s, selectedId: e.target.value }))}
                    className="mt-1 w-full rounded-md px-3 py-2 ring-1 ring-[#081F2E]/15 bg-white focus:outline-none focus:ring-[#081F2E]/30 text-sm"
                  >
                    <option value="">Select a vaccine</option>
                    {notAddedOptions.map((v) => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addVaccineToCentre}
                  className="h-[38px] md:h-[36px] inline-flex items-center justify-center text-xs rounded-md px-3 py-2 bg-[#EAB308] text-[#081F2E] hover:bg-[#d1a207]"
                >
                  <FiPlus /> Add Vaccine
                </motion.button>
              </div>

              <div className="mt-4 flex items-center justify-end">
                <button
                  onClick={closeVaccines}
                  className="text-xs px-3 py-2 rounded-md bg-[#081F2E]/5 text-[#081F2E] ring-1 ring-[#081F2E]/15 hover:bg-[#081F2E]/10"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default AuthorityCentres;