import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { adminApi } from '../../api/endpoints';

export default function AdminAnalytics() {
  const [rows, setRows] = useState(null);

  useEffect(() => {
    adminApi.gapAnalytics().then(setRows);
  }, []);

  if (!rows) return <p className="muted">Loading analytics...</p>;

  return (
    <>
      <h1>Gap analytics</h1>
      <p className="muted">Required skills that students are most often below the required level on, across their target roles.</p>

      <section className="panel">
        {rows.length === 0 ? (
          <p className="muted">No students have chosen a target role yet.</p>
        ) : (
          <div style={{ height: 340 }}>
            <ResponsiveContainer>
              <BarChart data={rows} margin={{ bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d9e0ea" />
                <XAxis dataKey="skillName" angle={-30} textAnchor="end" interval={0} height={70} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="studentsLacking" name="Students below required level" fill="#2446d6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      {rows.length > 0 && (
        <section className="panel">
          <table className="table">
            <thead><tr><th>Skill</th><th>Students lacking</th><th>Average level</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.skillName}><td>{r.skillName}</td><td>{r.studentsLacking}</td><td>{r.averageLevel}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </>
  );
}
