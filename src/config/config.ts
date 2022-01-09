export default {
  DB: {
    URI: process.env.MONGODB_URI || "somedburl",
    USER: process.env.MONGODB_USER || "somedbuser",
    PASSWORD: process.env.MONGODB_PASSWORD || "somedbpassword",
  },
  AUTH: {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "somesecrettoken",
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "somesecrettoken",
  },
};
