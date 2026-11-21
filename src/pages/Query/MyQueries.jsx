import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircleQuestion } from "lucide-react";
import api from "../../api/axios";
import { EmptyState, PageLoader } from "../../components/ui";
import QueryCard from "./QueryCard";

const MyQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    api
      .get("/api/query/my")
      .then(({ data }) => setQueries(data.queries || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(
    () => ({
      all: queries.length,
      pending: queries.filter((q) => q.status !== "solved").length,
      solved: queries.filter((q) => q.status === "solved").length,
    }),
    [queries]
  );
  const shown = queries.filter((q) => tab === "all" || (tab === "solved" ? q.status === "solved" : q.status !== "solved"));

  if (loading) return <PageLoader label="Loading your doubts…" />;

  return (
    <div className="page">
      <div className="container narrow">
        <div className="page-header">
          <div>
            <span className="eyebrow">Support</span>
            <h1>My doubts</h1>
            <p>Questions you've asked your instructors.</p>
          </div>
        </div>

        {queries.length > 0 && (
          <div className="chips" style={{ marginBottom: 20 }}>
            {[
              ["all", "All"],
              ["pending", "Pending"],
              ["solved", "Answered"],
            ].map(([k, label]) => (
              <button key={k} className={`chip ${tab === k ? "active" : ""}`} onClick={() => setTab(k)}>
                {label}
                <span className="count">{counts[k]}</span>
              </button>
            ))}
          </div>
        )}

        {shown.length ? (
          <div className="stack">
            {shown.map((q) => (
              <QueryCard key={q._id} q={{ ...q, student: null }}>
                {!q.reply && <p className="query-waiting">Waiting for {q.instructor?.name || "the instructor"} to reply…</p>}
              </QueryCard>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={MessageCircleQuestion}
            title={queries.length ? "Nothing here" : "No doubts yet"}
            text="Open any enrolled course and use “Ask the instructor” when you're stuck."
            action={
              <Link to="/dashboard" className="btn btn-primary">
                Go to my courses
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
};

export default MyQueries;
