import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { authService } from './services/api';

import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ProductionOrders } from './pages/ProductionOrders';
import { OrderDetails } from './pages/OrderDetails';
import { AIPrediction } from './pages/AIPrediction';
import { RootCauseAnalysis } from './pages/RootCauseAnalysis';
import { RiskAnalysis } from './pages/RiskAnalysis';
import { Recommendations } from './pages/Recommendations';
import { ActionComparison } from './pages/ActionComparison';
import { Machines } from './pages/Machines';
import { Materials } from './pages/Materials';
import { Workforce } from './pages/Workforce';
import { DatasetUpload } from './pages/DatasetUpload';
import { Analytics } from './pages/Analytics';
import { ModelPerformance } from './pages/ModelPerformance';
import { UserManagement } from './pages/UserManagement';
import { Settings } from './pages/Settings';

const ProtectedLayout = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[#0b1329]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<ProductionOrders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/predict" element={<AIPrediction />} />
            <Route path="/root-cause" element={<RootCauseAnalysis />} />
            <Route path="/risk-analysis" element={<RiskAnalysis />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/action-comparison" element={<ActionComparison />} />
            <Route path="/machines" element={<Machines />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/workforce" element={<Workforce />} />
            <Route path="/upload" element={<DatasetUpload />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/models" element={<ModelPerformance />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<ProtectedLayout />} />
      </Routes>
    </Router>
  );
}
