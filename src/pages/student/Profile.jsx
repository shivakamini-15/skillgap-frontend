import { useEffect, useState } from 'react';
import { catalogApi, studentApi } from '../../api/endpoints';
import { errorMessage } from '../../api/axios';
import Notice from '../../components/Notice';

export default function Profile() {
  const [form, setForm] = useState({ fullName: '', education: '', careerInterests: '' });
  const [email, setEmail] = useState('');
  const [roles, setRoles] = useState([]);
  const [targetId, setTargetId] = useState('');
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    (async () => {
      const [p, r] = await Promise.all([studentApi.profile(), catalogApi.roles()]);
      setForm({ fullName: p.fullName, education: p.education || '', careerInterests: p.careerInterests || '' });
      setEmail(p.email);
      setTargetId(p.targetRoleId || '');
      setRoles(r);
    })();
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    try {
      await studentApi.updateProfile(form);
      if (targetId) await studentApi.setTarget(targetId);
      setMsg({ type: 'ok', text: 'Profile saved' });
    } catch (err) {
      setMsg({ type: 'error', text: errorMessage(err) });
    }
  };

  return (
    <>
      <h1>Profile</h1>
      <form className="panel form" onSubmit={save}>
        <Notice msg={msg} />
        <label>Email<input value={email} disabled /></label>
        <label>Full name<input required value={form.fullName} onChange={set('fullName')} /></label>
        <label>Education<input value={form.education} onChange={set('education')} /></label>
        <label>Career interests<input value={form.careerInterests} onChange={set('careerInterests')} /></label>
        <label>Target career role
          <select value={targetId} onChange={(e) => setTargetId(e.target.value)}>
            <option value="">Not chosen yet</option>
            {roles.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}
          </select>
        </label>
        <button className="btn btn-primary">Save profile</button>
      </form>
    </>
  );
}
