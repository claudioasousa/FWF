
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import StudentsPage from './pages/StudentsPage';
import CoursesPage from './pages/CoursesPage';
import TeachersPage from './pages/TeachersPage';
import PartnersPage from './pages/PartnersPage';
import EnrollmentPage from './pages/EnrollmentPage';
import ReportsPage from './pages/ReportsPage';
import { DataProvider } from './hooks/useData';

function App() {
  return (
    <DataProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/alunos" element={<StudentsPage />} />
          <Route path="/cursos" element={<CoursesPage />} />
          <Route path="/professores" element={<TeachersPage />} />
          <Route path="/parceiros" element={<PartnersPage />} />
          <Route path="/enturmacao" element={<EnrollmentPage />} />
          <Route path="/relatorios" element={<ReportsPage />} />
        </Routes>
      </Layout>
    </DataProvider>
  );
}

export default App;
