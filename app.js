const express = require("express");
const bodyparser = require("body-parser");
const fs = require("fs");

app = express();

app.use(bodyparser.urlencoded({ extended: false }));

app.get("/favicon.ico", (req, res) => res.status(204).end());

app.get("/login", (req, res, next) => {
  res.send(
    `<form onsubmit="localStorage.setItem('username', document.getElementById('username').value)" action='/log' method='POST'>
        <input type='text' id='username' placeholder='username' name='username'>
        <button type='submit'>Login</button>
    </form>`
  );
});

app.post("/log", (req, res, next) => {
  res.redirect("/room");
});

app.get("/room", (req, res, next) => {
  fs.readFile("./message.txt", "utf-8", (err, data) => {
    if (err) return console.log(err);

    return res.send(
      `<p>${data}</p>
      <form onsubmit="document.getElementById('hiddenUsername').value = localStorage.getItem('username')" action='/room' method='POST'>
        <input type='hidden' id='hiddenUsername' name='username'>
        <input type='text' id='message' placeholder='message' name='message'>
        <button type='submit'>Send</button>
      </form>`
    );
  });
});

app.post("/room", (req, res, next) => {
  const message = req.body.message;
  const usernameFromLocalStorage = req.body.username;

  const text = usernameFromLocalStorage + ": " + message + " ";
  fs.appendFile("message.txt", text, (err) => {
    if (err) return console.log(err);

    return res.redirect("/room");
  });
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
