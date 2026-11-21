 
import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { X } from "lucide-react";
import { BRAND } from "../config";
import { initials } from "../utils/imageUrl";

export const Logo = ({ to = "/" }) => (
  <Link to={to} className="logo" aria-label={`${BRAND} home`}>
    <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="var(--primary)" />
      <path d="M8 11.5 16 8l8 3.5-8 3.5-8-3.5Z" fill="var(--on-primary)" />
      <path d="M11 14v5c0 1.7 2.2 3 5 3s5-1.3 5-3v-5l-5 2.2L11 14Z" fill="var(--on-primary)" opacity=".85" />
      <path d="M24 11.5v6" stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
    <span>{BRAND}</span>
  </Link>
);

export const Spinner = ({ small }) => <span className={`spinner ${small ? "spinner-sm" : ""}`} aria-hidden="true" />;

export const PageLoader = ({ full, label = "Loading…" }) => (
  <div className={`page-loader ${full ? "full" : ""}`} role="status">
    <div style={{ display: "grid", justifyItems: "center", gap: 14 }}>
      <Spinner />
      <span>{label}</span>
    </div>
  </div>
);

export const EmptyState = ({ icon: Icon, title, text, action }) => (
  <div className="empty-state">
    {Icon && (
      <div className="empty-icon">
        <Icon size={26} />
      </div>
    )}
    {title && <h3>{title}</h3>}
    {text && <p>{text}</p>}
    {action}
  </div>
);

export const Avatar = ({ name, src, size = 36 }) => (
  <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.36 }}>
    {src ? <img src={src} alt="" referrerPolicy="no-referrer" /> : initials(name)}
  </span>
);

export const Modal = ({ title, onClose, children, width }) => {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title} style={width ? { maxWidth: width } : undefined}>
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export const ProtectedRoute = ({ isAuth, allow = true, children }) => {
  if (!isAuth) return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
  if (!allow) return <Navigate to="/" replace />;
  return children;
};

export const SubmitButton = ({ loading, children, className = "btn btn-primary btn-block btn-lg", ...rest }) => (
  <button type="submit" className={className} disabled={loading} {...rest}>
    {loading ? <Spinner small /> : null}
    {children}
  </button>
);
