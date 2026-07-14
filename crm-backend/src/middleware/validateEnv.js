/**
 * Environment Variable Validation
 * Validates required environment variables on startup
 */

const requiredEnvVars = {
  PORT: "number",
  JWT_SECRET: "string",
  NODE_ENV: "string",
};

const optionalEnvVars = {
  DB_PATH: "string",
  FRONTEND_URL: "string",
  JWT_EXPIRES_IN: "string",
};

function validateEnv() {
  const missing = [];
  const invalid = [];

  // Check required variables
  for (const [key, type] of Object.entries(requiredEnvVars)) {
    const value = process.env[key];

    if (!value) {
      missing.push(key);
      continue;
    }

    // if (type === 'number' && isNaN(Number(value))) {
    //   invalid.push({ key, expected: type, received: typeof value });
    // }
  }

  // Report errors
  if (missing.length > 0) {
    console.error("\n❌ Environment Variable Validation Failed\n");

    if (missing.length > 0) {
      console.error("Missing required variables:");
      missing.forEach((key) => console.error(`  - ${key}`));
    }

    /*if (invalid.length > 0) {
      console.error("\nInvalid variable types:");
      invalid.forEach(({ key, expected, received }) => {
        console.error(`  - ${key}: expected ${expected}, got ${received}`);
      });
    }
    */

    console.error(
      "\n💡 Copy .env.example to .env and fill in the required values\n",
    );
    process.exit(1);
  }

  // Log configuration (exclude secrets in production)
  if (process.env.NODE_ENV === "development") {
    console.log("\n✅ Environment variables validated:");
    console.log(`  PORT: ${process.env.PORT}`);
    console.log(`  NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`  DB_PATH: ${process.env.DB_PATH || "./data/crm.db"}`);
    console.log(
      `  FRONTEND_URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`,
    );
    console.log(`  JWT_EXPIRES_IN: ${process.env.JWT_EXPIRES_IN || "7d"}`);
    console.log("");
  }
}

module.exports = validateEnv;
