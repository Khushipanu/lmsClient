import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Loading from "../../components/loading/Loading";
import { MessageSquare, User, BookOpen, CheckCircle, Clock } from "lucide-react";
import "./Query.css";

const InstructorQueries = () => {
  const [queries, setQueries] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchQueries = async () => {
    try {
      const { data } = await api.get("/api/query/instructor");
      setQueries(data.queries);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const sendReply = async (id) => {
    const reply = replyText[id];
    if (!reply?.trim()) return;

    setReplyText({ ...replyText, [id]: "" });

    try {
      await api.put(`/api/query/status/${id}`, {
        status: "solved",
        reply: reply,
      });
      fetchQueries();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="query-page">
        <Loading />
      </div>
    );
  }

  return (
    <div className="query-page">
      <div className="query-header">
        <MessageSquare size={28} />
        <h2>Students' Doubts</h2>
      </div>

      {queries.length === 0 ? (
        <div className="empty-state">
          <MessageSquare size={48} />
          <p>No doubts from students yet</p>
        </div>
      ) : (
        <div className="query-list">
          {queries.map((q) => (
            <div key={q._id} className="query-card">
              <div className="query-card-header">
                <h3>{q.title}</h3>
                <span
                  className={`status-badge ${
                    q.status === "pending" ? "pending" : "solved"
                  }`}
                >
                  {q.status === "pending" ? (
                    <>
                      <Clock size={14} /> Pending
                    </>
                  ) : (
                    <>
                      <CheckCircle size={14} /> Solved
                    </>
                  )}
                </span>
              </div>

              <div className="query-meta">
                <span>
                  <User size={14} /> {q.student?.name || "Unknown"}
                </span>
                <span>
                  <BookOpen size={14} /> {q.course?.title || "Unknown Course"}
                </span>
              </div>

              <p className="query-topic">
                <strong>Topic:</strong> {q.topic}
              </p>
              <p className="query-description">{q.description}</p>

              {q.status === "pending" ? (
                <div className="reply-form">
                  <textarea
                    placeholder="Write your reply..."
                    value={replyText[q._id] || ""}
                    onChange={(e) =>
                      setReplyText({
                        ...replyText,
                        [q._id]: e.target.value,
                      })
                    }
                    rows="3"
                  />
                  <button
                    className="common-btn"
                    onClick={() => sendReply(q._id)}
                  >
                    Send Reply
                  </button>
                </div>
              ) : (
                <div className="query-reply">
                  <h4>
                    <MessageSquare size={16} /> Your Reply
                  </h4>
                  <p>{q.reply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorQueries;
