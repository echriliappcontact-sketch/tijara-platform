"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { getStore, isLoggedIn, getUser } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [store, setStoreState] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ products: 0, orders: 0 });

  useEffect(() => {
    if (!isLoggedIn()) { router.push("/login"); return; }
    const s = getStore();
    const u = getUser();
    setStoreState(s);
    setUser(u);
    if (s?.id) {
      api.get("/subscriptions/my-subscription/" + s.id).then((r) => {
        setSubscription(r.data);
        if (r.data.storeStatus === "ACTIVE" || r.data.status === "ACTIVE") {
          api.get("/products?storeId=" + s.id).then((rp) => setStats((prev) => ({ ...prev, products: rp.data.length || 0 }))).catch(() => {});
          api.get("/orders?storeId=" + s.id).then((ro) => setStats((prev) => ({ ...prev, orders: ro.data.length || 0 }))).catch(() => {});
        }
      }).catch(() => {});
    }
  }, [router]);

  const isActive = subscription?.status === "ACTIVE" || subscription?.storeStatus === "ACTIVE";
  const isTrial = subscription?.status === "TRIAL";

  return (
    <div style={{ padding: "30px 24px", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>My Store</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "white" }}>
            {user?.firstName?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{user?.firstName} {user?.lastName}</div>
            <div style={{ fontSize: 12, color: "#888" }}>{user?.email}</div>
          </div>
        </div>
      </div>

      {subscription && (
        <div style={{ background: isActive ? "#0d2818" : isTrial ? "#1a1a0a" : "#2d1215", border: "1px solid " + (isActive ? "#10b981" : isTrial ? "#eab308" : "#dc2626"), borderRadius: 12, padding: 24, marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>Subscription Status</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: isActive ? "#10b981" : isTrial ? "#eab308" : "#dc2626" }}>
                {isActive ? "Active" : isTrial ? "Free Trial" : "Expired"}
              </div>
              {subscription.plan && (
                <div style={{ color: "#aaa", marginTop: 4, fontSize: 14 }}>
                  Plan: <strong>{subscription.plan.name}</strong> | {subscription.plan.maxProducts || "Unlimited"} Products | {subscription.plan.maxOrders || "Unlimited"} Orders | Staff: {subscription.plan.maxStaff}
                </div>
              )}
              {subscription.startDate && <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>Started: {new Date(subscription.startDate).toLocaleDateString()}</div>}
              {subscription.endDate && <div style={{ color: "#888", fontSize: 12 }}>Ends: {new Date(subscription.endDate).toLocaleDateString()} ({subscription.daysLeft} days left)</div>}
            </div>
            {!isActive && (
              <Link href="/dashboard/subscription" style={{ background: "#10b981", color: "white", padding: "10px 24px", borderRadius: 8, textDecoration: "none", fontWeight: 600, fontSize: 14 }}>
                {isTrial ? "Upgrade Now" : "Renew"}
              </Link>
            )}
          </div>
        </div>
      )}

      {store && isActive && (
        <div className="card" style={{ marginBottom: 24, background: "#0d2818", border: "1px solid #10b981" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Your Store Link</h3>
              <a href={"/store/" + store.slug} target="_blank" rel="noopener noreferrer" style={{ color: "#10b981", fontSize: 14 }}>
                tijara-platform.vercel.app/store/{store.slug}
              </a>
            </div>
            <a href={"/store/" + store.slug} target="_blank" rel="noopener noreferrer" style={{ background: "#10b981", color: "white", padding: "8px 16px", borderRadius: 6, textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
              View My Store
            </a>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#10b981" }}>{stats.products}</div>
          <div style={{ color: "#888", fontSize: 14 }}>Products</div>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#3b82f6" }}>{stats.orders}</div>
          <div style={{ color: "#888", fontSize: 14 }}>Orders</div>
        </div>
      </div>

      {isActive ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          <Link href="/dashboard/products" className="card" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#10b981", marginBottom: 8 }}>01</div>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Products</h3>
            <p style={{ color: "#888", fontSize: 13 }}>Add, edit and manage your products</p>
          </Link>
          <Link href="/dashboard/orders" className="card" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#3b82f6", marginBottom: 8 }}>02</div>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Orders</h3>
            <p style={{ color: "#888", fontSize: 13 }}>View and manage customer orders</p>
          </Link>
          <Link href="/dashboard/delivery" className="card" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#f59e0b", marginBottom: 8 }}>03</div>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Delivery</h3>
            <p style={{ color: "#888", fontSize: 13 }}>Shipping prices for 58 wilayas</p>
          </Link>
          <Link href="/dashboard/store" className="card" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#8b5cf6", marginBottom: 8 }}>04</div>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Store Settings</h3>
            <p style={{ color: "#888", fontSize: 13 }}>Store info, link, name, description</p>
          </Link>
          <Link href="/dashboard/subscription" className="card" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#ec4899", marginBottom: 8 }}>05</div>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Subscription</h3>
            <p style={{ color: "#888", fontSize: 13 }}>Plan details and payment history</p>
          </Link>
          <Link href="/dashboard/settings" className="card" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#06b6d4", marginBottom: 8 }}>06</div>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Account Settings</h3>
            <p style={{ color: "#888", fontSize: 13 }}>Profile, email, password</p>
          </Link>
        </div>
      ) : (
        <div className="card" style={{ textAlign: "center", padding: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Activate Your Store</h2>
          <p style={{ color: "#888", marginBottom: 20 }}>Subscribe to a plan to unlock all features and start selling</p>
          <Link href="/dashboard/subscription" style={{ background: "#10b981", color: "white", padding: "12px 32px", borderRadius: 8, textDecoration: "none", fontWeight: 600, fontSize: 16 }}>
            Choose a Plan
          </Link>
        </div>
      )}
    </div>
  );
}