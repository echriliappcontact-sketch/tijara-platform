"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getStore, getUser, isLoggedIn, setUser as saveUser } from "@/lib/auth";
import { t, isRTL } from "@/lib/i18n";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUserState] = useState<any>(null);
  const [store, setStore] = useState<any>(null);
  const [tab, setTab] = useState("profile");
  const [dir, setDir] = useState("rtl");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({ firstName: "", lastName: "", phone: "" });
  const [newEmail, setNewEmail] = useState("");
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [storeForm, setStoreForm] = useState({ name: "", description: "", phone: "", whatsapp: "", email: "" });

  useEffect(() => {
    setDir(isRTL() ? "rtl" : "ltr");
    if (!isLoggedIn()) { router.push("/login"); return; }
    const u = getUser();
    const s = getStore();
    if (u) {
      setUserState(u);
      setProfile({ firstName: u.firstName || "", lastName: u.lastName || "", phone: u.phone || "" });
      setNewEmail(u.email || "");
    }
    if (s) {
      setStore(s);
      setStoreForm({ name: s.name || "", description: s.description || "", phone: s.phone || "", whatsapp: s.whatsapp || "", email: s.email || "" });
      api.get("/stores/" + s.id).then((r) => {
        setStore(r.data);
        setStoreForm({
          name: r.data.name || "",
          description: r.data.description || "",
          phone: r.data.phone || "",
          whatsapp: r.data.whatsapp || "",
          email: r.data.email || ""
        });
      }).catch(() => {});
    }
  }, [router]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setErr("");
    setLoading(true);
    try {
      const res = await api.put("/users/" + user.id, profile);
      const updated = { ...user, ...res.data };
      saveUser(updated);
      setUserState(updated);
      setMsg("Profile updated!");
    } catch (e: any) {
      setErr(e.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const changeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setErr("");
    setLoading(true);
    try {
      await api.post("/users/" + user.id + "/change-email", { email: newEmail });
      const updated = { ...user, email: newEmail };
      saveUser(updated);
      setUserState(updated);
      setMsg("Email changed!");
    } catch (e: any) {
      setErr(e.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setErr("");
    if (passwords.newPass !== passwords.confirm) {
      setErr("Passwords do not match");
      return;
    }
    if (passwords.newPass.length < 6) {
      setErr("Min 6 characters");
      return;
    }
    setLoading(true);
    try {
      await api.post("/users/" + user.id + "/change-password", {
        currentPassword: passwords.current,
        newPassword: passwords.newPass
      });
      setMsg("Password changed!");
      setPasswords({ current: "", newPass: "", confirm: "" });
    } catch (e: any) {
      setErr(e.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const saveStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setErr("");
    setLoading(true);
    try {
      const res = await api.put("/stores/" + store.id, storeForm);
      setStore(res.data);
      setMsg("Store updated!");
    } catch (e: any) {
      setErr(e.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const tabBtn = (id: string, label: string) => (
    <button
      onClick={() => { setTab(id); setMsg(""); setErr(""); }}
      style={{
        flex: 1, padding: "10px", borderRadius: 8, border: "none", cursor: "pointer",
        fontSize: 14, fontWeight: 600,
        background: tab === id ? "#10b981" : "transparent",
        color: tab === id ? "white" : "#888"
      }}
    >
      {label}
    </button>
  );

  return (
    <div dir={dir} style={{ padding: "30px 24px", maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Settings</h1>

      <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "#111", borderRadius: 10, padding: 4 }}>
        {tabBtn("profile", "Profile")}
        {tabBtn("email", "Email")}
        {tabBtn("password", "Password")}
        {tabBtn("store", "Store")}
      </div>

      {msg && (
        <div style={{ background: "#0d2818", border: "1px solid #10b981", borderRadius: 8, padding: 12, marginBottom: 16, color: "#10b981" }}>
          {msg}
        </div>
      )}
      {err && (
        <div style={{ background: "#2d1215", border: "1px solid #dc2626", borderRadius: 8, padding: 12, marginBottom: 16, color: "#f87171" }}>
          {err}
        </div>
      )}

      {tab === "profile" && (
        <div className="card">
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Profile</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: "white" }}>
              {user?.firstName?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>{user?.firstName} {user?.lastName}</div>
              <div style={{ color: "#888", fontSize: 14 }}>{user?.email}</div>
            </div>
          </div>
          <form onSubmit={saveProfile}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ display: "block", marginBottom: 4, fontSize: 13, color: "#aaa" }}>First Name</label>
                <input className="input" value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 4, fontSize: 13, color: "#aaa" }}>Last Name</label>
                <input className="input" value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 4, fontSize: 13, color: "#aaa" }}>Phone</label>
              <input className="input" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      )}

      {tab === "email" && (
        <div className="card">
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Change Email</h2>
          <div style={{ background: "#1a1a0a", borderRadius: 8, padding: 12, marginBottom: 16, color: "#eab308", fontSize: 13 }}>
            Current: <strong>{user?.email}</strong>
          </div>
          <form onSubmit={changeEmail}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 4, fontSize: 13, color: "#aaa" }}>New Email</label>
              <input className="input" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Change Email"}
            </button>
          </form>
        </div>
      )}

      {tab === "password" && (
        <div className="card">
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Change Password</h2>
          <form onSubmit={changePassword}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", marginBottom: 4, fontSize: 13, color: "#aaa" }}>Current Password</label>
              <input className="input" type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} required />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", marginBottom: 4, fontSize: 13, color: "#aaa" }}>New Password</label>
              <input className="input" type="password" value={passwords.newPass} onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })} required />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 4, fontSize: 13, color: "#aaa" }}>Confirm Password</label>
              <input className="input" type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} required />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Change Password"}
            </button>
          </form>
        </div>
      )}

      {tab === "store" && (
        <div className="card">
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Store Settings</h2>
          <form onSubmit={saveStore}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", marginBottom: 4, fontSize: 13, color: "#aaa" }}>Store Name</label>
              <input className="input" value={storeForm.name} onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })} required />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", marginBottom: 4, fontSize: 13, color: "#aaa" }}>Description</label>
              <textarea className="input" rows={3} value={storeForm.description} onChange={(e) => setStoreForm({ ...storeForm, description: e.target.value })} style={{ resize: "vertical" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ display: "block", marginBottom: 4, fontSize: 13, color: "#aaa" }}>Phone</label>
                <input className="input" value={storeForm.phone} onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 4, fontSize: 13, color: "#aaa" }}>WhatsApp</label>
                <input className="input" value={storeForm.whatsapp} onChange={(e) => setStoreForm({ ...storeForm, whatsapp: e.target.value })} />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 4, fontSize: 13, color: "#aaa" }}>Store Email</label>
              <input className="input" type="email" value={storeForm.email} onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })} />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save Store"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
