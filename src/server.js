require('dotenv').config()
const express = require('express');
const pages = require('./pages.js');
const server = express();
const router = express.Router();
const cookieParser = require('cookie-parser');

const port = process.env.PORT || 3000;

router.get("/", pages.index);
router.get("/user", pages.user);
router.get("/createaccount", pages.createAccount);
router.get("/userslist", pages.usersList);
router.get("/getUserInformation", pages.getUserInformation);
router.get("/getAllUsers", pages.getAllUsers);
router.get("/changeName", pages.changeName);

server 
  .use("/", router)
  .use(express.urlencoded({extended: false}))
  .use(express.static("public"))
  .use(cookieParser())

  .post("/loginUser", pages.sendForm)
  .post("/createNewUser", pages.createNewUser)

server.listen(port);
console.log(`Servidor iniciado na porta ${port}`);
