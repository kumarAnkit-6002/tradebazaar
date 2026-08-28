import React, { useState } from "react";
import "./Signup.css";

const BACKEND_URL = "http://localhost:3002";
// Dashboard URL - default to port 3000 or custom origin
const DASHBOARD_URL = "http://localhost:3000";

function Signup() {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorMessage("");
  };

  const handleTabSwitch = (loginState) => {
    setIsLogin(loginState);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Client validation
    if (!formData.email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!formData.password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    if (!isLogin) {
      if (!formData.username.trim()) {
        setErrorMessage("Please choose a username.");
        return;
      }
      if (formData.password.length < 6) {
        setErrorMessage("Password must be at least 6 characters long.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? "/login" : "/signup";
      const payload = isLogin
        ? { email: formData.email.trim(), password: formData.password }
        : {
            username: formData.username.trim(),
            email: formData.email.trim(),
            password: formData.password,
          };

      const res = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Authentication failed. Please try again.");
        setLoading(false);
        return;
      }

      // Save token and user details to localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      setSuccessMessage(
        isLogin
          ? "Login successful! Redirecting to Dashboard..."
          : "Account created successfully! Redirecting to Dashboard..."
      );

      // Redirect to Dashboard
      setTimeout(() => {
        const username = data.user?.username || "";
        const email = data.user?.email || "";
        const token = data.token || "";
        window.location.href = `${DASHBOARD_URL}/?token=${encodeURIComponent(
          token
        )}&username=${encodeURIComponent(username)}&email=${encodeURIComponent(
          email
        )}`;
      }, 1000);
    } catch (err) {
      console.error("Auth error:", err);
      setErrorMessage("Unable to connect to the server. Please ensure backend is running.");
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="auth-wrapper row g-0">
        {/* Left Hero Column */}
        <div className="col-lg-5 auth-left-hero d-none d-lg-flex">
          <img
            src="media/images/signup.png"
            alt="TradeBazaar Ecosystem"
            className="img-fluid"
          />
          <h4 className="fw-bold mb-3" style={{ color: "#1e293b" }}>
            Invest in Everything
          </h4>
          <p className="text-muted mb-4" style={{ fontSize: "0.9rem" }}>
            Join millions of investors and traders on India's premier stock trading
            platform.
          </p>

          <div className="feature-pill">
            <i className="fa-solid fa-bolt"></i>
            <div>
              <h6>Zero Brokerage</h6>
              <p>Free equity delivery and direct mutual funds</p>
            </div>
          </div>

          <div className="feature-pill">
            <i className="fa-solid fa-chart-line"></i>
            <div>
              <h6>Lightning Fast Execution</h6>
              <p>Advanced real-time charting and instant order placement</p>
            </div>
          </div>

          <div className="feature-pill">
            <i className="fa-solid fa-shield-halved"></i>
            <div>
              <h6>Institutional Security</h6>
              <p>Bank-grade encryption protecting your assets</p>
            </div>
          </div>
        </div>

        {/* Right Auth Form Column */}
        <div className="col-lg-7 auth-card">
          {/* Tabs */}
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab-btn ${!isLogin ? "active" : ""}`}
              onClick={() => handleTabSwitch(false)}
            >
              Sign Up
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${isLogin ? "active" : ""}`}
              onClick={() => handleTabSwitch(true)}
            >
              Log In
            </button>
          </div>

          <div className="mb-4">
            <h3 className="fw-bold" style={{ color: "#0f172a" }}>
              {isLogin ? "Welcome Back" : "Open a Free Account"}
            </h3>
            <p className="text-muted" style={{ fontSize: "0.9rem" }}>
              {isLogin
                ? "Enter your credentials to access your trading dashboard."
                : "Sign up now and start investing with zero account maintenance charges."}
            </p>
          </div>

          {/* Error & Success Alerts */}
          {errorMessage && (
            <div className="auth-alert auth-alert-error">
              <i className="fa-solid fa-circle-exclamation"></i>
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="auth-alert auth-alert-success">
              <i className="fa-solid fa-circle-check"></i>
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group-custom">
                <label htmlFor="username">Username / Full Name</label>
                <div className="input-with-icon">
                  <i className="fa-regular fa-user input-icon"></i>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="e.g. rahulsharma"
                    value={formData.username}
                    onChange={handleChange}
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="form-group-custom">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <i className="fa-regular fa-envelope input-icon"></i>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group-custom">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <i className="fa-solid fa-lock input-icon"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  <i
                    className={`fa-regular ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="form-group-custom">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-with-icon">
                  <i className="fa-solid fa-shield-halved input-icon"></i>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn-auth-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  <span>Processing...</span>
                </>
              ) : isLogin ? (
                <>
                  <span>Log In to Dashboard</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </>
              )}
            </button>
          </form>

          <p className="auth-footer-text">
            {isLogin ? (
              <>
                Don't have an account yet?{" "}
                <a href="#signup" onClick={() => handleTabSwitch(false)}>
                  Sign up for free
                </a>
              </>
            ) : (
              <>
                Already have a TradeBazaar account?{" "}
                <a href="#login" onClick={() => handleTabSwitch(true)}>
                  Log in here
                </a>
              </>
            )}
          </p>

          <p className="terms-text">
            By proceeding, you agree to TradeBazaar's Terms of Service and Privacy
            Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
