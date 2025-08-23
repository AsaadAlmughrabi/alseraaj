// components/LocaleSwitcher.jsx
"use client";
import {Link, usePathname} from "@/i18n/navigation";
import {useParams} from "next/navigation";

export default function LocaleSwitcher() {
  const pathname = usePathname();
  const current = useParams()?.locale || "en";
  return (
    <div className="inline-flex items-center gap-3 text-sm">
      <Link href={pathname} locale="en" className={current === "en" ? "font-semibold" : ""}>EN</Link>
      <span className="opacity-50">/</span>
      <Link href={pathname} locale="ar" className={current === "ar" ? "font-semibold" : ""}>AR</Link>
    </div>
  );
}
