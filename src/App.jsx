import { useEffect, useRef, useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  useLocation,
} from "react-router-dom";

import veriflyLogo from "./verifly_logo.png";

import Home from "./pages/Home";
import Team from "./pages/Team";
import Details from "./pages/Details";


/* ========================================
   SCROLL TO TOP
======================================== */

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // When changing between actual pages,
    // always start at the top.
    if (pathname !== "/") {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }
  }, [pathname]);

  return null;
}


/* ========================================
   MAIN APP CONTENT
======================================== */

function AppContent() {
  const location = useLocation();

  const [account, setAccount] = useState(null);
  const [activeSection, setActiveSection] = useState("home");

  const issueRef = useRef(null);
  const verifyRef = useRef(null);

  /*
   * Prevent the scroll listener from immediately
   * overriding the button we just selected.
   */
  const navigationLock = useRef(false);


  /* ========================================
     GET SECTION POSITION
  ======================================== */

  const getSectionTop = (element) => {
    if (!element) return null;

    return (
      element.getBoundingClientRect().top +
      window.scrollY
    );
  };


  /* ========================================
     SCROLL TO VERIFY / ISSUE
  ======================================== */

  const scrollToSection = (
    ref,
    hash,
    sectionName
  ) => {
    /*
     * If currently on Team or Details,
     * navigate back to Home first.
     *
     * The hash will then be handled by
     * the Home page effect.
     */
    if (location.pathname !== "/") {
      window.location.href = `/${hash}`;
      return;
    }

    if (!ref.current) return;

    const navbarHeight = 78;

    const elementTop =
      getSectionTop(ref.current);

    if (elementTop === null) return;

    /*
     * Immediately activate the selected
     * navigation button.
     */
    setActiveSection(sectionName);

    /*
     * Prevent the scroll listener from
     * changing the active state while
     * smooth scrolling.
     */
    navigationLock.current = true;

    /*
     * Update URL.
     */
    window.history.replaceState(
      null,
      "",
      `/${hash}`
    );

    /*
     * Scroll to section.
     */
    window.scrollTo({
      top: Math.max(
        0,
        elementTop - navbarHeight - 20
      ),
      left: 0,
      behavior: "smooth",
    });

    /*
     * Release scroll lock after animation.
     */
    setTimeout(() => {
      navigationLock.current = false;
    }, 900);
  };


  /* ========================================
     HOME BUTTON
  ======================================== */

  const handleHomeClick = (event) => {
    /*
     * If already on Home,
     * prevent React Router navigation
     * and smoothly return to the top.
     */
    if (location.pathname === "/") {
      event.preventDefault();

      /*
       * Remove #verify / #issue.
       */
      window.history.replaceState(
        null,
        "",
        "/"
      );

      /*
       * Home becomes active immediately.
       */
      setActiveSection("home");

      /*
       * Prevent scroll detection from
       * changing the active state.
       */
      navigationLock.current = true;

      /*
       * Scroll completely to the top.
       */
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });

      setTimeout(() => {
        navigationLock.current = false;
      }, 900);
    } else {
      /*
       * We are navigating from Team/Details
       * back to Home.
       */
      setActiveSection("home");
    }
  };


  /* ========================================
     CONNECT METAMASK
  ======================================== */

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert(
        "MetaMask is not installed. Please install the MetaMask browser extension to connect your wallet."
      );

      return;
    }

    try {
      const accounts =
        await window.ethereum.request({
          method: "eth_requestAccounts",
        });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    } catch (error) {
      console.error(
        "Wallet connection error:",
        error
      );

      if (error.code === 4001) {
        alert(
          "Wallet connection was rejected."
        );
      } else {
        alert(
          "Unable to connect wallet."
        );
      }
    }
  };


  /* ========================================
     VERIFY BUTTON
  ======================================== */

  const scrollToVerify = () => {
    scrollToSection(
      verifyRef,
      "#verify",
      "verify"
    );
  };


  /* ========================================
     ISSUE BUTTON
  ======================================== */

  const scrollToIssue = () => {
    scrollToSection(
      issueRef,
      "#issue",
      "issue"
    );
  };


  /* ========================================
     ROUTE ACTIVE STATE
  ======================================== */

  /*
   * Team and Details are real pages.
   *
   * When entering those pages, they become
   * the ONLY active navigation item.
   *
   * Home / Verify / Issue are only allowed
   * to be active on "/".
   */
  useEffect(() => {
    if (location.pathname === "/team") {
      setActiveSection("team");
      return;
    }

    if (location.pathname === "/details") {
      setActiveSection("details");
      return;
    }

    if (location.pathname === "/") {
      const hash = window.location.hash;

      if (hash === "#verify") {
        setActiveSection("verify");
      } else if (hash === "#issue") {
        setActiveSection("issue");
      } else {
        setActiveSection("home");
      }
    }
  }, [location.pathname]);


  /* ========================================
     HANDLE DIRECT HASH NAVIGATION
  ======================================== */

  useEffect(() => {
    /*
     * Hash navigation only applies to Home.
     */
    if (location.pathname !== "/") {
      return;
    }

    const hash = window.location.hash;

    if (!hash) {
      return;
    }

    const sectionName =
      hash === "#verify"
        ? "verify"
        : hash === "#issue"
        ? "issue"
        : "home";

    setActiveSection(sectionName);

    /*
     * Wait for Home component to render.
     */
    const timer = setTimeout(() => {
      const element =
        document.getElementById(
          hash.substring(1)
        );

      if (!element) return;

      const navbarHeight = 78;

      const elementTop =
        element.getBoundingClientRect().top +
        window.scrollY;

      window.scrollTo({
        top: Math.max(
          0,
          elementTop - navbarHeight - 20
        ),
        left: 0,
        behavior: "instant",
      });
    }, 150);

    return () => {
      clearTimeout(timer);
    };
  }, [location.pathname]);


  /* ========================================
     SCROLL ACTIVE STATE
  ======================================== */

  useEffect(() => {
    /*
     * Scroll detection ONLY runs on Home.
     */
    if (location.pathname !== "/") {
      return;
    }

    const handleScroll = () => {
      /*
       * Do not change active button during
       * programmatic smooth scrolling.
       */
      if (navigationLock.current) {
        return;
      }

      /*
       * Safety check.
       */
      if (window.location.pathname !== "/") {
        return;
      }

      const verifyElement =
        verifyRef.current;

      const issueElement =
        issueRef.current;

      const verifyTop =
        getSectionTop(verifyElement);

      const issueTop =
        getSectionTop(issueElement);

      /*
       * Offset for the navbar.
       */
      const scrollPosition =
        window.scrollY + 150;


      /*
       * Create section list and sort it
       * according to its REAL position.
       *
       * This means the code does not assume
       * Verify comes before Issue.
       */
      const sections = [
        {
          name: "verify",
          top: verifyTop,
        },
        {
          name: "issue",
          top: issueTop,
        },
      ]
        .filter(
          (section) =>
            section.top !== null
        )
        .sort(
          (a, b) =>
            a.top - b.top
        );


      /*
       * At the top of Home,
       * Home is active.
       */
      if (
        sections.length === 0 ||
        scrollPosition < sections[0].top
      ) {
        setActiveSection("home");
        return;
      }


      /*
       * Find the latest section that
       * has been reached.
       */
      let currentSection = "home";

      for (const section of sections) {
        if (
          scrollPosition >= section.top
        ) {
          currentSection =
            section.name;
        }
      }

      setActiveSection(
        currentSection
      );
    };


    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    /*
     * Run once when Home loads.
     */
    handleScroll();


    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, [location.pathname]);


  /* ========================================
     NAVBAR
  ======================================== */

  return (
    <>
      <nav className="navbar">

        {/* ==================================
            LOGO / HOME
        ================================== */}

        <Link
          to="/"
          className={`logo ${
            location.pathname === "/" &&
            activeSection === "home"
              ? "active"
              : ""
          }`}
          aria-label="VERIFLY Home"
          onClick={handleHomeClick}
        >
          <img
            src={veriflyLogo}
            alt="VERIFLY"
          />
        </Link>


        {/* ==================================
            NAV LINKS
        ================================== */}

        <div className="nav-links">

          {/* HOME */}

          <Link
            to="/"
            className={
              location.pathname === "/" &&
              activeSection === "home"
                ? "active"
                : ""
            }
            onClick={handleHomeClick}
          >
            Home
          </Link>


          {/* VERIFY */}

          <button
            type="button"
            className={`nav-link-button ${
              location.pathname === "/" &&
              activeSection === "verify"
                ? "active"
                : ""
            }`}
            onClick={scrollToVerify}
          >
            Verify
          </button>


          {/* ISSUE */}

          <button
            type="button"
            className={`nav-link-button ${
              location.pathname === "/" &&
              activeSection === "issue"
                ? "active"
                : ""
            }`}
            onClick={scrollToIssue}
          >
            Issue
          </button>


          {/* TEAM */}

          <NavLink
            to="/team"
            className={({ isActive }) =>
              isActive
                ? "active"
                : ""
            }
            onClick={() => {
              navigationLock.current =
                true;

              setActiveSection(
                "team"
              );

              setTimeout(() => {
                navigationLock.current =
                  false;
              }, 500);
            }}
          >
            Team
          </NavLink>


          {/* DETAILS */}

          <NavLink
            to="/details"
            className={({ isActive }) =>
              isActive
                ? "active"
                : ""
            }
            onClick={() => {
              navigationLock.current =
                true;

              setActiveSection(
                "details"
              );

              setTimeout(() => {
                navigationLock.current =
                  false;
              }, 500);
            }}
          >
            Details
          </NavLink>

        </div>


        {/* ==================================
            CONNECT WALLET
        ================================== */}

        <button
          className="connect-btn"
          onClick={connectWallet}
        >
          {account
            ? `${account.slice(
                0,
                6
              )}...${account.slice(-4)}`
            : "Connect Wallet"}
        </button>

      </nav>


      {/* ====================================
          ROUTES
      ==================================== */}

      <Routes>

        <Route
          path="/"
          element={
            <Home
              issueRef={issueRef}
              verifyRef={verifyRef}
            />
          }
        />

        <Route
          path="/team"
          element={<Team />}
        />

        <Route
          path="/details"
          element={<Details />}
        />

      </Routes>
    </>
  );
}


/* ========================================
   APP
======================================== */

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <AppContent />
    </BrowserRouter>
  );
}


export default App;