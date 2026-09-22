import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MdEmail, MdLock } from "react-icons/md";
import API from "../api/axios";

const Login = () => {
  const COLORS = {
    primary: "#35C7A3",
    primaryHover: "#2DB693",
    background: "#EAFBF5",
    light: "#DFF8F0",
    navy: "#1B2940",
  };
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("Sending login...");
      const { data } = await API.post("/auth/admin/login", form);
      console.log("Response:", data);
      localStorage.setItem("adminToken", data.token);
      console.log("Token saved:", localStorage.getItem("adminToken"));
      toast.success("Welcome back, Admin!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err.response || err);
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
       background:
"linear-gradient(135deg,#EAFBF5 0%,#F8FFFC 50%,#DFF8F0 100%)",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "860px",
          minHeight: "540px",
         borderRadius: "32px",
overflow: "hidden",
boxShadow: "0 30px 80px rgba(30,158,116,0.20)",
border: "1px solid rgba(255,255,255,0.5)",
backdropFilter: "blur(10px)",
        }}
      >
        <div
          style={{
            flex: 1,
            background: "linear-gradient(135deg,#1E9E74,#35C7A3)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "52px 48px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-80px",
              right: "-80px",
              width: "240px",
              height: "240px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-100px",
              left: "-60px",
              width: "280px",
              height: "280px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "42%",
              right: "40px",
              width: "50px",
              height: "50px",
              background: "rgba(255,255,255,0.13)",
              transform: "rotate(45deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "18%",
              left: "40px",
              width: "26px",
              height: "26px",
              background: "rgba(255,255,255,0.10)",
              transform: "rotate(45deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "22%",
              right: "60px",
              width: "18px",
              height: "18px",
              background: "rgba(255,255,255,0.12)",
              transform: "rotate(45deg)",
            }}
          />

         <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "36px",
    position: "relative",
    zIndex: 1,
  }}
>
  <img
    src="https://res.cloudinary.com/dk2novgh2/image/upload/v1774185694/logo_xoaxud.png"
    alt="Aakriti Logo"
    style={{ height: "48px" }}
  />

  <span
    style={{
      fontSize: "28px",
      fontWeight: "700",
      color: "#fff",
      letterSpacing: "2px",
    }}
  >
    AAKRITI
  </span>
</div>
<div
  style={{
    display: "inline-flex",
    alignItems: "center",
    padding: "8px 16px",
    background: "rgba(255,255,255,0.15)",
    borderRadius: "50px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#fff",
    marginBottom: "24px",
    width: "fit-content",
    position: "relative",
    zIndex: 1,
  }}
>
  ✨ Healthcare Verification Platform
</div>
          <h2
            style={{
              color: "#fff",
              fontSize: "34px",
              fontWeight: "600",
              lineHeight: 1.3,
              marginBottom: "16px",
              position: "relative",
              zIndex: 1,
            }}
          > 
          Healthcare Portal
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.80)",
              fontSize: "14px",
              lineHeight: 1.9,
              position: "relative",
              zIndex: 1,
            }}
          >
            Securely verify doctor credentials,
review medical 

            <br />
          certificates, and manage healthcare approvals
from one centralized platform.
          </p>
        </div>

        <div
          style={{
            width: "420px",
            background: "#FFFFFF",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "48px 44px",
          }}
        >
          <h3
            style={{
              fontSize: "24px",
              fontWeight: "600",
              color: COLORS.navy,
              marginBottom: "6px",
            }}
          >
            Sign in
          </h3>
          <p style={{ fontSize: "13px", color: "#888", marginBottom: "32px" }}>
            Enter your admin credentials to continue
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "18px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  color: "#555",
                  fontWeight: "500",
                  marginBottom: "7px",
                }}
              >
                Email address
              </label>
              <div style={{ position: "relative" }}>
                <MdEmail
                  style={{
                    position: "absolute",
                    left: "13px",
                    top: "50%",
                    transform: "translateY(-50%)",
               color: "#94A3B8",
                    fontSize: "18px",
                  }}
                />
                <input
                  type="email"
                  placeholder="admin@doctorplatform.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    padding: "15px 16px 15px 45px",
                    border: "1.5px solid #e8e8e8",
                    borderRadius: "14px",
                    fontSize: "14px",
                    outline: "none",
                    color: COLORS.navy,
                    background: "#F8FFFC",
                    transition: "border 0.2s",
                  }}
                onFocus={(e)=>{
e.target.style.borderColor=COLORS.primary
e.target.style.boxShadow='0 0 0 4px rgba(30,158,116,0.15)'
}}
                  onBlur={(e)=>{
e.target.style.borderColor='#e8e8e8'
e.target.style.boxShadow='none'
}}
                />
              </div>
            </div>

            <div style={{ marginBottom: "28px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  color: "#555",
                  fontWeight: "500",
                  marginBottom: "7px",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <MdLock
                  style={{
                    position: "absolute",
                    left: "13px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94A3B8",
                    fontSize: "18px",
                  }}
                />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "12px 50px 12px 40px",
                    border: "1.5px solid #e8e8e8",
                    borderRadius: "14px",
                    fontSize: "14px",
                    outline: "none",
                    color: COLORS.navy,
                    background: "#F8FFFC",
                    transition: "border 0.2s",
                  }}
              onFocus={(e)=>{
e.target.style.borderColor=COLORS.primary
e.target.style.boxShadow='0 0 0 4px rgba(30,158,116,0.15)'
}}
                  onBlur={(e)=>{
e.target.style.borderColor='#e8e8e8'
e.target.style.boxShadow='none'
}}
                />
                <span
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute",
                    right: "13px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94A3B8",
                    cursor: "pointer",
                    fontSize: "12px",
                    userSelect: "none",
                    fontWeight: "500",
                  }}
                >
                  {showPass ? "Hide" : "Show"}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "16px",
                boxShadow:'0 10px 25px rgba(30,158,116,0.25)',
                background: loading
                  ? "#AEE8D8"
                  : "linear-gradient(135deg,#35C7A3,#2DB693)",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "14px",
                fontSize: "15px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!loading)
                  e.target.style.background =
                    "linear-gradient(135deg,#2DB693,#26A786)";
              }}
              onMouseLeave={(e) => {
                if (!loading)
                  e.target.style.background =
                    "linear-gradient(135deg,#35C7A3,#2DB693)";
              }}
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
