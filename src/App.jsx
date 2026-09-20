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


function App() {
  const [account, setAccount] = useState(null);
  const [activeSection, setActiveSection] = useState("home");

  const issueRef = useRef(null);
  const verifyRef = useRef(null);

  // Prevent the scroll listener from immediately
  // overriding the button we just selected.
  const navigationLock = useRef(false);


  /*
   * Get the actual position of a section.
   */
  const getSectionTop = (element) => {
    if (!element) return null;

    return (
      element.getBoundingClientRect().top +
      window.scrollY
    );
  };


  /*
   * Scroll to Verify / Issue section.
   */
  const scrollToSection = (ref, hash, sectionName) => {
    if (window.location.pathname !== "/") {
      window.location.href = `/${hash}`;
      return;
    }

    if (!ref.current) return;

    const navbarHeight = 78;
    const elementTop = getSectionTop(ref.current);

    if (elementTop === null) return;

    // Immediately show the correct active button.
    setActiveSection(sectionName);

    // Prevent scroll detection from changing it
    // while smooth scrolling is happening.
    navigationLock.current = true;

    window.history.replaceState(
      null,
      "",
      `/${hash}`
    );

    window.scrollTo({
      top: Math.max(
        0,
        elementTop - navbarHeight - 20
      ),
      left: 0,
      behavior: "smooth",
    });

    // Release the lock after smooth scrolling.
    setTimeout(() => {
      navigationLock.current = false;
    }, 900);
  };


  /*
   * Always return to the very top when Home is clicked.
   */
  const handleHomeClick = (event) => {
    if (window.location.pathname === "/") {
      event.preventDefault();

      // Remove #verify / #issue from the URL.
      window.history.replaceState(
        null,
        "",
        "/"
      );

      // Immediately make Home active.
      setActiveSection("home");

      // Lock active-section detection while scrolling.
      navigationLock.current = true;

      // Scroll completely to the top.
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });

      setTimeout(() => {
        navigationLock.current = false;
      }, 900);
    } else {
      // When coming from Team or Details,
      // Home should become active.
      setActiveSection("home");
    }
  };


  /*
   * Connect MetaMask wallet.
   */
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
        alert("Wallet connection was rejected.");
      } else {
        alert("Unable to connect wallet.");
      }
    }
  };


  /*
   * Verify button.
   */
  const scrollToVerify = () => {
    scrollToSection(
      verifyRef,
      "#verify",
      "verify"
    );
  };


  /*
   * Issue button.
   */
  const scrollToIssue = () => {
    scrollToSection(
      issueRef,
      "#issue",
      "issue"
    );
  };


  /*
   * Handle #verify and #issue when:
   *
   * /#verify
   * /#issue
   *
   * is opened directly or when coming
   * from another page.
   */
  useEffect(() => {
    if (window.location.pathname !== "/") {
      return;
    }

    const hash = window.location.hash;

    if (!hash) {
      setActiveSection("home");
      return;
    }

    const sectionName =
      hash === "#verify"
        ? "verify"
        : hash === "#issue"
        ? "issue"
        : "home";

    setActiveSection(sectionName);

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

    return () => clearTimeout(timer);
  }, []);


  /*
   * Keep navbar active state synchronized
   * with manual scrolling.
   *
   * This version DOES NOT assume that Verify
   * comes before Issue or vice versa.
   */
  useEffect(() => {
    if (window.location.pathname !== "/") {
      return;
    }

    const handleScroll = () => {
      if (navigationLock.current) {
        return;
      }

      const verifyElement = verifyRef.current;
      const issueElement = issueRef.current;

      const verifyTop =
        getSectionTop(verifyElement);

      const issueTop =
        getSectionTop(issueElement);

      const scrollPosition =
        window.scrollY + 150;


      /*
       * If both sections exist,
       * determine which section is currently
       * closest to the navbar.
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
          (section) => section.top !== null
        )
        .sort(
          (a, b) => a.top - b.top
        );


      /*
       * At the top of Home,
       * before reaching the first workspace section.
       */
      if (
        sections.length === 0 ||
        scrollPosition < sections[0].top
      ) {
        setActiveSection("home");
        return;
      }


      /*
       * Find the last section that has been reached.
       */
      let currentSection = "home";

      for (const section of sections) {
        if (scrollPosition >= section.top) {
          currentSection = section.name;
        }
      }

      setActiveSection(currentSection);
    };


    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    // Run once on load.
    handleScroll();

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);


  return (
    <BrowserRouter>
      <ScrollToTop />

      <nav className="navbar">

        {/* LOGO / HOME */}
        <Link
          to="/"
          className={`logo ${
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


        <div className="nav-links">

          {/* HOME */}
          <Link
            to="/"
            className={
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
              isActive ? "active" : ""
            }
            onClick={() =>
              setActiveSection("team")
            }
          >
            Team
          </NavLink>


          {/* DETAILS */}
          <NavLink
            to="/details"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
            onClick={() =>
              setActiveSection("details")
            }
          >
            Details
          </NavLink>

        </div>


        {/* CONNECT WALLET */}
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

    </BrowserRouter>
  );
}

export default App;