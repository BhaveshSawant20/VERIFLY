import "../App.css";

import VeriflyMark from "../components/VeriflyMark";

import bhaveshImage from "../bhavesh.png";
import virajImage from "../viraj.png";
import sanskrutiImage from "../sanskruti.png";

function Team() {
  const teamMembers = [
    {
      name: "Sanskruti Yadav",
      ien: "12327007",
      role: "Frontend Developer",
      image: sanskrutiImage,
      linkedin:
        "https://www.linkedin.com/in/sanskruti-yadav-436456339/",
      description:
        "Responsible for the user interface, responsive design, and frontend interaction with the certificate verification system.",
    },
    {
      name: "Viraj Pukale",
      ien: "12317004",
      role: "Backend Developer",
      image: virajImage,
      linkedin:
        "https://www.linkedin.com/in/viraj-pukale-53b561314/",
      description:
        "Responsible for backend architecture, data handling, and integration between the application and blockchain services.",
    },
    {
      name: "Bhavesh Sawant",
      ien: "12217028",
      role: "Blockchain Developer",
      image: bhaveshImage,
      linkedin:
        "https://www.linkedin.com/in/bhaveshsawant20/",
      description:
        "Responsible for Solidity smart-contract development, blockchain integration, certificate hashing, and verification logic.",
    },
  ];

  return (
    <div className="team-page">

      {/* PAGE HEADER */}

      <div className="team-header">
        <span className="team-eyebrow">
          THE TEAM BEHIND VERIFLY
        </span>

        <h1>
          Built with <span>purpose.</span>
        </h1>

        <p>
          A three-member team combining blockchain, backend,
          and frontend development to build a secure
          certificate verification platform.
        </p>
      </div>

      {/* TEAM MEMBERS */}

      <div className="team-grid">
        {teamMembers.map((member, index) => (
          <div
            className="team-card"
            key={member.ien}
          >

            {/* PROFILE IMAGE */}

            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="team-image-link"
              aria-label={`Open ${member.name}'s LinkedIn profile`}
            >
              <div className="team-image-wrapper">
                <img
                  src={member.image}
                  alt={member.name}
                  className="team-image"
                />

                {/* LINKEDIN BADGE */}

                <div className="linkedin-badge">
                  in
                </div>
              </div>
            </a>

            {/* MEMBER INFORMATION */}

            <div className="team-info">
              <span className="team-role">
                {member.role}
              </span>

              <h2>
                {member.name}
              </h2>

              <span className="team-ien">
                IEN • {member.ien}
              </span>

              <div className="team-line"></div>

              <p>
                {member.description}
              </p>

              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="team-link"
              >
                LinkedIn
                <span>↗</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* VERIFLY LICENSE MARK */}

      <VeriflyMark />
    </div>
  );
}

export default Team;