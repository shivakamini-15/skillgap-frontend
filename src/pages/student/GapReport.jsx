import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { studentApi } from '../../api/endpoints';
import { errorMessage } from '../../api/axios';
import ScoreRing from '../../components/ScoreRing';
import GapMeter from '../../components/GapMeter';
import StatusBadge from '../../components/StatusBadge';
import Notice from '../../components/Notice';

export default function GapReport() {
  const [report, setReport] = useState(null);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    studentApi.gap().then(setReport).catch((err) => setMsg({ type: 'error', text: errorMessage(err) }));
  }, []);

  const rerun = async () => {
    setBusy(true);
    try {
      setReport(await studentApi.runAnalysis());
      setMsg({ type: 'ok', text: 'Analysis saved. Your progress chart has a new point.' });
    } catch (err) {
      setMsg({ type: 'error', text: errorMessage(err) });
    } finally {
      setBusy(false);
    }
  };

  if (!report) {
    return (
      <>
        <h1>Gap report</h1>
        <Notice msg={msg} />
        <p>Pick a target role on the <Link to="/student/careers">careers page</Link> first.</p>
      </>
    );
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Gap report</h1>
          <p className="muted">Target: {report.roleTitle}</p>
        </div>
        <button className="btn btn-primary" onClick={rerun} disabled={busy}>
          {busy ? 'Analysing...' : 'Re-run and save analysis'}
        </button>
      </div>
      <Notice msg={msg} />

      <section className="panel hero">
        <div className="rings">
          <ScoreRing value={report.readinessScore} label="Readiness" size={150} />
          <ScoreRing value={report.alignmentScore} label="Alignment" size={150} color="var(--teal)" />
        </div>
        <ul className="summary">
          <li><strong>{report.missingCount}</strong> missing skills</li>
          <li><strong>{report.weakCount}</strong> below the required level</li>
          <li><strong>{report.strongCount}</strong> requirements met</li>
        </ul>
      </section>

      <section className="panel">
        <h2>Skill by skill</h2>
        <p className="muted small">Filled segments are your level. The marked segment is what the role requires.</p>
        <table className="table">
          <thead>
            <tr><th>Skill</th><th>Your level vs required</th><th>Weight</th><th>Status</th></tr>
          </thead>
          <tbody>
            {report.items.map((i) => (
              <tr key={i.skillId}>
                <td><strong>{i.skillName}</strong></td>
                <td><GapMeter current={i.currentLevel} required={i.requiredLevel} /></td>
                <td>{i.weight}</td>
                <td><StatusBadge status={i.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link className="btn btn-primary" to="/student/roadmap">Build my roadmap</Link>
      </section>
    </>
  );
}
