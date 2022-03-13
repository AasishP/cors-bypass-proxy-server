import express from "express";
import request from "request";
import cors from "cors";
import morgan from "morgan";
import readline from "readline";

//creating readline interface
const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const getServerBaseUrl = new Promise((resolve, reject) => {
  readlineInterface.question(`Input server baseURL:`, (baseURL) => {
    baseURL ? resolve(baseURL) : reject(new Error("baseURL is required"));
    readlineInterface.close();
  });
});

const app = express();
app.use(morgan("tiny"));
app.use(cors());

let serverURL = process.argv[2];
if (!serverURL) {
  try {
    serverURL = await getServerBaseUrl;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
console.log("serverURL:", serverURL);
console.log(
  `Forwarding all requests from http://localhost:5000/api to ${serverURL}`
);

// Forward all requests from /api to serverURL
app.use("/api", function (req, res) {
  req.pipe(request(serverURL + req.url)).pipe(res);
});

app.listen(process.env.PORT || 5000);
