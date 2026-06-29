import React, { useState, useMemo } from "react";
import "./courses.css";
import { CourseData } from "../../context/courseContext";
import CourseCard from "../../components/coursescard/CourseCard";
import { Search } from "lucide-react";

const Courses = () => {
  const { courses } = CourseData();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => {
    const list = courses?.map((c) => c.category).filter(Boolean) || [];
    return ["All", ...Array.from(new Set(list))];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return (courses || []).filter((course) => {
      const matchesSearch =
        course.title?.toLowerCase().includes(search.toLowerCase()) ||
        course.description?.toLowerCase().includes(search.toLowerCase()) ||
        course.category?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || course.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [courses, search, category]);

  return (
    <div className="courses">
      <h2>Available Courses</h2>

      <div className="courses-filter">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="category-buttons">
          {categories.map((cat) => (
            <button
              key={cat}
              className={category === cat ? "active" : ""}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="course-container">
        {filteredCourses && filteredCourses.length > 0 ? (
          filteredCourses.map((e) => (
            <CourseCard key={e._id} course={e} showAdminActions={false} />
          ))
        ) : (
          <p className="no-courses">No courses found</p>
        )}
      </div>
    </div>
  );
};

export default Courses;
