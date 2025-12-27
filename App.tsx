
import React from 'react';
// Fix: Import from react-router to resolve missing member error in some environments
import { Routes, Route, Navigate } from 'react-router';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import StudentsPage from './pages/StudentsPage';
import CoursesPage from './pages/CoursesPage';
import TeachersPage from './pages/TeachersPage';
import PartnersPage from './pages/PartnersPage';
import EnrollmentPage from './pages/EnrollmentPage';
import ReportsPage from './pages/ReportsPage';
import UsersPage from './pages/UsersPage';
import LoginPage from './pages/LoginPage';
import { DataProvider } from './hooks/useData';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ThemeProvider } from './hooks/useTheme';

const AppContent = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/alunos" element={<StudentsPage />} />
        <Route path="/cursos" element={<CoursesPage />} />
        <Route path="/professores" element={<TeachersPage />} />
        <Route path="/parceiros" element={<PartnersPage />} />
        <Route path="/enturmacao" element={<EnrollmentPage />} />
        <Route path="/relatorios" element={<ReportsPage />} />
        <Route path="/usuarios" element={<UsersPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
