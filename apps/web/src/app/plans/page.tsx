"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";
import { t, isRTL } from "@/lib/i18n";

export default function PlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [dir, setDir] = useState("rtl");

  useEffect(() => {
    setDir(isRTL() ? "rtl" : "ltr");
    api.get("/subscriptions/plans").then((r) => setPlans(r.data)).catch(() => {});
  }, []);

  return (
    <div dir={dir} style={{ padding: "60px 24px", maxWidth: 1000, margin: "0 auto" }}>
      <h1 style={{ fontSize: 36, fontWeight: 700, textAlign: "center", marginBottom: 12 }}>{t("plans.title")}</h1>
      <p style={{ color: "#888", textAlign: "center", marginBottom: 40, fontSize: 16 }}>{t("plans.desc")}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
        {plans.map((plan: any) => (
          <div key={plan.id} className="card" style={{ textAlign: "center", position: "relative", border: plan.isPopular ? "2px solid #10b981" : "1px solid #222" }}>
            {plan.isPopular && (
              <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#10b981", color: "white", padding: "4px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                {t("plans.popular")}
              </div>
            )}
            <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, marginTop: 8 }}>{plan.name}</h3>
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 40, fontWeight: 800, color: "#10b981" }}>
                {plan.price === 0 ? t("plans.free") : plan.price.toLocaleString() + " DZD"}
              </span>
              {plan.price > 0 && <span style={{ color: "#888", fontSize: 14 }}> / {plan.duration} {t("plans.month")}</span>}
            </div>
            <div style={{ color: "#aaa", fontSize: 14, marginBottom: 24, lineHeight: 1.8 }}>
              <div>{plan.maxProducts ? plan.maxProducts + " " + t("plans.products") : t("plans.products")}</div>
              <div>{plan.maxOrders ? plan.maxOrders + " " + t("plans.orders") : t("plans.orders")}</div>
              <div>{t("plans.allWilayas")}</div>
              <div>{t("plans.allCouriers")}</div>
              <div>{t("plans.cod")}</div>
            </div>
            {isLoggedIn() ? (
              <Link href="/dashboard/subscription" style={{ background: plan.isPopular ? "#10b981" : "#222", color: "white", padding: "10px 24px", borderRadius: 8, display: "block", textDecoration: "none", fontWeight: 600 }}>
                {plan.price === 0 ? t("plans.free") : t("plans.select")}
              </Link>
            ) : (
              <Link href="/register" style={{ background: plan.isPopular ? "#10b981" : "#222", color: "white", padding: "10px 24px", borderRadius: 8, display: "block", textDecoration: "none", fontWeight: 600 }}>
                {t("plans.startTrial")}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
