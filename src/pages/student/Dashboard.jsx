import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { studentApi } from '../../api/endpoints';
import ScoreRing from '../../components/ScoreRing';
import StatusBadge from '../../components/StatusBadge';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [gap, setGap] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const p = await studentApi.profile();
        setProfile(p);
        setRanking((await studentApi.alignment()).slice(0, 3));
        if (p.targetRoleId) setGap(await studentApi.gap());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="muted">Loading your dashboard...</p>;

  return (
    <>
      <h1>Hello, {profile.fullName.split(' ')[0]}</h1>

      {!gap ? (
        <section className="panel empty">
          <h2>Pick a target role to see your gap</h2>
          <p>Add your skills, then choose the career you are aiming for.</p>
          <div className="row">
            <Link className="btn btn-primary" to="/student/skills">Add skills</Link>
            <Link className="btn btn-ghost" to="/student/careers">Explore careers</Link>
          </div>
        </section>
      ) : (
        <section className="panel hero">
          <div>
            <p className="muted">Target role</p>
            <h2>{gap.roleTitle}</h2>
            <p>
              {gap.missingCount} missing, {gap.weakCount} need work, {gap.strongCount} already met.
            </p>
            <div className="row">
              <Link className="btn btn-primary" to="/student/gap">Open gap report</Link>
              <Link className="btn btn-ghost" to="/student/roadmap">View roadmap</Link>
            </div>
          </div>
          <div className="rings">
            <ScoreRing value={gap.readinessScore} label="Readiness" />
            <ScoreRing value={gap.alignmentScore} label="Alignment" color="var(--teal)" />
          </div>
        </section>
      )}

      <div className="grid two">
        <section className="panel">
          <h2>Best-fit careers right now</h2>
          {ranking.length === 0 && <p className="muted">Add skills to see a ranking.</p>}
          {ranking.map((r, i) => (
            <div className="rank-row" key={r.roleId}>
              <span className="rank-n">{i + 1}</span>
              <span className="grow">{r.roleTitle}</span>
              <strong>{r.alignmentScore}%</strong>
            </div>
          ))}
          <Link to="/student/careers">See all careers</Link>
        </section>

        <section className="panel">
          <h2>Biggest gaps</h2>
          {!gap && <p className="muted">Choose a target role first.</p>}
          {gap && gap.items.filter((i) => i.gap > 0).slice(0, 4).map((i) => (
            <div className="rank-row" key={i.skillId}>
              <span className="grow">{i.skillName}</span>
              <StatusBadge status={i.status} />
            </div>
          ))}
          {gap && gap.items.every((i) => i.gap === 0) && <p>You meet every requirement for this role.</p>}
        </section>
      </div>
    </>
  );
}
