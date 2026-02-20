const express = require('express');
const app = express();
app.post("/quote", (req, res) => res.send("quote"));
app.post("/api/quote", (req, res) => res.send("api/quote"));
const req = { method: "POST", url: "/api/quote" };
app(req, { send: (s) => console.log("Hit:", s), end: () => {} }, () => console.log("404"));
