import { Link, useLocation } from "react-router-dom";
import { Sparkles } from "lucide-react";

// Pages where a floating chat button would be in the way.
const HIDDEN = [/^\/bot/, /^\/login/, /^\/register/, /^\/verify/, /^\/forgot/, /^\/reset-password/, /^\/auth-success/];

/** Floating "Ask AI" button so the AI tutor is one click away on every page. */
const AiFab = () => {
  const { pathname } = useLocation();
  if (HIDDEN.some((re) => re.test(pathname))) return null;

  return (
    <Link to="/bot" className="ai-fab" aria-label="Open the AI tutor">
      <span className="ai-fab-icon">
        <Sparkles size={20} />
      </span>
      <span className="ai-fab-label">Ask AI tutor</span>
    </Link>
  );
};

export default AiFab;
