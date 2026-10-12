import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { catalogApi, studentApi } from '../../api/endpoints';
import { errorMessage } from '../../api/axios';
import Notice from '../../components/Notice';

export default function CareerExplorer() {
  const navigate = useNavigate();
  const [ranking, setRanking] = useState([]);
  const [roles, setRoles] = useState({});
  const [targetId, setTargetId] = useState(null);
  const [open, setOpen] = useState(null);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    (async () => {
      const [rank, rs, p] = await Promise.all([studentApi.alignment(), catalogApi.roles(), studentApi.profile()]);
      setRanking(rank);
      setRoles(Object.fromEntries(rs.map((r) => [r.id, r])));
      setTargetId(p.targetRoleId);
    })();
  }, []);

  const choose = async (id) => {
    try {
      await studentApi.setTarget(id);
      setTargetId(id);
      navigate('/student/gap');
    } catch (err) {
      setMsg({ type: 'error', text: errorMessage(err) });
    }
  };

  return (
    <>
      <h1>Career explorer</h1>
      <p className="muted">Ranked by cosine similarity between your skill vector and each role's weighted requirements.</p>
      <Notice msg={msg} />

      {ranking.map((r, i) => {
        const role = roles[r.roleId];
        return (
          <section className="panel career" key={r.roleId}>
            <div className="career-head">
              <span className="rank-n">{i + 1}</span>
              <div className="grow">
                <h2>{r.roleTitle}</h2>
                <p className="muted">{role?.description}</p>
              </div>
              <div className="career-scores">
                <div><strong>{r.alignmentScore}%</strong><span className="muted small"> alignment</span></div>
                <div><strong>{r.readinessScore}%</strong><span className="muted small"> readiness</span></div>
              </div>
            </div>
            <div className="bar"><span style={{ width: `${r.alignmentScore}%` }} /></div>

            <div className="row">
              <button className="btn btn-primary" disabled={targetId === r.roleId} onClick={() => choose(r.roleId)}>
                {targetId === r.roleId ? 'Current target' : 'Set as target'}
              </button>
              <button className="btn btn-ghost" onClick={() => setOpen(open === r.roleId ? null : r.roleId)}>
                {open === r.roleId ? 'Hide required skills' : 'Show required skills'}
              </button>
            </div>

            {open === r.roleId && role && (
              <ul className="chips">
                {role.skills.map((s) => (
                  <li key={s.skillId}>{s.skillName} <span className="muted">L{s.requiredLevel}, weight {s.weight}</span></li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </>
  );
}
