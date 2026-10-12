import { useEffect, useState } from 'react';
import { adminApi, catalogApi } from '../../api/endpoints';
import { errorMessage } from '../../api/axios';
import Notice from '../../components/Notice';

export default function ManageSkills() {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({ name: '', category: '', prerequisiteIds: [] });
  const [msg, setMsg] = useState(null);

  const load = () => catalogApi.skills().then(setSkills);
  useEffect(() => { load(); }, []);

  const nameOf = (id) => skills.find((s) => s.id === id)?.name;

  const create = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createSkill({ ...form, prerequisiteIds: form.prerequisiteIds.map(Number) });
      setForm({ name: '', category: '', prerequisiteIds: [] });
      setMsg({ type: 'ok', text: 'Skill added' });
      load();
    } catch (err) { setMsg({ type: 'error', text: errorMessage(err) }); }
  };

  const remove = async (id) => {
    try {
      await adminApi.deleteSkill(id);
      load();
    } catch (err) { setMsg({ type: 'error', text: errorMessage(err) }); }
  };

  const pickPrereqs = (e) =>
    setForm({ ...form, prerequisiteIds: Array.from(e.target.selectedOptions, (o) => o.value) });

  return (
    <>
      <h1>Skills library</h1>
      <Notice msg={msg} />

      <form className="panel form" onSubmit={create}>
        <div className="row">
          <label className="grow">Skill name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label className="grow">Category<input placeholder="Backend, Testing, Analytics" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></label>
        </div>
        <label>Prerequisites (hold Ctrl or Cmd to pick several)
          <select multiple value={form.prerequisiteIds} onChange={pickPrereqs} size={5}>
            {skills.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </label>
        <button className="btn btn-primary">Add skill</button>
      </form>

      <section className="panel">
        <table className="table">
          <thead><tr><th>Skill</th><th>Category</th><th>Learn first</th><th /></tr></thead>
          <tbody>
            {skills.map((s) => (
              <tr key={s.id}>
                <td><strong>{s.name}</strong></td>
                <td>{s.category}</td>
                <td>{s.prerequisiteIds.map(nameOf).join(', ') || <span className="muted">None</span>}</td>
                <td className="right"><button className="btn btn-ghost" onClick={() => remove(s.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
