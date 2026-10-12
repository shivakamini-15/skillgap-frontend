import { useEffect, useState } from 'react';
import { adminApi, catalogApi } from '../../api/endpoints';
import { errorMessage } from '../../api/axios';
import Notice from '../../components/Notice';

export default function ManageRoles() {
  const [roles, setRoles] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [rows, setRows] = useState([]);           // editable skill requirements of the selected role
  const [newRole, setNewRole] = useState({ title: '', description: '' });
  const [addSkillId, setAddSkillId] = useState('');
  const [msg, setMsg] = useState(null);

  const load = async () => {
    const [r, s] = await Promise.all([catalogApi.roles(), catalogApi.skills()]);
    setRoles(r);
    setSkills(s);
    return r;
  };

  useEffect(() => { load(); }, []);

  const selected = roles.find((r) => r.id === selectedId);

  const select = (role) => {
    setSelectedId(role.id);
    setRows(role.skills.map((s) => ({ skillId: s.skillId, skillName: s.skillName, weight: s.weight, requiredLevel: s.requiredLevel })));
    setMsg(null);
  };

  const fail = (err) => setMsg({ type: 'error', text: errorMessage(err) });

  const createRole = async (e) => {
    e.preventDefault();
    try {
      const created = await adminApi.createRole(newRole);
      setNewRole({ title: '', description: '' });
      await load();
      select({ ...created, skills: [] });
    } catch (err) { fail(err); }
  };

  const removeRole = async (id) => {
    if (!window.confirm('Delete this role and its skill requirements?')) return;
    try {
      await adminApi.deleteRole(id);
      setSelectedId(null);
      await load();
    } catch (err) { fail(err); }
  };

  const update = (skillId, key, value) =>
    setRows(rows.map((r) => (r.skillId === skillId ? { ...r, [key]: value } : r)));

  const addRow = () => {
    const s = skills.find((x) => x.id === Number(addSkillId));
    if (!s) return;
    setRows([...rows, { skillId: s.id, skillName: s.name, weight: 5, requiredLevel: 3 }]);
    setAddSkillId('');
  };

  const saveSkills = async () => {
    try {
      await adminApi.setRoleSkills(selectedId, rows.map((r) => ({
        skillId: r.skillId, weight: Number(r.weight), requiredLevel: Number(r.requiredLevel),
      })));
      await load();
      setMsg({ type: 'ok', text: 'Requirements saved' });
    } catch (err) { fail(err); }
  };

  const usedIds = new Set(rows.map((r) => r.skillId));

  return (
    <>
      <h1>Career roles</h1>
      <Notice msg={msg} />

      <form className="panel row" onSubmit={createRole}>
        <input required placeholder="New role title" value={newRole.title} onChange={(e) => setNewRole({ ...newRole, title: e.target.value })} />
        <input placeholder="Short description" className="grow" value={newRole.description} onChange={(e) => setNewRole({ ...newRole, description: e.target.value })} />
        <button className="btn btn-primary">Add role</button>
      </form>

      <div className="grid split">
        <section className="panel">
          <h2>Roles</h2>
          {roles.map((r) => (
            <button key={r.id} className={`list-btn ${r.id === selectedId ? 'active' : ''}`} onClick={() => select(r)}>
              {r.title}<span className="muted small">{r.skills.length} skills</span>
            </button>
          ))}
        </section>

        <section className="panel">
          {!selected ? (
            <p className="muted">Select a role to edit its required skills, weights and levels.</p>
          ) : (
            <>
              <div className="page-head">
                <h2>{selected.title}</h2>
                <button className="btn btn-ghost" onClick={() => removeRole(selected.id)}>Delete role</button>
              </div>
              <table className="table">
                <thead><tr><th>Skill</th><th>Weight (0.1-10)</th><th>Required level (1-5)</th><th /></tr></thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.skillId}>
                      <td>{r.skillName}</td>
                      <td><input type="number" min="0.1" max="10" step="0.5" value={r.weight} onChange={(e) => update(r.skillId, 'weight', e.target.value)} /></td>
                      <td><input type="number" min="1" max="5" value={r.requiredLevel} onChange={(e) => update(r.skillId, 'requiredLevel', e.target.value)} /></td>
                      <td className="right"><button className="btn btn-ghost" onClick={() => setRows(rows.filter((x) => x.skillId !== r.skillId))}>Remove</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="row">
                <select value={addSkillId} onChange={(e) => setAddSkillId(e.target.value)}>
                  <option value="">Add a skill to this role</option>
                  {skills.filter((s) => !usedIds.has(s.id)).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <button className="btn btn-ghost" onClick={addRow} disabled={!addSkillId}>Add</button>
                <span className="grow" />
                <button className="btn btn-primary" onClick={saveSkills}>Save requirements</button>
              </div>
            </>
          )}
        </section>
      </div>
    </>
  );
}
