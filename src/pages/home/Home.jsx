import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  PlayCircle,
  Sparkles,
  MessageCircleQuestion,
  ArrowRight,
  BookOpen,
  Users,
  Layers,
  Star,
  GraduationCap,
} from "lucide-react";
import { CourseData } from "../../context/courseContext";
import { UserData } from "../../context/UserContext";
import CourseCard, { CourseCardSkeleton } from "../../components/CourseCard";
import { Avatar, EmptyState } from "../../components/ui";
import { formatPrice, getImageUrl, isEnrolled, onImageError } from "../../utils/imageUrl";

const features = [
  {
    icon: PlayCircle,
    title: "Learn by watching",
    text: "Bite-sized video lectures you can pause, replay and pick up exactly where you left off.",
  },
  {
    icon: Sparkles,
    title: "AI tutor, 24/7",
    text: "Stuck at midnight? Ask the built-in AI tutor to explain a concept or debug your code.",
  },
  {
    icon: MessageCircleQuestion,
    title: "Ask your instructor",
    text: "Raise a doubt on any course and get a direct reply from the person who teaches it.",
  },
];

const testimonials = [
  {
    name: "Rohan Kumar",
    role: "Web Development student",
    text: "I struggled with JavaScript for months. The short lessons and quick doubt replies finally made it click — I now build full-stack apps.",
  },
  {
    name: "Chhavi Bisht",
    role: "AI & ML learner",
    text: "Complex topics were explained so simply. Whenever I got stuck the AI tutor helped me before I even needed to ask.",
  },
  {
    name: "Sonia Singh",
    role: "App Development student",
    text: "The practical lessons helped me publish my first Android app. Learning at my own pace made all the difference.",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const { courses, coursesLoading } = CourseData();
  const { user, isAuth } = UserData();
  const [query, setQuery] = useState("");

  const categories = useMemo(() => [...new Set(courses.map((c) => c.category).filter(Boolean))], [courses]);
  const totalLectures = courses.reduce((n, c) => n + (c.lectureCount || 0), 0);
  const featured = courses.slice(0, 6);
  // Hero: the course with the most lectures, plus a few others as thumbnails.
  const spotlight = useMemo(
    () => [...courses].sort((a, b) => (b.lectureCount || 0) - (a.lectureCount || 0))[0],
    [courses]
  );
  const others = courses.filter((c) => c._id !== spotlight?._id).slice(0, 3);

  const onSearch = (e) => {
    e.preventDefault();
    navigate(`/courses${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`);
  };

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy fade-up">
            <span className="hero-pill">
              <Sparkles size={14} /> Now with a free AI tutor
            </span>
            <h1>
              Learn skills that <span className="hl">actually</span> get you hired.
            </h1>
            <p>
              Practical, project-based courses from real instructors. Watch at your own pace, ask doubts, and get
              unstuck with AI — all in one place.
            </p>
            <form className="hero-search" onSubmit={onSearch}>
              <Search size={20} />
              <input
                placeholder="What do you want to learn?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search courses"
              />
              <button className="btn btn-primary" type="submit">
                Search
              </button>
            </form>
            {categories.length > 0 && (
              <div className="hero-tags">
                <span>Popular:</span>
                {categories.slice(0, 4).map((c) => (
                  <Link key={c} to={`/courses?category=${encodeURIComponent(c)}`}>
                    {c}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="hero-visual fade-up">
            {spotlight ? (
              <Link to={isEnrolled(user, spotlight._id) ? `/lecture/${spotlight._id}` : `/course/${spotlight._id}`} className="hero-card main">
                <div className="hero-card-thumb">
                  <img src={getImageUrl(spotlight.image)} alt="" onError={onImageError} />
                  <span className="hero-card-tag">
                    <Star size={12} fill="currentColor" /> Featured course
                  </span>
                </div>
                <div className="hero-card-body">
                  <span className="hero-card-cat">{spotlight.category}</span>
                  <strong>{spotlight.title}</strong>
                  <div className="hero-card-meta">
                    <span>
                      <PlayCircle size={14} /> {spotlight.lectureCount || 0} lectures
                    </span>
                    {spotlight.createdBy?.name && <span>by {spotlight.createdBy.name}</span>}
                    <b className={!spotlight.price ? "free" : ""}>{formatPrice(spotlight.price)}</b>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="hero-card main hero-card-empty" aria-hidden="true">
                <div className="hero-card-thumb">
                  <GraduationCap size={52} />
                </div>
                <div className="hero-card-body">
                  <strong>{coursesLoading ? "Loading courses…" : "New courses are on the way"}</strong>
                  <span>Instructors are preparing their first lessons.</span>
                </div>
              </div>
            )}

            <Link to="/bot" className="hero-card float-a">
              <Sparkles size={18} />
              <div>
                <strong>Ask the AI tutor</strong>
                <span>Get any concept explained, 24/7 →</span>
              </div>
            </Link>

            {others.length > 0 && (
              <Link to="/courses" className="hero-card float-b">
                <div className="hero-thumbs">
                  {others.map((c) => (
                    <img key={c._id} src={getImageUrl(c.image)} alt="" onError={onImageError} />
                  ))}
                </div>
                <div>
                  <strong>{courses.length} courses</strong>
                  <span>Browse the catalog →</span>
                </div>
              </Link>
            )}
          </div>
        </div>

        <div className="container">
          <div className="stats-bar">
            <div>
              <BookOpen size={20} />
              <strong>{coursesLoading ? "—" : courses.length}</strong>
              <span>Courses</span>
            </div>
            <div>
              <PlayCircle size={20} />
              <strong>{coursesLoading ? "—" : totalLectures}</strong>
              <span>Video lectures</span>
            </div>
            <div>
              <Layers size={20} />
              <strong>{coursesLoading ? "—" : categories.length}</strong>
              <span>Categories</span>
            </div>
            <div>
              <Users size={20} />
              <strong>24/7</strong>
              <span>AI support</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Featured</span>
              <h2>Start learning today</h2>
            </div>
            <Link to="/courses" className="btn btn-ghost">
              Browse all <ArrowRight size={16} />
            </Link>
          </div>
          {coursesLoading ? (
            <div className="grid grid-courses">
              {[1, 2, 3].map((i) => (
                <CourseCardSkeleton key={i} />
              ))}
            </div>
          ) : featured.length ? (
            <div className="grid grid-courses">
              {featured.map((c) => (
                <CourseCard key={c._id} course={c} enrolled={isEnrolled(user, c._id)} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={BookOpen}
              title="No courses yet"
              text="Instructors haven't published any courses yet. Check back soon!"
            />
          )}
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head center">
            <div>
              <span className="eyebrow">Why learn here</span>
              <h2>Everything you need to finish a course</h2>
            </div>
          </div>
          <div className="features">
            {features.map(({ icon: Icon, title, text }) => (
              <div className="feature" key={title}>
                <div className="feature-icon">
                  <Icon size={22} />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <div>
              <span className="eyebrow">Learners love it</span>
              <h2>Real stories from our students</h2>
            </div>
          </div>
          <div className="testimonials">
            {testimonials.map((t) => (
              <figure className="testimonial" key={t.name}>
                <div className="stars" aria-label="5 out of 5 stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" />
                  ))}
                </div>
                <blockquote>“{t.text}”</blockquote>
                <figcaption>
                  <Avatar name={t.name} size={40} />
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {!isAuth && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="cta-band">
              <div>
                <h2>Have something to teach?</h2>
                <p>Create a course, upload your lectures and start helping students today. It's free.</p>
              </div>
              <Link to="/register?role=instructor" className="btn btn-lg cta-btn">
                Become an instructor <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Home;
