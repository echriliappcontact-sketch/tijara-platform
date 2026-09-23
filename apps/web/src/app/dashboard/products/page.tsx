"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getStore, isLoggedIn } from "@/lib/auth";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", description: "", price: 0, stock: 0, status: "ACTIVE", sku: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const store = getStore();

  useEffect(() => {
    if (!isLoggedIn()) { router.push("/login"); return; }
    loadProducts();
  }, [router]);

  const loadProducts = async () => {
    try {
      const res = await api.get("/products?storeId=" + store?.id);
      setProducts(res.data);
    } catch (e) {}
  };

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg(""); setErr(""); setLoading(true);
    try {
      if (editing) {
        await api.put("/products/" + editing.id, form);
        setMsg("Product updated!");
      } else {
        await api.post("/products", { ...form, storeId: store?.id });
        setMsg("Product created!");
      }
      setShowForm(false); setEditing(null);
      setForm({ name: "", description: "", price: 0, stock: 0, status: "ACTIVE", sku: "" });
      loadProducts();
    } catch (e: any) { setErr(e.response?.data?.message || "Failed"); }
    finally { setLoading(false); }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete("/products/" + id);
      setMsg("Product deleted!");
      loadProducts();
    } catch (e: any) { setErr(e.response?.data?.message || "Failed"); }
  };

  return (
    <div style={{ padding: "30px 24px", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Products</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ name: "", description: "", price: 0, stock: 0, status: "ACTIVE", sku: "" }); }} className="btn-primary">+ Add Product</button>
      </div>

      {msg && <div style={{ background: "#0d2818", border: "1px solid #10b981", borderRadius: 8, padding: 12, marginBottom: 16, color: "#10b981" }}>{msg}</div>}
      {err && <div style={{ background: "#2d1215", border: "1px solid #dc2626", borderRadius: 8, padding: 12, marginBottom: 16, color: "#f87171" }}>{err}</div>}

      {showForm && (
        <div className="card" style={{ marginBottom: 24, border: "1px solid #10b981" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>{editing ? "Edit Product" : "Add New Product"}</h2>
          <form onSubmit={saveProduct}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 4 }}>Product Name</label>
                <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 4 }}>Price (DZD)</label>
                <input className="input" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 4 }}>Stock</label>
                <input className="input" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 4 }}>Description</label>
              <textarea className="input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ resize: "vertical" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 4 }}>SKU</label>
                <input className="input" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 4 }}>Status</label>
                <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="ACTIVE">Active</option>
                  <option value="DRAFT">Draft</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" className="btn-primary" disabled={loading}>{loading ? "..." : editing ? "Update" : "Create"}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} style={{ padding: "10px 20px", borderRadius: 8, border: "1px solid #333", background: "transparent", color: "#aaa", cursor: "pointer" }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card" style={{ overflowX: "auto" }}>
        {products.length === 0 ? (
          <p style={{ color: "#888", textAlign: "center", padding: 40 }}>No products yet. Click "Add Product" to get started!</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ borderBottom: "1px solid #333" }}>
              <th style={{ padding: "12px", textAlign: "left", color: "#888", fontSize: 13 }}>Name</th>
              <th style={{ padding: "12px", textAlign: "left", color: "#888", fontSize: 13 }}>Price</th>
              <th style={{ padding: "12px", textAlign: "left", color: "#888", fontSize: 13 }}>Stock</th>
              <th style={{ padding: "12px", textAlign: "left", color: "#888", fontSize: 13 }}>Status</th>
              <th style={{ padding: "12px", textAlign: "left", color: "#888", fontSize: 13 }}>Actions</th>
            </tr></thead>
            <tbody>
              {products.map((p: any) => (
                <tr key={p.id} style={{ borderBottom: "1px solid #1a1a1a" }}>
                  <td style={{ padding: "12px", fontSize: 14 }}>{p.name}</td>
                  <td style={{ padding: "12px", fontSize: 14 }}>{p.price?.toLocaleString()} DZD</td>
                  <td style={{ padding: "12px", fontSize: 14 }}>{p.stock}</td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: p.status === "ACTIVE" ? "#0d2818" : "#1a1a1a", color: p.status === "ACTIVE" ? "#10b981" : "#888" }}>{p.status}</span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => { setEditing(p); setForm({ name: p.name, description: p.description || "", price: p.price, stock: p.stock, status: p.status, sku: p.sku || "" }); setShowForm(true); }} style={{ padding: "4px 12px", borderRadius: 4, border: "none", background: "#3b82f6", color: "white", cursor: "pointer", fontSize: 12 }}>Edit</button>
                      <button onClick={() => deleteProduct(p.id)} style={{ padding: "4px 12px", borderRadius: 4, border: "none", background: "#dc2626", color: "white", cursor: "pointer", fontSize: 12 }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}