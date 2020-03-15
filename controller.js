const path = require("path");
const fs = require("fs");

const { exec } = require("child_process");

const { scan } = require("./scan");

exports.getIDE = (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
};

exports.postCpp = (req, res) => {
  code = req.body.code;
  inp = req.body.inp;
  out = req.body.out;

  if (scan(code)) {
    res.json({ out: "You Cannot Interact with system", status: 200 });
    return;
  }

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
};

exports.postPython = (req, res) => {
  code = req.body.code;
  inp = req.body.inp;

  // security
  if (scan(code)) {
    res.json({ out: "You Cannot Interact with system", status: 200 });
    return;
  }

  fs.writeFile("./code.py", code, err => {
    if (err) console.log(err);
    console.log("saved code py");

    fs.writeFile("./inp.txt", inp, err => {
      if (err) console.log(err);
      console.log("saved inp");
    });

    exec("timeout -k 1 5 python code.py < inp.txt", (error, stdout, stderr) => {
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
    });
  });
  // console.log(req.body);
};

exports.getChat = (req, res) => {
  res.sendFile(path.resolve(__dirname, "public/chat.html"));
};