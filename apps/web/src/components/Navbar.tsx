"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { isLoggedIn, getUser, logout } from "@/lib/auth";
import { t, getLang, setLang, languages, isRTL } from "@/lib/i18n";

export default function Navbar() {
  const [logged, setLogged] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [lang, setLangState] = useState("ar");
  const [showLang, setShowLang] = useState(false);

  useEffect(() => {
    setLogged(isLoggedIn());
    setUser(getUser());
    setLangState(getLang());
  }, []);

  const changeLang = (code: string) => {
    setLang(code as any);
    setLangState(code);
    setShowLang(false);
    document.documentElement.dir = code === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = code;
  };

  return (
    <nav style={{ background: "#111", borderBottom: "1px solid #222", padding: "0 24px", direction: "ltr" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
        <Link href="/" style={{ fontSize: 22, fontWeight: 700, color: "#10b981", textDecoration: "none" }}>
          Tijara
        </Link>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link href="/plans" style={{ color: "#ccc", textDecoration: "none", fontSize: 14 }}>{t("nav.plans")}</Link>
          {logged ? (
            <>
              <Link href="/dashboard" style={{ color: "#ccc", textDecoration: "none", fontSize: 14 }}>{t("nav.dashboard")}</Link>
              <span style={{ color: "#666", fontSize: 12 }}>{user?.email}</span>
              <button onClick={logout} style={{ background: "#dc2626", color: "white", padding: "5px 12px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12 }}>
                {t("nav.logout")}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ color: "#ccc", textDecoration: "none", fontSize: 14 }}>{t("nav.login")}</Link>
              <Link href="/register" style={{ background: "#10b981", color: "white", padding: "7px 14px", borderRadius: 6, textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
                {t("nav.register")}
              </Link>
            </>
          )}

          {/* Language Switcher */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowLang(!showLang)} style={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 6, padding: "5px 10px", color: "#ccc", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
              {languages.find(l => l.code === lang)?.name || "العربية"} ▾
            </button>
            {showLang && (
              <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 4, background: "#1a1a1a", border: "1px solid #333", borderRadius: 8, overflow: "hidden", zIndex: 100, minWidth: 120 }}>
                {languages.map((l) => (
                  <button key={l.code} onClick={() => changeLang(l.code)} style={{ display: "block", width: "100%", padding: "8px 14px", background: l.code === lang ? "#10b981" : "transparent", color: l.code === lang ? "white" : "#ccc", border: "none", cursor: "pointer", textAlign: "left", fontSize: 13 }}>
                    {l.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
