import express from "express";
import request from "request";
import cors from "cors";
import morgan from "morgan";

const app = express();
app.use(morgan("tiny"));
app.use(cors());

// Forward all requests from / to http://req.url
app.use("/", function (req, res) {
  req.pipe(request("http:/" + req.url)).pipe(res);
});

app.listen(process.env.PORT || 5000);
