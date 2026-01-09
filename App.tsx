
import React from 'react';
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
import { DataProvider, useData } from './hooks/useData';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ThemeProvider } from './hooks/useTheme';
import Spinner from './components/Spinner';

const AppContent = () => {
  const { user, loading: authLoading } = useAuth();
  const { loading: dataLoading } = useData();

  if (authLoading) return <div className="h-screen w-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><Spinner /></div>;

  if (!user) {
    return <LoginPage />;
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
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
