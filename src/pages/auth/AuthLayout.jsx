import { PlayCircle, Sparkles, MessageCircleQuestion } from "lucide-react";

const AuthLayout = ({ children }) => (
  <div className="auth-shell">
    <aside className="auth-aside">
      <div>
        <h2>Learn the skills that move your career forward.</h2>
        <p>Practical video courses from real instructors — with an AI tutor and doubt support whenever you get stuck.</p>
        <div className="auth-points">
          <div>
            <PlayCircle /> Watch lessons at your own pace
          </div>
          <div>
            <Sparkles /> Ask the AI tutor anything, 24/7
          </div>
          <div>
            <MessageCircleQuestion /> Get answers from your instructor
          </div>
        </div>
      </div>
      <div className="auth-quote">
        “The lessons are short and practical. I finally finished a course end to end — and built my first project.”
        <strong>Ananya, Web Development student</strong>
      </div>
    </aside>
    <div className="auth-main">
      <div className="auth-card fade-up">{children}</div>
    </div>
  </div>
);

export default AuthLayout;
