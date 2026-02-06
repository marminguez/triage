import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CaseList from './pages/CaseList';
import Dashboard from './pages/Dashboard';
import CaseForm from './pages/CaseForm';
import CaseDetail from './pages/CaseDetail';
import PatientHistory from './pages/PatientHistory';
import Layout from './components/Layout';

import SettingsIntegrations from './pages/SettingsIntegrations';

import Reports from './pages/Reports';

import UserProfile from './pages/UserProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/history/:id" element={<PatientHistory />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Navigate to="/settings/integrations" replace />} />
        <Route path="/settings/integrations" element={<SettingsIntegrations />} />
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/cases" element={<CaseList />} />
              <Route path="/cases/new" element={<CaseForm />} />
              <Route path="/cases/:id/edit" element={<CaseForm />} />
              <Route path="/cases/:id" element={<CaseDetail />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
