const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
app.use(express.json());
app.use(cors());
const PORT = 3000;
const { claimRouter } = require("./routers/claim");
// Add this at the top of your API route

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

const provider = new ethers.JsonRpcProvider("https://testnet-rpc.monad.xyz");
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const faucetContract = new ethers.Contract(
  "0x90323A278e8413443812ff200b2B882F76380e48",
  abi,
  wallet
);

app.post("/api/claim", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
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
