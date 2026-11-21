import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  CheckCircle2,
  Plus,
  Trash2,
  Film,
  MessageCircleQuestion,
  UploadCloud,
  ListVideo,
} from "lucide-react";
import api, { getErrorMessage } from "../../api/axios";
import { UserData } from "../../context/UserContext";
import { EmptyState, Modal, PageLoader, SubmitButton } from "../../components/ui";
import { getImageUrl, isEnrolled, onImageError, ownsCourse } from "../../utils/imageUrl";

const progressKey = (courseId) => `progress:${courseId}`;
const readProgress = (courseId) => {
  try {
    return JSON.parse(localStorage.getItem(progressKey(courseId))) || [];
  } catch {
    return [];
  }
};

const AddLectureModal = ({ courseId, onClose, onAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("video/")) return toast.error("Please choose a video file");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please choose a video");
    const form = new FormData();
    form.append("title", title);
    form.append("description", description);
    form.append("file", file);
    setLoading(true);
    try {
      const { data } = await api.post(`/api/courses/${courseId}`, form, {
        skipWakeToast: true,
        timeout: 0,
        onUploadProgress: (p) => p.total && setProgress(Math.round((p.loaded / p.total) * 100)),
      });
      toast.success(data.message);
      onAdded(data.lecture);
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err, "Upload failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Add a lecture" onClose={loading ? () => {} : onClose}>
      <form className="stack" onSubmit={submit}>
        <div className="field">
          <label htmlFor="lt">Title</label>
          <input id="lt" className="input" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="ld">Description</label>
          <textarea
            id="ld"
            className="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <span className="label">Video</span>
          <label className="file-drop">
            <input type="file" accept="video/*" onChange={onFile} />
            {preview ? (
              <video src={preview} muted />
            ) : (
              <>
                <UploadCloud size={28} />
                <strong>Click to choose a video</strong>
                <span className="field-hint">MP4 or WebM recommended</span>
              </>
            )}
          </label>
          {file && <span className="field-hint">{file.name}</span>}
        </div>
        {loading && (
          <div className="stack" style={{ gap: 6 }}>
            <div className="progress">
              <span style={{ width: `${progress}%` }} />
            </div>
            <span className="field-hint">
              {progress < 100 ? `Uploading… ${progress}%` : "Processing video… this can take a moment"}
            </span>
          </div>
        )}
        <SubmitButton loading={loading} className="btn btn-primary btn-lg">
          {loading ? "Uploading…" : "Add lecture"}
        </SubmitButton>
      </form>
    </Modal>
  );
};

