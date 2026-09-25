"use client";
import { useEffect, useState, useRef } from "react";
import api from "@/lib/api";
import { getStore, isLoggedIn } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function SubscriptionPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [step, setStep] = useState("current");
  const [transactionRef, setTransactionRef] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const store = getStore();

  useEffect(() => {
    if (!isLoggedIn()) { router.push("/login"); return; }
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      const plansRes = await api.get("/subscriptions/plans");
      setPlans(plansRes.data);
      const subRes = await api.get("/subscriptions/my-subscription/" + store?.id);
      setSubscription(subRes.data);
      const payRes = await api.get("/subscriptions/my-payments/" + store?.id);
      setPayments(payRes.data);
    } catch (e) {}
  };

  const handleReceiptUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setErr("");
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await api.post("/upload/image", { image: reader.result, folder: "receipts" });
        setReceiptUrl(res.data.url);
        setMsg("Receipt uploaded!");
        setTimeout(() => setMsg(""), 3000);
      } catch (e: any) {
        setErr("Upload failed: " + (e.response?.data?.message || "Unknown error"));
      } finally {
        setUploading(false);
      }
    };
    reader.onerror = () => { setErr("Failed to read file"); setUploading(false); };
    reader.readAsDataURL(file);
  };

  const submitPayment = async (e: any) => {
    e.preventDefault();
    setMsg("");
    setErr("");
    setSubmitting(true);
    if (!transactionRef) { setErr("Enter transaction number"); setSubmitting(false); return; }
    if (!receiptUrl) { setErr("Upload receipt first"); setSubmitting(false); return; }
    try {
      await api.post("/subscriptions/submit-payment/" + store?.id, {
        planId: selectedPlan.id,
        transactionRef,
        receiptUrl,
        paymentMethod: "BARIDIMOB",
      });
      setMsg("Payment submitted! Waiting for approval.");
      setStep("submitted");
      setTransactionRef("");
      setReceiptUrl("");
      setSelectedPlan(null);
      loadData();
    } catch (e: any) {
      setErr(e.response?.data?.message || "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  const isActive = subscription?.status === "ACTIVE";
  const isTrial = subscription?.status === "TRIAL";

  return (
    <div style={{ padding: "30px 24px", maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>My Subscription</h1>

      {msg && <div style={{ background: "#0d2818", border: "1px solid #10b981", borderRadius: 8, padding: 12, marginBottom: 16, color: "#10b981" }}>{msg}</div>}
      {err && <div style={{ background: "#2d1215", border: "1px solid #dc2626", borderRadius: 8, padding: 12, marginBottom: 16, color: "#f87171" }}>{err}</div>}

      {step === "current" && subscription && (
        <div className="card" style={{ marginBottom: 24, background: isActive ? "#0d2818" : isTrial ? "#1a1a0a" : "#2d1215", border: "1px solid " + (isActive ? "#10b981" : isTrial ? "#eab308" : "#dc2626") }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Current Plan</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div style={{ fontSize: 13, color: "#888" }}>Status</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: isActive ? "#10b981" : isTrial ? "#eab308" : "#dc2626" }}>
                {isActive ? "Active" : isTrial ? "Free Trial" : "Expired"}
              </div>
            </div>
            {subscription.plan && (
              <div>
                <div style={{ fontSize: 13, color: "#888" }}>Plan</div>
                <div style={{ fontSize: 18, fontWeight: 600 }}>{subscription.plan.name} - {subscription.plan.price?.toLocaleString()} DZD</div>
              </div>
            )}
            <div>
              <div style={{ fontSize: 13, color: "#888" }}>Start</div>
              <div>{subscription.startDate ? new Date(subscription.startDate).toLocaleDateString() : "-"}</div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: "#888" }}>End</div>
              <div>{subscription.endDate ? new Date(subscription.endDate).toLocaleDateString() : "-"}</div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: "#888" }}>Days Left</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#10b981" }}>{subscription.daysLeft || 0} days</div>
            </div>
          </div>
          {!isActive && (
            <button onClick={() => setStep("plans")} style={{ marginTop: 20, background: "#10b981", color: "white", padding: "12px 28px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 15 }}>
              {isTrial ? "Upgrade Plan" : "Renew Subscription"}
            </button>
          )}
        </div>
      )}

      {step === "plans" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600 }}>Choose Your Plan</h2>
            <button onClick={() => setStep("current")} style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #333", background: "transparent", color: "#aaa", cursor: "pointer" }}>Back</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {plans.map((plan: any) => (
              <div key={plan.id} className="card" style={{ border: plan.isPopular ? "2px solid #10b981" : "1px solid #333", cursor: "pointer" }}
                onClick={() => { setSelectedPlan(plan); setStep("payment"); setErr(""); setMsg(""); }}>
                {plan.isPopular && <div style={{ background: "#10b981", color: "white", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, display: "inline-block", marginBottom: 8 }}>Popular</div>}
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{plan.name}</h3>
                <div style={{ fontSize: 30, fontWeight: 800, color: "#10b981", marginBottom: 8 }}>{plan.price?.toLocaleString()} <span style={{ fontSize: 13, fontWeight: 400 }}>DZD</span></div>
                <div style={{ color: "#888", fontSize: 13, lineHeight: 2 }}>
                  <div>{plan.maxProducts || "Unlimited"} Products</div>
                  <div>{plan.maxOrders || "Unlimited"} Orders</div>
                  <div>{plan.maxStaff} Staff</div>
                  <div>{plan.duration} days</div>
                </div>
                <button type="button" style={{ marginTop: 16, width: "100%", padding: "10px", borderRadius: 6, border: "none", background: "#10b981", color: "white", cursor: "pointer", fontWeight: 600 }}>
                  Select Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === "payment" && selectedPlan && (
        <div className="card" style={{ border: "1px solid #10b981" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Payment for {selectedPlan.name} Plan</h2>
          <div style={{ background: "#1a1a1a", borderRadius: 8, padding: 16, marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: "#eab308" }}>Payment Information</h3>
            <div style={{ fontSize: 13, lineHeight: 2, color: "#aaa" }}>
              <div>Method: <strong>BaridiMob (Poste Algerienne)</strong></div>
              <div>Account: <strong>00799999 0012345678</strong></div>
              <div>Name: <strong>Tijara Platform</strong></div>
              <div>Amount: <strong style={{ color: "#10b981", fontSize: 18 }}>{selectedPlan.price?.toLocaleString()} DZD</strong></div>
            </div>
          </div>
          <form onSubmit={submitPayment}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 4 }}>Transaction Number</label>
              <input className="input" value={transactionRef} onChange={(e) => setTransactionRef(e.target.value)} placeholder="e.g. 1234567890" required />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 8 }}>Upload Payment Receipt</label>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleReceiptUpload} style={{ display: "none" }} />
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} style={{ padding: "12px 24px", borderRadius: 8, border: "1px dashed #10b981", background: "transparent", color: "#10b981", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
                {uploading ? "Uploading..." : receiptUrl ? "Change Receipt" : "+ Upload Payment Receipt"}
              </button>
              {receiptUrl && (
                <div style={{ marginTop: 12 }}>
                  <img src={receiptUrl} alt="Receipt" style={{ maxWidth: 200, maxHeight: 200, borderRadius: 8, border: "1px solid #333" }} />
                  <div style={{ color: "#10b981", fontSize: 12, marginTop: 4 }}>Receipt uploaded!</div>
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" className="btn-primary" disabled={submitting || uploading} style={{ padding: "12px 32px", fontSize: 15 }}>
                {submitting ? "Submitting..." : "Submit Payment"}
              </button>
              <button type="button" onClick={() => { setStep("plans"); setSelectedPlan(null); setReceiptUrl(""); setTransactionRef(""); }} style={{ padding: "12px 24px", borderRadius: 8, border: "1px solid #333", background: "transparent", color: "#aaa", cursor: "pointer" }}>Back</button>
            </div>
          </form>
        </div>
      )}

      {step === "submitted" && (
        <div className="card" style={{ textAlign: "center", padding: 40, border: "1px solid #eab308" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>&#x23F3;</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: "#eab308" }}>Payment Submitted!</h2>
          <p style={{ color: "#888", marginBottom: 20 }}>Your payment is being reviewed by our team. You will be notified once it is approved.</p>
          <button onClick={() => { setStep("current"); }} style={{ background: "#10b981", color: "white", padding: "10px 24px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600 }}>View Subscription</button>
        </div>
      )}

      {step === "current" && payments.length > 0 && (
        <div className="card">
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Payment History</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ borderBottom: "1px solid #333" }}>
              <th style={{ padding: "10px", textAlign: "left", color: "#888", fontSize: 12 }}>Date</th>
              <th style={{ padding: "10px", textAlign: "left", color: "#888", fontSize: 12 }}>Plan</th>
              <th style={{ padding: "10px", textAlign: "left", color: "#888", fontSize: 12 }}>Amount</th>
              <th style={{ padding: "10px", textAlign: "left", color: "#888", fontSize: 12 }}>Transaction</th>
              <th style={{ padding: "10px", textAlign: "left", color: "#888", fontSize: 12 }}>Receipt</th>
              <th style={{ padding: "10px", textAlign: "left", color: "#888", fontSize: 12 }}>Status</th>
            </tr></thead>
            <tbody>
              {payments.map((pay: any) => (
                <tr key={pay.id} style={{ borderBottom: "1px solid #1a1a1a" }}>
                  <td style={{ padding: "10px", fontSize: 13 }}>{new Date(pay.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: "10px", fontSize: 13 }}>{pay.plan?.name}</td>
                  <td style={{ padding: "10px", fontSize: 13 }}>{pay.amount?.toLocaleString()} DZD</td>
                  <td style={{ padding: "10px", fontSize: 13, fontFamily: "monospace" }}>{pay.transactionRef}</td>
                  <td style={{ padding: "10px" }}>
                    {pay.receiptUrl ? <a href={pay.receiptUrl} target="_blank" rel="noopener noreferrer"><img src={pay.receiptUrl} alt="Receipt" style={{ width: 40, height: 40, borderRadius: 4, objectFit: "cover" }} /></a> : "-"}
                  </td>
                  <td style={{ padding: "10px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: pay.status === "APPROVED" ? "#0d2818" : pay.status === "REJECTED" ? "#2d1215" : "#1a1a0a", color: pay.status === "APPROVED" ? "#10b981" : pay.status === "REJECTED" ? "#dc2626" : "#eab308" }}>{pay.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}