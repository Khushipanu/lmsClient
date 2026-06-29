import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Loading from "../../components/loading/Loading";
import { HelpCircle, MessageSquare, Clock, CheckCircle } from "lucide-react";
import "./Query.css";

const MyQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQueries = async () => {
    try {
      const { data } = await api.get("/api/query/my");
      setQueries(data.queries);
    } catch (error) {
      console.log("Error fetching queries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

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
        <HelpCircle size={28} />
        <h2>My Doubts</h2>
      </div>

      {queries.length === 0 ? (
        <div className="empty-state">
          <MessageSquare size={48} />
          <p>No doubts asked yet</p>
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

              <p className="query-topic">
                <strong>Topic:</strong> {q.topic}
              </p>
              <p className="query-description">{q.description}</p>

              {q.reply ? (
                <div className="query-reply">
                  <h4>
                    <MessageSquare size={16} /> Instructor Reply
                  </h4>
                  <p>{q.reply}</p>
                </div>
              ) : (
                <p className="query-waiting">
                  <Clock size={14} /> Waiting for instructor reply...
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyQueries;
