import { Link } from "react-router-dom";
import { Target, Heart, Rocket, ArrowRight } from "lucide-react";
import { BRAND } from "../../config";

const values = [
  { icon: Target, title: "Practical first", text: "Every course is built around real projects and skills you'll actually use." },
  { icon: Heart, title: "Learner focused", text: "Short lessons, clear explanations, and help whenever you get stuck." },
  { icon: Rocket, title: "Open to teach", text: "Anyone with expertise can become an instructor and share what they know." },
];

const About = () => (
  <>
    <section className="hero about-hero">
      <div className="container narrow" style={{ textAlign: "center" }}>
        <span className="eyebrow">About {BRAND}</span>
        <h1 className="about-title">Making quality education simple and accessible.</h1>
        <p className="about-lead">
          {BRAND} is a learning platform where instructors publish video courses and students learn at their own pace —
          with an AI tutor and direct doubt support along the way.
        </p>
      </div>
    </section>
    <section className="section" style={{ paddingTop: 24 }}>
      <div className="container">
        <div className="features">
          {values.map(({ icon: Icon, title, text }) => (
            <div className="feature" key={title}>
              <div className="feature-icon">
                <Icon size={22} />
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
        <div className="about-story card card-pad">
          <h2>How it works</h2>
          <ol className="steps">
            <li>
              <strong>Browse & enroll.</strong> Find a course in the catalog — free courses unlock instantly, paid ones use
              secure Razorpay checkout.
            </li>
            <li>
              <strong>Learn at your pace.</strong> Watch lectures in order, track your progress and come back anytime.
            </li>
            <li>
              <strong>Get unstuck.</strong> Ask the AI tutor for instant explanations, or send a doubt straight to your
              instructor.
            </li>
          </ol>
          <Link to="/courses" className="btn btn-primary" style={{ marginTop: 8 }}>
            Explore courses <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  </>
);

export default About;
