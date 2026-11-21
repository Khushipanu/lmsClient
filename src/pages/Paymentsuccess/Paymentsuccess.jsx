import { Link, useParams, useSearchParams } from "react-router-dom";
import { CheckCircle2, PlayCircle } from "lucide-react";

const Paymentsuccess = () => {
  const { id } = useParams();
  const [params] = useSearchParams();
  const courseId = params.get("course");

  return (
    <div className="page">
      <div className="container narrow">
        <div className="card success-card fade-up">
          <div className="success-icon">
            <CheckCircle2 size={40} />
          </div>
          <h1>Payment successful!</h1>
          <p className="muted">Your enrollment is active. Time to start learning.</p>
          <div className="receipt">
            <span>Payment reference</span>
            <code>{id}</code>
          </div>
          <div className="row" style={{ justifyContent: "center", flexWrap: "wrap" }}>
            {courseId && (
              <Link to={`/lecture/${courseId}`} className="btn btn-primary btn-lg">
                <PlayCircle size={18} /> Start the course
              </Link>
            )}
            <Link to="/dashboard" className="btn btn-lg">
              Go to my learning
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Paymentsuccess;
