import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SearchX, RefreshCw, X } from "lucide-react";
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
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <span className="eyebrow">Catalog</span>
            <h1>Explore courses</h1>
            <p>{coursesLoading ? "Loading courses…" : `${courses.length} courses from our instructors`}</p>
          </div>
        </div>

        <div className="toolbar">
          <div className="input-icon toolbar-search">
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
          <select
            className="select toolbar-sort"
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
        </div>

        {categories.length > 2 && (
          <div className="chips" style={{ margin: "18px 0 28px" }}>
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

        <div style={{ marginTop: categories.length > 2 ? 0 : 28 }}>
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
