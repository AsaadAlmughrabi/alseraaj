"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

const PANEL_WIDTH_BASE = 150;
const LANGS = [
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
];

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const search = useSearchParams();
  const locale = useLocale();
  const t = useTranslations("nav");

  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const lastPtr = useRef("mouse"); // 'mouse' | 'touch' | 'pen'
  const closeTimer = useRef(null);
  const pid = useId();

  const [pos, setPos] = useState({ top: 0, left: 0, w: PANEL_WIDTH_BASE });

  const queryStr = useMemo(() => search?.toString() ?? "", [search]);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  const scheduleClose = (ms = 120) => {
    // Only hover-close for mouse; never for touch/pen.
    if (lastPtr.current !== "mouse") return;
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), ms);
  };

  // Build href for a given locale (preserves path + query)
  const buildHref = (nextLocale) => {
    const segs = (pathname ? pathname.split("/") : [""]).filter(Boolean);
    if (segs.length) segs[0] = nextLocale;
    else segs.push(nextLocale);
    return "/" + segs.join("/") + (queryStr ? `?${queryStr}` : "");
  };

  // Position panel (responsive clamp)
  useEffect(() => {
    if (!open) return;
    const update = () => {
      const btn = triggerRef.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const vw = window.innerWidth;
      const w = Math.min(PANEL_WIDTH_BASE, Math.max(240, vw - 24));
      const left = Math.min(
        Math.max(12, rect.left + rect.width / 2 - w / 2),
        vw - w - 12
      );
      const top = rect.bottom + 10;
      setPos({ top, left, w });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
    };
  }, [open]);

  // ESC + close if another nav section opens
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onOpen = (e) => {
      if (e.detail !== "language") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("nav:open-section", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("nav:open-section", onOpen);
    };
  }, []);

  // Outside click
  useEffect(() => {
    const onDown = (e) => {
      const path = e.composedPath ? e.composedPath() : [];
      if (
        !path.includes(triggerRef.current) &&
        !path.includes(panelRef.current)
      )
        setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, []);

  const NAV_LINK =
    "rounded-md px-3 py-2 text-sm font-medium text-white hover:text-white " +
    "focus:outline-none focus:ring-2 focus:ring-[#FFCC00] " +
    "bg-[linear-gradient(90deg,#EB5B00,#FFCC00)] [background-size:0%_2px] [background-repeat:no-repeat] " +
    "[background-position:left_100%] hover:[background-size:100%_2px] transition-[background-size]";

  const panelNode =
    open &&
    createPortal(
      <div
        className="fixed inset-0 z-[60] pointer-events-none"
        onPointerEnter={(e) => {
          lastPtr.current = e.pointerType || "mouse";
          cancelClose();
        }}
        onPointerLeave={() => scheduleClose(120)}
      >
        <div
          ref={panelRef}
          id={`lang-panel-${pid}`}
          role="menu"
          aria-label={t("language")}
          className="pointer-events-auto rounded-xl border border-gray-200 bg-white shadow-xl text-gray-900"
          style={{
            position: "fixed",
            top: `${pos.top}px`,
            left: `${pos.left}px`,
            width: `${pos.w}px`,
          }}
        >
          <div className="px-4 py-3 border-b border-gray-200 text-xs font-semibold tracking-wide text-gray-600">
            {t("language")}
          </div>

          {/* multi-column; 1 col on phones, 2+ when wide */}
          <div className="p-3 [column-width:13rem] sm:[column-width:14rem] [column-gap:12px] [column-fill:balance]">
            {LANGS.map(({ code, flag, label }) => {
              const active = locale === code;
              const href = buildHref(code);
              return (
                <div key={code} className="mb-2 break-inside-avoid">
                  <Link
                    href={href}
                    replace
                    scroll={false}
                    prefetch
                    role="menuitemradio"
                    aria-checked={active ? "true" : "false"}
                    className={`w-full rounded-xl px-4 py-3 flex items-center justify-between hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FFCC00] ${
                      active ? "bg-gray-100 font-medium" : ""
                    } text-gray-900`}
                    onClick={() => setOpen(false)}
                  >
                    <span className="flex items-center gap-2">
                      <span aria-hidden className="text-base">
                        {flag}
                      </span>
                      <span className="text-sm">{label}</span>
                      <span className="text-xs ltr:ml-2 rtl:mr-2 opacity-80">
                        ({code.toUpperCase()})
                      </span>
                    </span>
                    {active && (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                        className="text-grey-600"
                      >
                        <path
                          d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 011.4-1.4L8 12.6l7.3-7.3a1 1 0 011.4 0z"
                          fill="currentColor"
                        />
                      </svg>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>,
      document.body
    );

  return (
    <div
      ref={triggerRef}
      className="inline-block"
      onPointerEnter={(e) => {
        lastPtr.current = e.pointerType || "mouse";
        if (lastPtr.current === "mouse") {
          cancelClose();
          setOpen(true);
          window.dispatchEvent(
            new CustomEvent("nav:open-section", { detail: "language" })
          );
        }
      }}
      onPointerLeave={() => scheduleClose(120)}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open ? "true" : "false"}
        aria-controls={`lang-panel-${pid}`}
        className={
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FFCC00]"
        }
        title={t("language")}
        onPointerDown={(e) => {
          lastPtr.current = e.pointerType || "mouse";
        }}
        onClick={() => {
          // On touch/pen, toggle via tap
          if (lastPtr.current !== "mouse") {
            setOpen((v) => !v);
            window.dispatchEvent(
              new CustomEvent("nav:open-section", { detail: "language" })
            );
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((v) => !v);
            window.dispatchEvent(
              new CustomEvent("nav:open-section", { detail: "language" })
            );
          } else if (e.key === "Escape") setOpen(false);
          else if (e.key === "ArrowDown") setOpen(true);
        }}
      >
        <span aria-hidden className="text-base">
          {locale === "ar"}
        </span>
        <span className="uppercase text-gray-900">{locale}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 20 20"
          aria-hidden="true"
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          } text-gray-900`}
        >
          <path
            d="M5 8l5 5 5-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {panelNode}
    </div>
  );
}
