"use client";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";

export default function ConditionalNavbar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(!window.location.pathname.startsWith("/store/"));
  }, []);

  if (!show) return null;
  return <Navbar />;
}
