import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import { FiChevronDown, FiNavigation, FiShield, FiZap, FiGlobe } from "react-icons/fi";
import { Link } from "react-router";
import logo from "../assets/logo.png";
import Chatbot from "../components/Chatbot";
import GoogleMap from "../components/GoogleMap";

const CITIES = [
  { id: "dhaka", title: "Dhaka", lat: 23.8103, lng: 90.4125 },
  { id: "chattogram", title: "Chattogram", lat: 22.3569, lng: 91.7832 },
  { id: "khulna", title: "Khulna", lat: 22.8456, lng: 89.5403 },
  { id: "rajshahi", title: "Rajshahi", lat: 24.374, lng: 88.6042 },
  { id: "sylhet", title: "Sylhet", lat: 24.8949, lng: 91.8687 },
  { id: "barishal", title: "Barishal", lat: 22.701, lng: 90.3535 },
  { id: "rangpur", title: "Rangpur", lat: 25.7439, lng: 89.2752 },
  { id: "mymensingh", title: "Mymensingh", lat: 24.7471, lng: 90.4203 },
  { id: "gazipur", title: "Gazipur", lat: 23.999, lng: 90.42 },
  { id: "narayanganj", title: "Narayanganj", lat: 23.6238, lng: 90.5009 },
  { id: "cumilla", title: "Cumilla", lat: 23.4607, lng: 91.1809 },
  { id: "jashore", title: "Jashore", lat: 23.166, lng: 89.208 },
  { id: "bogura", title: "Bogura", lat: 24.848, lng: 89.371 },
  { id: "noakhali", title: "Noakhali", lat: 22.8796, lng: 91.099 },
  { id: "coxs", title: "Cox’s Bazar", lat: 21.4272, lng: 92.0058 },
  { id: "dinajpur", title: "Dinajpur", lat: 25.627, lng: 88.634 },
  { id: "pabna", title: "Pabna", lat: 24.005, lng: 89.237 },
  { id: "tangail", title: "Tangail", lat: 24.2513, lng: 89.9161 },
  { id: "kushtia", title: "Kushtia", lat: 23.901, lng: 89.123 },
  { id: "feni", title: "Feni", lat: 23.019, lng: 91.403 },
  { id: "faridpur", title: "Faridpur", lat: 23.606, lng: 89.842 },
  { id: "brahmanbaria", title: "Brahmanbaria", lat: 23.996, lng: 91.183 },
  { id: "sirajganj", title: "Sirajganj", lat: 24.452, lng: 89.708 },
];

const FAQ = [
  {
    q: "How do I schedule a vaccination appointment?",
    a: "Go to Dashboard → Citizen → Schedule. Choose a vaccine, select a centre, and request an appointment. You’ll receive confirmation once approved.",
  },
  {
    q: "Is the AI guidance medical advice?",
    a: "It’s general guidance to help you make informed decisions. For personalized recommendations, consult your healthcare professional.",
  },
  {
    q: "Which centres are available near me?",
    a: "Use the coverage map to explore centres, or the Schedule page’s search. Availability depends on selected vaccine and dates.",
  },
  {
    q: "What should I do after vaccination?",
    a: "Avoid heavy exercise for 24 hours, monitor for side effects, and keep the injection site clean and dry. Seek care if symptoms worsen.",
  },
];

