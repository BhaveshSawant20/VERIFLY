export const CONTRACT_ADDRESS =
  "0x1c5689D87D2CceDBb267737C7289a7D6755A38A6";

export const CONTRACT_ABI = [
  {
    inputs: [
      { internalType: "string", name: "_certificateId", type: "string" },
      { internalType: "string", name: "_studentName", type: "string" },
      { internalType: "string", name: "_course", type: "string" },
      { internalType: "string", name: "_institute", type: "string" },
      { internalType: "bytes32", name: "_certificateHash", type: "bytes32" }
    ],
    name: "issueCertificate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "string", name: "_certificateId", type: "string" },
      { internalType: "bytes32", name: "_certificateHash", type: "bytes32" }
    ],
    name: "verifyCertificate",
    outputs: [
      { internalType: "bool", name: "isAuthentic", type: "bool" },
      { internalType: "string", name: "studentName", type: "string" },
      { internalType: "string", name: "course", type: "string" },
      { internalType: "string", name: "institute", type: "string" },
      { internalType: "address", name: "issuer", type: "address" },
      { internalType: "uint256", name: "issuedAt", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "string", name: "_certificateId", type: "string" }
    ],
    name: "getCertificate",
    outputs: [
      { internalType: "string", name: "", type: "string" },
      { internalType: "string", name: "", type: "string" },
      { internalType: "string", name: "", type: "string" },
      { internalType: "string", name: "", type: "string" },
      { internalType: "bytes32", name: "", type: "bytes32" },
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "bool", name: "", type: "bool" }
    ],
    stateMutability: "view",
    type: "function"
  }
];