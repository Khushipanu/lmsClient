import { BookOpen, CheckCircle2, Clock, CornerDownRight } from "lucide-react";
import { Avatar } from "../../components/ui";
import { timeAgo } from "../../utils/imageUrl";

export const StatusBadge = ({ status }) =>
  status === "solved" ? (
    <span className="badge badge-success">
      <CheckCircle2 size={13} /> Answered
    </span>
  ) : (
    <span className="badge badge-warning">
      <Clock size={13} /> Pending
    </span>
  );

const QueryCard = ({ q, children, replyLabel = "Instructor's reply" }) => (
  <article className="query-card card fade-up">
    <header className="query-card-head">
      <div>
        <h3>{q.title}</h3>
        <div className="query-meta">
          {q.student?.name && (
            <span className="row" style={{ gap: 6 }}>
              <Avatar name={q.student.name} size={22} /> {q.student.name}
            </span>
          )}
          <span>
            <BookOpen size={14} /> {q.course?.title || "Deleted course"}
          </span>
          <span className="badge">{q.topic}</span>
          <span>{timeAgo(q.createdAt)}</span>
        </div>
      </div>
      <StatusBadge status={q.status} />
    </header>
    <p className="query-desc">{q.description}</p>
    {q.reply && (
      <div className="query-reply">
        <strong>
          <CornerDownRight size={15} /> {replyLabel}
        </strong>
        <p>{q.reply}</p>
      </div>
    )}
    {children}
  </article>
);

export default QueryCard;