const Home = () => {
  const [activeCity, setActiveCity] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const cities = useMemo(() => CITIES, []);

  // Navbar auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dashboardPath, setDashboardPath] = useState("/dashboard/citizen");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("auth_token");
    const role = localStorage.getItem("role");
    setIsLoggedIn(!!token);
    let path = "/dashboard/citizen";
    if (role === "authority") path = "/dashboard/authority";
    else if (role === "vacc_centre" || role === "vcc_centre" || role === "centre") path = "/dashboard/centre";
    setDashboardPath(path);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="min-h-screen bg-gradient-to-b from-white to-[#EAB308]/10"
    >
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md ring-1 ring-[#081F2E]/10">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} className="h-10 w-10" />
            <span className="text-[#081F2E] font-semibold">TikaSheba</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            {isLoggedIn && (
              <Link
                to={dashboardPath}
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-white shadow ring-1 ring-white/10 bg-gradient-to-r from-[#F04E36] to-[#EAB308] hover:opacity-90"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="mx-auto max-w-6xl px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-md shadow-sm ring-1 ring-[#081F2E]/10 p-8"
        >
          {/* Ambient accents */}
          <div className="pointer-events-none absolute -top-10 -left-10 h-48 w-48 rounded-full bg-[#EAB308]/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-[#F04E36]/15 blur-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#081F2E] mb-4">
                Smart, Accessible Vaccination for Everyone
              </h1>
              <p className="text-[#0c2b40]/80 mb-6">
                Schedule appointments, track your vaccine history, and get AI
                guidance on common questions — all in one place.
              </p>
              {/* Feature chips */}
              <div className="flex flex-wrap gap-2 mb-6">
                <motion.span
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.02 }}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#081F2E]/5 px-3 py-2 text-xs font-medium text-[#081F2E] ring-1 ring-[#081F2E]/15"
                >
                  <FiShield className="text-[#081F2E]/80" /> Secure & Private
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.08 }}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#EAB308]/15 px-3 py-2 text-xs font-medium text-[#EAB308] ring-1 ring-[#EAB308]/25"
                >
                  <FiZap /> AI Guidance
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.14 }}
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-medium text-[#081F2E] ring-1 ring-[#081F2E]/10"
                >
                  <FiGlobe className="text-[#081F2E]/80" /> Nationwide Coverage
                </motion.span>
              </div>
              <div className="flex gap-3">
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  href="/dashboard/citizen"
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow ring-1 ring-white/10 bg-gradient-to-r from-[#F04E36] to-[#EAB308]"
                >
                  Get Started
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  href="#coverage"
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-[#081F2E] ring-1 ring-[#081F2E]/15 bg-white hover:bg-[#081F2E]/5"
                >
                  <FiNavigation />
                  Coverage Map
                </motion.a>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="relative rounded-2xl bg-[#EAB308]/10 ring-1 ring-[#EAB308]/20 p-6 overflow-hidden"
            >
              {/* Decorative halo */}
              <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 h-40 w-40 rounded-full bg-[#F04E36]/20 blur-2xl" />
              <div className="pointer-events-none absolute bottom-0 right-0 h-32 w-32 rounded-full bg-[#EAB308]/25 blur-2xl" />
              <div className="flex items-center gap-4">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white ring-1 ring-[#081F2E]/10">
                  <img src={logo} alt="brand" className="h-10 w-10" />
                </div>
                <div>
                  <div className="text-sm text-[#0c2b40]/80">
                    Empowering citizens and centres with data-driven insights and modern tools.
                  </div>
                  <div className="mt-2 text-[#081F2E] font-semibold">Trusted. Efficient. Human-centric.</div>
                </div>
              </div>
              {/* Mini stat strip */}
              <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
                <div className="rounded-xl bg-white ring-1 ring-[#081F2E]/10 p-3 text-center">
                  <div className="text-[#081F2E] font-semibold">AI</div>
                  <div className="text-[#0c2b40]/70">Guidance</div>
                </div>
                <div className="rounded-xl bg-white ring-1 ring-[#081F2E]/10 p-3 text-center">
                  <div className="text-[#081F2E] font-semibold">Map</div>
                  <div className="text-[#0c2b40]/70">Coverage</div>
                </div>
                <div className="rounded-xl bg-white ring-1 ring-[#081F2E]/10 p-3 text-center">
                  <div className="text-[#081F2E] font-semibold">Secure</div>
                  <div className="text-[#0c2b40]/70">Access</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </header>

      {/* Coverage Map */}
      <section id="coverage" className="mx-auto max-w-6xl px-4 pb-16">
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="text-xl font-semibold text-[#081F2E] mb-4"
        >
          Nationwide Coverage
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="rounded-2xl bg-white/70 backdrop-blur-md shadow-sm ring-1 ring-[#081F2E]/10 p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <GoogleMap
                markers={cities.map((c) => ({
                  id: c.id,
                  lat: c.lat,
                  lng: c.lng,
                  title: c.title,
                }))}
                activeId={activeCity?.id}
                showAll={true}
                onMarkerClick={(m) => setActiveCity(m)}
                height={420}
              />
            </div>
            <div>
              <div className="text-[#0c2b40]/80 mb-2">Highlighted City</div>
              <div className="rounded-xl bg-white ring-1 ring-[#081F2E]/10 p-4">
                {activeCity ? (
                  <div>
                    <div className="text-[#081F2E] font-semibold">
                      {activeCity.title}
                    </div>
                    <div className="text-xs text-[#0c2b40]/70">
                      Lat: {activeCity.lat.toFixed(4)} | Lng:{" "}
                      {activeCity.lng.toFixed(4)}
                    </div>
                    <div className="mt-2 text-sm text-[#0c2b40]/80">
                      Centres are operating in this region.
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-[#0c2b40]/70">
                    Click a marker to highlight a city.
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="text-xl font-semibold text-[#081F2E] mb-4"
        >
          Frequently Asked Questions
        </motion.h2>
        <div className="rounded-2xl bg-white/70 backdrop-blur-md shadow-sm ring-1 ring-[#081F2E]/10 p-6">
          {FAQ.map((item, idx) => {
            const isOpen = expanded === idx;
            return (
              <div
                key={idx}
                className="border-b last:border-none border-[#081F2E]/10"
              >
                <button
                  className="w-full flex items-center justify-between py-4 text-left"
                  onClick={() => setExpanded(isOpen ? null : idx)}
                >
                  <span className="text-[#081F2E] font-medium">{item.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#081F2E]/10 text-[#081F2E]"
                  >
                    <FiChevronDown />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 24,
                      }}
                      className="pb-4"
                    >
                      <div className="text-sm text-[#0c2b40]/80">{item.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md ring-1 ring-[#081F2E]/10">
        <div className="mx-auto max-w-6xl px-4 py-8 flex items-center justify-between">
          <div className="text-sm text-[#0c2b40]/70">
            © {new Date().getFullYear()} ImmunizeBD
          </div>
          <div className="text-sm text-[#0c2b40]/70">
            Built with care for communities
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot />
    </motion.div>
  );
};

export default Home;
