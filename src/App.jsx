import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WardSelectorModal from './components/WardSelectorModal';

import Home from './pages/Home';
import Chat from './pages/Chat';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import PropertyTax from './pages/PropertyTax';
import TradeLicense from './pages/TradeLicense';
import Waste from './pages/Waste';
import Wards from './pages/Wards';
import WardMap from './pages/WardMap';
import Helplines from './pages/Helplines';
import Sources from './pages/Sources';
import Help from './pages/Help';

function AppLayout({ children, selectedWard, onOpenWardModal }) {
  const location = useLocation();
  const isChat = location.pathname === '/chat';
  const isMap = location.pathname === '/map';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar
        selectedWard={selectedWard}
        onOpenWardModal={onOpenWardModal}
      />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      {!isChat && !isMap && <Footer />}
    </div>
  );
}

export default function App() {
  const [selectedWard, setSelectedWard] = useState(null);
  const [wardModalOpen, setWardModalOpen] = useState(false);

  return (
    <BrowserRouter>
      <AppLayout
        selectedWard={selectedWard}
        onOpenWardModal={() => setWardModalOpen(true)}
      >
        <Routes>
          <Route
            path="/"
            element={
              <Home
                selectedWard={selectedWard}
                onOpenWardModal={() => setWardModalOpen(true)}
              />
            }
          />
          <Route
            path="/chat"
            element={
              <Chat
                selectedWard={selectedWard}
                onOpenWardModal={() => setWardModalOpen(true)}
              />
            }
          />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/property-tax" element={<PropertyTax />} />
          <Route path="/trade-license" element={<TradeLicense />} />
          <Route path="/waste" element={<Waste />} />
          <Route
            path="/wards"
            element={
              <Wards
                selectedWard={selectedWard}
                onSelectWard={(ward) => setSelectedWard(ward)}
              />
            }
          />
          <Route
            path="/map"
            element={
              <WardMap
                selectedWard={selectedWard}
                onSelectWard={(ward) => setSelectedWard(ward)}
              />
            }
          />
          <Route path="/helplines" element={<Helplines />} />
          <Route path="/sources" element={<Sources />} />
          <Route path="/help" element={<Help />} />
          {/* Fallback route */}
          <Route
            path="*"
            element={
              <Home
                selectedWard={selectedWard}
                onOpenWardModal={() => setWardModalOpen(true)}
              />
            }
          />
        </Routes>
      </AppLayout>

      <WardSelectorModal
        isOpen={wardModalOpen}
        onClose={() => setWardModalOpen(false)}
        selectedWard={selectedWard}
        onSelectWard={(ward) => setSelectedWard(ward)}
      />
    </BrowserRouter>
  );
}
