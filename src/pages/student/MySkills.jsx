import { useEffect, useState } from 'react';
import { catalogApi, studentApi } from '../../api/endpoints';
import { errorMessage } from '../../api/axios';
import Notice from '../../components/Notice';

const LEVELS = ['Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert'];

export default function MySkills() {
  const [mine, setMine] = useState([]);
  const [library, setLibrary] = useState([]);
  const [skillId, setSkillId] = useState('');
  const [level, setLevel] = useState(3);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    (async () => {
      const [m, l] = await Promise.all([studentApi.skills(), catalogApi.skills()]);
      setMine(m);
      setLibrary(l);
    })();
  }, []);

  const have = new Set(mine.map((s) => s.skillId));
  const available = library.filter((s) => !have.has(s.id));

  const save = async (id, lvl) => {
    try {
      setMine(await studentApi.saveSkill({ skillId: Number(id), level: Number(lvl) }));
      setMsg(null);
    } catch (err) {
      setMsg({ type: 'error', text: errorMessage(err) });
    }
  };

  const add = async (e) => {
    e.preventDefault();
    if (!skillId) return;
    await save(skillId, level);
    setSkillId('');
  };

  const remove = async (id) => {
    await studentApi.removeSkill(id);
    setMine(mine.filter((s) => s.skillId !== id));
  };

  return (
    <>
      <h1>My skills</h1>
      <Notice msg={msg} />

      <form className="panel row add-skill" onSubmit={add}>
        <select value={skillId} onChange={(e) => setSkillId(e.target.value)} aria-label="Skill">
          <option value="">Choose a skill to add</option>
          {available.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.category})</option>)}
        </select>
        <select value={level} onChange={(e) => setLevel(e.target.value)} aria-label="Proficiency">
          {LEVELS.map((l, i) => <option key={l} value={i + 1}>{i + 1} - {l}</option>)}
        </select>
        <button className="btn btn-primary" disabled={!skillId}>Add skill</button>
      </form>

      <section className="panel">
        {mine.length === 0 && <p className="muted">No skills yet. Add the first one above.</p>}
        <table className="table">
          <tbody>
            {mine.map((s) => (
              <tr key={s.skillId}>
                <td><strong>{s.skillName}</strong><div className="muted small">{s.category}</div></td>
                <td>
                  <select value={s.level} onChange={(e) => save(s.skillId, e.target.value)} aria-label={`Level for ${s.skillName}`}>
                    {LEVELS.map((l, i) => <option key={l} value={i + 1}>{i + 1} - {l}</option>)}
                  </select>
                </td>
                <td className="right"><button className="btn btn-ghost" onClick={() => remove(s.skillId)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
