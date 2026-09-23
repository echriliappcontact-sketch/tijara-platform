"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { getStore, isLoggedIn, getUser } from "@/lib/auth";
import { t, isRTL } from "@/lib/i18n";

export default function DashboardPage() {
  const router = useRouter();
  const [store, setStore] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [dir, setDir] = useState("rtl");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setDir(isRTL() ? "rtl" : "ltr");
    if (!isLoggedIn()) { router.push("/login"); return; }
    const s = getStore();
    const u = getUser();
    setStore(s);
    setUser(u);
    if (s?.id) {
      api.get("/subscriptions/my-subscription/" + s.id).then((r) => setSubscription(r.data)).catch(() => {});
    }
  }, [router]);

  return (
    <div dir={dir} style={{ padding: "30px 24px", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>{t("dash.title")}</h1>
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
        <div style={{
          background: subscription.status === "ACTIVE" ? "#0d2818" : subscription.status === "TRIAL" ? "#1a1a0a" : "#2d1215",
          border: "1px solid " + (subscription.status === "ACTIVE" ? "#10b981" : subscription.status === "TRIAL" ? "#eab308" : "#dc2626"),
          borderRadius: 12, padding: 20, marginBottom: 24
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, color: "#888", marginBottom: 4 }}>{t("dash.subStatus")}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: subscription.status === "ACTIVE" ? "#10b981" : subscription.status === "TRIAL" ? "#eab308" : "#dc2626" }}>
                {subscription.status === "ACTIVE" ? t("dash.active") : subscription.status === "TRIAL" ? t("dash.trial") : t("dash.expired")}
              </div>
              {subscription.daysLeft > 0 && <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>{subscription.daysLeft} {t("dash.daysLeft")}</div>}
            </div>
            {subscription.status !== "ACTIVE" && (
              <Link href="/dashboard/subscription" style={{ background: "#10b981", color: "white", padding: "8px 20px", borderRadius: 8, textDecoration: "none", fontWeight: 600, fontSize: 14 }}>
                {t("dash.upgrade")}
              </Link>
            )}
          </div>
        </div>
      )}

      {store && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>{t("dash.storeInfo")}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><span style={{ color: "#888" }}>{t("dash.name")}: </span><strong>{store.name}</strong></div>
            <div><span style={{ color: "#888" }}>{t("dash.slug")}: </span>{store.slug}</div>
            <div><span style={{ color: "#888" }}>{t("dash.status")}: </span><span style={{ color: store.status === "ACTIVE" ? "#10b981" : "#eab308" }}>{store.status}</span></div>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { icon: "01", title: t("dash.products"), desc: t("dash.productsDesc"), href: "/dashboard/products" },
          { icon: "02", title: t("dash.orders"), desc: t("dash.ordersDesc"), href: "/dashboard/orders" },
          { icon: "03", title: t("dash.subscription"), desc: t("dash.subscriptionDesc"), href: "/dashboard/subscription" },
        ].map((item, i) => (
          <Link key={i} href={item.href} className="card" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#10b981", marginBottom: 8 }}>{item.icon}</div>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{item.title}</h3>
            <p style={{ color: "#888", fontSize: 13 }}>{item.desc}</p>
          </Link>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        <Link href="/dashboard/settings" className="card" style={{ textDecoration: "none", color: "inherit", border: "1px solid #333" }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Settings</h3>
          <p style={{ color: "#888", fontSize: 13 }}>Profile, Email, Password, Store</p>
        </Link>
        <Link href="/dashboard/subscription" className="card" style={{ textDecoration: "none", color: "inherit", border: "1px solid #333" }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Subscription</h3>
          <p style={{ color: "#888", fontSize: 13 }}>Manage your plan and payments</p>
        </Link>
      </div>
    </div>
  );
}