const Lecture = () => {
  const { id } = useParams();
  const [params, setParams] = useSearchParams();
  const { user } = UserData();
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [done, setDone] = useState(() => readProgress(id));

  const owner = ownsCourse(course, user);
  const allowed = owner || isEnrolled(user, id);

  const load = useCallback(async () => {
    try {
      const [{ data: c }, { data: l }] = await Promise.all([
        api.get(`/api/course/${id}`),
        api.get(`/api/lectures/${id}`),
      ]);
      setCourse(c.course);
      setLectures(l.lectures || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const currentId = params.get("l") || lectures[0]?._id;
  const index = Math.max(0, lectures.findIndex((l) => l._id === currentId));
  const current = lectures[index];

  const select = (lectureId) => {
    setParams({ l: lectureId }, { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const markDone = useCallback(
    (lectureId) => {
      setDone((prev) => {
        if (prev.includes(lectureId)) return prev;
        const next = [...prev, lectureId];
        localStorage.setItem(progressKey(id), JSON.stringify(next));
        return next;
      });
    },
    [id]
  );

  const pct = useMemo(
    () => (lectures.length ? Math.round((lectures.filter((l) => done.includes(l._id)).length / lectures.length) * 100) : 0),
    [lectures, done]
  );

  const deleteLecture = async (lectureId) => {
    if (!confirm("Delete this lecture? This can't be undone.")) return;
    try {
      const { data } = await api.delete(`/api/lecture/${lectureId}`);
      toast.success(data.message);
      setLectures((ls) => ls.filter((l) => l._id !== lectureId));
      if (lectureId === currentId) setParams({}, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (loading) return <PageLoader label="Loading lectures…" />;
  if (user && course && !allowed) return <Navigate to={`/course/${id}`} replace />;
  if (error && !course)
    return (
      <div className="page container">
        <EmptyState
          icon={ListVideo}
          title="Can't open this course"
          text={error}
          action={
            <Link to={`/course/${id}`} className="btn btn-primary">
              Go to course page
            </Link>
          }
        />
      </div>
    );

  return (
    <div className="player-page">
      <div className="container">
        <div className="player-top">
          <Link to={owner ? "/admin/course" : "/dashboard"} className="back-link">
            <ChevronLeft size={16} /> {owner ? "My courses" : "My learning"}
          </Link>
          <h1>{course?.title}</h1>
          {!owner && lectures.length > 0 && (
            <div className="player-progress">
              <div className="progress" style={{ width: 160 }}>
                <span style={{ width: `${pct}%` }} />
              </div>
              <span>{pct}% complete</span>
            </div>
          )}
        </div>

        <div className="player-grid">
          <div className="player-main">
            {current ? (
              <>
                <div className="video-wrap">
                  <video
                    key={current._id}
                    src={getImageUrl(current.video)}
                    controls
                    controlsList="nodownload"
                    playsInline
                    onEnded={() => markDone(current._id)}
                    onTimeUpdate={(e) => {
                      const v = e.currentTarget;
                      if (v.duration && v.currentTime / v.duration > 0.9) markDone(current._id);
                    }}
                  />
                </div>
                <div className="lecture-info">
                  <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
                    <span className="eyebrow">
                      Lecture {index + 1} of {lectures.length}
                    </span>
                    <div className="row" style={{ gap: 8 }}>
                      <button className="btn btn-sm" disabled={index === 0} onClick={() => select(lectures[index - 1]._id)}>
                        <ChevronLeft size={16} /> Previous
                      </button>
                      <button
                        className="btn btn-sm btn-primary"
                        disabled={index >= lectures.length - 1}
                        onClick={() => select(lectures[index + 1]._id)}
                      >
                        Next <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                  <h2>{current.title}</h2>
                  <p>{current.description}</p>
                  {!owner && (
                    <Link to={`/ask-query/${id}`} className="btn btn-soft" style={{ marginTop: 18 }}>
                      <MessageCircleQuestion size={17} /> Stuck? Ask the instructor
                    </Link>
                  )}
                </div>
              </>
            ) : (
              <div className="video-empty">
                <img src={getImageUrl(course?.image)} alt="" onError={onImageError} />
                <div>
                  <Film size={30} />
                  <h2>No lectures yet</h2>
                  <p>{owner ? "Add your first lecture to get started." : "The instructor is still preparing this course."}</p>
                  {owner && (
                    <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
                      <Plus size={17} /> Add lecture
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <aside className="playlist card">
            <div className="playlist-head">
              <div>
                <strong>Course content</strong>
                <span>{lectures.length} lectures</span>
              </div>
              {owner && (
                <button className="btn btn-sm btn-primary" onClick={() => setShowAdd(true)}>
                  <Plus size={15} /> Add
                </button>
              )}
            </div>
            <ol className="playlist-list">
              {lectures.map((l, i) => (
                <li key={l._id} className={l._id === current?._id ? "active" : ""}>
                  <button className="playlist-item" onClick={() => select(l._id)}>
                    <span className="pl-icon">
                      {done.includes(l._id) ? (
                        <CheckCircle2 size={18} className="done" />
                      ) : l._id === current?._id ? (
                        <PlayCircle size={18} />
                      ) : (
                        <span className="pl-num">{i + 1}</span>
                      )}
                    </span>
                    <span className="pl-title">{l.title}</span>
                  </button>
                  {owner && (
                    <button className="icon-btn pl-delete" onClick={() => deleteLecture(l._id)} aria-label={`Delete ${l.title}`}>
                      <Trash2 size={16} />
                    </button>
                  )}
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </div>

      {showAdd && (
        <AddLectureModal
          courseId={id}
          onClose={() => setShowAdd(false)}
          onAdded={(lec) => {
            setLectures((ls) => [...ls, lec]);
            select(lec._id);
          }}
        />
      )}
    </div>
  );
};

export default Lecture;
