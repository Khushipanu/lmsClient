import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ChevronLeft, MessageCircleQuestion } from "lucide-react";
import api, { getErrorMessage } from "../../api/axios";
import { SubmitButton } from "../../components/ui";

const AskQuery = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [form, setForm] = useState({ title: "", topic: "", description: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .get(`/api/course/${courseId}`)
      .then(({ data }) => setCourse(data.course))
      .catch(() => {});
  }, [courseId]);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post(`/api/query/create/${courseId}`, form);
      toast.success(data.message);
      navigate("/my-queries");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container narrow">
        <Link to={`/lecture/${courseId}`} className="back-link">
          <ChevronLeft size={16} /> Back to course
        </Link>
        <div className="card card-pad fade-up" style={{ marginTop: 14 }}>
          <div className="row" style={{ marginBottom: 22 }}>
            <div className="feature-icon" style={{ margin: 0 }}>
              <MessageCircleQuestion size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: 24 }}>Ask your instructor</h1>
              <p className="muted">{course ? `About “${course.title}”` : "Describe what you're stuck on"}</p>
            </div>
          </div>
          <form className="stack" onSubmit={submit}>
            <div className="form-row">
              <div className="field">
                <label htmlFor="title">Question title</label>
                <input
                  id="title"
                  name="title"
                  className="input"
                  placeholder="e.g. useEffect runs twice"
                  value={form.title}
                  onChange={change}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="topic">Topic / lecture</label>
                <input
                  id="topic"
                  name="topic"
                  className="input"
                  placeholder="e.g. React Hooks"
                  value={form.topic}
                  onChange={change}
                  required
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="description">Details</label>
              <textarea
                id="description"
                name="description"
                className="textarea"
                rows={7}
                placeholder="Explain what you tried, what you expected and what happened instead. Paste error messages if you have them."
                value={form.description}
                onChange={change}
                required
              />
            </div>
            <div className="row" style={{ justifyContent: "flex-end" }}>
              <Link to="/my-queries" className="btn btn-ghost">
                View my doubts
              </Link>
              <SubmitButton loading={loading} className="btn btn-primary">
                Send to instructor
              </SubmitButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AskQuery;
