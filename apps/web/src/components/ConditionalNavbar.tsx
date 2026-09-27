"use client";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import Navbar from "./Navbar";

function Inner() {
  const pathname = usePathname();
  if (!pathname) return null;
  if (pathname.startsWith("/store/")) return null;
  return <Navbar />;
}

export default function ConditionalNavbar() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}