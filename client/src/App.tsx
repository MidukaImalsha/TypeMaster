import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
import "./App.css";
import SinglePlayerGame from "./components/singleplayer/SinglePlayerGame";
import MultiplayerGame from "./components/multiplayer/MultiplayerGame";
import Stats from "./components/Stats";
import Leaderboard from "./components/Leaderboard";
import GlowingLogo from "./utils/GlowingLogo";
import typeMasterLogo from "./assets/logos/TypeMasterLogo.webp";
import extruLogo from "./assets/logos/extru_logo.png";
import { Keyboard, Users, Trophy, Home as HomeIcon } from "lucide-react";

function NavLink({ to, children, icon }: { to: string; children: React.ReactNode; icon?: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${isActive
          ? "bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.2)]"
          : "text-blue-100/70 hover:text-blue-200 hover:bg-blue-500/10 border border-transparent"
        }`}
    >
      {icon}
      {children}
    </Link>
  );
}

function App() {
  return (
    <Router>
      <div className="app min-h-screen">
        {/* Navbar */}
        <nav className="sticky top-0 z-30 border-b border-blue-900/50 bg-[rgba(5,15,40,0.8)] backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 py-3">
            <ul className="flex items-center gap-1">
              <li>
                <NavLink to="/" icon={<HomeIcon className="h-4 w-4" />}>Home</NavLink>
              </li>
              <li>
                <NavLink to="/singleplayer" icon={<Keyboard className="h-4 w-4" />}>Single Player</NavLink>
              </li>
              <li>
                <NavLink to="/multiplayer" icon={<Users className="h-4 w-4" />}>Multiplayer</NavLink>
              </li>
              <li>
                <NavLink to="/leaderboard" icon={<Trophy className="h-4 w-4" />}>Leaderboard</NavLink>
              </li>
              <li className="!ml-auto">
                <img src={extruLogo} alt="Extru Logo" className="h-11 w-auto max-w-full object-contain" />
              </li>
            </ul>
          </div>
        </nav>

        {/* Main content */}
        <main className="mx-auto max-w-7xl px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/singleplayer" element={<SinglePlayerGame />} />
            <Route path="/multiplayer" element={<MultiplayerGame />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-8 fadein">
      {/* Logo */}
      <div className="flex h-52 w-full items-center justify-center mb-6">
        <GlowingLogo src={typeMasterLogo} alt="TypeMaster Logo" />
      </div>

      {/* Heading */}
      <h1 className="mb-3 text-5xl font-black tracking-tight leading-[1.2] bg-gradient-to-r from-blue-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(59,130,246,0.45)]">
        Extru TypeMaster 2026
      </h1>
      <p className="mb-10 text-blue-200/60 text-lg font-light tracking-wide">
        Test your speed. Challenge your rivals. Dominate the leaderboard.
      </p>

      {/* Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          to="/singleplayer"
          className="btn-primary text-base px-8 py-3"
        >
          <Keyboard className="h-5 w-5" />
          Single Player
        </Link>
        <Link
          to="/multiplayer"
          className="inline-flex items-center gap-2 rounded-[0.625rem] border border-blue-400/30 bg-blue-500/10 px-8 py-3 text-base font-bold text-blue-300 transition-all duration-200 hover:bg-blue-500/20 hover:border-blue-400/60 hover:text-blue-200 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:-translate-y-px"
        >
          <Users className="h-5 w-5" />
          Multiplayer
        </Link>
      </div>

      {/* Stats teaser row */}
      <div className="mt-16 grid grid-cols-3 gap-6 w-full max-w-lg">
        {[
          { label: "Game Modes", value: "2" },
          { label: "Real-time Races", value: "✓" },
          { label: "Live Leaderboard", value: "✓" },
        ].map((item) => (
          <div key={item.label} className="glass-card p-5 rounded-xl flex flex-col items-center">
            <span className="text-3xl font-black text-blue-400 mb-1">{item.value}</span>
            <span className="text-xs text-blue-200/50 font-medium uppercase tracking-widest">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
