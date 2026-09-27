"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getStore, isLoggedIn, setStore } from "@/lib/auth";

export default function StoreSettingsPage() {
  const router = useRouter();
  const [store, setStoreData] = useState<any>(null);
  const [form, setForm] = useState({ name: "", description: "", phone: "", whatsapp: "", email: "", logo: "" });
  const [settings, setSettings] = useState({ primaryColor: "#10b981", backgroundColor: "#ffffff", textColor: "#1a1a1a", fontSize: "16", metaTitle: "", metaDescription: "" });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const localStore = getStore();

  useEffect(() => {
    if (!isLoggedIn()) { router.push("/login"); return; }
    if (localStore?.id) {
      api.get("/stores/" + localStore.id).then((r) => {
        setStoreData(r.data);
        setForm({
          name: r.data.name || "",
          description: r.data.description || "",
          phone: r.data.phone || "",
          whatsapp: r.data.whatsapp || "",
          email: r.data.email || "",
          logo: r.data.logo || "",
        });
        if (r.data.settings) {
          setSettings({
            primaryColor: r.data.settings.primaryColor || "#10b981",
            backgroundColor: r.data.settings.backgroundColor || "#ffffff",
            textColor: r.data.settings.textColor || "#1a1a1a",
            fontSize: r.data.settings.fontSize || "16",
            metaTitle: r.data.settings.metaTitle || "",
            metaDescription: r.data.settings.metaDescription || "",
          });
        }
      }).catch(() => {});
    }
  }, [router]);

  const handleLogoUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setErr("");
    try {
      const reader = new FileReader();
      const result = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res = await api.post("/upload/image", { image: result, folder: "logos" });
      setForm((prev) => ({ ...prev, logo: res.data.url }));
      setMsg("Logo uploaded!");
    } catch (e: any) {
      setErr("Failed to upload logo");
    } finally { setUploading(false); }
  };

  const saveStore = async (e: any) => {
    e.preventDefault(); setLoading(true); setMsg(""); setErr("");
    try {
      await api.put("/stores/" + localStore?.id, form);
      await api.put("/stores/" + localStore?.id + "/settings", settings);
      setStore({ ...localStore, name: form.name, slug: localStore?.slug });
      setMsg("Store settings saved!");
    } catch (e: any) {
      setErr(e.response?.data?.message || "Failed to save");
    } finally { setLoading(false); }
  };

  const copyStoreLink = () => {
    const url = window.location.origin + "/store/" + localStore?.slug;
    navigator.clipboard.writeText(url);
    setMsg("Store link copied!");
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div style={{ padding: "30px 24px", maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Store Settings</h1>

      {msg && <div style={{ background: "#e8f5e9", border: "1px solid #10b981", borderRadius: 8, padding: 12, marginBottom: 16, color: "#10b981" }}>{msg}</div>}
      {err && <div style={{ background: "#fee2e2", border: "1px solid #dc2626", borderRadius: 8, padding: 12, marginBottom: 16, color: "#dc2626" }}>{err}</div>}

      {/* Store Link */}
      <div className="card" style={{ marginBottom: 24, background: "#0d2818", border: "1px solid #10b981" }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Your Store Link</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <code style={{ background: "#1a1a1a", padding: "8px 16px", borderRadius: 6, color: "#10b981", fontSize: 14, flex: 1 }}>
            tijara-platform.vercel.app/store/{localStore?.slug}
          </code>
          <button onClick={copyStoreLink} style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: "#10b981", color: "white", cursor: "pointer", fontWeight: 600 }}>Copy</button>
          <a href={"/store/" + localStore?.slug} target="_blank" rel="noopener noreferrer" style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #10b981", color: "#10b981", textDecoration: "none", fontWeight: 600 }}>View</a>
        </div>
      </div>

      <form onSubmit={saveStore}>
        {/* Store Info */}
        <div className="card" style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Store Information</h2>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 8 }}>Store Logo</label>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: "none" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {form.logo && <img src={form.logo} alt="Logo" style={{ width: 80, height: 80, borderRadius: 12, objectFit: "cover", border: "2px solid #333" }} />}
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} style={{ padding: "10px 20px", borderRadius: 8, border: "1px dashed #10b981", background: "transparent", color: "#10b981", cursor: "pointer", fontSize: 13 }}>
                {uploading ? "Uploading..." : form.logo ? "Change Logo" : "+ Upload Logo"}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 4 }}>Store Name</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 4 }}>Description</label>
            <textarea className="input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ resize: "vertical" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 4 }}>Phone</label>
              <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 4 }}>WhatsApp</label>
              <input className="input" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="213555123456" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 4 }}>Email</label>
              <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="card" style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Store Appearance</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 6 }}>Primary Color</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="color" value={settings.primaryColor} onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })} style={{ width: 44, height: 44, borderRadius: 8, border: "none", cursor: "pointer" }} />
                <input className="input" value={settings.primaryColor} onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })} style={{ width: 100, fontSize: 12 }} />
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 6 }}>Background Color</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="color" value={settings.backgroundColor} onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })} style={{ width: 44, height: 44, borderRadius: 8, border: "none", cursor: "pointer" }} />
                <input className="input" value={settings.backgroundColor} onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })} style={{ width: 100, fontSize: 12 }} />
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 6 }}>Text Color</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="color" value={settings.textColor} onChange={(e) => setSettings({ ...settings, textColor: e.target.value })} style={{ width: 44, height: 44, borderRadius: 8, border: "none", cursor: "pointer" }} />
                <input className="input" value={settings.textColor} onChange={(e) => setSettings({ ...settings, textColor: e.target.value })} style={{ width: 100, fontSize: 12 }} />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div style={{ background: settings.backgroundColor, borderRadius: 12, border: "1px solid #333", overflow: "hidden" }}>
            <div style={{ background: settings.primaryColor, padding: "12px 16px", color: "white", fontWeight: 700, fontSize: 16 }}>
              {form.name || "Your Store Name"}
            </div>
            <div style={{ padding: 16, color: settings.textColor }}>
              <div style={{ background: "white", borderRadius: 8, padding: 12, border: "1px solid #eee" }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Sample Product</div>
                <div style={{ color: settings.primaryColor, fontWeight: 700, fontSize: 18 }}>2,500 DZD</div>
              </div>
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="card" style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>SEO & Meta</h2>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 4 }}>Page Title</label>
            <input className="input" value={settings.metaTitle} onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })} placeholder="My Amazing Store" />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 4 }}>Meta Description</label>
            <textarea className="input" rows={2} value={settings.metaDescription} onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })} style={{ resize: "vertical" }} placeholder="Best products in Algeria..." />
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading || uploading} style={{ padding: "14px 40px", fontSize: 16 }}>
          {loading ? "Saving..." : "Save All Settings"}
        </button>
      </form>
    </div>
  );
}