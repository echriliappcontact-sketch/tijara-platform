"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";

export default function PublicProductPage() {
  const params = useParams();
  const storeSlug = params.slug as string;
  const productSlug = params.productSlug as string;
  const [product, setProduct] = useState<any>(null);
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [showOrder, setShowOrder] = useState(false);
  const [orderForm, setOrderForm] = useState({ customerName: "", customerPhone: "", wilayaCode: "16", commune: "", address: "", deliveryType: "HOME", notes: "" });
  const [ordering, setOrdering] = useState(false);
  const [orderMsg, setOrderMsg] = useState("");
  const [orderErr, setOrderErr] = useState("");
  const [shippingCost, setShippingCost] = useState(0);
  const [deliverySettings, setDeliverySettings] = useState<any[]>([]);

  const wilayas = [
    { code: "01", name: "Adrar" }, { code: "02", name: "Chlef" }, { code: "03", name: "Laghouat" },
    { code: "04", name: "Oum El Bouaghi" }, { code: "05", name: "Batna" }, { code: "06", name: "Bejaia" },
    { code: "07", name: "Biskra" }, { code: "08", name: "Bechar" }, { code: "09", name: "Blida" },
    { code: "10", name: "Bouira" }, { code: "11", name: "Tamanrasset" }, { code: "12", name: "Tebessa" },
    { code: "13", name: "Tlemcen" }, { code: "14", name: "Tiaret" }, { code: "15", name: "Tizi Ouzou" },
    { code: "16", name: "Algiers" }, { code: "17", name: "Djelfa" }, { code: "18", name: "Jijel" },
    { code: "19", name: "Setif" }, { code: "20", name: "Saida" }, { code: "21", name: "Skikda" },
    { code: "22", name: "Sidi Bel Abbes" }, { code: "23", name: "Annaba" }, { code: "24", name: "Guelma" },
    { code: "25", name: "Constantine" }, { code: "26", name: "Medea" }, { code: "27", name: "Mostaganem" },
    { code: "28", name: "Msila" }, { code: "29", name: "Mascara" }, { code: "30", name: "Ouargla" },
    { code: "31", name: "Oran" }, { code: "32", name: "El Bayadh" }, { code: "33", name: "Illizi" },
    { code: "34", name: "Bordj Bou Arreridj" }, { code: "35", name: "Boumerdes" }, { code: "36", name: "El Tarf" },
    { code: "37", name: "Tindouf" }, { code: "38", name: "Tissemsilt" }, { code: "39", name: "El Oued" },
    { code: "40", name: "Khenchela" }, { code: "41", name: "Souk Ahras" }, { code: "42", name: "Tipaza" },
    { code: "43", name: "Mila" }, { code: "44", name: "Ain Defla" }, { code: "45", name: "Naama" },
    { code: "46", name: "Ain Temouchent" }, { code: "47", name: "Ghardaia" }, { code: "48", name: "Relizane" },
    { code: "49", name: "El Mghair" }, { code: "50", name: "El Meniaa" }, { code: "51", name: "Ouled Djellal" },
    { code: "52", name: "Bordj Badji Mokhtar" }, { code: "53", name: "Beni Abbes" }, { code: "54", name: "Timimoun" },
    { code: "55", name: "Touggourt" }, { code: "56", name: "Djanet" }, { code: "57", name: "In Salah" },
    { code: "58", name: "In Guezzam" },
  ];

  useEffect(() => {
    if (!storeSlug || !productSlug) return;
    api.get("/products/by-slug/" + storeSlug + "/" + productSlug).then((r) => {
      setProduct(r.data);
      setStore(r.data.store);
      if (r.data.store?.id) {
        api.get("/stores/" + r.data.store.id + "/delivery").then((dr) => setDeliverySettings(dr.data)).catch(() => {});
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [storeSlug, productSlug]);

  useEffect(() => {
    const delivery = deliverySettings.find((d: any) => d.wilayaCode === orderForm.wilayaCode);
    if (delivery) {
      setShippingCost(orderForm.deliveryType === "STOP_DESK" ? (delivery.stopDeskPrice || 0) : (delivery.homePrice || 0));
    } else { setShippingCost(0); }
  }, [orderForm.wilayaCode, orderForm.deliveryType, deliverySettings]);

  const placeOrder = async (e: any) => {
    e.preventDefault();
    setOrdering(true); setOrderMsg(""); setOrderErr("");
    try {
      await api.post("/orders/public/" + storeSlug, {
        ...orderForm,
        items: [{ productId: product.id, productName: product.name, price: product.price, quantity: qty, image: product.images?.[0]?.url || null }],
      });
      setOrderMsg("Order placed successfully! We will contact you soon.");
      setShowOrder(false);
    } catch (e: any) { setOrderErr(e.response?.data?.message || "Failed to place order"); }
    finally { setOrdering(false); }
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#fff", color: "#666", fontSize: 18 }}>Loading...</div>;
  if (!product) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#fff", color: "#dc2626", fontSize: 18 }}>Product not found</div>;

  const primaryColor = store?.settings?.primaryColor || "#10b981";
  const backgroundColor = store?.settings?.backgroundColor || "#ffffff";
  const textColor = store?.settings?.textColor || "#1a1a1a";
  const total = (product.price || 0) * qty + shippingCost;

  return (
    <div style={{ minHeight: "100vh", background: backgroundColor, color: textColor, fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif" }}>
      {/* Store Header */}
      <header style={{ background: primaryColor, color: "white", padding: "16px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href={"/store/" + storeSlug} style={{ background: "rgba(255,255,255,0.2)", color: "white", padding: "8px 16px", borderRadius: 8, textDecoration: "none", fontWeight: 600, fontSize: 14 }}>
            {"<"} Back to {store?.name || "Store"}
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {store?.logo && <img src={store.logo} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover" }} />}
            <div style={{ fontSize: 18, fontWeight: 700 }}>{store?.name}</div>
          </div>
        </div>
      </header>

      {orderMsg && <div style={{ maxWidth: 1100, margin: "16px auto 0", padding: "0 24px" }}><div style={{ background: "#e8f5e9", border: "1px solid #10b981", borderRadius: 8, padding: 14, color: "#10b981", fontWeight: 600 }}>{orderMsg}</div></div>}

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "30px 24px" }}>
        <div style={{ display: "flex", gap: 30, flexWrap: "wrap" }}>
          {/* Images */}
          <div style={{ flex: 1, minWidth: 300 }}>
            <div style={{ background: "#f5f5f5", borderRadius: 16, overflow: "hidden", marginBottom: 12 }}>
              {product.images?.[selectedImage]?.url ? (
                <img src={product.images[selectedImage].url} alt={product.name} style={{ width: "100%", height: 450, objectFit: "cover" }} />
              ) : (
                <div style={{ height: 450, display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc", fontSize: 64 }}>&#128247;</div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {product.images.map((img: any, i: number) => (
                  <div key={i} onClick={() => setSelectedImage(i)} style={{ width: 75, height: 75, borderRadius: 10, overflow: "hidden", cursor: "pointer", border: selectedImage === i ? "3px solid " + primaryColor : "1px solid #ddd" }}>
                    <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div style={{ flex: 1, minWidth: 300 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12, color: textColor }}>{product.name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 36, fontWeight: 800, color: primaryColor }}>{product.price?.toLocaleString()} DZD</span>
              {product.compareAtPrice && <span style={{ fontSize: 20, color: "#dc2626", textDecoration: "line-through" }}>{product.compareAtPrice?.toLocaleString()} DZD</span>}
            </div>
            {product.description && <p style={{ color: "#666", fontSize: 15, lineHeight: 1.8, marginBottom: 20 }}>{product.description}</p>}
            {product.stock > 0 && <div style={{ color: "#10b981", fontSize: 14, fontWeight: 600, marginBottom: 20 }}>{product.stock} in stock</div>}

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <span style={{ color: "#888", fontSize: 15, fontWeight: 600 }}>Quantity:</span>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 40, height: 40, borderRadius: 8, border: "2px solid #ddd", background: "white", color: "#333", cursor: "pointer", fontSize: 20 }}>-</button>
              <span style={{ fontSize: 22, fontWeight: 700, minWidth: 40, textAlign: "center" }}>{qty}</span>
              <button onClick={() => setQty(qty + 1)} style={{ width: 40, height: 40, borderRadius: 8, border: "2px solid #ddd", background: "white", color: "#333", cursor: "pointer", fontSize: 20 }}>+</button>
            </div>

            <button onClick={() => setShowOrder(true)} style={{ width: "100%", background: primaryColor, color: "white", padding: "18px", borderRadius: 12, border: "none", cursor: "pointer", fontSize: 20, fontWeight: 800, marginBottom: 12 }}>
              Order Now - {((product.price || 0) * qty).toLocaleString()} DZD
            </button>
            <div style={{ color: "#999", fontSize: 13, textAlign: "center" }}>Cash on Delivery Available</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: primaryColor, color: "white", padding: "24px", marginTop: 40 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{store?.name}</div>
          <div style={{ display: "flex", gap: 16 }}>
            {store?.phone && <a href={"tel:" + store.phone} style={{ color: "white", textDecoration: "none", opacity: 0.9 }}>{store.phone}</a>}
            {store?.whatsapp && <a href={"https://wa.me/" + store.whatsapp.replace(/[^0-9]/g, "")} target="_blank" rel="noopener noreferrer" style={{ color: "white", textDecoration: "none", opacity: 0.9 }}>WhatsApp</a>}
          </div>
        </div>
      </footer>

      {/* Order Modal */}
      {showOrder && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: 20 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 30, maxWidth: 520, width: "100%", maxHeight: "90vh", overflow: "auto" }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, color: textColor }}>Complete Your Order</h2>
            {orderErr && <div style={{ background: "#fee2e2", border: "1px solid #dc2626", borderRadius: 8, padding: 10, marginBottom: 12, color: "#dc2626", fontSize: 13 }}>{orderErr}</div>}
            <form onSubmit={placeOrder}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 14, color: "#555", marginBottom: 4, fontWeight: 600 }}>Full Name *</label>
                <input style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "2px solid #e5e7eb", fontSize: 15, outline: "none" }} value={orderForm.customerName} onChange={(e: any) => setOrderForm({ ...orderForm, customerName: e.target.value })} required />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 14, color: "#555", marginBottom: 4, fontWeight: 600 }}>Phone *</label>
                <input style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "2px solid #e5e7eb", fontSize: 15, outline: "none" }} value={orderForm.customerPhone} onChange={(e: any) => setOrderForm({ ...orderForm, customerPhone: e.target.value })} required />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 14, color: "#555", marginBottom: 4, fontWeight: 600 }}>Wilaya *</label>
                  <select style={{ width: "100%", padding: "12px", borderRadius: 8, border: "2px solid #e5e7eb", fontSize: 14, background: "white" }} value={orderForm.wilayaCode} onChange={(e: any) => setOrderForm({ ...orderForm, wilayaCode: e.target.value })}>
                    {wilayas.map((w) => <option key={w.code} value={w.code}>{w.code} - {w.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 14, color: "#555", marginBottom: 4, fontWeight: 600 }}>Delivery</label>
                  <select style={{ width: "100%", padding: "12px", borderRadius: 8, border: "2px solid #e5e7eb", fontSize: 14, background: "white" }} value={orderForm.deliveryType} onChange={(e: any) => setOrderForm({ ...orderForm, deliveryType: e.target.value })}>
                    <option value="HOME">Home Delivery</option>
                    <option value="STOP_DESK">Stop Desk</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 14, color: "#555", marginBottom: 4, fontWeight: 600 }}>Address</label>
                <input style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "2px solid #e5e7eb", fontSize: 15, outline: "none" }} value={orderForm.address} onChange={(e: any) => setOrderForm({ ...orderForm, address: e.target.value })} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 14, color: "#555", marginBottom: 4, fontWeight: 600 }}>Notes</label>
                <input style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "2px solid #e5e7eb", fontSize: 15, outline: "none" }} value={orderForm.notes} onChange={(e: any) => setOrderForm({ ...orderForm, notes: e.target.value })} placeholder="Optional" />
              </div>
              <div style={{ background: "#f9fafb", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14 }}>
                  <span style={{ color: "#666" }}>Subtotal ({qty} x {product.name}):</span>
                  <span style={{ fontWeight: 600 }}>{((product.price || 0) * qty).toLocaleString()} DZD</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14 }}>
                  <span style={{ color: "#666" }}>Shipping:</span>
                  <span style={{ fontWeight: 600 }}>{shippingCost > 0 ? shippingCost.toLocaleString() + " DZD" : "Free"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 18, borderTop: "2px solid #e5e7eb", paddingTop: 10 }}>
                  <span>Total:</span><span style={{ color: primaryColor }}>{total.toLocaleString()} DZD</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button type="submit" disabled={ordering} style={{ flex: 1, background: primaryColor, color: "white", padding: "14px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 16, fontWeight: 700 }}>{ordering ? "Placing..." : "Confirm Order"}</button>
                <button type="button" onClick={() => setShowOrder(false)} style={{ padding: "14px 24px", borderRadius: 10, border: "2px solid #e5e7eb", background: "white", color: "#666", cursor: "pointer", fontSize: 15 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}