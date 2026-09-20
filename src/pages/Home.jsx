import { useState } from "react";

import { ethers } from "ethers";

import VeriflyMark from "../components/VeriflyMark";

import "../App.css";

import backgroundImage from "../background.png";

import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
} from "../contract";

async function generateHash(
  certificateId,
  studentName,
  course,
  institute
) {
  const data = `${certificateId}|${studentName}|${course}|${institute}`;

  const encoder = new TextEncoder();

  const dataBuffer = encoder.encode(data);

  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    dataBuffer
  );

  const hashArray = Array.from(
    new Uint8Array(hashBuffer)
  );

  return (
    "0x" +
    hashArray
      .map((byte) =>
        byte.toString(16).padStart(2, "0")
      )
      .join("")
  );
}

const emptyCertificateData = {
  certificateId: "",
  studentName: "",
  course: "",
  institute: "",
};

function Home({ issueRef, verifyRef }) {
  const [issueData, setIssueData] = useState(
    emptyCertificateData
  );

  const [verifyData, setVerifyData] = useState(
    emptyCertificateData
  );

  const [issueHash, setIssueHash] = useState("");
  const [transactionHash, setTransactionHash] =
    useState("");

  const [issueStatus, setIssueStatus] =
    useState("");

  const [verifyStatus, setVerifyStatus] =
    useState("");

  const [certificateDetails, setCertificateDetails] =
    useState(null);

  const scrollToIssue = () => {
    issueRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const scrollToVerify = () => {
    verifyRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleIssueChange = (e) => {
    setIssueData({
      ...issueData,
      [e.target.name]: e.target.value,
    });
  };

  const handleVerifyChange = (e) => {
    setVerifyData({
      ...verifyData,
      [e.target.name]: e.target.value,
    });
  };

  // ================================
  // ISSUE CERTIFICATE
  // ================================

  const issueCertificate = async (e) => {
    e.preventDefault();

    setIssueStatus("");
    setTransactionHash("");
    setIssueHash("");

    if (!window.ethereum) {
      setIssueStatus(
        "MetaMask is not installed."
      );
      return;
    }

    const {
      certificateId,
      studentName,
      course,
      institute,
    } = issueData;

    if (
      !certificateId ||
      !studentName ||
      !course ||
      !institute
    ) {
      setIssueStatus(
        "Please fill in all fields."
      );
      return;
    }

    try {
      setIssueStatus(
        "Generating certificate hash..."
      );

      const hash = await generateHash(
        certificateId,
        studentName,
        course,
        institute
      );

      setIssueHash(hash);

      setIssueStatus(
        "Waiting for MetaMask..."
      );

      const provider =
        new ethers.BrowserProvider(
          window.ethereum
        );

      const signer =
        await provider.getSigner();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      setIssueStatus(
        "Submitting certificate to blockchain..."
      );

      const transaction =
        await contract.issueCertificate(
          certificateId,
          studentName,
          course,
          institute,
          hash
        );

      setTransactionHash(
        transaction.hash
      );

      setIssueStatus(
        "Transaction submitted. Waiting for confirmation..."
      );

      await transaction.wait();

      setIssueStatus(
        "Certificate successfully stored on blockchain."
      );

      /*
       * CLEAR FORM AFTER SUCCESSFUL
       * BLOCKCHAIN CONFIRMATION
       */
      setIssueData(
        emptyCertificateData
      );
    } catch (error) {
      console.error(
        "Issue certificate error:",
        error
      );

      if (error.code === 4001) {
        setIssueStatus(
          "Transaction rejected in MetaMask."
        );
      } else if (
        error.reason ===
          "Certificate already exists" ||
        error.message?.includes(
          "Certificate already exists"
        )
      ) {
        setIssueStatus(
          "This certificate ID already exists."
        );
      } else {
        setIssueStatus(
          error.shortMessage ||
            error.reason ||
            "Unable to issue certificate."
        );
      }
    }
  };

  // ================================
  // VERIFY CERTIFICATE
  // ================================

  const verifyCertificate = async (e) => {
    e.preventDefault();

    setVerifyStatus("");
    setCertificateDetails(null);

    if (!window.ethereum) {
      setVerifyStatus(
        "MetaMask is not installed."
      );
      return;
    }

    const {
      certificateId,
      studentName,
      course,
      institute,
    } = verifyData;

    if (
      !certificateId ||
      !studentName ||
      !course ||
      !institute
    ) {
      setVerifyStatus(
        "Please fill in all fields."
      );
      return;
    }

    try {
      setVerifyStatus(
        "Generating verification hash..."
      );

      const hash = await generateHash(
        certificateId,
        studentName,
        course,
        institute
      );

      const provider =
        new ethers.BrowserProvider(
          window.ethereum
        );

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        provider
      );

      setVerifyStatus(
        "Checking blockchain record..."
      );

      const certificate =
        await contract.getCertificate(
          certificateId
        );

      const [
        blockchainCertificateId,
        blockchainStudent,
        blockchainCourse,
        blockchainInstitute,
        blockchainHash,
        issuer,
        issuedAt,
        exists,
      ] = certificate;

      /*
       * Certificate does not exist
       */
      if (!exists) {
        setVerifyStatus(
          "CERTIFICATE NOT FOUND"
        );

        /*
         * Clear form after verification attempt.
         */
        setVerifyData(
          emptyCertificateData
        );

        return;
      }

      setVerifyStatus(
        "Comparing certificate with blockchain..."
      );

      const result =
        await contract.verifyCertificate(
          certificateId,
          hash
        );

      const [
        isAuthentic,
        verifiedStudent,
        verifiedCourse,
        verifiedInstitute,
        verifiedIssuer,
        verifiedIssuedAt,
      ] = result;

      if (isAuthentic) {
        setCertificateDetails({
          studentName: verifiedStudent,
          course: verifiedCourse,
          institute: verifiedInstitute,
          issuer: verifiedIssuer,
          issuedAt: new Date(
            Number(verifiedIssuedAt) * 1000
          ).toLocaleString(),
        });

        setVerifyStatus(
          "AUTHENTIC"
        );
      } else {
        setVerifyStatus(
          "TAMPERED OR INVALID"
        );
      }

      /*
       * CLEAR FORM AFTER VERIFICATION
       * IS COMPLETED
       */
      setVerifyData(
        emptyCertificateData
      );
    } catch (error) {
      console.error(
        "Verification error:",
        error
      );

      setVerifyStatus(
        error.shortMessage ||
          error.reason ||
          "Unable to verify certificate."
      );
    }
  };

  return (
    <div
      className="app"
      style={{
        "--background-image": `url(${backgroundImage})`,
      }}
    >
      {/* ================================
          HERO
      ================================= */}

      <main id="home" className="hero">
        <div className="hero-content">
          <div className="eyebrow">
            BLOCKCHAIN • TRUST • AUTHENTICITY
          </div>

          <h1>
            Certificates you can
            <span> trust.</span>
          </h1>

          <p className="hero-description">
            Verify academic certificates with
            blockchain-backed records. Detect
            tampering, confirm authenticity, and
            keep credentials trustworthy.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={scrollToVerify}
            >
              Verify Certificate
              <span>→</span>
            </button>

            <button
              className="secondary-btn"
              onClick={scrollToIssue}
            >
              Issue Certificate
              <span>+</span>
            </button>
          </div>

          <div className="trust-line">
            <div className="trust-item">
              <strong>BLOCKCHAIN</strong>
              <span>Secured Records</span>
            </div>

            <div className="divider"></div>

            <div className="trust-item">
              <strong>VERIFICATION</strong>
              <span>Instant Validation</span>
            </div>
          </div>
        </div>

        <div className="verification-card">
          <div className="card-top">
            <span>VERIFLY</span>

            <span className="status">
              <i></i> VERIFIED
            </span>
          </div>

          <div className="certificate-symbol">
            ✓
          </div>

          <p className="card-label">
            CERTIFICATE STATUS
          </p>

          <h2>Authentic</h2>

          <p className="card-description">
            This certificate matches the original
            blockchain record and has not been
            altered.
          </p>

          <div className="record-box">
            <div>
              <span>Record</span>
              <strong>BLOCKCHAIN</strong>
            </div>

            <div>
              <span>Network</span>
              <strong>SEPOLIA</strong>
            </div>
          </div>
        </div>
      </main>

      {/* ================================
          BLOCKCHAIN WORKSPACE
      ================================= */}

      <section className="workspace">

        {/* ISSUE CERTIFICATE */}

        <div
          id="issue"
          className="workspace-card"
          ref={issueRef}
        >
          <div className="workspace-header">
            <span className="workspace-eyebrow">
              FOR INSTITUTES
            </span>

            <h2>
              Issue <span>Certificate</span>
            </h2>

            <p>
              Register a certificate on the
              VERIFLY blockchain.
            </p>
          </div>

          <form
            className="certificate-form"
            onSubmit={issueCertificate}
          >
            <input
              type="text"
              name="certificateId"
              placeholder="Certificate ID"
              value={issueData.certificateId}
              onChange={handleIssueChange}
            />

            <input
              type="text"
              name="studentName"
              placeholder="Student Name"
              value={issueData.studentName}
              onChange={handleIssueChange}
            />

            <input
              type="text"
              name="course"
              placeholder="Course"
              value={issueData.course}
              onChange={handleIssueChange}
            />

            <input
              type="text"
              name="institute"
              placeholder="Institute"
              value={issueData.institute}
              onChange={handleIssueChange}
            />

            <button
              type="submit"
              className="primary-btn form-btn"
            >
              Issue on Blockchain
              <span>→</span>
            </button>
          </form>

          {issueStatus && (
            <div className="status-message">
              {issueStatus}
            </div>
          )}

          {issueHash && (
            <div className="hash-box">
              <span>Certificate Hash</span>
              <code>{issueHash}</code>
            </div>
          )}

          {transactionHash && (
            <div className="transaction-box">
              <div className="transaction-header">
                <span>
                  BLOCKCHAIN TRANSACTION
                </span>

                <span className="transaction-network">
                  SEPOLIA
                </span>
              </div>

              <div className="transaction-hash">
                <span>
                  Transaction Hash
                </span>

                <code>
                  {transactionHash}
                </code>
              </div>

              <a
                href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="etherscan-link"
              >
                View on Sepolia Etherscan
                <span>↗</span>
              </a>
            </div>
          )}
        </div>

        {/* VERIFY CERTIFICATE */}

        <div
          id="verify"
          className="workspace-card"
          ref={verifyRef}
        >
          <div className="workspace-header">
            <span className="workspace-eyebrow">
              FOR VERIFIERS
            </span>

            <h2>
              Verify <span>Certificate</span>
            </h2>

            <p>
              Compare certificate data against
              the blockchain record.
            </p>
          </div>

          <form
            className="certificate-form"
            onSubmit={verifyCertificate}
          >
            <input
              type="text"
              name="certificateId"
              placeholder="Certificate ID"
              value={verifyData.certificateId}
              onChange={handleVerifyChange}
            />

            <input
              type="text"
              name="studentName"
              placeholder="Student Name"
              value={verifyData.studentName}
              onChange={handleVerifyChange}
            />

            <input
              type="text"
              name="course"
              placeholder="Course"
              value={verifyData.course}
              onChange={handleVerifyChange}
            />

            <input
              type="text"
              name="institute"
              placeholder="Institute"
              value={verifyData.institute}
              onChange={handleVerifyChange}
            />

            <button
              type="submit"
              className="primary-btn form-btn"
            >
              Verify on Blockchain
              <span>✓</span>
            </button>
          </form>

          {verifyStatus && (
            <div
              className={`verification-result ${
                verifyStatus === "AUTHENTIC"
                  ? "authentic"
                  : verifyStatus ===
                    "CERTIFICATE NOT FOUND"
                  ? "not-found"
                  : "invalid"
              }`}
            >
              <div className="result-heading">
                <span className="result-icon">
                  {verifyStatus === "AUTHENTIC"
                    ? "✓"
                    : verifyStatus ===
                      "CERTIFICATE NOT FOUND"
                    ? "!"
                    : "×"}
                </span>

                <strong>
                  {verifyStatus}
                </strong>
              </div>

              <p>
                {verifyStatus === "AUTHENTIC"
                  ? "The submitted certificate data matches the original blockchain record."
                  : verifyStatus ===
                    "CERTIFICATE NOT FOUND"
                  ? "No certificate with this ID is registered on the VERIFLY blockchain."
                  : "The certificate ID exists, but the submitted certificate data does not match the blockchain record."}
              </p>
            </div>
          )}

          {certificateDetails && (
            <div className="certificate-result">
              <div>
                <span>Student</span>
                <strong>
                  {
                    certificateDetails.studentName
                  }
                </strong>
              </div>

              <div>
                <span>Course</span>
                <strong>
                  {
                    certificateDetails.course
                  }
                </strong>
              </div>

              <div>
                <span>Institute</span>
                <strong>
                  {
                    certificateDetails.institute
                  }
                </strong>
              </div>

              <div>
                <span>Issuer</span>
                <strong>
                  {certificateDetails.issuer}
                </strong>
              </div>

              <div>
                <span>Issued At</span>
                <strong>
                  {
                    certificateDetails.issuedAt
                  }
                </strong>
              </div>
            </div>
          )}
        </div>
      </section>

      <VeriflyMark />
    </div>
  );
}

export default Home;