import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LogOut, Mail, Calendar, BookOpen, GraduationCap, LayoutDashboard } from "lucide-react";
import api, { getErrorMessage } from "../../api/axios";
import { UserData } from "../../context/UserContext";
import { CourseData } from "../../context/courseContext";
import { Avatar, SubmitButton } from "../../components/ui";

const Account = () => {
  const navigate = useNavigate();
  const { user, setUser, logout } = UserData();
  const { mycourse } = CourseData();
  const [name, setName] = useState(user?.name || "");
  const [savingName, setSavingName] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [savingPw, setSavingPw] = useState(false);
  const isInstructor = user?.role === "admin";

  const save = async (payload, setBusy, onDone) => {
    setBusy(true);
    try {
      const { data } = await api.put("/api/user/profile", payload);
      setUser(data.user);
      toast.success(data.message);
      onDone?.();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="page">
      <div className="container account-grid">
        <aside className="card card-pad profile-card fade-up">
          <Avatar name={user?.name} src={user?.avatar} size={84} />
          <h2>{user?.name}</h2>
          <span className="badge badge-primary">
            {isInstructor ? <GraduationCap size={13} /> : <BookOpen size={13} />}
            {isInstructor ? "Instructor" : "Student"}
          </span>
          <ul className="profile-facts">
            <li>
              <Mail size={16} /> {user?.email}
            </li>
            {user?.createdAt && (
              <li>
                <Calendar size={16} /> Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })}
              </li>
            )}
            <li>
              <BookOpen size={16} /> {mycourse.length} {isInstructor ? "courses created" : "courses enrolled"}
            </li>
          </ul>
          <Link to={isInstructor ? "/admin/dashboard" : "/dashboard"} className="btn btn-block">
            <LayoutDashboard size={17} /> {isInstructor ? "Instructor dashboard" : "My learning"}
          </Link>
          <button className="btn btn-danger btn-block" onClick={handleLogout}>
            <LogOut size={17} /> Log out
          </button>
        </aside>

        <div className="stack" style={{ gap: 24 }}>
          <section className="card card-pad">
            <h2 className="cd-h2">Profile</h2>
            <form
              className="stack"
              onSubmit={(e) => {
                e.preventDefault();
                save({ name }, setSavingName);
              }}
            >
              <div className="form-row">
                <div className="field">
                  <label htmlFor="name">Full name</label>
                  <input id="name" className="input" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input id="email" className="input" value={user?.email || ""} disabled />
                </div>
              </div>
              <div>
                <SubmitButton loading={savingName} className="btn btn-primary" disabled={savingName || name.trim() === user?.name}>
                  Save changes
                </SubmitButton>
              </div>
            </form>
          </section>

          <section className="card card-pad">
            <h2 className="cd-h2">{user?.hasPassword === false ? "Set a password" : "Change password"}</h2>
            {user?.hasPassword === false && (
              <p className="muted" style={{ marginBottom: 16 }}>
                You signed up with Google. Set a password to also log in with your email.
              </p>
            )}
            <form
              className="stack"
              onSubmit={(e) => {
                e.preventDefault();
                save({ password, currentPassword }, setSavingPw, () => {
                  setPassword("");
                  setCurrentPassword("");
                });
              }}
            >
              <div className="form-row">
                {user?.hasPassword !== false && (
                  <div className="field">
                    <label htmlFor="cur">Current password</label>
                    <input
                      id="cur"
                      type="password"
                      className="input"
                      autoComplete="current-password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                )}
                <div className="field">
                  <label htmlFor="new">New password</label>
                  <input
                    id="new"
                    type="password"
                    className="input"
                    minLength={6}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <SubmitButton loading={savingPw} className="btn btn-primary">
                  Update password
                </SubmitButton>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Account;
