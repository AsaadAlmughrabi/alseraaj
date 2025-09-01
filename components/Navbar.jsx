"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useId,
} from "react";
import { createPortal } from "react-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import useScrollTransparency from "../hooks/useScrollTransparency";
import { servicesStructure, galleryKeys } from "../lib/menuData";

/* ---------------------------------- utils --------------------------------- */
function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function useOutsideClick(ref, handler) {
  useEffect(() => {
    function onDocClick(e) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) handler?.(e);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("touchstart", onDocClick, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("touchstart", onDocClick);
    };
  }, [ref, handler]);
}

const Chevron = ({ open }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 20 20"
    className={cx(
      "inline-block ltr:ml-1 rtl:mr-1 transition-transform duration-200",
      open && "rotate-180"
    )}
    aria-hidden="true"
  >
    <path
      d="M5 8l5 5 5-5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* -------------------------- floating panel wrapper ------------------------- */
function FloatingPanel({
  anchorRef,
  open,
  onRequestClose,
  children,
  width = 760,
}) {
  const panelRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const closeTimer = useRef(null);

  const clear = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  const scheduleClose = () => {
    clear();
    closeTimer.current = setTimeout(() => onRequestClose?.(), 140);
  };

  // Reposition on open/resize/scroll
  useEffect(() => {
    const update = () => {
      const btn = anchorRef.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const vw = window.innerWidth;
      const left = Math.min(
        Math.max(12, rect.left + rect.width / 2 - width / 2),
        vw - width - 12
      );
      const top = rect.bottom + 10;
      setPos({ top, left });
    };
    if (open) {
      update();
      window.addEventListener("resize", update);
      window.addEventListener("scroll", update, { passive: true });
      return () => {
        window.removeEventListener("resize", update);
        window.removeEventListener("scroll", update);
      };
    }
  }, [open, anchorRef, width]);

  // Close when clicking outside the panel (not the whole header)
  useOutsideClick(panelRef, () => onRequestClose?.());

  if (!open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="false"
      className="fixed inset-0 z-[60] pointer-events-none"
      // allow hover from trigger -> panel without flicker; close only for mouse
      onPointerEnter={clear}
      onPointerLeave={(e) => {
        if ((e.pointerType || "mouse") === "mouse") scheduleClose();
      }}
    >
      <div
        ref={panelRef}
        className="pointer-events-auto rounded-xl border border-black/10 bg-white shadow-xl"
        style={{
          position: "fixed",
          top: `${pos.top}px`,
          left: `${pos.left}px`,
          width: `${width}px`,
        }}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

/* ------------------------------ main component ----------------------------- */
export default function Navbar() {
  const tNav = useTranslations("nav");
  const tServices = useTranslations("services");
  const tGallery = useTranslations("gallery");
  const locale = useLocale();
  const pathname = usePathname();
  const scrolled = useScrollTransparency(16);

  const root = `/${locale}`;
  const uid = useId();

  const ids = useMemo(
    () => ({
      servicesPanel: `services-panel-${uid}`,
      galleryPanel: `gallery-panel-${uid}`,
      mobileServices: `m-services-${uid}`,
      mobileGallery: `m-gallery-${uid}`,
    }),
    [uid]
  );

  const [openSection, setOpenSection] = useState(null); // 'services' | 'gallery' | null
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileGalleryOpen, setMobileGalleryOpen] = useState(false);

  const headerRef = useRef(null);
  const servicesBtnRef = useRef(null);
  const galleryBtnRef = useRef(null);

  // Close menus on outside click (desktop header only)
  useOutsideClick(headerRef, () => setOpenSection(null));

  // Close everything on route change
  useEffect(() => {
    setOpenSection(null);
    setMobileOpen(false);
    setMobileServicesOpen(false);
    setMobileGalleryOpen(false);
  }, [pathname]);

  // ESC closes everything
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpenSection(null);
        setMobileOpen(false);
        setMobileServicesOpen(false);
        setMobileGalleryOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = useCallback(
    (href) =>
      !!pathname && (pathname === href || pathname.startsWith(href + "/")),
    [pathname]
  );

  const maxH = "max-h-[2000px]";

  const navLink = useMemo(
    () =>
      cx(
        "rounded-md px-3 py-2 text-sm font-medium text-black/80 hover:text-black",
        "focus:outline-none focus:ring-2 focus:ring-[#EB5B00]",
        "bg-[linear-gradient(90deg,#EB5B00,#FFCC00)] [background-size:0%_2px] [background-repeat:no-repeat] [background-position:left_100%] hover:[background-size:100%_2px] transition-[background-size]"
      ),
    []
  );

  // Announce opening to close other panels (like LanguageSwitcher)
  const announceOpen = (section) =>
    window.dispatchEvent(
      new CustomEvent("nav:open-section", { detail: section })
    );

  const onHover = (section) => (e) => {
    if (e.pointerType === "mouse") {
      setOpenSection(section);
      announceOpen(section);
    }
  };

  const onButtonKeyDown = (section) => (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const next = openSection === section ? null : section;
      setOpenSection(next);
      if (next) announceOpen(section);
    } else if (e.key === "ArrowDown") {
      setOpenSection(section);
      announceOpen(section);
    } else if (e.key === "Escape") {
      setOpenSection(null);
      e.currentTarget.blur();
    }
  };

  /* ------------------------------ small subparts ----------------------------- */
  const NavButton = ({ label, section, controlsId, buttonRef }) => (
    <button
      ref={buttonRef}
      type="button"
      className={cx(navLink, "flex items-center")}
      aria-haspopup="menu"
      aria-expanded={openSection === section}
      aria-controls={controlsId}
      onPointerEnter={onHover(section)}
      onClick={() => {
        const next = openSection === section ? null : section;
        setOpenSection(next);
        if (next) announceOpen(section);
      }}
      onKeyDown={onButtonKeyDown(section)}
    >
      {label} <Chevron open={openSection === section} />
    </button>
  );

  const ServicesPanel = () => (
    <div
      id={ids.servicesPanel}
      role="menu"
      aria-label={tNav("services")}
      className="overflow-hidden"
    >
      <div className="px-5 py-4">
        <div className="grid md:grid-cols-2 gap-4">
          {servicesStructure.map(({ groupKey, items }) => (
            <div
              key={groupKey}
              className="rounded-lg bg-gray-50 p-3 border border-black/10"
            >
              <h3 className="mb-2 text-sm font-semibold tracking-wide text-gray-700">
                {tServices(`groups.${groupKey}.label`)}
              </h3>
              <ul className="space-y-2">
                {items.map((key) => (
                  <li key={key}>
                    <Link
                      href={`${root}/services/${key}`}
                      role="menuitem"
                      className="block rounded-md p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FFCC00]"
                      onClick={() => setOpenSection(null)}
                    >
                      <p className="text-sm font-medium text-gray-900">
                        {tServices(`items.${key}.label`)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {tServices(`items.${key}.desc`)}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const GalleryPanel = () => (
    <div
      id={ids.galleryPanel}
      role="menu"
      aria-label={tNav("gallery")}
      className="overflow-hidden"
    >
      <div className="px-5 py-4">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {galleryKeys.map((gKey) => (
            <Link
              key={gKey}
              href={`${root}/gallery/${gKey}`}
              role="menuitem"
              className="rounded-lg bg-gray-50 p-3 border border-black/10 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FFCC00]"
              onClick={() => setOpenSection(null)}
            >
              <p className="text-sm font-medium text-gray-900">
                {tGallery(`items.${gKey}.label`)}
              </p>
              <p className="text-xs text-gray-500 ">
                {tGallery(`items.${gKey}.desc`)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

  const DesktopTopRow = () => (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between py-3">
        {/* Logo */}
        <div className="flex items-center">
          <Link
            href={root}
            aria-label="Go to homepage"
            className="flex items-center"
          >
            <Image
              src="/logos/logo.svg"
              alt="Brand logo"
              width={46}
              height={46}
              priority
              className="h-15 w-15"
            />
          </Link>
        </div>

        {/* Desktop nav */}
        <nav role="navigation" aria-label="Main" className="hidden md:block">
          <ul role="menubar" className="flex items-center gap-1">
            <li role="none">
              <Link
                role="menuitem"
                href={root}
                className={cx(navLink, isActive(root) && "text-black")}
              >
                {tNav("home")}
              </Link>
            </li>

            <li role="none">
              <NavButton
                label={tNav("services")}
                section="services"
                controlsId={ids.servicesPanel}
                buttonRef={servicesBtnRef}
              />
            </li>

            <li role="none">
              <NavButton
                label={tNav("gallery")}
                section="gallery"
                controlsId={ids.galleryPanel}
                buttonRef={galleryBtnRef}
              />
            </li>

            <li role="none">
              <Link
                role="menuitem"
                href={`${root}/contact`}
                className={cx(
                  navLink,
                  isActive(`${root}/contact`) && "text-white"
                )}
              >
                {tNav("contact")}
              </Link>
            </li>
            <li role="none">
              <Link
                role="menuitem"
                href={`${root}/about`}
                className={cx(
                  navLink,
                  isActive(`${root}/about`) && "text-white"
                )}
              >
                {tNav("about")}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right: language + mobile trigger */}
        <div className="hidden md:block">
          <LanguageSwitcher />
        </div>
        <div className="md:hidden">
          <button
            type="button"
            className="rounded-md p-2 text-gray-900 hover:text-black focus:outline-none focus:ring-2 focus:ring-[#FFCC00]"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => {
              setMobileOpen((v) => !v);
              setMobileServicesOpen(false);
              setMobileGalleryOpen(false);
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  const MobileStack = () => (
    <div className="md:hidden">
      <div className="px-4 sm:px-6 lg:px-8 pb-4">
        <nav role="navigation" aria-label="Mobile Main">
          <ul className="space-y-2">
            <li>
              <Link
                href={root}
                className="block rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FFCC00]"
                onClick={() => setMobileOpen(false)}
              >
                {tNav("home")}
              </Link>
            </li>

            {/* Mobile Services accordion */}
            <li>
              <button
                type="button"
                className="w-full rounded-lg px-3 py-2 text-left text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FFCC00] flex items-center justify-between"
                aria-haspopup="menu"
                aria-expanded={mobileServicesOpen}
                aria-controls={ids.mobileServices}
                onClick={() => setMobileServicesOpen((v) => !v)}
              >
                <span>{tNav("services")}</span>{" "}
                <Chevron open={mobileServicesOpen} />
              </button>
              <div
                id={ids.mobileServices}
                className={cx(
                  "overflow-hidden transition-[max-height] duration-300",
                  mobileServicesOpen ? maxH : "max-h-0"
                )}
              >
                <div className="ps-3">
                  {servicesStructure.map(({ groupKey, items }) => (
                    <div key={groupKey} className="my-2">
                      <p className="px-3 py-1 text-xs text-gray-600">
                        {tServices(`groups.${groupKey}.label`)}
                      </p>
                      <ul className="ps-2">
                        {items.map((key) => (
                          <li key={key}>
                            <Link
                              href={`${root}/services/${key}`}
                              className="block rounded-md px-3 py-2 text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FFCC00]"
                              onClick={() => setMobileOpen(false)}
                            >
                              {tServices(`items.${key}.label`)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </li>

            {/* Mobile Gallery accordion */}
            <li>
              <button
                type="button"
                className="w-full rounded-lg px-3 py-2 text-left text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FFCC00] flex items-center justify-between"
                aria-haspopup="menu"
                aria-expanded={mobileGalleryOpen}
                aria-controls={ids.mobileGallery}
                onClick={() => setMobileGalleryOpen((v) => !v)}
              >
                <span>{tNav("gallery")}</span>{" "}
                <Chevron open={mobileGalleryOpen} />
              </button>
              <div
                id={ids.mobileGallery}
                className={cx(
                  "overflow-hidden transition-[max-height] duration-300",
                  mobileGalleryOpen ? maxH : "max-h-0"
                )}
              >
                <div className="ps-3">
                  <ul className="ps-2">
                    {galleryKeys.map((gKey) => (
                      <li key={gKey}>
                        <Link
                          href={`${root}/gallery/${gKey}`}
                          className="block rounded-md px-3 py-2 text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FFCC00]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {tGallery(`items.${gKey}.label`)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>

            <li>
              <Link
                href={`${root}/contact`}
                className="block rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FFCC00]"
                onClick={() => setMobileOpen(false)}
              >
                {tNav("contact")}
              </Link>
            </li>
            <li>
              <Link
                href={`${root}/about`}
                className="block rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FFCC00]"
                onClick={() => setMobileOpen(false)}
              >
                {tNav("about")}
              </Link>
            </li>

            <li className="pt-2 border-t border-gray-200">
              <LanguageSwitcher />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );

  /* --------------------------------- render --------------------------------- */
  return (
    <header
      ref={headerRef}
      className={cx(
        "border-b border-black/10 backdrop-blur-md",
        scrolled
          ? "bg-white/80 shadow-[inset_0_-1px_0_rgba(0,0,0,.06)]"
          : "bg-white/95"
      )}
    >
      <DesktopTopRow />

      {/* Floating (overlay) panels for desktop */}
      <FloatingPanel
        anchorRef={servicesBtnRef}
        open={openSection === "services"}
        onRequestClose={() => setOpenSection(null)}
        width={760}
      >
        <ServicesPanel />
      </FloatingPanel>

      <FloatingPanel
        anchorRef={galleryBtnRef}
        open={openSection === "gallery"}
        onRequestClose={() => setOpenSection(null)}
        width={760}
      >
        <GalleryPanel />
      </FloatingPanel>

      {/* Mobile stacked menu in normal flow */}
      <div
        className={cx(
          "md:hidden transition-[max-height] duration-300 overflow-hidden",
          mobileOpen ? maxH : "max-h-0"
        )}
      >
        <MobileStack />
      </div>
    </header>
  );
}
