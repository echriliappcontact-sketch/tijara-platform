"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function AdminPage() {
  const [tab, setTab] = useState("dashboard");
  const [data, setData] = useState<any>({});
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [adminNote, setAdminNote] = useState("");
  const [auth, setAuth] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [token, setTokenState] = useState("");

  const doLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", loginForm);
      if (res.data.token) {
        setTokenState(res.data.token);
        localStorage.setItem("token", res.data.token);
        setAuth(true);
        loadTab("dashboard");
      }
    } catch (e: any) {
      setErr("Login failed. Use admin@tijara.dz / Admin@123456");
    }
  };

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) { setTokenState(t); setAuth(true); loadTab("dashboard"); }
  }, []);

  const loadTab = async (t: string) => {
    setTab(t); setMsg(""); setErr(""); setShowForm(false); setEditing(null);
    try {
      if (t === "dashboard") { const r = await api.get("/admin/dashboard"); setData({ dashboard: r.data }); }
      if (t === "users") { const r = await api.get("/admin/users"); setData({ users: r.data }); }
      if (t === "stores") { const r = await api.get("/admin/stores"); setData({ stores: r.data }); }
      if (t === "products") { const r = await api.get("/admin/products"); setData({ products: r.data }); }
      if (t === "orders") { const r = await api.get("/admin/orders"); setData({ orders: r.data }); }
      if (t === "plans") { const r = await api.get("/admin/plans"); setData({ plans: r.data }); }
      if (t === "payments") { const r = await api.get("/admin/payments"); setData({ payments: r.data }); }
    } catch (e: any) {
      if (e.response?.status === 401) { setAuth(false); localStorage.removeItem("token"); }
    }
  };

  const doAction = async (method: string, url: string, body?: any) => {
    setMsg(""); setErr(""); setLoading(true);
    try {
      if (method === "post") await api.post(url, body || {});
      if (method === "put") await api.put(url, body || {});
      if (method === "delete") await api.delete(url);
      setMsg("Done!");
      loadTab(tab);
    } catch (e: any) { setErr(e.response?.data?.message || "Failed"); }
    finally { setLoading(false); }
  };

  const savePlan = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setMsg(""); setErr("");
    try {
      if (editing) { await api.put("/admin/plans/" + editing.id, form); setMsg("Plan updated!"); }
      else { await api.post("/admin/plans", form); setMsg("Plan created!"); }
      setShowForm(false); setEditing(null); loadTab("plans");
    } catch (e: any) { setErr(e.response?.data?.message || "Failed"); }
    finally { setLoading(false); }
  };

  const badge = (s: string) => {
    const c: any = { ACTIVE: "#10b981", TRIAL: "#eab308", SUSPENDED: "#dc2626", PENDING: "#eab308", APPROVED: "#10b981", REJECTED: "#dc2626" };
    return React.createElement("span", { style: { padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: (c[s] || "#888") + "22", color: c[s] || "#888" } }, s);
  };

  const th: React.CSSProperties = { padding: "10px 12px", textAlign: "left", color: "#888", fontSize: 12, borderBottom: "1px solid #222" };
  const td: React.CSSProperties = { padding: "10px 12px", fontSize: 13, borderBottom: "1px solid #1a1a1a" };
  const btn = (bg: string, label: string, onClick: () => void) => React.createElement("button", { onClick, disabled: loading, style: { padding: "4px 10px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, background: bg, color: "white" } }, label);
  const tabBtn = (id: string, label: string) => React.createElement("button", { onClick: () => loadTab(id), style: { padding: "8px 14px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: tab === id ? "#10b981" : "#1a1a1a", color: tab === id ? "white" : "#888" } }, label);

  if (!auth) {
    return React.createElement("div", { style: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", padding: 24 } },
      React.createElement("div", { className: "card", style: { maxWidth: 400, width: "100%" } },
        React.createElement("h1", { style: { fontSize: 24, fontWeight: 700, textAlign: "center", marginBottom: 8 } }, "Admin Login"),
        React.createElement("p", { style: { color: "#888", textAlign: "center", marginBottom: 20, fontSize: 13 } }, "admin@tijara.dz / Admin@123456"),
        err && React.createElement("div", { style: { background: "#2d1215", border: "1px solid #dc2626", borderRadius: 8, padding: 10, marginBottom: 12, color: "#f87171", fontSize: 13 } }, err),
        React.createElement("form", { onSubmit: doLogin },
          React.createElement("div", { style: { marginBottom: 12 } },
            React.createElement("label", { style: { display: "block", fontSize: 13, color: "#aaa", marginBottom: 4 } }, "Email"),
            React.createElement("input", { className: "input", type: "email", value: loginForm.email, onChange: (e: any) => setLoginForm({ ...loginForm, email: e.target.value }), required: true })
          ),
          React.createElement("div", { style: { marginBottom: 16 } },
            React.createElement("label", { style: { display: "block", fontSize: 13, color: "#aaa", marginBottom: 4 } }, "Password"),
            React.createElement("input", { className: "input", type: "password", value: loginForm.password, onChange: (e: any) => setLoginForm({ ...loginForm, password: e.target.value }), required: true })
          ),
          React.createElement("button", { type: "submit", className: "btn-primary", style: { width: "100%" } }, "Login")
        )
      )
    );
  }

  const d = data.dashboard;
  const users = data.users || [];
  const stores = data.stores || [];
  const products = data.products || [];
  const orders = data.orders || [];
  const plans = data.plans || [];
  const payments = data.payments || [];

  return React.createElement("div", { style: { padding: "24px", maxWidth: 1200, margin: "0 auto" } },
    React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 } },
      React.createElement("h1", { style: { fontSize: 24, fontWeight: 700 } }, "Admin Panel"),
      React.createElement("button", { onClick: () => { localStorage.removeItem("token"); setAuth(false); }, style: { background: "#dc2626", color: "white", padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12 } }, "Logout")
    ),

    React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" } },
      tabBtn("dashboard", "Dashboard"), tabBtn("users", "Users (" + users.length + ")"), tabBtn("stores", "Stores (" + stores.length + ")"),
      tabBtn("products", "Products"), tabBtn("orders", "Orders"), tabBtn("plans", "Plans"), tabBtn("payments", "Payments")
    ),

    msg && React.createElement("div", { style: { background: "#0d2818", border: "1px solid #10b981", borderRadius: 8, padding: 10, marginBottom: 16, color: "#10b981", fontSize: 13 } }, msg),
    err && React.createElement("div", { style: { background: "#2d1215", border: "1px solid #dc2626", borderRadius: 8, padding: 10, marginBottom: 16, color: "#f87171", fontSize: 13 } }, err),

    // DASHBOARD
    tab === "dashboard" && d && React.createElement("div", null,
      React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 } },
        ...[
          { l: "Users", v: d.totalUsers, c: "#3b82f6" }, { l: "Stores", v: d.totalStores, c: "#8b5cf6" },
          { l: "Products", v: d.totalProducts, c: "#10b981" }, { l: "Orders", v: d.totalOrders, c: "#eab308" },
          { l: "Revenue", v: (d.totalRevenue || 0).toLocaleString() + " DZD", c: "#f59e0b" }, { l: "Pending Payments", v: d.pendingPayments, c: "#dc2626" },
        ].map((item: any, i: number) => React.createElement("div", { key: i, className: "card", style: { textAlign: "center" } },
          React.createElement("div", { style: { fontSize: 28, fontWeight: 800, color: item.c } }, item.v),
          React.createElement("div", { style: { color: "#888", fontSize: 13, marginTop: 4 } }, item.l)
        ))
      )
    ),

    // USERS
    tab === "users" && React.createElement("div", { className: "card", style: { overflowX: "auto" } },
      React.createElement("table", { style: { width: "100%", borderCollapse: "collapse" } },
        React.createElement("thead", null, React.createElement("tr", null,
          React.createElement("th", th, "Name"), React.createElement("th", th, "Email"), React.createElement("th", th, "Status"), React.createElement("th", th, "Actions")
        )),
        React.createElement("tbody", null, users.map((u: any) => React.createElement("tr", { key: u.id },
          React.createElement("td", td, u.firstName, " ", u.lastName),
          React.createElement("td", td, u.email),
          React.createElement("td", td, u.isActive ? badge("ACTIVE") : badge("SUSPENDED")),
          React.createElement("td", td, btn("#dc2626", "Delete", () => doAction("delete", "/admin/users/" + u.id)))
        )))
      )
    ),

    // STORES
    tab === "stores" && React.createElement("div", { className: "card", style: { overflowX: "auto" } },
      React.createElement("table", { style: { width: "100%", borderCollapse: "collapse" } },
        React.createElement("thead", null, React.createElement("tr", null,
          React.createElement("th", th, "Name"), React.createElement("th", th, "Owner"), React.createElement("th", th, "Status"), React.createElement("th", th, "Actions")
        )),
        React.createElement("tbody", null, stores.map((s: any) => React.createElement("tr", { key: s.id },
          React.createElement("td", td, s.name),
          React.createElement("td", td, s.owner?.email),
          React.createElement("td", td, badge(s.status)),
          React.createElement("td", td,
            React.createElement("div", { style: { display: "flex", gap: 4 } },
              s.status !== "ACTIVE" && btn("#10b981", "Activate", () => doAction("post", "/admin/stores/" + s.id + "/activate")),
              s.status === "ACTIVE" && btn("#eab308", "Suspend", () => doAction("post", "/admin/stores/" + s.id + "/suspend")),
              btn("#dc2626", "Delete", () => doAction("delete", "/admin/stores/" + s.id))
            )
          )
        )))
      )
    ),

    // PRODUCTS
    tab === "products" && React.createElement("div", { className: "card", style: { overflowX: "auto" } },
      React.createElement("table", { style: { width: "100%", borderCollapse: "collapse" } },
        React.createElement("thead", null, React.createElement("tr", null,
          React.createElement("th", th, "Name"), React.createElement("th", th, "Store"), React.createElement("th", th, "Price"), React.createElement("th", th, "Stock"), React.createElement("th", th, "Actions")
        )),
        React.createElement("tbody", null, products.map((p: any) => React.createElement("tr", { key: p.id },
          React.createElement("td", td, p.name), React.createElement("td", td, p.store?.name),
          React.createElement("td", td, p.price?.toLocaleString(), " DZD"), React.createElement("td", td, p.stock),
          React.createElement("td", td, btn("#dc2626", "Delete", () => doAction("delete", "/admin/products/" + p.id)))
        )))
      )
    ),

    // ORDERS
    tab === "orders" && React.createElement("div", { className: "card", style: { overflowX: "auto" } },
      React.createElement("table", { style: { width: "100%", borderCollapse: "collapse" } },
        React.createElement("thead", null, React.createElement("tr", null,
          React.createElement("th", th, "Order #"), React.createElement("th", th, "Customer"), React.createElement("th", th, "Total"), React.createElement("th", th, "Status"), React.createElement("th", th, "Actions")
        )),
        React.createElement("tbody", null, orders.map((o: any) => React.createElement("tr", { key: o.id },
          React.createElement("td", td, o.orderNumber), React.createElement("td", td, o.customerName),
          React.createElement("td", td, o.total?.toLocaleString(), " DZD"), React.createElement("td", td, badge(o.status)),
          React.createElement("td", td, btn("#dc2626", "Delete", () => doAction("delete", "/admin/orders/" + o.id)))
        )))
      )
    ),

    // PLANS
    tab === "plans" && React.createElement("div", null,
      React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 } },
        React.createElement("h2", { style: { fontSize: 18, fontWeight: 600 } }, "Subscription Plans"),
        btn("#10b981", "+ Add Plan", () => { setShowForm(true); setEditing(null); setForm({ name: "", slug: "", description: "", price: 0, duration: 30, maxProducts: 50, maxOrders: 200, maxStaff: 1, isPopular: false, sortOrder: 0 }); })
      ),

      (showForm || editing) && React.createElement("div", { className: "card", style: { marginBottom: 20, border: "1px solid #10b981" } },
        React.createElement("h3", { style: { fontSize: 16, fontWeight: 600, marginBottom: 12 } }, editing ? "Edit Plan" : "New Plan"),
        React.createElement("form", { onSubmit: savePlan },
          React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 } },
            React.createElement("div", null,
              React.createElement("label", { style: { display: "block", fontSize: 12, color: "#aaa", marginBottom: 4 } }, "Name"),
              React.createElement("input", { className: "input", value: form.name || "", onChange: (e: any) => setForm({ ...form, name: e.target.value }), required: true })
            ),
            React.createElement("div", null,
              React.createElement("label", { style: { display: "block", fontSize: 12, color: "#aaa", marginBottom: 4 } }, "Slug"),
              React.createElement("input", { className: "input", value: form.slug || "", onChange: (e: any) => setForm({ ...form, slug: e.target.value }), required: true })
            ),
            React.createElement("div", null,
              React.createElement("label", { style: { display: "block", fontSize: 12, color: "#aaa", marginBottom: 4 } }, "Price (DZD)"),
              React.createElement("input", { className: "input", type: "number", value: form.price || 0, onChange: (e: any) => setForm({ ...form, price: Number(e.target.value) }), required: true })
            )
          ),
          React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 12 } },
            React.createElement("div", null,
              React.createElement("label", { style: { display: "block", fontSize: 12, color: "#aaa", marginBottom: 4 } }, "Duration (days)"),
              React.createElement("input", { className: "input", type: "number", value: form.duration || 30, onChange: (e: any) => setForm({ ...form, duration: Number(e.target.value) }) })
            ),
            React.createElement("div", null,
              React.createElement("label", { style: { display: "block", fontSize: 12, color: "#aaa", marginBottom: 4 } }, "Max Products"),
              React.createElement("input", { className: "input", type: "number", value: form.maxProducts || 50, onChange: (e: any) => setForm({ ...form, maxProducts: Number(e.target.value) }) })
            ),
            React.createElement("div", null,
              React.createElement("label", { style: { display: "block", fontSize: 12, color: "#aaa", marginBottom: 4 } }, "Max Orders"),
              React.createElement("input", { className: "input", type: "number", value: form.maxOrders || 200, onChange: (e: any) => setForm({ ...form, maxOrders: Number(e.target.value) }) })
            ),
            React.createElement("div", null,
              React.createElement("label", { style: { display: "block", fontSize: 12, color: "#aaa", marginBottom: 4 } }, "Max Staff"),
              React.createElement("input", { className: "input", type: "number", value: form.maxStaff || 1, onChange: (e: any) => setForm({ ...form, maxStaff: Number(e.target.value) }) })
            )
          ),
          React.createElement("div", { style: { marginBottom: 12 } },
            React.createElement("label", { style: { display: "block", fontSize: 12, color: "#aaa", marginBottom: 4 } }, "Description"),
            React.createElement("input", { className: "input", value: form.description || "", onChange: (e: any) => setForm({ ...form, description: e.target.value }) })
          ),
          React.createElement("div", { style: { marginBottom: 16 } },
            React.createElement("label", { style: { fontSize: 13, color: "#aaa" } },
              React.createElement("input", { type: "checkbox", checked: form.isPopular || false, onChange: (e: any) => setForm({ ...form, isPopular: e.target.checked }), style: { marginRight: 6 } }),
              " Mark as Popular"
            )
          ),
          React.createElement("div", { style: { display: "flex", gap: 8 } },
            React.createElement("button", { type: "submit", className: "btn-primary", disabled: loading }, loading ? "..." : editing ? "Update" : "Create"),
            btn("#333", "Cancel", () => { setShowForm(false); setEditing(null); })
          )
        )
      ),

      React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 } },
        plans.map((plan: any) => React.createElement("div", { key: plan.id, className: "card", style: { border: plan.isPopular ? "2px solid #10b981" : "1px solid #333" } },
          React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 8 } },
            React.createElement("h3", { style: { fontSize: 18, fontWeight: 700 } }, plan.name),
            plan.isPopular && badge("Popular")
          ),
          React.createElement("div", { style: { fontSize: 28, fontWeight: 800, color: "#10b981", marginBottom: 8 } }, plan.price?.toLocaleString(), " DZD"),
          React.createElement("div", { style: { color: "#888", fontSize: 13, lineHeight: 1.8, marginBottom: 12 } },
            React.createElement("div", null, "Duration: ", plan.duration, " days"),
            React.createElement("div", null, "Products: ", plan.maxProducts || "Unlimited"),
            React.createElement("div", null, "Orders: ", plan.maxOrders || "Unlimited"),
            React.createElement("div", null, "Staff: ", plan.maxStaff)
          ),
          React.createElement("div", { style: { display: "flex", gap: 8 } },
            btn("#3b82f6", "Edit", () => { setEditing(plan); setForm({ ...plan }); setShowForm(false); }),
            btn("#dc2626", "Delete", () => doAction("delete", "/admin/plans/" + plan.id))
          )
        ))
      )
    ),

    // PAYMENTS
    tab === "payments" && React.createElement("div", null,
      React.createElement("div", { className: "card", style: { marginBottom: 16, padding: 12, background: "#1a1a0a", border: "1px solid #eab308" } },
        React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center" } },
          React.createElement("span", { style: { color: "#eab308", fontSize: 13 } }, "Admin Note:"),
          React.createElement("input", { className: "input", value: adminNote, onChange: (e: any) => setAdminNote(e.target.value), placeholder: "Note for approve/reject...", style: { flex: 1 } })
        )
      ),
      React.createElement("div", { className: "card", style: { overflowX: "auto" } },
        React.createElement("table", { style: { width: "100%", borderCollapse: "collapse" } },
          React.createElement("thead", null, React.createElement("tr", null,
            React.createElement("th", th, "Date"), React.createElement("th", th, "Store"), React.createElement("th", th, "Plan"),
            React.createElement("th", th, "Amount"), React.createElement("th", th, "Transaction"), React.createElement("th", th, "Status"), React.createElement("th", th, "Actions")
          )),
          React.createElement("tbody", null, payments.map((pay: any) => React.createElement("tr", { key: pay.id },
            React.createElement("td", td, new Date(pay.createdAt).toLocaleDateString()),
            React.createElement("td", td, pay.store?.name),
            React.createElement("td", td, pay.plan?.name),
            React.createElement("td", td, pay.amount?.toLocaleString(), " DZD"),
            React.createElement("td", td, React.createElement("span", { style: { fontFamily: "monospace", fontSize: 12 } }, pay.transactionRef)),
            React.createElement("td", td, badge(pay.status)),
            React.createElement("td", td,
              pay.status === "PENDING" ? React.createElement("div", { style: { display: "flex", gap: 4 } },
                btn("#10b981", "Approve", () => doAction("post", "/admin/payments/" + pay.id + "/approve", { adminNote: adminNote || "Approved" })),
                btn("#dc2626", "Reject", () => { if (!adminNote) { setErr("Add rejection reason"); return; } doAction("post", "/admin/payments/" + pay.id + "/reject", { adminNote }); })
              ) : React.createElement("span", { style: { color: "#555", fontSize: 12 } }, pay.adminNote || "-")
            )
          )))
        )
      )
    )
  );
}