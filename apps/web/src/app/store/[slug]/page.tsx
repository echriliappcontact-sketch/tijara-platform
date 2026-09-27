"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";

export default function PublicStorePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!slug) return;
    api.get("/stores/by-slug/" + slug).then((r) => {
      setStore(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#fff", color: "#666", fontSize: 18 }}>Loading...</div>;
  if (!store) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#fff", color: "#dc2626", fontSize: 18 }}>Store not found</div>;

  const primaryColor = store.settings?.primaryColor || "#10b981";
  const backgroundColor = store.settings?.backgroundColor || "#ffffff";
  const textColor = store.settings?.textColor || "#1a1a1a";
  const products = (store.products || []).filter((p: any) => !search || p.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ minHeight: "100vh", background: backgroundColor, color: textColor, fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif" }}>
      <header style={{ background: primaryColor, color: "white", padding: "20px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {store.logo && <img src={store.logo} alt={store.name} style={{ width: 60, height: 60, borderRadius: 12, objectFit: "cover", border: "2px solid rgba(255,255,255,0.3)" }} />}
              <div>
                <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>{store.name}</h1>
                {store.description && <p style={{ margin: "4px 0 0", opacity: 0.9, fontSize: 14 }}>{store.description}</p>}
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              {store.whatsapp && <a href={"https://wa.me/" + store.whatsapp.replace(/[^0-9]/g, "")} target="_blank" rel="noopener noreferrer" style={{ background: "#25D366", color: "white", padding: "10px 20px", borderRadius: 8, textDecoration: "none", fontWeight: 600, fontSize: 14 }}>WhatsApp</a>}
              {store.phone && <a href={"tel:" + store.phone} style={{ background: "rgba(255,255,255,0.2)", color: "white", padding: "10px 20px", borderRadius: 8, textDecoration: "none", fontWeight: 600, fontSize: 14 }}>Call Us</a>}
            </div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: "24px auto 0", padding: "0 24px" }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." style={{ width: "100%", padding: "14px 20px", borderRadius: 10, border: "2px solid " + primaryColor + "33", background: "white", fontSize: 16, color: "#333", outline: "none" }} />
      </div>

      <div style={{ maxWidth: 1200, margin: "24px auto", padding: "0 24px" }}>
        {products.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, color: "#999", fontSize: 18 }}>{search ? "No products match your search" : "No products yet. Check back soon!"}</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {products.map((product: any) => (
              <a key={product.id} href={"/store/" + slug + "/product/" + product.slug} style={{ textDecoration: "none", color: textColor }}>
                <div style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", transition: "transform 0.2s", cursor: "pointer" }}
                  onMouseEnter={(e: any) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; }}
                  onMouseLeave={(e: any) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)"; }}>
                  <div style={{ position: "relative", height: 280, background: "#f5f5f5" }}>
                    {product.images?.[0]?.url ? (
                      <img src={product.images[0].url} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc", fontSize: 48 }}>&#128247;</div>
                    )}
                    {product.compareAtPrice && <div style={{ position: "absolute", top: 12, right: 12, background: "#dc2626", color: "white", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>Sale</div>}
                  </div>
                  <div style={{ padding: 16 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 8", color: textColor, lineHeight: 1.4 }}>{product.name}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 22, fontWeight: 800, color: primaryColor }}>{product.price?.toLocaleString()} DZD</span>
                      {product.compareAtPrice && <span style={{ fontSize: 14, color: "#999", textDecoration: "line-through" }}>{product.compareAtPrice?.toLocaleString()}</span>}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      <footer style={{ background: primaryColor, color: "white", padding: "30px 24px", marginTop: 40 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{store.name}</div>
            {store.description && <div style={{ opacity: 0.8, fontSize: 13, marginTop: 4 }}>{store.description}</div>}
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            {store.phone && <a href={"tel:" + store.phone} style={{ color: "white", textDecoration: "none", opacity: 0.9 }}>{store.phone}</a>}
            {store.whatsapp && <a href={"https://wa.me/" + store.whatsapp.replace(/[^0-9]/g, "")} target="_blank" rel="noopener noreferrer" style={{ color: "white", textDecoration: "none", opacity: 0.9 }}>WhatsApp</a>}
            {store.email && <a href={"mailto:" + store.email} style={{ color: "white", textDecoration: "none", opacity: 0.9 }}>{store.email}</a>}
          </div>
        </div>
      </footer>
    </div>
  );
}