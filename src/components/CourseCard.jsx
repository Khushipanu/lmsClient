import { Link } from "react-router-dom";
import { Clock, PlayCircle, CheckCircle2 } from "lucide-react";
import { formatPrice, getImageUrl, onImageError } from "../utils/imageUrl";

const CourseCard = ({ course, enrolled, footer, to }) => {
  const instructor = course.createdBy?.name;
  const href = to || (enrolled ? `/lecture/${course._id}` : `/course/${course._id}`);

  return (
    <article className="course-card fade-up">
      <Link to={href} className="course-card-link" aria-label={course.title}>
        <div className="course-thumb">
          <img src={getImageUrl(course.image)} alt="" loading="lazy" onError={onImageError} />
          {course.category && <span className="course-cat">{course.category}</span>}
        </div>
        <div className="course-body">
          <h3>{course.title}</h3>
          {instructor && <p className="course-instructor">by {instructor}</p>}
          <div className="course-meta">
            <span>
              <PlayCircle size={15} /> {course.lectureCount ?? 0} lectures
            </span>
            <span>
              <Clock size={15} /> {course.duration} {Number(course.duration) === 1 ? "week" : "weeks"}
            </span>
          </div>
          <div className="course-foot">
            {enrolled ? (
              <span className="badge badge-success">
                <CheckCircle2 size={13} /> Enrolled
              </span>
            ) : (
              <span className={`course-price ${!course.price ? "free" : ""}`}>{formatPrice(course.price)}</span>
            )}
            <span className="course-cta">{enrolled ? "Continue →" : "View course →"}</span>
          </div>
        </div>
      </Link>
      {footer && <div className="course-card-actions">{footer}</div>}
    </article>
  );
};

export const CourseCardSkeleton = () => (
  <div className="course-card">
    <div className="skeleton" style={{ aspectRatio: "16/9", borderRadius: 0 }} />
    <div className="course-body">
      <div className="skeleton" style={{ height: 20, width: "85%" }} />
      <div className="skeleton" style={{ height: 14, width: "45%", marginTop: 10 }} />
      <div className="skeleton" style={{ height: 14, width: "60%", marginTop: 18 }} />
    </div>
  </div>
);

export default CourseCard;
