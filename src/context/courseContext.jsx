import { createContext, useCallback, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { UserData } from "./UserContext";

const CourseContext = createContext();

export const CourseContextProvider = ({ children }) => {
  const { isAuth } = UserData();
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState(false);
  const [mycourse, setMyCourse] = useState([]);
  const [myLoading, setMyLoading] = useState(false);

  const fetchCourses = useCallback(async () => {
    try {
      const { data } = await api.get("/api/courses/all");
      setCourses(data.courses || []);
      setCoursesError(false);
    } catch {
      setCoursesError(true);
    } finally {
      setCoursesLoading(false);
    }
  }, []);

  const fetchMyCourse = useCallback(async () => {
    if (!localStorage.getItem("token")) return setMyCourse([]);
    setMyLoading(true);
    try {
      const { data } = await api.get("/api/mycourse");
      setMyCourse(data.courses || []);
    } catch {
      /* handled by interceptor / empty state */
    } finally {
      setMyLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    if (isAuth) fetchMyCourse();
    else setMyCourse([]);
  }, [isAuth, fetchMyCourse]);

  return (
    <CourseContext.Provider
      value={{ courses, coursesLoading, coursesError, fetchCourses, mycourse, myLoading, fetchMyCourse }}
    >
      {children}
    </CourseContext.Provider>
  );
};

 
export const CourseData = () => useContext(CourseContext);
