module.exports = {
  info: {
    title: "test",
    version: "1.0.0",
  },
  servers: [
    {
      url: process.env.HOSTING_PATH || "http://localhost:3000",
    },
  ],
  apis: ["./routes/*.js"],
};
