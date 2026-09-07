import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to sign in."
        );
      }

      const user = result.data?.user;
      const token = result.data?.token;

      if (!user || !token) {
        throw new Error(
          "Login response is missing authentication details."
        );
      }

      if (user.role !== "admin") {
        throw new Error(
          "You do not have permission to access the admin dashboard."
        );
      }

      localStorage.setItem(
        "lume_admin_token",
        token
      );

      localStorage.setItem(
        "lume_admin_user",
        JSON.stringify(user)
      );

      navigate("/admin");
    } catch (err) {
      console.error(
        "Admin login error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fffaf7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 430,
          background: "#ffffff",
          border: "1px solid #eaded8",
          borderRadius: 20,
          padding: 40,
          boxShadow:
            "0 20px 60px rgba(74, 48, 40, 0.08)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: 34,
          }}
        >
          <div
            style={{
              fontFamily:
                'Georgia, "Times New Roman", serif',
              fontSize: 30,
              letterSpacing: "0.12em",
              color: "#4a3028",
            }}
          >
            LUME
          </div>

          <div
            style={{
              marginTop: 7,
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#8b7770",
            }}
          >
            Beauty Studio
          </div>

          <h1
            style={{
              marginTop: 30,
              marginBottom: 8,
              fontFamily:
                'Georgia, "Times New Roman", serif',
              fontSize: 30,
              fontWeight: 400,
              color: "#35221c",
            }}
          >
            Admin Portal
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: "#8b7770",
            }}
          >
            Sign in to manage your studio.
          </p>
        </div>

        {error && (
          <div
            style={{
              marginBottom: 20,
              padding: "12px 14px",
              borderRadius: 10,
              background: "#f7eee9",
              border: "1px solid #eaded8",
              color: "#6b4b41",
              fontSize: 12,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label
              htmlFor="admin-email"
              style={{
                display: "block",
                marginBottom: 7,
                fontSize: 11,
                fontWeight: 600,
                color: "#4a3028",
              }}
            >
              Email
            </label>

            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="admin@lumebeautystudio.com"
              autoComplete="email"
              style={{
                width: "100%",
                boxSizing: "border-box",
                height: 46,
                padding: "0 14px",
                borderRadius: 10,
                border: "1px solid #eaded8",
                background: "#fffaf7",
                color: "#3f2b25",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label
              htmlFor="admin-password"
              style={{
                display: "block",
                marginBottom: 7,
                fontSize: 11,
                fontWeight: 600,
                color: "#4a3028",
              }}
            >
              Password
            </label>

            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter your password"
              autoComplete="current-password"
              style={{
                width: "100%",
                boxSizing: "border-box",
                height: 46,
                padding: "0 14px",
                borderRadius: 10,
                border: "1px solid #eaded8",
                background: "#fffaf7",
                color: "#3f2b25",
                outline: "none",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              height: 48,
              border: 0,
              borderRadius: 999,
              background: loading
                ? "#6b4b41"
                : "#4a3028",
              color: "#ffffff",
              fontSize: 13,
              fontWeight: 600,
              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}