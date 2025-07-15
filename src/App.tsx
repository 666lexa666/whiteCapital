import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Verification } from './pages/Verification';
import { Exchange } from './pages/Exchange';
import { Wallet } from './pages/Wallet';
import { Security } from './pages/Security';
import { Admin } from './pages/Admin';
import { About } from './pages/About';
import { Support } from './pages/Support';
import { LegalOffer } from './pages/LegalOffer';
import { LegalPrivacy } from './pages/LegalPrivacy';
import { LegalPersonalData } from './pages/LegalPersonalData';
import { LegalCookies } from './pages/LegalCookies';
import { Buffer } from 'buffer';
window.Buffer = Buffer;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={
              <ProtectedRoute requireRegularUser>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="verification" element={
              <ProtectedRoute requireRegularUser>
                <Verification />
              </ProtectedRoute>
            } />
            <Route path="exchange" element={
              <ProtectedRoute requireRegularUser>
                <Exchange />
              </ProtectedRoute>
            } />
            <Route path="wallet" element={
              <ProtectedRoute requireRegularUser>
                <Wallet />
              </ProtectedRoute>
            } />
            <Route path="security" element={
              <ProtectedRoute requireRegularUser>
                <Security />
              </ProtectedRoute>
            } />
            <Route path="about" element={
              <ProtectedRoute requireRegularUser>
                <About />
              </ProtectedRoute>
            } />
            <Route path="support" element={
              <ProtectedRoute requireRegularUser>
                <Support />
              </ProtectedRoute>
            } />
            <Route path="legal/offer" element={
              <ProtectedRoute requireRegularUser>
                <LegalOffer />
              </ProtectedRoute>
            } />
            <Route path="legal/privacy" element={
              <ProtectedRoute requireRegularUser>
                <LegalPrivacy />
              </ProtectedRoute>
            } />
            <Route path="legal/personal-data" element={
              <ProtectedRoute requireRegularUser>
                <LegalPersonalData />
              </ProtectedRoute>
            } />
            <Route path="legal/cookies" element={
              <ProtectedRoute requireRegularUser>
                <LegalCookies />
              </ProtectedRoute>
            } />
            <Route path="admin" element={
              <ProtectedRoute requireAdmin>
                <Admin />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;