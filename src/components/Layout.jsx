import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const studentLinks = [
  ['/student', 'Dashboard', true],
  ['/student/profile', 'Profile'],
  ['/student/skills', 'My skills'],
  ['/student/careers', 'Careers'],
  ['/student/gap', 'Gap report'],
  ['/student/roadmap', 'Roadmap'],
  ['/student/progress', 'Progress'],
];

const adminLinks = [
  ['/admin', 'Gap analytics', true],
  ['/admin/roles', 'Career roles'],
  ['/admin/skills', 'Skills library'],
  ['/admin/resources', 'Resources'],
];

export default function Layout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const links = user.role === 'STUDENT' ? studentLinks : adminLinks;

  const logout = () => {
    signOut();
    navigate('/login');
  };

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">SkillGap</div>
        <nav className="nav">
          {links.map(([to, label, end]) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => (isActive ? 'active' : '')}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="who">
          <span>{user.fullName}</span>
          <button className="btn btn-ghost" onClick={logout}>Log out</button>
        </div>
      </header>
      <main className="page">
        <Outlet />
      </main>
    </div>
  );
}
