import { useCallback, useEffect, useState } from "react";
import type { FC } from "react";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ArrowUpRight, Menu, X } from "lucide-react";
import SuspenseLoader from "~components/SuspenseLoader";
const links = [
  { to: "/index.html", label: "Home" },
  { to: "/handbook.html", label: "Handbook" },
  { to: "/chain-of-command.html", label: "Chain of Command" },
  { to: "/vehicle-guidelines.html", label: "Vehicle Guidelines" },
  { to: "/troopers.html", label: "Troopers" },
  { to: "/official_media.html", label: "Official Media" },
] as const;
const titles: Record<string, string> = {
  "/": "Home",
  ...Object.fromEntries(links.map((link) => [link.to, link.label])),
  "/hspu_app_new.html": "HSPU Application",
  "/srt_app_new.html": "SRT Application",
};
const Layout: FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const path = useRouterState({ select: (state) => state.location.pathname });
  useEffect((): void => {
    setMenuOpen(false);
    document.title = `${titles[path] ?? "Page"} | FHP Ghost Unit`;
  }, [path]);
  const toggleMenu = useCallback((): void => setMenuOpen((open) => !open), []);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="site-header">
        <Link to="/index.html" className="brand" aria-label="Ghost Unit home">
          <img
            src="/assets/logo.png"
            alt="Florida Highway Patrol Ghost Unit logo"
            width="54"
            height="54"
          />
          <span>
            <strong>GHOST UNIT</strong>
            <small>FLORIDA HIGHWAY PATROL</small>
          </span>
        </Link>
        <button
          className="menu-toggle icon-button"
          aria-controls="primary-nav"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          onClick={toggleMenu}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
        <nav
          id="primary-nav"
          aria-label="Main navigation"
          className={menuOpen ? "is-open" : ""}
        >
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={
                path === link.to || (path === "/" && link.to === "/index.html")
                  ? "active"
                  : ""
              }
              aria-current={
                path === link.to || (path === "/" && link.to === "/index.html")
                  ? "page"
                  : undefined
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
      <main id="main" tabIndex={-1}>
        <SuspenseLoader>
          <Outlet />
        </SuspenseLoader>
      </main>
      <footer className="site-footer">
        <div className="footer-brand">
          <img src="/assets/logo.png" width="52" height="52" alt="" />
          <div>
            <strong>FHP Ghost Unit</strong>
            <span>FSRP • Florida Highway Patrol Ghost Unit</span>
          </div>
        </div>
        <Link to="/handbook.html" className="footer-link">
          Handbook <ArrowUpRight size={18} />
        </Link>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} FHP GHOST UNIT</span>
          <span>A DIVISION OF FSRP</span>
          <span>REDUCE SPEED — ARRIVE ALIVE</span>
        </div>
      </footer>
    </>
  );
};
export default Layout;
