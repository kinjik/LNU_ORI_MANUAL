import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { lnuOri } from "../../assets/images";
import { MouseEvent, useEffect } from "react";
import { useAuthContextProvider } from "../../hooks/hooks";
import { redirectLink } from "../../constant/redirectLinks";

/** Scroll container for routed pages; avoids `scrollIntoView` scrolling `html`/`body` (mobile layout jump). */
export const APP_LAYOUT_SCROLL_ROOT_ID = "app-layout-scroll";

function scrollSectionIntoLayout(sectionId: string) {
  const target = document.getElementById(sectionId);
  if (!target) return;

  const root = document.getElementById(APP_LAYOUT_SCROLL_ROOT_ID);
  if (root) {
    const rootRect = root.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const nextTop = root.scrollTop + (targetRect.top - rootRect.top);
    root.scrollTo({ top: Math.max(0, nextTop), behavior: "smooth" });
    return;
  }

  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

const Navbar = () => {
  const { user } = useAuthContextProvider();
  const location = useLocation();
  const roleName = user?.roles?.[0]?.name;
  const redirectUser = roleName ? redirectLink[roleName] ?? "/" : "/";
  const homeLink = location.pathname === "/" ? "#home" : "/#home";
  const aboutLink = location.pathname === "/" ? "#about" : "/#about";

  const handleSectionClick = (
    event: MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    if (location.pathname !== "/") {
      return;
    }

    event.preventDefault();
    scrollSectionIntoLayout(sectionId);
    window.history.replaceState(null, "", `#${sectionId}`);
  };

  useEffect(() => {
    if (!location.hash) return;
    const targetId = location.hash.slice(1);
    scrollSectionIntoLayout(targetId);
  }, [location.hash]);

  return (
    <div className="flex h-svh min-h-0 flex-col overflow-hidden bg-background text-lg font-medium scrollbar-thin scrollbar-track-[#f1f1f1] scrollbar-thumb-[#c1c1c1]">
      <div className="flex min-h-0 flex-1 flex-col">
        <nav className="relative z-30 flex shrink-0 flex-wrap items-center gap-3 bg-primary p-2 px-4 shadow-custom">
          <Link to="/" className="flex shrink-0 items-center">
            {/* Logo */}
            <img
              src={lnuOri}
              alt="LNU ORI LOGO"
              className="h-[55px] w-[62px]"
              loading="lazy"
            />
          </Link>
          <div className="ml-auto flex items-center">
            <ul className="flex flex-wrap items-center justify-end gap-2 pr-0 text-white sm:gap-4 md:gap-6 lg:gap-10">
              <li>
                <Link
                  to={homeLink}
                  className="rounded-md border-b-2 border-transparent px-2 py-1 text-xs text-white hover:border-b-amber-300 sm:px-3 sm:text-sm md:text-base"
                  onClick={(event) => handleSectionClick(event, "home")}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to={aboutLink}
                  className="rounded-md border-b-2 border-transparent px-2 py-1 text-xs text-white hover:border-b-amber-300 sm:px-3 sm:text-sm md:text-base"
                  onClick={(event) => handleSectionClick(event, "about")}
                >
                  About
                </Link>
              </li>
              <li>
                {!user ? (
                  <NavLink
                    to="/login"
                    className={() =>
                      "rounded-md border-b-2 border-transparent px-2 py-1 text-xs text-white hover:border-b-amber-300 sm:px-3 sm:text-sm md:text-base"
                    }
                  >
                    Login
                  </NavLink>
                ) : (
                  <NavLink
                    to={redirectUser}
                    className={() =>
                      "rounded-md border-b-2 border-transparent px-2 py-1 text-xs text-white hover:border-b-amber-300 sm:px-3 sm:text-sm md:text-base"
                    }
                  >
                    Dashboard
                  </NavLink>
                )}
              </li>
            </ul>
          </div>
        </nav>
        <main
          id={APP_LAYOUT_SCROLL_ROOT_ID}
          className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Navbar;
