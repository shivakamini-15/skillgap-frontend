import { useEffect, useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { studentApi } from '../../api/endpoints';

export default function Progress() {
  const [data, setData] = useState(null);

  useEffect(() => {
    studentApi.progress().then(setData);
  }, []);

  if (!data) return <p className="muted">Loading progress...</p>;

  const points = data.history.map((h, i) => ({
    run: `#${i + 1}`,
    Readiness: h.readinessScore,
    Alignment: h.alignmentScore,
    when: new Date(h.createdAt).toLocaleString(),
  }));
  const change = Math.round((data.latestReadiness - data.firstReadiness) * 100) / 100;

  return (
    <>
      <h1>Progress</h1>
      <div className="grid three">
        <div className="panel stat"><strong>{data.completedSteps}/{data.totalSteps}</strong><span>roadmap steps done</span></div>
        <div className="panel stat"><strong>{data.latestReadiness}%</strong><span>latest readiness</span></div>
        <div className="panel stat"><strong>{change >= 0 ? '+' : ''}{change}</strong><span>points since first analysis</span></div>
      </div>

      <section className="panel">
        <h2>Score history</h2>
        {points.length < 2 ? (
          <p className="muted">Run the analysis again after learning a skill to see your line move.</p>
        ) : (
          <div style={{ height: 320 }}>
            <ResponsiveContainer>
              <LineChart data={points}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d9e0ea" />
                <XAxis dataKey="run" />
                <YAxis domain={[0, 100]} unit="%" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Readiness" stroke="#2446d6" strokeWidth={3} dot />
                <Line type="monotone" dataKey="Alignment" stroke="#0f8b8d" strokeWidth={3} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>
    </>
  );
}
