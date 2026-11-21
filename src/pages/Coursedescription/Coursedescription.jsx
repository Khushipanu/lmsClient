import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Clock,
  PlayCircle,
  Lock,
  ShieldCheck,
  Sparkles,
  MessageCircleQuestion,
  Infinity as InfinityIcon,
  BookX,
  ChevronLeft,
  Settings2,
} from "lucide-react";
import api, { getErrorMessage } from "../../api/axios";
import { UserData } from "../../context/UserContext";
import { CourseData } from "../../context/courseContext";
import { Avatar, EmptyState, PageLoader, Spinner } from "../../components/ui";
import { RAZORPAY_KEY, BRAND } from "../../config";
import { loadRazorpay } from "../../utils/razorpay";
import { formatPrice, getImageUrl, isEnrolled, onImageError, ownsCourse } from "../../utils/imageUrl";

const Coursedescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuth, fetchUser } = UserData();
  const { fetchMyCourse } = CourseData();
  const [course, setCourse] = useState(null);
  const [curriculum, setCurriculum] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get(`/api/course/${id}`);
      setCourse(data.course);
      setCurriculum(data.curriculum || []);
    } catch {
      setCourse(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <PageLoader label="Loading course…" />;
  if (!course)
    return (
      <div className="page container">
        <EmptyState
          icon={BookX}
          title="Course not found"
          text="It may have been removed by the instructor."
          action={
            <Link to="/courses" className="btn btn-primary">
              Browse courses
            </Link>
          }
        />
      </div>
    );

  const owner = ownsCourse(course, user);
  const enrolled = isEnrolled(user, course._id);

  const afterEnroll = async (message) => {
    await Promise.all([fetchUser(), fetchMyCourse()]);
    toast.success(message);
  };

  const checkoutHandler = async () => {
    if (!isAuth) return navigate("/login", { state: { from: `/course/${id}` } });
    setPaying(true);
    try {
      const { data } = await api.post(`/api/course/checkout/${id}`);

      if (data.free) {
        await afterEnroll(data.message);
        navigate(`/lecture/${id}`);
        return;
      }

      if (!(await loadRazorpay())) throw new Error("Couldn't load the payment window. Check your connection.");

      const rzp = new window.Razorpay({
        key: data.key || RAZORPAY_KEY,
        amount: data.order.amount,
        currency: data.order.currency || "INR",
        name: BRAND,
        description: course.title,
        order_id: data.order.id,
        prefill: { name: user?.name, email: user?.email },
        theme: { color: "#0f766e" },
        handler: async (response) => {
          try {
            const { data: res } = await api.post(`/api/verification/${id}`, response);
            await afterEnroll(res.message);
            navigate(`/payment-success/${response.razorpay_payment_id}?course=${id}`);
          } catch (err) {
            toast.error(getErrorMessage(err, "Payment verification failed"));
          } finally {
            setPaying(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPaying(false);
            toast("Payment cancelled");
          },
        },
      });
      rzp.on("payment.failed", (resp) => toast.error(resp.error?.description || "Payment failed"));
      rzp.open();
    } catch (err) {
      toast.error(getErrorMessage(err, "Checkout failed"));
      setPaying(false);
    }
  };

  const cta = owner ? (
    <button className="btn btn-primary btn-lg btn-block" onClick={() => navigate(`/lecture/${course._id}`)}>
      <Settings2 size={18} /> Manage lectures
    </button>
  ) : enrolled ? (
    <button className="btn btn-primary btn-lg btn-block" onClick={() => navigate(`/lecture/${course._id}`)}>
      <PlayCircle size={18} /> Continue learning
    </button>
  ) : user?.role === "admin" ? (
    <p className="muted" style={{ fontSize: 14, textAlign: "center" }}>
      Log in with a student account to enroll in other instructors' courses.
    </p>
  ) : (
    <button className="btn btn-primary btn-lg btn-block" onClick={checkoutHandler} disabled={paying}>
      {paying && <Spinner small />}
      {!isAuth ? "Log in to enroll" : course.price > 0 ? `Enroll for ${formatPrice(course.price)}` : "Enroll for free"}
    </button>
  );

  return (
    <div className="course-detail">
      <section className="cd-hero">
        <div className="container cd-hero-inner">
          <div className="cd-hero-copy fade-up">
            <Link to="/courses" className="back-link">
              <ChevronLeft size={16} /> All courses
            </Link>
            <span className="badge badge-primary">{course.category}</span>
            <h1>{course.title}</h1>
            <p className="cd-desc">{course.description}</p>
            <div className="cd-meta">
              {course.createdBy?.name && (
                <span className="row" style={{ gap: 8 }}>
                  <Avatar name={course.createdBy.name} size={28} /> {course.createdBy.name}
                </span>
              )}
              <span>
                <PlayCircle size={16} /> {curriculum.length} lectures
              </span>
              <span>
                <Clock size={16} /> {course.duration} weeks
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="container cd-body">
        <div className="cd-main">
          <div className="card card-pad">
            <h2 className="cd-h2">Course content</h2>
            <p className="muted" style={{ marginBottom: 16 }}>
              {curriculum.length} {curriculum.length === 1 ? "lecture" : "lectures"} ·{" "}
              {enrolled || owner ? "Click a lecture to start watching" : "Enroll to unlock every lecture"}
            </p>
            {curriculum.length ? (
              <ol className="curriculum">
                {curriculum.map((l, i) => (
                  <li key={l._id}>
                    <span className="curr-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="curr-title">{l.title}</span>
                    {enrolled || owner ? (
                      <Link to={`/lecture/${course._id}?l=${l._id}`} className="curr-icon">
                        <PlayCircle size={18} />
                      </Link>
                    ) : (
                      <Lock size={16} className="curr-icon muted" />
                    )}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="muted">The instructor hasn't uploaded lectures yet.</p>
            )}
          </div>

          <div className="card card-pad">
            <h2 className="cd-h2">What you get</h2>
            <div className="perks">
              <div>
                <InfinityIcon size={20} /> Lifetime access to all lectures
              </div>
              <div>
                <MessageCircleQuestion size={20} /> Ask the instructor your doubts
              </div>
              <div>
                <Sparkles size={20} /> 24/7 AI tutor for instant help
              </div>
              <div>
                <ShieldCheck size={20} /> Secure checkout with Razorpay
              </div>
            </div>
          </div>
        </div>

        <aside className="cd-aside">
          <div className="card buy-card">
            <img src={getImageUrl(course.image)} alt="" onError={onImageError} />
            <div className="buy-body">
              {!enrolled && !owner && <div className="buy-price">{formatPrice(course.price)}</div>}
              {enrolled && <span className="badge badge-success">You're enrolled</span>}
              {owner && <span className="badge badge-primary">You teach this course</span>}
              {cta}
              {enrolled && !owner && (
                <Link to={`/ask-query/${course._id}`} className="btn btn-block">
                  <MessageCircleQuestion size={17} /> Ask a doubt
                </Link>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Coursedescription;
