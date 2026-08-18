import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "./context/SocketContext";

// Pages
import Dashboard from "./pages/Dashboard";
import TrainDetails from "./pages/TrainDetails";
import PNRStatus from "./pages/PNRStatus";
import SavedTrips from "./pages/SavedTrips";

// Components
import Navbar from "./components/Navbar";

import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/train/:id" element={<TrainDetails />} />
                <Route path="/pnr/:number" element={<PNRStatus />} />
                <Route path="/saved-trips" element={<SavedTrips />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </Router>
      </SocketProvider>
    </QueryClientProvider>
  );
}

export default App;
