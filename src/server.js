require('dotenv').config()
const express = require('express');
const pages = require('./pages.js');
const server = express();
const router = express.Router();
const cookieParser = require('cookie-parser');

const port = process.env.PORT || 3000;

router.get("/", pages.index);
router.get("/user", pages.user);

server 
  .use("/", router)
  .use(express.urlencoded({extended: true}))
  .use(express.static("public"))
  .use(cookieParser())
  .post("/loginUser", pages.sendForm);

server.listen(port);
console.log(`Servidor iniciado na porta ${port}`);
