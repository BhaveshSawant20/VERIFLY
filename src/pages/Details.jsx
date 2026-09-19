import "../App.css";
import VeriflyMark from "../components/VeriflyMark";

function Details() {
  const papers = [
    {
      text: `S. Al Ahmed, R. A. M. Rudro, A. J. Prity, S. Saha, N. Mansoor, and K. Nur, “CredChain: Academic and Professional Certificate Verification System using Blockchain,” in 2024 Int. Conf. on Advances in Computing, Communication, Electrical, and Smart Systems (iCACCESS), pp. 1–6, Mar. 2024.`,
      link: "https://doi.org/10.1109/iCACCESS61735.2024.10499520",
    },
    {
      text: `M. Obaid, A. Abumwais, R. Hodrob, and S. M. Odeh, “A Blockchain-Based Framework for Efficient and Secure E-Certification Sharing and Verification,” in 25th Int. Arab Conf. on Information Technology (ACIT), pp. 1–6, Dec. 2024.`,
      link: "https://doi.org/10.1109/ACIT62805.2024.10876869",
    },
    {
      text: `R. Priyadarshini, R. Pandey, K. C. Ankit, D. Bhandari, B. Khadka, R. K. Barik, and M. J. Saikia, “A Faster, Integrated, and Trusted Certificate Authentication and Issuer Validation System Based on Blockchain,” IEEE Access, vol. 13, pp. 27037–27049, Feb. 2025.`,
      link: "https://doi.org/10.1109/ACCESS.2025.3539180",
    },
    {
      text: `R. S. A. Fathima, M. Sathwika, M. H. Prakash, R. V. N. Reddy, and M. S. Sekhar, “Blockchain-Powered Certificate Verification using SHA-256 Algorithm,” in 7th Int. Conf. on Intelligent Sustainable Systems (ICISS), pp. 440–445, Mar. 2025.`,
      link: "https://doi.org/10.1109/ICISS63372.2025.11076488",
    },
    {
      text: `S. Narvekar, S. Patil, P. Motghare, T. Panaskar, and R. Pawar, “A Secure Framework for Academic Certificate Authentication on Ethereum Blockchain,” in 2025 IEEE Int. Conf. on Blockchain and Distributed Systems Security (ICBDS), pp. 1–6, Oct. 2025.`,
      link: "https://doi.org/10.1109/ICBDS67396.2025.11377304",
    },
  ];

  return (
    <div className="page details-page">

      <div className="details-header">
        <span className="details-eyebrow">
          PROJECT DOCUMENTATION
        </span>

        <h1>
          About <span>VERIFLY</span>
        </h1>

        <p>
          A blockchain-based certificate verification system designed
          to provide secure, transparent, and tamper-resistant
          verification of academic credentials.
        </p>
      </div>

      <section className="details-section">
        <h2>Project Overview</h2>

        <p>
          VERIFLY is a decentralized certificate verification platform
          that uses blockchain technology and cryptographic hashing to
          verify the authenticity of academic certificates. The system
          reduces dependence on manual verification and centralized
          databases by maintaining a trusted record of certificate
          information on the blockchain.
        </p>

        <p>
          When a certificate is issued, its important details are combined
          and converted into a unique SHA-256 hash. The hash is stored
          through a Solidity smart contract on the Ethereum Sepolia
          blockchain. During verification, the same certificate details
          are hashed again and compared with the blockchain record. If
          both hashes match, the certificate is considered authentic.
        </p>
      </section>

      <section className="details-section">
        <h2>How VERIFLY Works</h2>

        <div className="details-flow">

          <div className="details-step">
            <span>01</span>
            <h3>Certificate Issuance</h3>
            <p>
              The issuer enters the certificate ID, student name,
              course, and institute details.
            </p>
          </div>

          <div className="details-step">
            <span>02</span>
            <h3>Hash Generation</h3>
            <p>
              The certificate information is processed using SHA-256
              to generate a unique digital fingerprint.
            </p>
          </div>

          <div className="details-step">
            <span>03</span>
            <h3>Blockchain Storage</h3>
            <p>
              The certificate metadata and hash are recorded through
              a Solidity smart contract on Ethereum Sepolia.
            </p>
          </div>

          <div className="details-step">
            <span>04</span>
            <h3>Certificate Verification</h3>
            <p>
              The entered certificate data is hashed again and compared
              with the hash stored on the blockchain.
            </p>
          </div>

        </div>
      </section>

      <section className="details-section">
        <h2>Technology Stack</h2>

        <div className="tech-grid">
          <div className="tech-item">
            <strong>Frontend</strong>
            <span>React + Vite + CSS</span>
          </div>

          <div className="tech-item">
            <strong>Blockchain</strong>
            <span>Ethereum Sepolia</span>
          </div>

          <div className="tech-item">
            <strong>Smart Contract</strong>
            <span>Solidity</span>
          </div>

          <div className="tech-item">
            <strong>Blockchain Interaction</strong>
            <span>Ethers.js</span>
          </div>

          <div className="tech-item">
            <strong>Wallet</strong>
            <span>MetaMask</span>
          </div>

          <div className="tech-item">
            <strong>Hashing</strong>
            <span>SHA-256</span>
          </div>
        </div>
      </section>

      <section className="details-section">
        <h2>Security Approach</h2>

        <p>
          VERIFLY does not rely on storing the complete certificate
          document directly on the blockchain. Instead, a cryptographic
          hash acts as the certificate's digital fingerprint. Even a
          small modification to the certificate information produces a
          different hash, allowing the system to detect tampering during
          verification.
        </p>

        <p>
          The blockchain provides an immutable record of the registered
          certificate hash, while the smart contract controls the
          issuance and verification logic. This combination provides
          transparency, traceability, and a verifiable record of the
          certificate's registration.
        </p>
      </section>

      <section className="details-section papers-section">
        <div className="papers-heading">
          <span className="details-eyebrow">
            RESEARCH FOUNDATION
          </span>

          <h2>IEEE Research Papers</h2>

          <p>
            The development of VERIFLY is supported by recent research
            on blockchain-based certificate authentication, cryptographic
            hashing, Ethereum smart contracts, and decentralized
            verification systems.
          </p>
        </div>

        <div className="paper-list">
          {papers.map((paper, index) => (
            <a
              key={index}
              href={paper.link}
              target="_blank"
              rel="noopener noreferrer"
              className="paper-card"
            >
              <span className="paper-number">
                0{index + 1}
              </span>

              <p>{paper.text}</p>

              <span className="paper-arrow">
                ↗
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="details-section project-info">
        <h2>Project Information</h2>

        <div className="project-info-grid">
          <div>
            <span>Project</span>
            <strong>VERIFLY</strong>
          </div>

          <div>
            <span>Domain</span>
            <strong>Blockchain</strong>
          </div>

          <div>
            <span>Network</span>
            <strong>Ethereum Sepolia</strong>
          </div>

          <div>
            <span>Smart Contract</span>
            <strong>Solidity</strong>
          </div>
        </div>
      </section>

      <VeriflyMark />

    </div>
  );
}

export default Details;