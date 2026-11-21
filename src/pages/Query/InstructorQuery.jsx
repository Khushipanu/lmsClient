import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { MessageCircleQuestion, Send } from "lucide-react";
import api, { getErrorMessage } from "../../api/axios";
import AdminLayout from "../../Admin/Utils/Layout";
import { EmptyState, PageLoader, Spinner } from "../../components/ui";
import QueryCard from "./QueryCard";

const InstructorQuery = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replies, setReplies] = useState({});
  const [sending, setSending] = useState(null);
  const [tab, setTab] = useState("pending");

  useEffect(() => {
    api
      .get("/api/query/instructor")
      .then(({ data }) => setQueries(data.queries || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const sendReply = async (id) => {
    const reply = replies[id]?.trim();
    if (!reply) return;
    setSending(id);
    try {
      const { data } = await api.put(`/api/query/status/${id}`, { status: "solved", reply });
      setQueries((qs) => qs.map((q) => (q._id === id ? { ...q, ...data.query, student: q.student, course: q.course } : q)));
      setReplies((r) => ({ ...r, [id]: "" }));
      toast.success("Reply sent");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSending(null);
    }
  };

  const counts = useMemo(
    () => ({
      pending: queries.filter((q) => q.status !== "solved").length,
      solved: queries.filter((q) => q.status === "solved").length,
      all: queries.length,
    }),
    [queries]
  );
  const shown = queries.filter((q) => tab === "all" || (tab === "solved" ? q.status === "solved" : q.status !== "solved"));

  return (
    <AdminLayout title="Student doubts" subtitle="Questions students asked about your courses.">
      {loading ? (
        <PageLoader />
      ) : (
        <>
          <div className="chips" style={{ marginBottom: 20 }}>
            {[
              ["pending", "Pending"],
              ["solved", "Answered"],
              ["all", "All"],
            ].map(([k, label]) => (
              <button key={k} className={`chip ${tab === k ? "active" : ""}`} onClick={() => setTab(k)}>
                {label}
                <span className="count">{counts[k]}</span>
              </button>
            ))}
          </div>

          {shown.length ? (
            <div className="stack">
              {shown.map((q) => (
                <QueryCard key={q._id} q={q} replyLabel="Your reply">
                  {q.status !== "solved" && (
                    <div className="reply-box">
                      <textarea
                        className="textarea"
                        rows={3}
                        placeholder="Write a helpful reply…"
                        value={replies[q._id] || ""}
                        onChange={(e) => setReplies((r) => ({ ...r, [q._id]: e.target.value }))}
                      />
                      <button
                        className="btn btn-primary"
                        onClick={() => sendReply(q._id)}
                        disabled={!replies[q._id]?.trim() || sending === q._id}
                      >
                        {sending === q._id ? <Spinner small /> : <Send size={16} />} Send reply
                      </button>
                    </div>
                  )}
                </QueryCard>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={MessageCircleQuestion}
              title={tab === "pending" ? "You're all caught up" : "No doubts here"}
              text={tab === "pending" ? "No pending questions from students right now." : "Student questions will show up here."}
            />
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default InstructorQuery;
