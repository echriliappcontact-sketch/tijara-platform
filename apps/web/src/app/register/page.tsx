"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { setToken, setUser, setStore } from "@/lib/auth";
import { t, isRTL } from "@/lib/i18n";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", storeName: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dir, setDir] = useState("rtl");

  useEffect(() => { setDir(isRTL() ? "rtl" : "ltr"); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/register", form);
      setToken(res.data.token);
      setUser(res.data.user);
      setStore(res.data.store);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir={dir} style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", padding: 24 }}>
      <div className="card" style={{ width: "100%", maxWidth: 480 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>{t("auth.register.title")}</h1>
        <p style={{ color: "#888", textAlign: "center", marginBottom: 24 }}>{t("auth.register.desc")}</p>
        {error && <div style={{ background: "#2d1215", border: "1px solid #dc2626", borderRadius: 8, padding: "10px 14px", marginBottom: 16, color: "#f87171", fontSize: 14 }}>{error}</div>}
        <form onSubmit={handleRegister}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 14, color: "#aaa" }}>{t("auth.register.firstName")}</label>
              <input className="input" name="firstName" value={form.firstName} onChange={handleChange} required />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 14, color: "#aaa" }}>{t("auth.register.lastName")}</label>
              <input className="input" name="lastName" value={form.lastName} onChange={handleChange} />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 6, fontSize: 14, color: "#aaa" }}>{t("auth.register.storeName")}</label>
            <input className="input" name="storeName" value={form.storeName} onChange={handleChange} required />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 6, fontSize: 14, color: "#aaa" }}>{t("auth.register.email")}</label>
            <input className="input" type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", marginBottom: 6, fontSize: 14, color: "#aaa" }}>{t("auth.register.password")}</label>
            <input className="input" type="password" name="password" value={form.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn-primary" style={{ width: "100%", fontSize: 16 }} disabled={loading}>
            {loading ? "..." : t("auth.register.btn")}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: 20, color: "#888", fontSize: 14 }}>
          {t("auth.register.hasAccount")}{" "}
          <Link href="/login" style={{ color: "#10b981", textDecoration: "none" }}>{t("auth.register.login")}</Link>
        </p>
      </div>
    </div>
  );
}
