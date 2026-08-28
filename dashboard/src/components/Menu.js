import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    username: "USERID",
    email: "",
  });

  useEffect(() => {
    // Check if token/user passed in query params
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token");
    const usernameParam = params.get("username");
    const emailParam = params.get("email");

    if (tokenParam) {
      localStorage.setItem("token", tokenParam);
      const userObj = {
        username: usernameParam || "Trader",
        email: emailParam || "",
      };
      localStorage.setItem("user", JSON.stringify(userObj));
      setCurrentUser(userObj);
      // Clean query params from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed && parsed.username) {
            setCurrentUser(parsed);
          }
        } catch (e) {
          console.error("Error parsing user from localStorage", e);
        }
      }
    }
  }, []);

  const handleMenuClick = (index) => {
    setSelectedMenu(index);
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Redirect to frontend signup/login
    window.location.href = "http://localhost:3001/signup";
  };

  const getInitials = (name) => {
    if (!name || name === "USERID") return "TB";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  return (
    <div className="menu-container">
      <img src="logo.png" alt="logo" style={{ width: "50px" }} />
      <div className="menus">
        <ul>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/"
              onClick={() => handleMenuClick(0)}
            >
              <p className={selectedMenu === 0 ? activeMenuClass : menuClass}>
                Dashboard
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/orders"
              onClick={() => handleMenuClick(1)}
            >
              <p className={selectedMenu === 1 ? activeMenuClass : menuClass}>
                Orders
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/holdings"
              onClick={() => handleMenuClick(2)}
            >
              <p className={selectedMenu === 2 ? activeMenuClass : menuClass}>
                Holdings
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/positions"
              onClick={() => handleMenuClick(3)}
            >
              <p className={selectedMenu === 3 ? activeMenuClass : menuClass}>
                Positions
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="funds"
              onClick={() => handleMenuClick(4)}
            >
              <p className={selectedMenu === 4 ? activeMenuClass : menuClass}>
                Funds
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/apps"
              onClick={() => handleMenuClick(6)}
            >
              <p className={selectedMenu === 6 ? activeMenuClass : menuClass}>
                Apps
              </p>
            </Link>
          </li>
        </ul>
        <hr />
        <div style={{ position: "relative" }}>
          <div className="profile" onClick={handleProfileClick}>
            <div className="avatar">{getInitials(currentUser.username)}</div>
            <p className="username">{currentUser.username}</p>
          </div>

          {isProfileDropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "45px",
                right: "0",
                background: "#ffffff",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                borderRadius: "8px",
                padding: "12px 16px",
                minWidth: "180px",
                zIndex: 1000,
                border: "1px solid #eaeaea",
              }}
            >
              <p style={{ margin: "0 0 4px 0", fontWeight: "600", fontSize: "0.85rem", color: "#333" }}>
                {currentUser.username}
              </p>
              {currentUser.email && (
                <p style={{ margin: "0 0 10px 0", fontSize: "0.75rem", color: "#888" }}>
                  {currentUser.email}
                </p>
              )}
              <hr style={{ margin: "8px 0", border: "none", borderTop: "1px solid #f0f0f0", height: "auto" }} />
              <button
                onClick={handleLogout}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#e53e3e",
                  fontSize: "0.85rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  padding: "4px 0",
                  width: "100%",
                  textAlign: "left",
                }}
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
