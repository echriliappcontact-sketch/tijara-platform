"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { getStore, isLoggedIn } from "@/lib/auth";
import { t, isRTL } from "@/lib/i18n";

export default function DashboardPage() {
  const router = useRouter();
  const [store, setStore] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [dir, setDir] = useState("rtl");

  useEffect(() => {
    setDir(isRTL() ? "rtl" : "ltr");
    if (!isLoggedIn()) { router.push("/login"); return; }
    const s = getStore();
    setStore(s);
    if (s?.id) {
      api.get("/subscriptions/my-subscription/" + s.id).then((r) => setSubscription(r.data)).catch(() => {});
    }
  }, [router]);

  return (
    <div dir={dir} style={{ padding: "30px 24px", maxWidth: 1000, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>{t("dash.title")}</h1>

      {subscription && (
        <div style={{ background: subscription.status === "ACTIVE" ? "#0d2818" : subscription.status === "TRIAL" ? "#1a1a0a" : "#2d1215", border: "1px solid " + (subscription.status === "ACTIVE" ? "#10b981" : subscription.status === "TRIAL" ? "#eab308" : "#dc2626"), borderRadius: 12, padding: 20, marginBottom: 24 }}>
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

      <div className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>{t("dash.storeInfo")}</h2>
        {store ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><span style={{ color: "#888" }}>{t("dash.name")}: </span>{store.name}</div>
            <div><span style={{ color: "#888" }}>{t("dash.slug")}: </span>{store.slug}</div>
            <div><span style={{ color: "#888" }}>{t("dash.status")}: </span><span style={{ color: store.status === "ACTIVE" ? "#10b981" : "#eab308" }}>{store.status}</span></div>
          </div>
        ) : <p style={{ color: "#888" }}>...</p>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {[
          { title: t("dash.products"), desc: t("dash.productsDesc"), href: "/dashboard/products", icon: "01" },
          { title: t("dash.orders"), desc: t("dash.ordersDesc"), href: "/dashboard/orders", icon: "02" },
          { title: t("dash.subscription"), desc: t("dash.subscriptionDesc"), href: "/dashboard/subscription", icon: "03" },
          { title: t("dash.settings"), desc: t("dash.settingsDesc"), href: "/dashboard/settings", icon: "04" },
        ].map((item, i) => (
          <Link key={i} href={item.href} className="card" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#10b981", marginBottom: 8 }}>{item.icon}</div>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{item.title}</h3>
            <p style={{ color: "#888", fontSize: 13 }}>{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
