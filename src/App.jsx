import { useEffect, useRef, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import veriflyLogo from "./verifly_logo.png";

import Home from "./pages/Home";
import Team from "./pages/Team";
import Details from "./pages/Details";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}

function App() {
  const [account, setAccount] = useState(null);

  const issueRef = useRef(null);
  const verifyRef = useRef(null);

  /*
   * Scroll to a section while keeping it below the navbar.
   */
  const scrollToSection = (ref, hash) => {
    if (window.location.pathname !== "/") {
      window.location.href = `/${hash}`;
      return;
    }

    if (!ref.current) return;

    const navbarHeight = 78;

    const elementTop =
      ref.current.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: elementTop - navbarHeight - 20,
      left: 0,
      behavior: "smooth",
    });

    /*
     * Update the URL hash without causing another page navigation.
     */
    window.history.replaceState(null, "", `/${hash}`);
  };

  /*
   * Always return to the top when Home is clicked.
   */
  const handleHomeClick = (event) => {
    if (window.location.pathname === "/") {
      event.preventDefault();

      /*
       * Remove #verify / #issue from the URL.
       */
      window.history.replaceState(null, "", "/");

      /*
       * Scroll all the way to the top of Home.
       */
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert(
        "MetaMask is not installed. Please install the MetaMask browser extension to connect your wallet."
      );
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    } catch (error) {
      console.error("Wallet connection error:", error);

      if (error.code === 4001) {
        alert("Wallet connection was rejected.");
      } else {
        alert("Unable to connect wallet.");
      }
    }
  };

  const scrollToIssue = () => {
    scrollToSection(issueRef, "#issue");
  };

  const scrollToVerify = () => {
    scrollToSection(verifyRef, "#verify");
  };

  /*
   * Handles /#verify and /#issue when coming from
   * Team/Details or directly opening a URL with a hash.
   */
  useEffect(() => {
    if (window.location.pathname !== "/") return;

    const hash = window.location.hash;

    if (!hash) return;

    const timer = setTimeout(() => {
      const element = document.getElementById(hash.substring(1));

      if (!element) return;

      const navbarHeight = 78;

      const elementTop =
        element.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: elementTop - navbarHeight - 20,
        left: 0,
        behavior: "instant",
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />

      <nav className="navbar">
        <Link
          to="/"
          className="logo"
          aria-label="VERIFLY Home"
          onClick={handleHomeClick}
        >
          <img src={veriflyLogo} alt="VERIFLY" />
        </Link>

        <div className="nav-links">
          <Link to="/" onClick={handleHomeClick}>
            Home
          </Link>

          <button
            type="button"
            className="nav-link-button"
            onClick={scrollToVerify}
          >
            Verify
          </button>

          <button
            type="button"
            className="nav-link-button"
            onClick={scrollToIssue}
          >
            Issue
          </button>

          <Link to="/team">Team</Link>

          <Link to="/details">Details</Link>
        </div>

        <button className="connect-btn" onClick={connectWallet}>
          {account
            ? `${account.slice(0, 6)}...${account.slice(-4)}`
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

        <Route path="/team" element={<Team />} />

        <Route path="/details" element={<Details />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;