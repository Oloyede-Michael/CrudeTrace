import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/landing/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { Operations } from './pages/Operations';
import { Admin } from './pages/Admin';

function App() {
  return (
    <Routes>
      {/* Landing page — standalone, no sidebar */}
      <Route path="/" element={<LandingPage />} />

      {/* App — wrapped in sidebar Layout */}
      <Route path="/dashboard" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="operations" element={<Operations />} />
        <Route path="admin" element={<Admin />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;