import { NavLink } from "react-router-dom";
import { LayoutDashboard, BookOpen, Users, MessageCircleQuestion } from "lucide-react";

const items = [
  { to: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/course", label: "My courses", icon: BookOpen },
  { to: "/admin/users", label: "Students", icon: Users },
  { to: "/admin/queries", label: "Doubts", icon: MessageCircleQuestion },
];

const AdminLayout = ({ title, subtitle, actions, children }) => (
  <div className="page admin-page">
    <div className="container admin-grid">
      <aside className="admin-side">
        <span className="admin-side-label">Instructor</span>
        <nav>
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className="admin-link">
              <Icon size={18} /> <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <section className="admin-content">
        <div className="page-header">
          <div>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {actions}
        </div>
        {children}
      </section>
    </div>
  </div>
);

export default AdminLayout;
