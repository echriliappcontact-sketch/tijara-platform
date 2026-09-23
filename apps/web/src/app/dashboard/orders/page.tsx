"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getStore, isLoggedIn } from "@/lib/auth";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [msg, setMsg] = useState("");
  const store = getStore();

  useEffect(() => {
    if (!isLoggedIn()) { router.push("/login"); return; }
    loadOrders();
  }, [router]);

  const loadOrders = async () => {
    try {
      const res = await api.get("/orders?storeId=" + store?.id);
      setOrders(res.data);
    } catch (e) {}
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put("/orders/" + id + "/status", { status, note: "Status updated to " + status });
      setMsg("Order status updated to " + status);
      loadOrders();
    } catch (e: any) { setMsg("Failed to update status"); }
  };

  const statusColors: any = { PENDING: "#eab308", CONFIRMED: "#3b82f6", PROCESSING: "#8b5cf6", SHIPPED: "#f59e0b", DELIVERED: "#10b981", CANCELLED: "#dc2626" };

  return (
    <div style={{ padding: "30px 24px", maxWidth: 1000, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Orders</h1>
      {msg && <div style={{ background: "#0d2818", border: "1px solid #10b981", borderRadius: 8, padding: 12, marginBottom: 16, color: "#10b981" }}>{msg}</div>}

      {orders.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 60 }}>
          <p style={{ color: "#888", fontSize: 16 }}>No orders yet</p>
          <p style={{ color: "#555", fontSize: 13, marginTop: 8 }}>Orders will appear here when customers place them</p>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 20 }}>
          <div style={{ flex: 2 }}>
            <div className="card" style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr style={{ borderBottom: "1px solid #333" }}>
                  <th style={{ padding: "10px", textAlign: "left", color: "#888", fontSize: 12 }}>Order #</th>
                  <th style={{ padding: "10px", textAlign: "left", color: "#888", fontSize: 12 }}>Customer</th>
                  <th style={{ padding: "10px", textAlign: "left", color: "#888", fontSize: 12 }}>Total</th>
                  <th style={{ padding: "10px", textAlign: "left", color: "#888", fontSize: 12 }}>Status</th>
                  <th style={{ padding: "10px", textAlign: "left", color: "#888", fontSize: 12 }}>Actions</th>
                </tr></thead>
                <tbody>
                  {orders.map((o: any) => (
                    <tr key={o.id} style={{ borderBottom: "1px solid #1a1a1a", cursor: "pointer", background: selected?.id === o.id ? "#1a1a1a" : "transparent" }} onClick={() => setSelected(o)}>
                      <td style={{ padding: "10px", fontSize: 13 }}>{o.orderNumber}</td>
                      <td style={{ padding: "10px", fontSize: 13 }}>{o.customerName}<br/><span style={{ color: "#888", fontSize: 11 }}>{o.customerPhone}</span></td>
                      <td style={{ padding: "10px", fontSize: 13 }}>{o.total?.toLocaleString()} DZD</td>
                      <td style={{ padding: "10px" }}>
                        <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: (statusColors[o.status] || "#888") + "22", color: statusColors[o.status] || "#888" }}>{o.status}</span>
                      </td>
                      <td style={{ padding: "10px" }}>
                        <select onClick={(e) => e.stopPropagation()} onChange={(e) => updateStatus(o.id, e.target.value)} value={o.status} style={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 4, color: "#ccc", padding: "4px 8px", fontSize: 12 }}>
                          <option value="PENDING">Pending</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="PROCESSING">Processing</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {selected && (
            <div style={{ flex: 1 }}>
              <div className="card">
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Order Details</h3>
                <div style={{ fontSize: 13, lineHeight: 2 }}>
                  <div><span style={{ color: "#888" }}>Order: </span>{selected.orderNumber}</div>
                  <div><span style={{ color: "#888" }}>Customer: </span>{selected.customerName}</div>
                  <div><span style={{ color: "#888" }}>Phone: </span>{selected.customerPhone}</div>
                  <div><span style={{ color: "#888" }}>Wilaya: </span>{selected.wilayaCode}</div>
                  <div><span style={{ color: "#888" }}>Address: </span>{selected.address}</div>
                  <div><span style={{ color: "#888" }}>Payment: </span>{selected.paymentMethod}</div>
                  <div><span style={{ color: "#888" }}>Subtotal: </span>{selected.subtotal?.toLocaleString()} DZD</div>
                  <div><span style={{ color: "#888" }}>Shipping: </span>{selected.shippingCost?.toLocaleString()} DZD</div>
                  <div><span style={{ color: "#10b981", fontWeight: 600 }}>Total: {selected.total?.toLocaleString()} DZD</span></div>
                </div>
                {selected.items && selected.items.length > 0 && (
                  <div style={{ marginTop: 12, borderTop: "1px solid #333", paddingTop: 12 }}>
                    <h4 style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>Items:</h4>
                    {selected.items.map((item: any, i: number) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                        <span>{item.productName} x{item.quantity}</span>
                        <span>{item.total?.toLocaleString()} DZD</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}