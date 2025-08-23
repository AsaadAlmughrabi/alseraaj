"use client";
import {Link} from "@/i18n/navigation";
import {useTranslations} from "next-intl";
import LocaleSwitcher from "./LocaleSwitcher";

export default function Navbar() {
  const t = useTranslations("nav");
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/50 bg-white/70 backdrop-blur ltr:text-left rtl:text-right">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-semibold">Aleseerajj</Link>
        <nav className="hidden gap-6 text-sm text-neutral-700 md:flex">
          <Link href="/#services">{t("services")}</Link>
          <Link href="/#work">{t("work")}</Link>
          <Link href="/#process">{t("process")}</Link>
          <Link href="/#contact">{t("contact")}</Link>
        </nav>
        <LocaleSwitcher />
      </div>
    </header>
  );
}
