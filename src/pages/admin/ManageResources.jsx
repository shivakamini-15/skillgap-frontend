import { useEffect, useState } from 'react';
import { adminApi, catalogApi } from '../../api/endpoints';
import { errorMessage } from '../../api/axios';
import Notice from '../../components/Notice';

const TYPES = ['Tutorial', 'Course', 'Documentation', 'Video', 'Book', 'Practice'];
const empty = { skillId: '', title: '', url: '', type: 'Tutorial' };

export default function ManageResources() {
  const [items, setItems] = useState([]);
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState(empty);
  const [msg, setMsg] = useState(null);

  const load = async () => {
    const [r, s] = await Promise.all([adminApi.resources(), catalogApi.skills()]);
    setItems(r);
    setSkills(s);
  };
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const create = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createResource({ ...form, skillId: Number(form.skillId) });
      setForm(empty);
      setMsg({ type: 'ok', text: 'Resource added' });
      load();
    } catch (err) { setMsg({ type: 'error', text: errorMessage(err) }); }
  };

  const remove = async (id) => {
    await adminApi.deleteResource(id);
    load();
  };

  return (
    <>
      <h1>Learning resources</h1>
      <Notice msg={msg} />

      <form className="panel form" onSubmit={create}>
        <div className="row">
          <label className="grow">Skill
            <select required value={form.skillId} onChange={set('skillId')}>
              <option value="">Choose a skill</option>
              {skills.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </label>
          <label>Type
            <select value={form.type} onChange={set('type')}>
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
        </div>
        <label>Title<input required value={form.title} onChange={set('title')} /></label>
        <label>Link<input type="url" required placeholder="https://" value={form.url} onChange={set('url')} /></label>
        <button className="btn btn-primary">Add resource</button>
      </form>

      <section className="panel">
        <table className="table">
          <thead><tr><th>Skill</th><th>Resource</th><th>Type</th><th /></tr></thead>
          <tbody>
            {items.map((r) => (
              <tr key={r.id}>
                <td>{r.skillName}</td>
                <td><a href={r.url} target="_blank" rel="noreferrer">{r.title}</a></td>
                <td>{r.type}</td>
                <td className="right"><button className="btn btn-ghost" onClick={() => remove(r.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
