"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getStore, isLoggedIn } from "@/lib/auth";

export default function StoreSettingsPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", description: "", phone: "", whatsapp: "", email: "" });
  const [storeData, setStoreData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const store = getStore();

  useEffect(() => {
    if (!isLoggedIn()) { router.push("/login"); return; }
    if (store?.id) {
      api.get("/stores/" + store.id).then((r) => {
        setStoreData(r.data);
        setForm({ name: r.data.name || "", description: r.data.description || "", phone: r.data.phone || "", whatsapp: r.data.whatsapp || "", email: r.data.email || "" });
      }).catch(() => {});
    }
  }, [router]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg(""); setErr(""); setLoading(true);
    try {
      await api.put("/stores/" + store?.id, form);
      setMsg("Store settings saved!");
    } catch (e: any) { setErr(e.response?.data?.message || "Failed"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ padding: "30px 24px", maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Store Settings</h1>

      {storeData && (
        <div className="card" style={{ marginBottom: 24, background: "#0d2818", border: "1px solid #10b981" }}>
          <h3 style={{ fontSize: 14, color: "#10b981", marginBottom: 8 }}>Your Store Link</h3>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input className="input" value={"https://tijara-platform.vercel.app/store/" + storeData.slug} readOnly style={{ flex: 1, color: "#10b981" }} />
            <button onClick={() => { navigator.clipboard.writeText("https://tijara-platform.vercel.app/store/" + storeData.slug); setMsg("Link copied!"); }} style={{ padding: "10px 16px", borderRadius: 8, border: "none", background: "#10b981", color: "white", cursor: "pointer", fontWeight: 600 }}>Copy</button>
          </div>
          <div style={{ marginTop: 12 }}>
            <a href={"/store/" + storeData.slug} target="_blank" rel="noopener noreferrer" style={{ color: "#10b981", fontSize: 13 }}>View My Store</a>
          </div>
        </div>
      )}

      {msg && <div style={{ background: "#0d2818", border: "1px solid #10b981", borderRadius: 8, padding: 12, marginBottom: 16, color: "#10b981" }}>{msg}</div>}
      {err && <div style={{ background: "#2d1215", border: "1px solid #dc2626", borderRadius: 8, padding: 12, marginBottom: 16, color: "#f87171" }}>{err}</div>}

      <div className="card">
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Store Information</h2>
        <form onSubmit={save}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 4 }}>Store Name</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 4 }}>Description</label>
            <textarea className="input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ resize: "vertical" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 4 }}>Phone</label>
              <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 4 }}>WhatsApp</label>
              <input className="input" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 4 }}>Store Email</label>
            <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? "..." : "Save Store Settings"}</button>
        </form>
      </div>
    </div>
  );
}