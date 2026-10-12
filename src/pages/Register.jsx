import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/endpoints';
import { errorMessage } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Notice from '../components/Notice';

export default function Register() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', education: '', careerInterests: '' });
  const [msg, setMsg] = useState(null);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      signIn(await authApi.register(form));
      navigate('/student/skills');
    } catch (err) {
      setMsg({ type: 'error', text: errorMessage(err) });
    }
  };

  return (
    <div className="auth">
      <section className="auth-pitch">
        <h1>Start with the skills you already have.</h1>
        <p>It takes a few minutes to add them. The analysis does the rest.</p>
      </section>
      <form className="auth-card" onSubmit={submit}>
        <h2>Create your account</h2>
        <Notice msg={msg} />
        <label>Full name<input required value={form.fullName} onChange={set('fullName')} /></label>
        <label>Email<input type="email" required value={form.email} onChange={set('email')} /></label>
        <label>Password<input type="password" required minLength={6} value={form.password} onChange={set('password')} /></label>
        <label>Education<input placeholder="B.Tech, 3rd year" value={form.education} onChange={set('education')} /></label>
        <label>Career interests<input placeholder="Full stack development, data" value={form.careerInterests} onChange={set('careerInterests')} /></label>
        <button className="btn btn-primary">Create account</button>
        <p className="muted">Already registered? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  );
}
