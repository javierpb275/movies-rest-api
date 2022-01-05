export default {
  DB: {
    URI: process.env.MONGODB_URI || "mongodb://localhost/movies-rest-api",
    USER: process.env.MONGODB_USER,
    PASSWORD: process.env.MONGODB_PASSWORD,
  },
  JWT_SECRET: process.env.JWT_SECRET || "somesecrettoken",
};
