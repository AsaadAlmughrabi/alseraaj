"use client";
import {useTranslations} from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  return (
    <footer id="contact" className="mt-20 border-t border-neutral-200/60 py-8 ltr:text-left rtl:text-right">
      <div className="mx-auto max-w-6xl px-4 text-sm text-neutral-600">
        <div>© {new Date().getFullYear()} Aleseerajj — {t("rights")}</div>
      </div>
    </footer>
  );
}
