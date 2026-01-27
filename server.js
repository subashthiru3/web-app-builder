import dotenv from "dotenv";
import express from "express";
import sql from "mssql";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

const dbConfig = {
  user: "sa",
  password: "Password@123",
  server: "192.168.131.98",
  database: "appBuilder",
  options: {
    // instanceName: "MSSQLSERVER", 
    encrypt: false, // ✅ FIX
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

async function connectToSql() {
  try {
    await sql.connect(dbConfig);
    console.log("✅ Connected to SQL Server");
  } catch (err) {
    console.error("❌ SQL Connection Error:", err);
    process.exit(1);
  }
}

connectToSql();

/* Test API */
app.get("/api/test-db", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM NewProject");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
