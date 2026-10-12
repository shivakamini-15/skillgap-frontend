import { Navigate, Route, Routes } from 'react-router-dom';
import { homePath, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/student/Dashboard';
import Profile from './pages/student/Profile';
import MySkills from './pages/student/MySkills';
import CareerExplorer from './pages/student/CareerExplorer';
import GapReport from './pages/student/GapReport';
import Roadmap from './pages/student/Roadmap';
import Progress from './pages/student/Progress';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import ManageRoles from './pages/admin/ManageRoles';
import ManageSkills from './pages/admin/ManageSkills';
import ManageResources from './pages/admin/ManageResources';

export default function App() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute roles={['STUDENT']} />}>
        <Route path="/student" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="skills" element={<MySkills />} />
          <Route path="careers" element={<CareerExplorer />} />
          <Route path="gap" element={<GapReport />} />
          <Route path="roadmap" element={<Roadmap />} />
          <Route path="progress" element={<Progress />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={['ADMIN', 'MENTOR']} />}>
        <Route path="/admin" element={<Layout />}>
          <Route index element={<AdminAnalytics />} />
          <Route path="roles" element={<ManageRoles />} />
          <Route path="skills" element={<ManageSkills />} />
          <Route path="resources" element={<ManageResources />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={user ? homePath(user.role) : '/login'} replace />} />
    </Routes>
  );
}
