"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { setToken, setUser, setStore } from "@/lib/auth";
import { t, isRTL } from "@/lib/i18n";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dir, setDir] = useState("rtl");

  useEffect(() => { setDir(isRTL() ? "rtl" : "ltr"); }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      setToken(res.data.token);
      setUser(res.data.user);
      if (res.data.store) {
        setStore(res.data.store);
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir={dir} style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", padding: 24 }}>
      <div className="card" style={{ width: "100%", maxWidth: 440 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>{t("auth.login.title")}</h1>
        <p style={{ color: "#888", textAlign: "center", marginBottom: 24 }}>{t("auth.login.desc")}</p>
        {error && <div style={{ background: "#2d1215", border: "1px solid #dc2626", borderRadius: 8, padding: "10px 14px", marginBottom: 16, color: "#f87171", fontSize: 14 }}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 6, fontSize: 14, color: "#aaa" }}>{t("auth.login.email")}</label>
            <input className="input" type="email" name="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", marginBottom: 6, fontSize: 14, color: "#aaa" }}>{t("auth.login.password")}</label>
            <input className="input" type="password" name="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button type="submit" className="btn-primary" style={{ width: "100%", fontSize: 16 }} disabled={loading}>
            {loading ? "..." : t("auth.login.btn")}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: 20, color: "#888", fontSize: 14 }}>
          {t("auth.login.noAccount")}{" "}
          <Link href="/register" style={{ color: "#10b981", textDecoration: "none" }}>{t("auth.login.register")}</Link>
        </p>
      </div>
    </div>
  );
}