import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ImagePlus } from "lucide-react";
import api, { getErrorMessage } from "../../api/axios";
import { Modal, SubmitButton } from "../../components/ui";
import { getImageUrl } from "../../utils/imageUrl";

const CATEGORIES = [
  "Web Development",
  "App Development",
  "Data Science",
  "Artificial Intelligence",
  "Design",
  "Game Development",
  "Business",
  "Other",
];

/** Create (no `course`) or edit (with `course`) a course. */
const CourseForm = ({ course, onClose, onSaved }) => {
  const editing = Boolean(course);
  const [form, setForm] = useState({
    title: course?.title || "",
    description: course?.description || "",
    category: course?.category || "",
    price: course?.price ?? "",
    duration: course?.duration ?? "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(course ? getImageUrl(course.image) : "");
  const [loading, setLoading] = useState(false);
  const categories = form.category && !CATEGORIES.includes(form.category) ? [form.category, ...CATEGORIES] : CATEGORIES;

  useEffect(() => () => image && URL.revokeObjectURL(preview), [image, preview]);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onImage = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) return toast.error("Please choose an image");
    setImage(f);
    setPreview(URL.createObjectURL(f));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!editing && !image) return toast.error("Please add a cover image");
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (image) data.append("file", image);

    setLoading(true);
    try {
      const res = editing
        ? await api.put(`/api/course/${course._id}`, data, { skipWakeToast: true, timeout: 0 })
        : await api.post("/api/course/new", data, { skipWakeToast: true, timeout: 0 });
      toast.success(res.data.message);
      onSaved();
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={editing ? "Edit course" : "Create a new course"} onClose={loading ? () => {} : onClose} width={620}>
      <form className="stack" onSubmit={submit}>
        <label className="file-drop" style={{ minHeight: 180 }}>
          <input type="file" accept="image/*" onChange={onImage} />
          {preview ? (
            <img src={preview} alt="Cover preview" />
          ) : (
            <>
              <ImagePlus size={28} />
              <strong>Upload a cover image</strong>
              <span className="field-hint">16:9 works best · JPG, PNG or WebP</span>
            </>
          )}
        </label>
        <div className="field">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" className="input" value={form.title} onChange={change} required />
        </div>
        <div className="field">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            className="textarea"
            rows={4}
            placeholder="What will students learn?"
            value={form.description}
            onChange={change}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" className="select" value={form.category} onChange={change} required>
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <div className="field">
            <label htmlFor="price">Price (₹)</label>
            <input id="price" name="price" type="number" min="0" className="input" value={form.price} onChange={change} required />
            <span className="field-hint">Use 0 for a free course</span>
          </div>
          <div className="field">
            <label htmlFor="duration">Duration (weeks)</label>
            <input id="duration" name="duration" type="number" min="1" className="input" value={form.duration} onChange={change} required />
          </div>
        </div>
        <SubmitButton loading={loading} className="btn btn-primary btn-lg">
          {loading ? "Saving…" : editing ? "Save changes" : "Create course"}
        </SubmitButton>
      </form>
    </Modal>
  );
};

export default CourseForm;
