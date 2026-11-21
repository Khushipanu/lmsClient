import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UserData } from "../../context/UserContext";
import { PageLoader } from "../../components/ui";

// Google OAuth lands here with #token=<access>&refreshToken=<refresh>.
const AuthSuccess = () => {
  const navigate = useNavigate();
  const { loginWithToken } = UserData();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const hash = new URLSearchParams(window.location.hash.slice(1));
    const query = new URLSearchParams(window.location.search);
    const token = hash.get("token") || query.get("token");
    const refreshToken = hash.get("refreshToken");
    window.history.replaceState(null, "", "/auth-success"); // drop the token from the URL bar

    if (!token) {
      navigate("/login?err=google_failed", { replace: true });
      return;
    }

    loginWithToken(token, refreshToken).then((user) => {
      if (user) {
        toast.success(`Welcome, ${user.name?.split(" ")[0] || "there"}!`);
        navigate(user.role === "admin" ? "/admin/dashboard" : "/dashboard", { replace: true });
      } else {
        navigate("/login?err=google_failed", { replace: true });
      }
    });
  }, [loginWithToken, navigate]);

  return <PageLoader label="Signing you in with Google…" />;
};

export default AuthSuccess;
