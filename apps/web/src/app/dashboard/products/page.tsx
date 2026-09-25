"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getStore, isLoggedIn } from "@/lib/auth";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", description: "", price: 0, compareAtPrice: 0, stock: 0, status: "ACTIVE", sku: "" });
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true); setErr("");
    try {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        await new Promise((resolve, reject) => {
          reader.onload = async () => {
            try {
              const res = await api.post("/upload/image", { image: reader.result, folder: "products" });
              setImages((prev) => [...prev, res.data.url]);
              resolve(null);
            } catch (e) { reject(e); }
          };
          reader.onerror = reject;
          reader.readAsDataURL(files[i]);
        });
      }
    } catch (e: any) {
      setErr("Failed to upload image");
    }
    finally { setUploading(false); }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const setPrimary = (index: number) => {
    const newImages = [...images];
    const selected = newImages.splice(index, 1)[0];
    newImages.unshift(selected);
    setImages(newImages);
  };

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg(""); setErr(""); setLoading(true);
    try {
      const data = { ...form, images };
      if (editing) {
        await api.put("/products/" + editing.id, data);
        setMsg("Product updated!");
      } else {
        await api.post("/products", { ...data, storeId: store?.id });
        setMsg("Product created!");
      }
      setShowForm(false); setEditing(null);
      setForm({ name: "", description: "", price: 0, compareAtPrice: 0, stock: 0, status: "ACTIVE", sku: "" });
      setImages([]);
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

  const copyLink = (product: any) => {
    const url = window.location.origin + "/store/" + store?.slug + "/product/" + product.slug;
    navigator.clipboard.writeText(url);
    setMsg("Product link copied!");
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div style={{ padding: "30px 24px", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Products</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ name: "", description: "", price: 0, compareAtPrice: 0, stock: 0, status: "ACTIVE", sku: "" }); setImages([]); }} className="btn-primary">+ Add Product</button>
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 4 }}>Old Price (optional)</label>
                <input className="input" type="number" value={form.compareAtPrice} onChange={(e) => setForm({ ...form, compareAtPrice: Number(e.target.value) })} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 4 }}>Status</label>
                <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="ACTIVE">Active</option>
                  <option value="DRAFT">Draft</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 4 }}>Description</label>
              <textarea className="input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ resize: "vertical" }} />
            </div>

            {/* IMAGE UPLOAD */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 8 }}>Product Images</label>
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFileSelect} style={{ display: "none" }} />
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} style={{ padding: "10px 20px", borderRadius: 8, border: "1px dashed #10b981", background: "transparent", color: "#10b981", cursor: "pointer", fontSize: 13 }}>
                {uploading ? "Uploading..." : "+ Upload Product Images"}
              </button>
              {images.length > 0 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                  {images.map((url, i) => (
                    <div key={i} style={{ position: "relative", width: 100, height: 100, borderRadius: 8, overflow: "hidden", border: i === 0 ? "2px solid #10b981" : "1px solid #333" }}>
                      <img src={url} alt={"Product image " + (i + 1)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <button type="button" onClick={() => removeImage(i)} style={{ position: "absolute", top: 2, right: 2, width: 20, height: 20, borderRadius: "50%", background: "#dc2626", color: "white", border: "none", cursor: "pointer", fontSize: 11 }}>X</button>
                      {i === 0 && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#10b981", color: "white", fontSize: 9, textAlign: "center", padding: 2 }}>Primary</div>}
                      {i > 0 && <button type="button" onClick={() => setPrimary(i)} style={{ position: "absolute", bottom: 2, left: 2, padding: "2px 6px", borderRadius: 4, background: "#333", color: "#aaa", border: "none", cursor: "pointer", fontSize: 9 }}>Main</button>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" className="btn-primary" disabled={loading || uploading}>{loading ? "Saving..." : editing ? "Update Product" : "Create Product"}</button>
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
              <th style={{ padding: "12px", textAlign: "left", color: "#888", fontSize: 13 }}>Image</th>
              <th style={{ padding: "12px", textAlign: "left", color: "#888", fontSize: 13 }}>Name</th>
              <th style={{ padding: "12px", textAlign: "left", color: "#888", fontSize: 13 }}>Price</th>
              <th style={{ padding: "12px", textAlign: "left", color: "#888", fontSize: 13 }}>Stock</th>
              <th style={{ padding: "12px", textAlign: "left", color: "#888", fontSize: 13 }}>Status</th>
              <th style={{ padding: "12px", textAlign: "left", color: "#888", fontSize: 13 }}>Actions</th>
            </tr></thead>
            <tbody>
              {products.map((prod: any) => (
                <tr key={prod.id} style={{ borderBottom: "1px solid #1a1a1a" }}>
                  <td style={{ padding: "12px" }}>
                    {prod.images?.[0]?.url ? (
                      <img src={prod.images[0].url} alt={prod.name} style={{ width: 50, height: 50, borderRadius: 6, objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: 50, height: 50, borderRadius: 6, background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontSize: 10 }}>No Img</div>
                    )}
                  </td>
                  <td style={{ padding: "12px", fontSize: 14 }}>{prod.name}</td>
                  <td style={{ padding: "12px", fontSize: 14 }}>{prod.price?.toLocaleString()} DZD</td>
                  <td style={{ padding: "12px", fontSize: 14 }}>{prod.stock}</td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: prod.status === "ACTIVE" ? "#0d2818" : "#1a1a1a", color: prod.status === "ACTIVE" ? "#10b981" : "#888" }}>{prod.status}</span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <button onClick={() => { setEditing(prod); setForm({ name: prod.name, description: prod.description || "", price: prod.price, compareAtPrice: prod.compareAtPrice || 0, stock: prod.stock, status: prod.status, sku: prod.sku || "" }); setImages(prod.images?.map((img: any) => img.url) || []); setShowForm(true); }} style={{ padding: "4px 10px", borderRadius: 4, border: "none", background: "#3b82f6", color: "white", cursor: "pointer", fontSize: 11 }}>Edit</button>
                      <button onClick={() => copyLink(prod)} style={{ padding: "4px 10px", borderRadius: 4, border: "none", background: "#10b981", color: "white", cursor: "pointer", fontSize: 11 }}>Copy Link</button>
                      <button onClick={() => deleteProduct(prod.id)} style={{ padding: "4px 10px", borderRadius: 4, border: "none", background: "#dc2626", color: "white", cursor: "pointer", fontSize: 11 }}>Delete</button>
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