import axios from "axios";

const serverUrl = process.env.NODE_ENV == "production" ? process.env.APP_SERVER_URL : "http://localhost:8080";
const testUrl = "https://jsonplaceholder.typicode.com";

export default axios.create({
  // baseURL: serverUrl + "/api",
  baseURL: testUrl,

  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  },

  withCredentials: true,
});
