const corsOptions = {
  origin: function (origin, callback) {
    const whitelist = process.env.CORS_WHITELIST?.split(",") || [
      "http://localhost:5173",
    ];

    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

module.exports = corsOptions;
