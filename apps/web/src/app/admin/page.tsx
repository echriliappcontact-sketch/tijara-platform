"use client";
import React from "react";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function AdminPage() {
  const [tab, setTab] = useState("dashboard");
  const [data, setData] = useState<any>({});
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [adminNote, setAdminNote] = useState("");
  const [showReceipt, setShowReceipt] = useState("");

  const doLogin = async (e: any) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", loginForm);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setAuth(true);
        loadTab("dashboard");
      }
    } catch (e: any) {
      setErr("Login failed. Check credentials.");
    }
  };

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) { setAuth(true); loadTab("dashboard"); }
  }, []);

  const loadTab = async (t: string) => {
    setTab(t); setMsg(""); setErr(""); setShowReceipt("");
    try {
      const endpoints: any = {
        dashboard: "/admin/dashboard",
        users: "/admin/users",
        stores: "/admin/stores",
        products: "/admin/products",
        orders: "/admin/orders",
        plans: "/admin/plans",
        payments: "/admin/payments",
      };
      const r = await api.get(endpoints[t]);
      setData({ [t]: r.data });
    } catch (e: any) {
      if (e.response?.status === 401) { setAuth(false); localStorage.removeItem("token"); }
    }
  };

  const approvePayment = async (id: string) => {
    setLoading(true); setMsg(""); setErr("");
    try {
      await api.put("/admin/payments/" + id + "/approve", { adminNote });
      setMsg("Payment approved! Store activated!");
      loadTab("payments");
    } catch (e: any) { setErr(e.response?.data?.message || "Failed"); }
    finally { setLoading(false); }
  };

  const rejectPayment = async (id: string) => {
    if (!adminNote) { setErr("Add a note before rejecting"); return; }
    setLoading(true); setMsg(""); setErr("");
    try {
      await api.put("/admin/payments/" + id + "/reject", { adminNote });
      setMsg("Payment rejected.");
      loadTab("payments");
    } catch (e: any) { setErr(e.response?.data?.message || "Failed"); }
    finally { setLoading(false); }
  };

  const deleteItem = async (url: string) => {
    if (!confirm("Delete this?")) return;
    setLoading(true); setMsg(""); setErr("");
    try {
      await api.delete(url);
      setMsg("Deleted!");
      loadTab(tab);
    } catch (e: any) { setErr(e.response?.data?.message || "Failed"); }
    finally { setLoading(false); }
  };

  const activateStore = async (id: string) => {
    setLoading(true);
    try { await api.put("/admin/stores/" + id + "/activate"); setMsg("Store activated!"); loadTab("stores"); }
    catch (e: any) { setErr(e.response?.data?.message || "Failed"); }
    finally { setLoading(false); }
  };

  const suspendStore = async (id: string) => {
    setLoading(true);
    try { await api.put("/admin/stores/" + id + "/suspend"); setMsg("Store suspended!"); loadTab("stores"); }
    catch (e: any) { setErr(e.response?.data?.message || "Failed"); }
    finally { setLoading(false); }
  };

  const badge = (s: string) => {
    const colors: any = { ACTIVE: "#10b981", TRIAL: "#eab308", SUSPENDED: "#dc2626", PENDING: "#eab308", APPROVED: "#10b981", REJECTED: "#dc2626", DRAFT: "#888" };
    return <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: (colors[s] || "#888") + "22", color: colors[s] || "#888" }}>{s}</span>;
  };

  const th: React.CSSProperties = { padding: "10px 12px", textAlign: "left", color: "#888", fontSize: 12, borderBottom: "1px solid #222" };
  const td: React.CSSProperties = { padding: "10px 12px", fontSize: 13, borderBottom: "1px solid #1a1a1a" };
  const btnStyle = (bg: string) => ({ padding: "5px 12px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, background: bg, color: "white" });

  const tabs = [
    ["dashboard", "Dashboard"], ["payments", "Payments"], ["users", "Users"],
    ["stores", "Stores"], ["products", "Products"], ["orders", "Orders"], ["plans", "Plans"],
  ];

  if (!auth) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", padding: 24 }}>
        <div className="card" style={{ maxWidth: 400, width: "100%" }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>Admin Panel</h1>
          {err && <div style={{ background: "#2d1215", border: "1px solid #dc2626", borderRadius: 8, padding: 10, marginBottom: 12, color: "#f87171", fontSize: 13 }}>{err}</div>}
          <form onSubmit={doLogin}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 4 }}>Email</label>
              <input className="input" type="email" value={loginForm.email} onChange={(e: any) => setLoginForm({ ...loginForm, email: e.target.value })} required />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 4 }}>Password</label>
              <input className="input" type="password" value={loginForm.password} onChange={(e: any) => setLoginForm({ ...loginForm, password: e.target.value })} required />
            </div>
            <button type="submit" className="btn-primary" style={{ width: "100%" }}>Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Admin Panel</h1>

      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {tabs.map(([id, label]) => (
          <button key={id} onClick={() => loadTab(id)} style={{ padding: "8px 16px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: tab === id ? "#10b981" : "#1a1a1a", color: tab === id ? "white" : "#888" }}>{label}</button>
        ))}
      </div>

      {msg && <div style={{ background: "#0d2818", border: "1px solid #10b981", borderRadius: 8, padding: 12, marginBottom: 16, color: "#10b981" }}>{msg}</div>}
      {err && <div style={{ background: "#2d1215", border: "1px solid #dc2626", borderRadius: 8, padding: 12, marginBottom: 16, color: "#f87171" }}>{err}</div>}

      {/* Dashboard */}
      {tab === "dashboard" && data.dashboard && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {Object.entries(data.dashboard).map(([key, val]: any) => (
            <div key={key} className="card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#10b981" }}>{typeof val === "number" ? val.toLocaleString() : val}</div>
              <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>{key.replace(/([A-Z])/g, " $1").replace("total", "").trim()}</div>
            </div>
          ))}
        </div>
      )}

      {/* Payments - WITH RECEIPT IMAGE */}
      {tab === "payments" && data.payments && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: "#aaa" }}>Admin Note (for approve/reject): </label>
            <input className="input" value={adminNote} onChange={(e: any) => setAdminNote(e.target.value)} placeholder="Optional note" style={{ width: 300, marginLeft: 8 }} />
          </div>
          <div className="card" style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>
                <th style={th}>Date</th><th style={th}>Store</th><th style={th}>Plan</th>
                <th style={th}>Amount</th><th style={th}>Transaction</th><th style={th}>Receipt</th>
                <th style={th}>Status</th><th style={th}>Actions</th>
              </tr></thead>
              <tbody>
                {data.payments.map((pay: any) => (
                  <tr key={pay.id}>
                    <td style={td}>{new Date(pay.createdAt).toLocaleDateString()}</td>
                    <td style={td}>{pay.store?.name || "-"}</td>
                    <td style={td}>{pay.plan?.name}</td>
                    <td style={td}>{pay.amount?.toLocaleString()} DZD</td>
                    <td style={{ ...td, fontFamily: "monospace", fontSize: 11 }}>{pay.transactionRef}</td>
                    <td style={td}>
                      {pay.receiptUrl ? (
                        <div>
                          <img src={pay.receiptUrl} alt="Receipt" onClick={() => setShowReceipt(pay.receiptUrl)} style={{ width: 50, height: 50, borderRadius: 6, objectFit: "cover", cursor: "pointer", border: "1px solid #333" }} />
                          <div style={{ fontSize: 10, color: "#10b981", marginTop: 2 }}>Click to view</div>
                        </div>
                      ) : <span style={{ color: "#666" }}>No receipt</span>}
                    </td>
                    <td style={td}>{badge(pay.status)}</td>
                    <td style={td}>
                      {pay.status === "PENDING" && (
                        <div style={{ display: "flex", gap: 4 }}>
                          <button onClick={() => approvePayment(pay.id)} disabled={loading} style={btnStyle("#10b981")}>Approve</button>
                          <button onClick={() => rejectPayment(pay.id)} disabled={loading} style={btnStyle("#dc2626")}>Reject</button>
                        </div>
                      )}
                      {pay.status === "APPROVED" && <span style={{ color: "#10b981", fontSize: 12 }}>&#x2713; Approved {pay.reviewedAt ? new Date(pay.reviewedAt).toLocaleDateString() : ""}</span>}
                      {pay.status === "REJECTED" && <span style={{ color: "#dc2626", fontSize: 12 }}>Rejected</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Receipt Modal */}
          {showReceipt && (
            <div onClick={() => setShowReceipt("")} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, cursor: "pointer" }}>
              <img src={showReceipt} alt="Receipt" style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: 12 }} />
            </div>
          )}
        </div>
      )}

      {/* Users */}
      {tab === "users" && data.users && (
        <div className="card" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><th style={th}>Email</th><th style={th}>Name</th><th style={th}>Status</th><th style={th}>Date</th><th style={th}>Actions</th></tr></thead>
            <tbody>
              {data.users.map((u: any) => (
                <tr key={u.id}>
                  <td style={td}>{u.email}</td>
                  <td style={td}>{u.firstName} {u.lastName}</td>
                  <td style={td}>{badge(u.isActive ? "ACTIVE" : "SUSPENDED")}</td>
                  <td style={td}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td style={td}>
                    <button onClick={() => deleteItem("/admin/users/" + u.id)} disabled={loading} style={btnStyle("#dc2626")}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Stores */}
      {tab === "stores" && data.stores && (
        <div className="card" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><th style={th}>Name</th><th style={th}>Slug</th><th style={th}>Owner</th><th style={th}>Status</th><th style={th}>Actions</th></tr></thead>
            <tbody>
              {data.stores.map((s: any) => (
                <tr key={s.id}>
                  <td style={td}>{s.name}</td>
                  <td style={{ ...td, fontFamily: "monospace" }}>/{s.slug}</td>
                  <td style={td}>{s.owner?.email}</td>
                  <td style={td}>{badge(s.status)}</td>
                  <td style={td}>
                    <div style={{ display: "flex", gap: 4 }}>
                      {s.status !== "ACTIVE" && <button onClick={() => activateStore(s.id)} disabled={loading} style={btnStyle("#10b981")}>Activate</button>}
                      {s.status === "ACTIVE" && <button onClick={() => suspendStore(s.id)} disabled={loading} style={btnStyle("#f59e0b")}>Suspend</button>}
                      <button onClick={() => deleteItem("/admin/stores/" + s.id)} disabled={loading} style={btnStyle("#dc2626")}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Products */}
      {tab === "products" && data.products && (
        <div className="card" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><th style={th}>Name</th><th style={th}>Store</th><th style={th}>Price</th><th style={th}>Status</th><th style={th}>Actions</th></tr></thead>
            <tbody>
              {data.products.map((p: any) => (
                <tr key={p.id}>
                  <td style={td}>{p.name}</td>
                  <td style={td}>{p.store?.name}</td>
                  <td style={td}>{p.price?.toLocaleString()} DZD</td>
                  <td style={td}>{badge(p.status)}</td>
                  <td style={td}>
                    <button onClick={() => deleteItem("/admin/products/" + p.id)} disabled={loading} style={btnStyle("#dc2626")}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Orders */}
      {tab === "orders" && data.orders && (
        <div className="card" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><th style={th}>Order #</th><th style={th}>Store</th><th style={th}>Customer</th><th style={th}>Total</th><th style={th}>Status</th><th style={th}>Actions</th></tr></thead>
            <tbody>
              {data.orders.map((o: any) => (
                <tr key={o.id}>
                  <td style={td}>{o.orderNumber}</td>
                  <td style={td}>{o.store?.name}</td>
                  <td style={td}>{o.customerName}</td>
                  <td style={td}>{o.total?.toLocaleString()} DZD</td>
                  <td style={td}>{badge(o.status)}</td>
                  <td style={td}>
                    <button onClick={() => deleteItem("/admin/orders/" + o.id)} disabled={loading} style={btnStyle("#dc2626")}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Plans */}
      {tab === "plans" && data.plans && (
        <div className="card" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><th style={th}>Name</th><th style={th}>Price</th><th style={th}>Duration</th><th style={th}>Products</th><th style={th}>Orders</th><th style={th}>Status</th></tr></thead>
            <tbody>
              {data.plans.map((p: any) => (
                <tr key={p.id}>
                  <td style={td}>{p.name}</td>
                  <td style={td}>{p.price?.toLocaleString()} DZD</td>
                  <td style={td}>{p.duration} days</td>
                  <td style={td}>{p.maxProducts || "Unlimited"}</td>
                  <td style={td}>{p.maxOrders || "Unlimited"}</td>
                  <td style={td}>{badge(p.isActive ? "ACTIVE" : "DRAFT")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}