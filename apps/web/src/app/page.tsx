"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { t, getLang, isRTL } from "@/lib/i18n";

export default function Home() {
  const [dir, setDir] = useState("rtl");

  useEffect(() => {
    setDir(isRTL() ? "rtl" : "ltr");
    document.documentElement.dir = isRTL() ? "rtl" : "ltr";
  }, []);

  return (
    <div dir={dir}>
      {/* Hero */}
      <section style={{ padding: "80px 24px", textAlign: "center", background: "linear-gradient(135deg, #0a0a0a 0%, #0d2818 50%, #0a0a0a 100%)" }}>
        <h1 style={{ fontSize: 52, fontWeight: 800, marginBottom: 20, lineHeight: 1.1 }}>
          {t("home.title1")}<br/>
          <span style={{ color: "#10b981" }}>{t("home.title2")}</span>
        </h1>
        <p style={{ fontSize: 20, color: "#888", maxWidth: 600, margin: "0 auto 40px" }}>
          {t("home.desc")}
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <Link href="/register" className="btn-primary" style={{ fontSize: 18, padding: "14px 36px", textDecoration: "none" }}>
            {t("home.cta")}
          </Link>
          <Link href="/plans" style={{ fontSize: 18, padding: "14px 36px", border: "1px solid #333", borderRadius: 8, color: "#ccc", textDecoration: "none" }}>
            {t("home.cta2")}
          </Link>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "60px 24px", maxWidth: 1000, margin: "0 auto" }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, textAlign: "center", marginBottom: 40 }}>{t("home.why")}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {[
            { icon: "01", title: t("home.f1.title"), desc: t("home.f1.desc") },
            { icon: "02", title: t("home.f2.title"), desc: t("home.f2.desc") },
            { icon: "03", title: t("home.f3.title"), desc: t("home.f3.desc") },
            { icon: "04", title: t("home.f4.title"), desc: t("home.f4.desc") },
            { icon: "05", title: t("home.f5.title"), desc: t("home.f5.desc") },
            { icon: "06", title: t("home.f6.title"), desc: t("home.f6.desc") },
          ].map((f, i) => (
            <div key={i} className="card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#10b981", marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: "#888", fontSize: 14 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "60px 24px", textAlign: "center", borderTop: "1px solid #222" }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>{t("home.ready")}</h2>
        <p style={{ color: "#888", marginBottom: 24 }}>{t("home.readyDesc")}</p>
        <Link href="/register" className="btn-primary" style={{ fontSize: 16, padding: "12px 32px", textDecoration: "none" }}>
          {t("home.create")}
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ padding: "30px 24px", textAlign: "center", borderTop: "1px solid #1a1a1a", color: "#555", fontSize: 13 }}>
        {t("footer")}
      </footer>
    </div>
  );
}
