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
    if (window.location.pathname !== "/") {
      window.location.href = "/#issue";
      return;
    }

    issueRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const scrollToVerify = () => {
    if (window.location.pathname !== "/") {
      window.location.href = "/#verify";
      return;
    }

    verifyRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <BrowserRouter>
      <ScrollToTop />

      <nav className="navbar">
        <Link to="/" className="logo" aria-label="VERIFLY Home">
  <img src={veriflyLogo} alt="VERIFLY" />
</Link>

        <div className="nav-links">
          <Link to="/">Home</Link>

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