const path = require("path");
const fs = require("fs");

const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/compile", (req, res) => {
  code = req.body.code;
  inp = req.body.inp;
  out = req.body.out;
  fs.writeFile("./code.cpp", code, err => {
    if (err) console.log(err);
    console.log("saved code");

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
          let sendOut = { out: error, status: 500 };
          res.json({ out: error.message, status: 501 });
          // return;
        }
        if (stderr) {
          let sendOut = { out: stdout, status: 500 };
          // return;
        } else {
          sendOut = { out: stdout, status: 200 };
        }
        // console.log(sendOut);
        res.json(sendOut);
      }
    );
  });
  // console.log(req.body);
});

app.listen(3000);
console.log("server at : localhost:3000");
