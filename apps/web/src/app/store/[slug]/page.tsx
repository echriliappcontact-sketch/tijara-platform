"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";

export default function PublicStorePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [store, setStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [orderForm, setOrderForm] = useState({ customerName: "", customerPhone: "", wilayaCode: "16", commune: "", address: "", deliveryType: "HOME", notes: "" });
  const [orderMsg, setOrderMsg] = useState("");
  const [orderErr, setOrderErr] = useState("");
  const [ordering, setOrdering] = useState(false);
  const [wilayas] = useState([
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
    { code: "58", name: "In Guezzam" }, { code: "59", name: "Bordj Badji Mokhtar" },
  ]);

  useEffect(() => {
    if (!slug) return;
    api.get("/stores/by-slug/" + slug).then((r) => {
      setStore(r.data);
      setProducts(r.data.products || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug]);

  const addToCart = (product: any) => {
    const exists = cart.find((c) => c.productId === product.id);
    if (exists) {
      setCart(cart.map((c) => c.productId === product.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { productId: product.id, productName: product.name, price: product.price, quantity: 1, image: product.images?.[0]?.url || null }]);
    }
    setShowCart(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((c) => c.productId !== productId));
  };

  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) { removeFromCart(productId); return; }
    setCart(cart.map((c) => c.productId === productId ? { ...c, quantity: qty } : c));
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrdering(true); setOrderMsg(""); setOrderErr("");
    try {
      await api.post("/orders/public/" + slug, {
        ...orderForm,
        items: cart.map((c) => ({ productId: c.productId, productName: c.productName, price: c.price, quantity: c.quantity, image: c.image })),
      });
      setOrderMsg("Order placed successfully! The store will contact you soon.");
      setCart([]);
      setShowOrder(false);
      setShowCart(false);
    } catch (e: any) { setOrderErr(e.response?.data?.message || "Failed to place order"); }
    finally { setOrdering(false); }
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", color: "#888" }}>Loading store...</div>;
  if (!store) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", color: "#dc2626" }}>Store not found</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a" }}>
      <div style={{ background: "#111", borderBottom: "1px solid #222", padding: "24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "#10b981" }}>{store.name}</h1>
            {store.description && <p style={{ color: "#888", fontSize: 14, marginTop: 4 }}>{store.description}</p>}
          </div>
          <button onClick={() => setShowCart(!showCart)} style={{ background: "#10b981", color: "white", padding: "10px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
            Cart ({cart.length})
          </button>
        </div>
      </div>

      {orderMsg && <div style={{ maxWidth: 1200, margin: "16px auto 0", padding: "0 24px" }}><div style={{ background: "#0d2818", border: "1px solid #10b981", borderRadius: 8, padding: 12, color: "#10b981" }}>{orderMsg}</div></div>}

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "30px 24px", display: "flex", gap: 24 }}>
        <div style={{ flex: 3 }}>
          {products.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: "#888" }}>No products available yet</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 20 }}>
              {products.map((product: any) => (
                <div key={product.id} style={{ background: "#111", borderRadius: 12, border: "1px solid #222", overflow: "hidden" }}>
                  <div style={{ height: 200, background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#555" }}>
                    {product.images?.[0]?.url ? <img src={product.images[0].url} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span>No Image</span>}
                  </div>
                  <div style={{ padding: 16 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{product.name}</h3>
                    {product.description && <p style={{ color: "#888", fontSize: 13, marginBottom: 8, lineHeight: 1.5 }}>{product.description}</p>}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 20, fontWeight: 700, color: "#10b981" }}>{product.price?.toLocaleString()} DZD</span>
                      <button onClick={() => addToCart(product)} style={{ background: "#10b981", color: "white", padding: "8px 16px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Add to Cart</button>
                    </div>
                    {product.stock !== undefined && <div style={{ color: "#555", fontSize: 12, marginTop: 8 }}>{product.stock > 0 ? product.stock + " in stock" : "Out of stock"}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showCart && (
          <div style={{ flex: 1, minWidth: 300 }}>
            <div style={{ background: "#111", borderRadius: 12, border: "1px solid #222", padding: 20, position: "sticky", top: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Your Cart</h2>
              {cart.length === 0 ? (
                <p style={{ color: "#888", fontSize: 13 }}>Cart is empty</p>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item.productId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #222" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 500 }}>{item.productName}</div>
                        <div style={{ color: "#10b981", fontSize: 13 }}>{item.price?.toLocaleString()} DZD</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button onClick={() => updateQty(item.productId, item.quantity - 1)} style={{ width: 28, height: 28, borderRadius: 4, border: "1px solid #333", background: "transparent", color: "#ccc", cursor: "pointer" }}>-</button>
                        <span style={{ fontSize: 14, minWidth: 20, textAlign: "center" }}>{item.quantity}</span>
                        <button onClick={() => updateQty(item.productId, item.quantity + 1)} style={{ width: 28, height: 28, borderRadius: 4, border: "1px solid #333", background: "transparent", color: "#ccc", cursor: "pointer" }}>+</button>
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #333" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                      <span style={{ fontSize: 16, fontWeight: 600 }}>Total:</span>
                      <span style={{ fontSize: 18, fontWeight: 700, color: "#10b981" }}>{cartTotal.toLocaleString()} DZD</span>
                    </div>
                    <button onClick={() => setShowOrder(true)} style={{ width: "100%", background: "#10b981", color: "white", padding: "12px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 15, fontWeight: 600 }}>Place Order</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

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
                  <span style={{ color: "#888" }}>Subtotal:</span><span>{cartTotal.toLocaleString()} DZD</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ color: "#888" }}>Shipping:</span><span>Calculated on delivery</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 16, borderTop: "1px solid #333", paddingTop: 8 }}>
                  <span>Total:</span><span style={{ color: "#10b981" }}>{cartTotal.toLocaleString()} DZD</span>
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