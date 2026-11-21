import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SearchX, RefreshCw, X, BookOpen, PlayCircle, Layers, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { CourseData } from "../../context/courseContext";
import { UserData } from "../../context/UserContext";
import CourseCard, { CourseCardSkeleton } from "../../components/CourseCard";
import { EmptyState } from "../../components/ui";
import { isEnrolled } from "../../utils/imageUrl";

const SORTS = {
  newest: { label: "Newest", fn: (a, b) => new Date(b.createdAt) - new Date(a.createdAt) },
  "price-asc": { label: "Price: low to high", fn: (a, b) => a.price - b.price },
  "price-desc": { label: "Price: high to low", fn: (a, b) => b.price - a.price },
  popular: { label: "Most lectures", fn: (a, b) => (b.lectureCount || 0) - (a.lectureCount || 0) },
};

const Courses = () => {
  const { courses, coursesLoading, coursesError, fetchCourses } = CourseData();
  const { user } = UserData();
  const [params, setParams] = useSearchParams();
  const search = params.get("q") || "";
  const category = params.get("category") || "All";
  const sort = SORTS[params.get("sort")] ? params.get("sort") : "newest";

  const update = (key, value, empty) => {
    const next = new URLSearchParams(params);
    if (!value || value === empty) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const categories = useMemo(() => {
    const counts = {};
    courses.forEach((c) => c.category && (counts[c.category] = (counts[c.category] || 0) + 1));
    return [["All", courses.length], ...Object.entries(counts)];
  }, [courses]);

  const totalLectures = courses.reduce((n, c) => n + (c.lectureCount || 0), 0);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return courses
      .filter(
        (c) =>
          (category === "All" || c.category === category) &&
          (!q || [c.title, c.description, c.category, c.createdBy?.name].some((v) => v?.toLowerCase().includes(q)))
      )
      .sort(SORTS[sort].fn);
  }, [courses, search, category, sort]);

  return (
    <div className="page catalog-page">
      <div className="container">
        <section className="catalog-hero">
          <div className="catalog-hero-copy">
            <span className="eyebrow">Catalog</span>
            <h1>Explore courses</h1>
            <p>Practical courses from real instructors. Learn at your own pace, ask doubts, and get unstuck with AI.</p>
            <div className="input-icon catalog-search">
              <Search size={18} />
              <input
                className="input"
                placeholder="Search by title, topic or instructor"
                value={search}
                onChange={(e) => update("q", e.target.value)}
                aria-label="Search courses"
              />
              {search && (
                <button className="icon-btn input-action" onClick={() => update("q", "")} aria-label="Clear search">
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
          <div className="catalog-stats">
            <div>
              <BookOpen size={18} />
              <strong>{coursesLoading ? "—" : courses.length}</strong>
              <span>Courses</span>
            </div>
            <div>
              <PlayCircle size={18} />
              <strong>{coursesLoading ? "—" : totalLectures}</strong>
              <span>Lectures</span>
            </div>
            <div>
              <Layers size={18} />
              <strong>{coursesLoading ? "—" : categories.length - 1}</strong>
              <span>Categories</span>
            </div>
            <Link to="/bot" className="catalog-ai">
              <Sparkles size={18} />
              <strong>AI tutor</strong>
              <span>Ask anything →</span>
            </Link>
          </div>
        </section>

        {categories.length > 2 && (
          <div className="chips catalog-chips">
            {categories.map(([name, count]) => (
              <button
                key={name}
                className={`chip ${category === name ? "active" : ""}`}
                onClick={() => update("category", name, "All")}
              >
                {name}
                <span className="count">{count}</span>
              </button>
            ))}
          </div>
        )}

        <div className="catalog-bar">
          <p>
            {coursesLoading ? (
              "Loading courses…"
            ) : (
              <>
                Showing <strong>{filtered.length}</strong> of {courses.length} courses
                {category !== "All" && (
                  <>
                    {" "}
                    in <strong>{category}</strong>
                  </>
                )}
                {search && (
                  <>
                    {" "}
                    for “<strong>{search}</strong>”
                  </>
                )}
              </>
            )}
          </p>
          <label className="catalog-sort">
            <span>Sort by</span>
            <select
              className="select"
              value={sort}
              onChange={(e) => update("sort", e.target.value, "newest")}
              aria-label="Sort courses"
            >
              {Object.entries(SORTS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          {coursesLoading ? (
            <div className="grid grid-courses">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <CourseCardSkeleton key={i} />
              ))}
            </div>
          ) : coursesError && !courses.length ? (
            <EmptyState
              icon={RefreshCw}
              title="Couldn't load courses"
              text="The server might be waking up. Give it a few seconds and try again."
              action={
                <button className="btn btn-primary" onClick={fetchCourses}>
                  Try again
                </button>
              }
            />
          ) : filtered.length ? (
            <div className="grid grid-courses">
              {filtered.map((c) => (
                <CourseCard key={c._id} course={c} enrolled={isEnrolled(user, c._id)} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={SearchX}
              title="No matching courses"
              text="Try a different keyword or category."
              action={
                (search || category !== "All") && (
                  <button className="btn" onClick={() => setParams({}, { replace: true })}>
                    Clear filters
                  </button>
                )
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
