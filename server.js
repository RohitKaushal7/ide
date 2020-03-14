const path = require("path");
const fs = require("fs");

const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/cpp", (req, res) => {
  code = req.body.code;
  inp = req.body.inp;
  out = req.body.out;
  fs.writeFile("./code.cpp", code, err => {
    if (err) console.log(err);
    console.log("saved code cpp");

    fs.writeFile("./inp.txt", inp, err => {
      if (err) console.log(err);
      console.log("saved inp");
    });

    exec(
      "g++ code.cpp && timeout -k 1 5 ./a.out < inp.txt",
      (error, stdout, stderr) => {
        let sendOut;
        if (error) {
          console.log(`err: ${error}`);
          sendOut = { out: error.message, status: 500 };
          let msg = error.message.split("\n");
          if (msg.length == 2) msg[0] = "tle";
          else msg[0] = "";
          msg = msg.join("");
          console.log(msg);

          res.json({ out: msg, status: 501 });
          return;
        } else {
          sendOut = { out: stdout, status: 200 };
        }
        console.log(sendOut);
        res.json(sendOut);
      }
    );
  });
  // console.log(req.body);
});

app.post("/python", (req, res) => {
  code = req.body.code;
  inp = req.body.inp;
  fs.writeFile("./code.py", code, err => {
    if (err) console.log(err);
    console.log("saved code py");

    fs.writeFile("./inp.txt", inp, err => {
      if (err) console.log(err);
      console.log("saved inp");
    });

    exec(
      "timeout -k 1 5 python3 code.py < inp.txt",
      (error, stdout, stderr) => {
        let sendOut;
        if (error) {
          console.log(`err: ${error}`);
          sendOut = { out: error.message, status: 500 };
          let msg = error.message.split("\n");
          if (msg.length == 2) msg[0] = "tle";
          else msg[0] = "";
          msg = msg.join("");
          console.log(msg);

          res.json({ out: msg, status: 501 });
          return;
        } else {
          sendOut = { out: stdout, status: 200 };
        }
        console.log(sendOut);
        res.json(sendOut);
      }
    );
  });
  // console.log(req.body);
});

app.listen(process.env.PORT || 5000);
console.log("server at : localhost:3000");
