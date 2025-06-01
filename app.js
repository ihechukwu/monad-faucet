const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
app.use(express.json());
app.use(cors());
const PORT = 3000;
const { claimRouter } = require("./routers/claim");

app.use(express.static(path.join(__dirname, "public")));
// app.use("/api/claim", claimRouter);
require("dotenv").config();
const { ethers } = require("ethers");
// const { ABI } = require("../ABI.json");
const fs = require("fs");
// const path = require("path");

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const abiPath = path.join(__dirname, "ABI.json");
const abi = JSON.parse(fs.readFileSync(abiPath, "utf8"));
// const abi = [
//   {
//     inputs: [],
//     stateMutability: "nonpayable",
//     type: "constructor",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "amount",
//         type: "uint256",
//       },
//     ],
//     name: "FaucetSettingsChanged",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: true,
//         internalType: "address",
//         name: "recipient",
//         type: "address",
//       },
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "amount",
//         type: "uint256",
//       },
//     ],
//     name: "TokensClaimed",
//     type: "event",
//   },
//   {
//     inputs: [],
//     name: "COOLDOWN_PERIOD",
//     outputs: [
//       {
//         internalType: "uint256",
//         name: "",
//         type: "uint256",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [
//       {
//         internalType: "address",
//         name: "_recipient",
//         type: "address",
//       },
//     ],
//     name: "claim",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "claimAmount",
//     outputs: [
//       {
//         internalType: "uint256",
//         name: "",
//         type: "uint256",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [
//       {
//         internalType: "address",
//         name: "",
//         type: "address",
//       },
//     ],
//     name: "lastClaimTime",
//     outputs: [
//       {
//         internalType: "uint256",
//         name: "",
//         type: "uint256",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [
//       {
//         internalType: "address",
//         name: "_recipient",
//         type: "address",
//       },
//     ],
//     name: "nextClaimTime",
//     outputs: [
//       {
//         internalType: "uint256",
//         name: "",
//         type: "uint256",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "owner",
//     outputs: [
//       {
//         internalType: "address",
//         name: "",
//         type: "address",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [
//       {
//         internalType: "uint256",
//         name: "_newAmount",
//         type: "uint256",
//       },
//     ],
//     name: "setClaimAmount",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "withdrawFunds",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     stateMutability: "payable",
//     type: "receive",
//   },
// ];

const provider = new ethers.JsonRpcProvider("https://testnet-rpc.monad.xyz");
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const faucetContract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

app.post("/api/claim", async (req, res) => {
  const { userAddress } = req.body;
  if (!userAddress || !ethers.isAddress(userAddress)) {
    return res.status(400).json({ error: "missing or invalid address" });
  }

  try {
    const tx = await faucetContract.claim(userAddress);
    tx.wait();
    console.log(`Claimed successful for ${userAddress}`);
    res.json({ success: true, txHash: tx.hash });
  } catch (error) {
    console.error("Error claiming tokens:", error);
    res
      .status(500)
      .json({ error: "Failed to claim tokens.", details: error.toString() });
  }
});
app.listen(PORT, () => {
  console.log(`server listening at port ${PORT}`);
});
