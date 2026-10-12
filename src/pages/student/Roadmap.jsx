import { useEffect, useState } from 'react';
import { studentApi } from '../../api/endpoints';
import { errorMessage } from '../../api/axios';
import Notice from '../../components/Notice';

export default function Roadmap() {
  const [steps, setSteps] = useState([]);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    studentApi.roadmap().then(setSteps);
  }, []);

  const generate = async () => {
    setBusy(true);
    try {
      setSteps(await studentApi.generateRoadmap());
      setMsg(null);
    } catch (err) {
      setMsg({ type: 'error', text: errorMessage(err) });
    } finally {
      setBusy(false);
    }
  };

  const complete = async (id) => {
    try {
      const updated = await studentApi.completeStep(id);
      setSteps(steps.map((s) => (s.id === id ? updated : s)));
      setMsg({ type: 'ok', text: 'Skill marked as learned. Your readiness score has been updated.' });
    } catch (err) {
      setMsg({ type: 'error', text: errorMessage(err) });
    }
  };

  const done = steps.filter((s) => s.completed).length;

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Learning roadmap</h1>
          <p className="muted">Highest-impact skills first, with prerequisites placed before the skills that need them.</p>
        </div>
        <button className="btn btn-primary" onClick={generate} disabled={busy}>
          {steps.length ? 'Regenerate roadmap' : 'Generate roadmap'}
        </button>
      </div>
      <Notice msg={msg} />

      {steps.length > 0 && (
        <div className="panel">
          <div className="bar"><span style={{ width: `${(done / steps.length) * 100}%` }} /></div>
          <p className="muted small">{done} of {steps.length} steps completed</p>
        </div>
      )}

      {steps.length === 0 && <p className="muted">No roadmap yet. Generate one from your current gap report.</p>}

      <ol className="steps">
        {steps.map((s) => (
          <li key={s.id} className={`step ${s.completed ? 'done' : ''}`}>
            <div className="step-n">{s.stepOrder}</div>
            <div className="grow">
              <h3>{s.skillName}</h3>
              <p className="muted small">
                Priority {s.priorityScore}
                {s.prerequisites.length > 0 && <> &middot; builds on {s.prerequisites.join(', ')}</>}
              </p>
              {s.resources.length > 0 ? (
                <ul className="links">
                  {s.resources.map((r) => (
                    <li key={r.id}><a href={r.url} target="_blank" rel="noreferrer">{r.title}</a> <span className="muted small">{r.type}</span></li>
                  ))}
                </ul>
              ) : (
                <p className="muted small">No resources added for this skill yet.</p>
              )}
            </div>
            <button className="btn btn-ghost" disabled={s.completed} onClick={() => complete(s.id)}>
              {s.completed ? 'Learned' : 'Mark as learned'}
            </button>
          </li>
        ))}
      </ol>
    </>
  );
}
