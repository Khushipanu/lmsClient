import { useEffect, useMemo, useState } from "react";
import { Search, Users } from "lucide-react";
import api from "../../api/axios";
import AdminLayout from "../Utils/Layout";
import { Avatar, EmptyState, PageLoader } from "../../components/ui";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    api
      .get("/api/users")
      .then(({ data }) => setUsers(data.users || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const shown = useMemo(() => {
    const s = q.toLowerCase();
    return users.filter((u) => !s || u.name?.toLowerCase().includes(s) || u.email?.toLowerCase().includes(s));
  }, [users, q]);

  return (
    <AdminLayout title="Students" subtitle="Everyone enrolled in at least one of your courses.">
      {loading ? (
        <PageLoader />
      ) : users.length ? (
        <>
          <div className="input-icon" style={{ maxWidth: 360, marginBottom: 18 }}>
            <Search size={18} />
            <input className="input" placeholder="Search students" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="card table-card">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Enrolled in</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="row" style={{ gap: 10 }}>
                        <Avatar name={u.name} size={34} />
                        <div className="cell-stack">
                          <strong>{u.name}</strong>
                          <span>{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="chips" style={{ gap: 6 }}>
                        {u.enrolledIn.map((t) => (
                          <span className="badge" key={t}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <EmptyState icon={Users} title="No students yet" text="Students who enroll in your courses will appear here." />
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
