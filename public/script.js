document.getElementById("claimBtn").addEventListener("click", async () => {
  const address = document.getElementById("addressInput").value.trim();
  const resultDiv = document.getElementById("result");

  if (!address) {
    resultDiv.innerText = "Please enter your address.";
    resultDiv.style.color = "red";
    return;
  }

  resultDiv.innerText = "Sending claim request...";
  resultDiv.style.color = "black";

  try {
    const res = await fetch("http://localhost:3000/api/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userAddress: address }),
    });

    const data = await res.json();

    if (data.success) {
      resultDiv.innerText = `Claim successful! TX Hash: ${data.txHash}`;
      resultDiv.style.color = "green";
    } else {
      resultDiv.innerText = `Error: ${data.error}`;
      resultDiv.style.color = "red";
    }
  } catch (err) {
    console.error(err);
    resultDiv.innerText = "Failed to connect to the faucet server.";
    resultDiv.style.color = "red";
  }
});
