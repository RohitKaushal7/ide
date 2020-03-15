const path = require("path");
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const router = require("./routs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// for API
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(router);

// chat
const server = http.createServer(app);
const io = require("socket.io")(server);

const users = {};

const { filter } = require("./scan");

io.on("connection", soc => {
  let user = soc.id;
  soc.on("new-user", name => {
    user = name;
    if (filter(user)) user = "****";
    users[soc.id] = name;
    io.emit("all", users);
    // console.log(`${user} Connected`);
    soc.broadcast.emit("new-user", user);

    soc.on("disconnect", () => {
      // console.log(`${user} Disconnected`);
      io.emit("user-left", user);
      delete users[soc.id];
      io.emit("all", users);
    });

    soc.on("msg", msg => {
      if (filter(msg)) msg = "****";
      console.log(`${user} : ${msg}`);
      soc.broadcast.emit("msg", { user, msg });
    });
    soc.on("typing", () => {
      soc.broadcast.emit("typing", user);
    });
    soc.on("not-typing", () => {
      soc.broadcast.emit("not-typing", user);
    });
  });
});

server.listen(process.env.PORT || 5000);
console.log("server at : localhost:5000");
