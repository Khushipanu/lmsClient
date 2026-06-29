import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const CourseContext = createContext();

export const CourseContextProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState(null);
  const [mycourse, setMyCourse] = useState([]);

  async function fetchCourses() {
    try {
      const { data } = await api.get("/api/courses/all");
      setCourses(data.courses);
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchCourse(id) {
    try {
      const { data } = await api.get(`/api/course/${id}`);
      setCourse(data.course);
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchCourseByAdmin(id) {
    try {
      const { data } = await api.get(`/api/admin/course/${id}`);
      setCourse(data.course);
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchMyCourse() {
    try {
      const { data } = await api.get("/api/mycourse");
      setMyCourse(data.courses);
    } catch (err) {
      if (!(err?.response?.status === 401 || err?.response?.status === 403)) {
        console.log(err);
      }
    }
  }

  useEffect(() => {
    fetchCourses();
    if (localStorage.getItem("token")) {
      fetchMyCourse();
    }
  }, []);

  return (
    <CourseContext.Provider
      value={{
        courses,
        fetchCourses,
        fetchCourse,
        course,
        fetchMyCourse,
        mycourse,
        fetchCourseByAdmin,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const CourseData = () => useContext(CourseContext);
