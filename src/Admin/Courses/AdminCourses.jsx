import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, ListVideo, BookOpen } from "lucide-react";
import api, { getErrorMessage } from "../../api/axios";
import AdminLayout from "../Utils/Layout";
import CourseForm from "./CourseForm";
import CourseCard, { CourseCardSkeleton } from "../../components/CourseCard";
import { EmptyState } from "../../components/ui";
import { CourseData } from "../../context/courseContext";

const AdminCourses = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { mycourse, myLoading, fetchMyCourse, fetchCourses } = CourseData();
  const [editing, setEditing] = useState(null);
  const creating = params.get("new") === "1";

  const refresh = () => Promise.all([fetchMyCourse(), fetchCourses()]);

  const remove = async (course) => {
    if (!confirm(`Delete “${course.title}” and all its lectures? This can't be undone.`)) return;
    try {
      const { data } = await api.delete(`/api/course/${course._id}`);
      toast.success(data.message);
      refresh();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <AdminLayout
      title="My courses"
      subtitle="Create courses, upload lectures and keep your content up to date."
      actions={
        <button className="btn btn-primary" onClick={() => setParams({ new: "1" })}>
          <Plus size={17} /> New course
        </button>
      }
    >
      {myLoading && !mycourse.length ? (
        <div className="grid grid-courses">
          {[1, 2, 3].map((i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      ) : mycourse.length ? (
        <div className="grid grid-courses">
          {mycourse.map((c) => (
            <CourseCard
              key={c._id}
              course={c}
              to={`/course/${c._id}`}
              footer={
                <>
                  <button className="btn btn-sm btn-soft" onClick={() => navigate(`/lecture/${c._id}`)}>
                    <ListVideo size={15} /> Lectures
                  </button>
                  <button className="btn btn-sm" onClick={() => setEditing(c)} aria-label="Edit course">
                    <Pencil size={15} />
                  </button>
                  <button className="btn btn-sm btn-danger" style={{ flex: "none" }} onClick={() => remove(c)} aria-label="Delete course">
                    <Trash2 size={15} />
                  </button>
                </>
              }
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="Create your first course"
          text="Add a title, description and cover image — then upload lectures to it."
          action={
            <button className="btn btn-primary" onClick={() => setParams({ new: "1" })}>
              <Plus size={17} /> New course
            </button>
          }
        />
      )}

      {(creating || editing) && (
        <CourseForm
          course={editing}
          onClose={() => {
            setEditing(null);
            if (creating) setParams({}, { replace: true });
          }}
          onSaved={refresh}
        />
      )}
    </AdminLayout>
  );
};

export default AdminCourses;
