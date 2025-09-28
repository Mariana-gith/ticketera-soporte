module.exports = {
  apps: [
    {
      name: "tiketera-backend",
      script: "server.js",
      cwd: "./backend",
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 4100,
        MONGO_URI: process.env.MONGO_URI
      }
    }
  ]
};
