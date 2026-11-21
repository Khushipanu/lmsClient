import { Link } from "react-router-dom";
import { Clock, PlayCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { Avatar } from "./ui";
import { formatPrice, getImageUrl, onImageError } from "../utils/imageUrl";

const isNew = (createdAt) => createdAt && Date.now() - new Date(createdAt).getTime() < 14 * 24 * 60 * 60 * 1000;

const CourseCard = ({ course, enrolled, footer, to }) => {
  const instructor = course.createdBy?.name;
  const href = to || (enrolled ? `/lecture/${course._id}` : `/course/${course._id}`);
  const free = !course.price || Number(course.price) <= 0;
  const lectures = course.lectureCount ?? 0;
  const weeks = Number(course.duration) || 0;

  return (
    <article className="course-card fade-up">
      <Link to={href} className="course-card-link" aria-label={course.title}>
        <div className="course-thumb">
          <img src={getImageUrl(course.image)} alt="" loading="lazy" onError={onImageError} />
          <div className="course-thumb-tags">
            {course.category && <span className="course-cat">{course.category}</span>}
            {isNew(course.createdAt) && <span className="course-flag">New</span>}
          </div>
          {enrolled ? (
            <span className="course-ribbon enrolled">
              <CheckCircle2 size={13} /> Enrolled
            </span>
          ) : (
            free && <span className="course-ribbon free">Free</span>
          )}
        </div>

        <div className="course-body">
          <h3>{course.title}</h3>
          {course.description && <p className="course-desc">{course.description}</p>}

          {instructor && (
            <div className="course-instructor">
              <Avatar name={instructor} size={24} />
              <span>{instructor}</span>
            </div>
          )}

          <div className="course-meta">
            <span>
              <PlayCircle size={14} /> {lectures} {lectures === 1 ? "lecture" : "lectures"}
            </span>
            {weeks > 0 && (
              <span>
                <Clock size={14} /> {weeks} {weeks === 1 ? "week" : "weeks"}
              </span>
            )}
          </div>

          <div className="course-foot">
            {enrolled ? (
              <span className="course-progress-label">Continue learning</span>
            ) : (
              <span className={`course-price ${free ? "free" : ""}`}>{formatPrice(course.price)}</span>
            )}
            <span className="course-cta" aria-hidden="true">
              {enrolled ? "Resume" : "View"} <ArrowRight size={15} />
            </span>
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
      <div className="skeleton" style={{ height: 13, width: "100%", marginTop: 12 }} />
      <div className="skeleton" style={{ height: 13, width: "70%", marginTop: 6 }} />
      <div className="skeleton" style={{ height: 24, width: "45%", marginTop: 16 }} />
      <div className="skeleton" style={{ height: 22, width: "35%", marginTop: 18 }} />
    </div>
  </div>
);

export default CourseCard;
