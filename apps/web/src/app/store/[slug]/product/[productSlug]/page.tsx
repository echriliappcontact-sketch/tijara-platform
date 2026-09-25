"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";

export default function PublicProductPage() {
  const params = useParams();
  const router = useRouter();
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
        api.get("/stores/" + r.data.store.id + "/delivery").then((dr) => {
          setDeliverySettings(dr.data);
        }).catch(() => {});
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [storeSlug, productSlug]);

  useEffect(() => {
    const delivery = deliverySettings.find((d: any) => d.wilayaCode === orderForm.wilayaCode);
    if (delivery) {
      setShippingCost(orderForm.deliveryType === "STOP_DESK" ? (delivery.stopDeskPrice || 0) : (delivery.homePrice || 0));
    } else {
      setShippingCost(0);
    }
  }, [orderForm.wilayaCode, orderForm.deliveryType, deliverySettings]);

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrdering(true); setOrderMsg(""); setOrderErr("");
    try {
      await api.post("/orders/public/" + storeSlug, {
        ...orderForm,
        items: [{
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity: qty,
          image: product.images?.[0]?.url || null,
        }],
      });
      setOrderMsg("Order placed successfully! The store will contact you soon.");
      setShowOrder(false);
    } catch (e: any) {
      setOrderErr(e.response?.data?.message || "Failed to place order");
    } finally {
      setOrdering(false);
    }
  };

  const total = (product?.price || 0) * qty + shippingCost;

  if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", color: "#888" }}>Loading...</div>;
  if (!product) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", color: "#dc2626" }}>Product not found</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a" }}>
      <div style={{ background: "#111", borderBottom: "1px solid #222", padding: "16px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => router.push("/store/" + storeSlug)} style={{ background: "transparent", border: "none", color: "#10b981", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
            {"<"} Back to {store?.name || "Store"}
          </button>
          <div style={{ color: "#888", fontSize: 13 }}>{store?.name}</div>
        </div>
      </div>

      {orderMsg && <div style={{ maxWidth: 1000, margin: "16px auto 0", padding: "0 24px" }}><div style={{ background: "#0d2818", border: "1px solid #10b981", borderRadius: 8, padding: 12, color: "#10b981" }}>{orderMsg}</div></div>}

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "30px 24px" }}>
        <div style={{ display: "flex", gap: 30, flexWrap: "wrap" }}>
          {/* Images */}
          <div style={{ flex: 1, minWidth: 300 }}>
            <div style={{ background: "#1a1a1a", borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
              {product.images?.[selectedImage]?.url ? (
                <img src={product.images[selectedImage].url} alt={product.name} style={{ width: "100%", height: 400, objectFit: "cover" }} />
              ) : (
                <div style={{ height: 400, display: "flex", alignItems: "center", justifyContent: "center", color: "#555" }}>No Image</div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {product.images.map((img: any, i: number) => (
                  <div key={i} onClick={() => setSelectedImage(i)} style={{ width: 70, height: 70, borderRadius: 8, overflow: "hidden", cursor: "pointer", border: selectedImage === i ? "2px solid #10b981" : "1px solid #333" }}>
                    <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div style={{ flex: 1, minWidth: 300 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>{product.name}</h1>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#10b981", marginBottom: 8 }}>
              {product.price?.toLocaleString()} DZD
              {product.compareAtPrice && (
                <span style={{ fontSize: 18, color: "#dc2626", textDecoration: "line-through", marginLeft: 12 }}>{product.compareAtPrice?.toLocaleString()} DZD</span>
              )}
            </div>
            {product.description && (
              <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.8, marginBottom: 20 }}>{product.description}</p>
            )}
            {product.stock !== undefined && product.stock > 0 && (
              <div style={{ color: "#10b981", fontSize: 13, marginBottom: 16 }}>{product.stock} in stock</div>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <span style={{ color: "#888", fontSize: 13 }}>Quantity:</span>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 36, height: 36, borderRadius: 6, border: "1px solid #333", background: "transparent", color: "#ccc", cursor: "pointer", fontSize: 18 }}>-</button>
              <span style={{ fontSize: 18, fontWeight: 600, minWidth: 30, textAlign: "center" }}>{qty}</span>
              <button onClick={() => setQty(qty + 1)} style={{ width: 36, height: 36, borderRadius: 6, border: "1px solid #333", background: "transparent", color: "#ccc", cursor: "pointer", fontSize: 18 }}>+</button>
            </div>

            <button onClick={() => setShowOrder(true)} style={{ width: "100%", background: "#10b981", color: "white", padding: "16px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
              Order Now - {((product.price || 0) * qty).toLocaleString()} DZD
            </button>
            <div style={{ color: "#888", fontSize: 12, textAlign: "center" }}>Cash on Delivery Available</div>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {showOrder && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: 20 }}>
          <div style={{ background: "#111", borderRadius: 12, border: "1px solid #333", padding: 30, maxWidth: 500, width: "100%", maxHeight: "90vh", overflow: "auto" }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Complete Your Order</h2>
            {orderErr && <div style={{ background: "#2d1215", border: "1px solid #dc2626", borderRadius: 8, padding: 10, marginBottom: 12, color: "#f87171", fontSize: 13 }}>{orderErr}</div>}
            <form onSubmit={placeOrder}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 4 }}>Full Name *</label>
                <input className="input" value={orderForm.customerName} onChange={(e) => setOrderForm({ ...orderForm, customerName: e.target.value })} required />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 4 }}>Phone *</label>
                <input className="input" value={orderForm.customerPhone} onChange={(e) => setOrderForm({ ...orderForm, customerPhone: e.target.value })} required />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 4 }}>Wilaya *</label>
                  <select className="input" value={orderForm.wilayaCode} onChange={(e) => setOrderForm({ ...orderForm, wilayaCode: e.target.value })}>
                    {wilayas.map((w) => <option key={w.code} value={w.code}>{w.code} - {w.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 4 }}>Delivery Type</label>
                  <select className="input" value={orderForm.deliveryType} onChange={(e) => setOrderForm({ ...orderForm, deliveryType: e.target.value })}>
                    <option value="HOME">Home Delivery</option>
                    <option value="STOP_DESK">Stop Desk</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 4 }}>Address</label>
                <input className="input" value={orderForm.address} onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 4 }}>Notes</label>
                <input className="input" value={orderForm.notes} onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })} placeholder="Optional" />
              </div>
              <div style={{ background: "#1a1a1a", borderRadius: 8, padding: 16, marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ color: "#888" }}>Subtotal ({qty} x {product.name}):</span>
                  <span>{((product.price || 0) * qty).toLocaleString()} DZD</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ color: "#888" }}>Shipping:</span>
                  <span>{shippingCost > 0 ? shippingCost.toLocaleString() + " DZD" : "Free"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 18, borderTop: "1px solid #333", paddingTop: 8 }}>
                  <span>Total:</span><span style={{ color: "#10b981" }}>{total.toLocaleString()} DZD</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button type="submit" disabled={ordering} style={{ flex: 1, background: "#10b981", color: "white", padding: "12px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 15, fontWeight: 600 }}>{ordering ? "Placing..." : "Confirm Order"}</button>
                <button type="button" onClick={() => setShowOrder(false)} style={{ padding: "12px 20px", borderRadius: 8, border: "1px solid #333", background: "transparent", color: "#aaa", cursor: "pointer" }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}