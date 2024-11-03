const axios = require("axios");

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:3000/api",
});

module.exports = apiClient;
