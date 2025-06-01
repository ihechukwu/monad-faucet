require("dotenv").config();
const { ethers } = require("ethers");
// const { ABI } = require("../ABI.json");
const fs = require("fs");
const path = require("path");

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const abiPath = path.join(__dirname, "../ABI.json");
const abi = JSON.parse(fs.readFileSync(abiPath, "utf8"));

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const faucetContract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

const claim = async (req, res) => {
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
};

module.exports = { claim };
