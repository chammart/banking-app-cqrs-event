import express from "express";
import supertest from "supertest";

const app = express();
app.use(express.json());

// The target URL for the main application (make sure the main app is running)
const TARGET_URL = process.env.TARGET_URL || "http://localhost:3000";

// Define an endpoint that will run a set of E2E tests
app.get("/e2e/run-tests", async (req, res) => {
  try {
    // Create a supertest agent for the main application
    const request = supertest(TARGET_URL);
    const results: any[] = [];

    // --------------------------
    // Test 1: Open an Account
    // --------------------------
    let response = await request
      .post("/account/open")
      .send({ accountId: "test-acc", initialDeposit: 1000 });
    results.push({
      test: "Open Account",
      status: response.status,
      body: response.body,
    });

    // --------------------------
    // Test 2: Withdraw Funds
    // --------------------------
    response = await request
      .post("/account/withdraw")
      .send({ accountId: "test-acc", amount: 100 });
    results.push({
      test: "Withdraw Funds",
      status: response.status,
      body: response.body,
    });

    // --------------------------
    // Test 3: Transfer Funds (requires a second account)
    // --------------------------
    // First open a second account
    await request
      .post("/account/open")
      .send({ accountId: "test-acc2", initialDeposit: 500 });
    response = await request
      .post("/account/transfer")
      .send({ fromAccountId: "test-acc", toAccountId: "test-acc2", amount: 200 });
    results.push({
      test: "Transfer Funds",
      status: response.status,
      body: response.body,
    });

    // --------------------------
    // Test 4: Get Transactions
    // --------------------------
    response = await request.get("/account/test-acc/transactions");
    results.push({
      test: "Get Transactions",
      status: response.status,
      body: response.body,
    });

    res.status(200).json({ message: "E2E tests executed", results });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.E2E_PORT || 4000;
app.listen(PORT, () => {
  console.log(`E2E service running on port ${PORT}`);
});
