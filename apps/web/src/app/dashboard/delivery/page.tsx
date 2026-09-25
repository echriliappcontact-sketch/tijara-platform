"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getStore, isLoggedIn } from "@/lib/auth";

export default function DeliveryPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const store = getStore();

  const allWilayas = [
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
    { code: "58", name: "In Guezzam" },
  ];

  useEffect(() => {
    if (!isLoggedIn()) { router.push("/login"); return; }
    loadSettings();
  }, [router]);

  const loadSettings = async () => {
    try {
      const res = await api.get("/stores/" + store?.id + "/delivery");
      setSettings(res.data);
    } catch (e: any) {
      setErr("Failed to load delivery settings");
    }
  };

  const updateLocal = (wilayaCode: string, field: string, value: any) => {
    setSettings(prev => {
      const existing = prev.find(s => s.wilayaCode === wilayaCode);
      if (existing) {
        return prev.map(s => s.wilayaCode === wilayaCode ? { ...s, [field]: value } : s);
      } else {
        return [...prev, { wilayaCode, homePrice: 0, stopDeskPrice: 0, isActive: false, estimatedDays: 3, [field]: value }];
      }
    });
  };

  const getSetting = (code: string) => {
    return settings.find(s => s.wilayaCode === code) || { homePrice: 0, stopDeskPrice: 0, isActive: false, estimatedDays: 3 };
  };

  const saveAll = async () => {
    setLoading(true);
    setMsg("");
    setErr("");
    try {
      for (const w of allWilayas) {
        const s = getSetting(w.code);
        if (s.homePrice > 0 || s.stopDeskPrice > 0 || s.isActive) {
          await api.put("/stores/" + store?.id + "/delivery/" + w.code, {
            homePrice: Number(s.homePrice) || 0,
            stopDeskPrice: Number(s.stopDeskPrice) || 0,
            isActive: Boolean(s.isActive),
            estimatedDays: Number(s.estimatedDays) || 3,
          });
        }
      }
      setMsg("All delivery settings saved successfully!");
      loadSettings();
    } catch (e: any) {
      setErr("Failed to save: " + (e.response?.data?.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px 24px", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Delivery & Shipping</h1>
        <button onClick={saveAll} className="btn-primary" disabled={loading} style={{ padding: "12px 28px", fontSize: 15 }}>
          {loading ? "Saving..." : "Save All Settings"}
        </button>
      </div>

      {msg && <div style={{ background: "#0d2818", border: "1px solid #10b981", borderRadius: 8, padding: 12, marginBottom: 16, color: "#10b981" }}>{msg}</div>}
      {err && <div style={{ background: "#2d1215", border: "1px solid #dc2626", borderRadius: 8, padding: 12, marginBottom: 16, color: "#f87171" }}>{err}</div>}

      <p style={{ color: "#888", marginBottom: 16, fontSize: 13 }}>
        Set delivery prices for each wilaya. Enable the wilayas where you offer delivery and set home / stop desk prices.
      </p>

      <div className="card" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #333" }}>
              <th style={{ padding: "10px", textAlign: "left", color: "#888", fontSize: 12 }}>Code</th>
              <th style={{ padding: "10px", textAlign: "left", color: "#888", fontSize: 12 }}>Wilaya</th>
              <th style={{ padding: "10px", textAlign: "left", color: "#888", fontSize: 12 }}>Enabled</th>
              <th style={{ padding: "10px", textAlign: "left", color: "#888", fontSize: 12 }}>Home Price (DZD)</th>
              <th style={{ padding: "10px", textAlign: "left", color: "#888", fontSize: 12 }}>Stop Desk (DZD)</th>
              <th style={{ padding: "10px", textAlign: "left", color: "#888", fontSize: 12 }}>Days</th>
            </tr>
          </thead>
          <tbody>
            {allWilayas.map((w) => {
              const s = getSetting(w.code);
              return (
                <tr key={w.code} style={{ borderBottom: "1px solid #1a1a1a" }}>
                  <td style={{ padding: "8px 10px", fontSize: 13 }}>{w.code}</td>
                  <td style={{ padding: "8px 10px", fontSize: 13 }}>{w.name}</td>
                  <td style={{ padding: "8px 10px" }}>
                    <input
                      type="checkbox"
                      checked={s.isActive}
                      onChange={(e) => updateLocal(w.code, "isActive", e.target.checked)}
                      style={{ width: 18, height: 18, cursor: "pointer" }}
                    />
                  </td>
                  <td style={{ padding: "8px 10px" }}>
                    <input
                      className="input"
                      type="number"
                      value={s.homePrice}
                      onChange={(e) => updateLocal(w.code, "homePrice", Number(e.target.value))}
                      style={{ width: 100, padding: "6px 8px" }}
                    />
                  </td>
                  <td style={{ padding: "8px 10px" }}>
                    <input
                      className="input"
                      type="number"
                      value={s.stopDeskPrice}
                      onChange={(e) => updateLocal(w.code, "stopDeskPrice", Number(e.target.value))}
                      style={{ width: 100, padding: "6px 8px" }}
                    />
                  </td>
                  <td style={{ padding: "8px 10px" }}>
                    <input
                      className="input"
                      type="number"
                      value={s.estimatedDays}
                      onChange={(e) => updateLocal(w.code, "estimatedDays", Number(e.target.value))}
                      style={{ width: 60, padding: "6px 8px" }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}