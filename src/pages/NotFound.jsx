import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { EmptyState } from "../components/ui";

const NotFound = () => (
  <div className="page">
    <div className="container narrow">
      <EmptyState
        icon={Compass}
        title="Page not found"
        text="The page you're looking for doesn't exist or has moved."
        action={
          <Link to="/" className="btn btn-primary">
            Back to home
          </Link>
        }
      />
    </div>
  </div>
);

export default NotFound;
