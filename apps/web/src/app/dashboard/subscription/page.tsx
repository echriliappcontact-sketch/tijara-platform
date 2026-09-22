"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getStore, isLoggedIn } from "@/lib/auth";
import { t, isRTL } from "@/lib/i18n";

export default function SubscriptionPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [transactionRef, setTransactionRef] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [dir, setDir] = useState("rtl");
  const store = getStore();

  useEffect(() => {
    setDir(isRTL() ? "rtl" : "ltr");
    if (!isLoggedIn()) { router.push("/login"); return; }
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      const [p, s, pay] = await Promise.all([
        api.get("/subscriptions/plans"),
        api.get("/subscriptions/my-subscription/" + store?.id),
        api.get("/subscriptions/payments/" + store?.id),
      ]);
      setPlans(p.data);
      setSubscription(s.data);
      setPayments(pay.data);
    } catch (e) {}
  };

  const selectPlan = (plan: any) => {
    setSelectedPlan(plan);
    setStep(2);
    setSuccess("");
    setError("");
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!transactionRef.trim()) { setError(t("sub.refHint")); return; }
    setLoading(true);
    try {
      await api.post("/subscriptions/payment", {
        storeId: store?.id,
        planId: selectedPlan.id,
        transactionRef: transactionRef.trim(),
        receiptUrl: receiptUrl.trim() || null,
        paymentMethod: "BARIDIMOB",
      });
      setSuccess(t("sub.success"));
      setStep(1);
      setSelectedPlan(null);
      setTransactionRef("");
      setReceiptUrl("");
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir={dir} style={{ padding: "30px 24px", maxWidth: 1000, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>{t("sub.title")}</h1>

      {subscription && (
        <div style={{ background: subscription.status === "ACTIVE" ? "#0d2818" : subscription.status === "TRIAL" ? "#1a1a0a" : "#2d1215", border: "1px solid " + (subscription.status === "ACTIVE" ? "#10b981" : subscription.status === "TRIAL" ? "#eab308" : "#dc2626"), borderRadius: 12, padding: 24, marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>{t("dash.subStatus")}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: subscription.status === "ACTIVE" ? "#10b981" : subscription.status === "TRIAL" ? "#eab308" : "#dc2626" }}>
                {subscription.status === "ACTIVE" ? t("dash.active") : subscription.status === "TRIAL" ? t("dash.trial") : t("dash.expired")}
              </div>
              {subscription.plan && <div style={{ color: "#aaa", marginTop: 4 }}>{subscription.plan.name}</div>}
              {subscription.daysLeft > 0 && <div style={{ color: "#888", fontSize: 14, marginTop: 4 }}>{subscription.daysLeft} {t("dash.daysLeft")}</div>}
            </div>
          </div>
        </div>
      )}

      {success && <div style={{ background: "#0d2818", border: "1px solid #10b981", borderRadius: 8, padding: 14, marginBottom: 20, color: "#10b981" }}>{success}</div>}
      {error && <div style={{ background: "#2d1215", border: "1px solid #dc2626", borderRadius: 8, padding: 14, marginBottom: 20, color: "#f87171" }}>{error}</div>}

      {step === 1 && (
        <>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>{t("sub.step1")}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 40 }}>
            {plans.map((plan: any) => (
              <div key={plan.id} className="card" style={{ border: plan.isPopular ? "2px solid #10b981" : "1px solid #333", position: "relative", textAlign: "center" }}>
                {plan.isPopular && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "#10b981", padding: "3px 14px", borderRadius: 20, fontSize: 11, fontWeight: 600, color: "white" }}>{t("plans.popular")}</div>}
                <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, marginTop: 8 }}>{plan.name}</h3>
                <p style={{ color: "#888", fontSize: 13, marginBottom: 12 }}>{plan.description}</p>
                <div style={{ marginBottom: 16 }}>
                  <span style={{ fontSize: 36, fontWeight: 800, color: "#10b981" }}>{plan.price.toLocaleString()}</span>
                  <span style={{ color: "#888", fontSize: 14 }}> DZD / {plan.duration} {t("plans.month")}</span>
                </div>
                <div style={{ color: "#aaa", fontSize: 13, lineHeight: 2, marginBottom: 20, textAlign: "left", paddingLeft: 20 }}>
                  <div>{plan.maxProducts ? plan.maxProducts + " " + t("plans.products") : t("plans.products")}</div>
                  <div>{plan.maxOrders ? plan.maxOrders + " " + t("plans.orders") : t("plans.orders")}</div>
                  <div>{plan.maxStaff} {t("plans.staff")}</div>
                  <div>{t("plans.allWilayas")}</div>
                  <div>{t("plans.allCouriers")}</div>
                  <div>{t("plans.cod")}</div>
                </div>
                <button onClick={() => selectPlan(plan)} style={{ width: "100%", padding: "12px", borderRadius: 8, border: "none", background: plan.isPopular ? "#10b981" : "#2a2a2a", color: "white", fontWeight: 600, cursor: "pointer", fontSize: 15 }}>
                  {t("plans.select")} {plan.name}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {step === 2 && selectedPlan && (
        <>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>{t("sub.step2")}</h2>
          <div className="card" style={{ marginBottom: 24, border: "1px solid #f59e0b" }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: "#f59e0b" }}>{t("sub.sendAmount")} {selectedPlan.price.toLocaleString()} DZD</h3>
            <div style={{ background: "#1a1a0a", borderRadius: 8, padding: 20, marginBottom: 16 }}>
              <div style={{ display: "grid", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #333", paddingBottom: 8 }}>
                  <span style={{ color: "#888" }}>{t("sub.accountNumber")}</span>
                  <span style={{ color: "#f59e0b", fontWeight: 700, fontSize: 18, fontFamily: "monospace" }}>0079999900123456789</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #333", paddingBottom: 8 }}>
                  <span style={{ color: "#888" }}>{t("sub.accountName")}</span>
                  <span style={{ fontWeight: 600 }}>TIJARA PLATFORM</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #333", paddingBottom: 8 }}>
                  <span style={{ color: "#888" }}>{t("sub.ccp")}</span>
                  <span style={{ fontWeight: 600, fontFamily: "monospace" }}>1234567890</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#888" }}>{t("sub.amount")}</span>
                  <span style={{ fontWeight: 700, fontSize: 18, color: "#10b981" }}>{selectedPlan.price.toLocaleString()} DZD</span>
                </div>
              </div>
            </div>
            <div style={{ background: "#1a1a1a", borderRadius: 8, padding: 12, color: "#f59e0b", fontSize: 13 }}>
              <strong>{t("sub.sendSteps")}</strong>
              <ol style={{ margin: "8px 0 0 16px", lineHeight: 1.8 }}>
                <li>{t("sub.step1text")}</li>
                <li>{t("sub.step2text")} <strong>{selectedPlan.price.toLocaleString()} DZD</strong></li>
                <li>{t("sub.step3text")}</li>
                <li>{t("sub.step4text")}</li>
                <li>{t("sub.step5text")}</li>
              </ol>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 24, border: "1px solid #10b981" }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>{t("sub.step3")}</h3>
            <form onSubmit={handleSubmitPayment}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 600 }}>{t("sub.plan")}</label>
                <input className="input" value={selectedPlan.name + " - " + selectedPlan.price.toLocaleString() + " DZD"} disabled />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 600 }}>
                  {t("sub.refNumber")} <span style={{ color: "#dc2626" }}>{t("sub.refRequired")}</span>
                </label>
                <input className="input" value={transactionRef} onChange={(e) => setTransactionRef(e.target.value)} placeholder={t("sub.refPlaceholder")} required style={{ fontSize: 16, fontFamily: "monospace" }} />
                <p style={{ color: "#888", fontSize: 12, marginTop: 4 }}>{t("sub.refHint")}</p>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 600 }}>
                  {t("sub.screenshot")} <span style={{ color: "#888" }}>{t("sub.screenshotOptional")}</span>
                </label>
                <input className="input" value={receiptUrl} onChange={(e) => setReceiptUrl(e.target.value)} placeholder={t("sub.screenshotPlaceholder")} />
                <p style={{ color: "#888", fontSize: 12, marginTop: 4 }}>{t("sub.screenshotHint")}</p>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button type="submit" className="btn-primary" style={{ fontSize: 16, padding: "12px 32px" }} disabled={loading}>
                  {loading ? "..." : t("sub.submitBtn")}
                </button>
                <button type="button" onClick={() => { setStep(1); setSelectedPlan(null); }} style={{ padding: "12px 24px", borderRadius: 8, border: "1px solid #333", background: "transparent", color: "#aaa", cursor: "pointer" }}>
                  {t("sub.back")}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {payments.length > 0 && (
        <>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>{t("sub.history")}</h2>
          <div className="card" style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #333" }}>
                  <th style={{ padding: "12px", textAlign: "left", color: "#888", fontSize: 13 }}>{t("sub.date")}</th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#888", fontSize: 13 }}>{t("sub.planLabel")}</th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#888", fontSize: 13 }}>{t("sub.amountLabel")}</th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#888", fontSize: 13 }}>{t("sub.transRef")}</th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#888", fontSize: 13 }}>{t("sub.status")}</th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#888", fontSize: 13 }}>{t("sub.adminNote")}</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((pay: any) => (
                  <tr key={pay.id} style={{ borderBottom: "1px solid #1a1a1a" }}>
                    <td style={{ padding: "12px", fontSize: 13 }}>{new Date(pay.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: "12px", fontSize: 13, fontWeight: 600 }}>{pay.plan?.name}</td>
                    <td style={{ padding: "12px", fontSize: 13 }}>{pay.amount.toLocaleString()} DZD</td>
                    <td style={{ padding: "12px", fontSize: 13, fontFamily: "monospace" }}>{pay.transactionRef}</td>
                    <td style={{ padding: "12px" }}>
                      <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: pay.status === "APPROVED" ? "#0d2818" : pay.status === "PENDING" ? "#1a1a0a" : "#2d1215", color: pay.status === "APPROVED" ? "#10b981" : pay.status === "PENDING" ? "#eab308" : "#dc2626" }}>
                        {pay.status === "APPROVED" ? t("sub.approved") : pay.status === "PENDING" ? t("sub.pending") : t("sub.rejected")}
                      </span>
                    </td>
                    <td style={{ padding: "12px", fontSize: 13, color: "#888" }}>{pay.adminNote || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
