import Clock from "./components/layout/Clock.tsx";
import Dashboard from "./components/Dashboard";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DarkModeProvider } from "./context/DarkModeContext";

function App() {
  return (
    <DarkModeProvider>
      <Router>
        {/* Hintergrund */}
        <div
          className="
            min-h-screen 
            bg-linear-to-br from-gray-100 via-gray-50 to-gray-200
            dark:from-[#0d1117] dark:via-[#111827] dark:to-[#1f2937]
            text-gray-900 dark:text-gray-100
            transition-colors duration-500
          "
        >
          {/* Hauptcontainer */}
          <div className="flex min-h-screen max-w-7xl mx-auto">
            {/* Main Content */}
            <main
              className="
                flex-1 p-6 md:p-8 
                space-y-8 
                bg-white/60 dark:bg-gray-900/40 
                backdrop-blur-md 
                border-l border-gray-200/40 dark:border-gray-700/40
                shadow-sm
                transition-all duration-500
              "
            >
              {/* Header mit Titel & Uhr */}
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">
                  KI Kosten Dashboard
                </h1>
                <Clock />
              </div>

              {/* Seiteninhalte */}
              <div className="pb-12">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
      </Router>
    </DarkModeProvider>
  );
}

export default App;
