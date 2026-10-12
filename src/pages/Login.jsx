import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { authApi } from '../api/endpoints';
import { errorMessage } from '../api/axios';
import { homePath, useAuth } from '../context/AuthContext';
import Notice from '../components/Notice';

export default function Login() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={homePath(user.role)} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const u = signIn(await authApi.login(form));
      navigate(homePath(u.role));
    } catch (err) {
      setMsg({ type: 'error', text: errorMessage(err) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth">
      <section className="auth-pitch">
        <h1>Know exactly what stands between you and the role you want.</h1>
        <p>Add your skills, pick a target career, and get a ranked gap report with a step-by-step learning plan.</p>
      </section>
      <form className="auth-card" onSubmit={submit}>
        <h2>Log in</h2>
        <Notice msg={msg} />
        <label>Email
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <label>Password
          <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </label>
        <button className="btn btn-primary" disabled={busy}>{busy ? 'Logging in...' : 'Log in'}</button>
        <p className="muted">New here? <Link to="/register">Create a student account</Link></p>
        <p className="hint">Demo student login: demo.student@skillgap.com / Student@123. You can also create your own student account.</p>
      </form>
    </div>
  );
}
