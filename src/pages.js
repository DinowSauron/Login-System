
const path = require('path');
const { executeLogin, isValidToken, getUserData, getAllUsersData, updateName, createNewUser } = require("./services/AccessManager")

module.exports = {

  // GET

  index(req, res) {
    const authToken = getAuthCookie(req);
    if(authToken && isValidToken(authToken)){
      return res.redirect("/user")
    }

    return res.sendFile(PathJoin("index.html"))

  },

  user(req, res) {
    const authToken = getAuthCookie(req);

    if(!authToken || !isValidToken(authToken)){
      res.redirect("/");
      return
    }

    res.sendFile(PathJoin("user.html"));
  },

  usersList(req, res) {
    const authToken = getAuthCookie(req);

    if(!authToken || !isValidToken(authToken)){
      res.redirect("/");
      return
    }
    
    res.sendFile(PathJoin("userslist.html"));
  },


  createAccount(req,res) {

    return res.sendFile(PathJoin("create.html"))
  },

  getAllUsers(req,res) {
    const authToken = getAuthCookie(req);
    
    if(!authToken)
      res.json({error: "token invalid"})

    const allUsers = getAllUsersData(authToken) ;

    res.json({allUsers});
  },

  getUserInformation(req, res) {
    const authToken = getAuthCookie(req);

    if(!authToken)
      res.json({error: "token invalid"})
    
    const userInfo = getUserData(authToken);


    res.json(userInfo);
  },
  



  //POST

  createNewUser(req, res){

    const userData = req.body;

    const data = createNewUser(userData)

    if(data.error) {
      res.redirect("/createaccount")
    }
    if(data.redirect) {
      res.redirect(data.redirect)
    }
  },

  changeName(req,res) {

    newName = req.headers.newname;
    const authToken = getAuthCookie(req);

    if(!isValidToken(authToken)) {
      res.json({error: "Requisição Não permitida"})
      return
    }
    if(!isNameValid(newName)){
      res.json({error: "nome não válido"});
      return
    }

    const status = updateName(newName, authToken);

    if(status.error) {
      console.log(status);
      res.json({error: status.error});
      return;
    }

    const {token, redirect, message} = status.returnState;

    if(token) {
      res.cookie("ls-auth-token", token)
    }

    res.json(status)
  },

  sendForm(req, res){
    user = req.body;
    const {token, redirect, status, message} = executeLogin(user);
    // console.log(status)
    if(token) {
      res.cookie("ls-auth-token", token)
    }
    
    if(redirect != "" && redirect != "/") {
      res.redirect(redirect)
    } else {
      res.redirect(`/?e=${message}`)
    }
  }
}






function isNameValid(newName) {
  const nameFormated = newName.trim();
  if(nameFormated.length > 3 && nameFormated.length < 20)
    return true

  return false
}

function PathJoin(pathName){
  return (path.join(__dirname + "/views/" + pathName));
}

function getAuthCookie(req) {
  if(!req.headers.cookie){
    return false;
  }
  const rawCookiesList = req.headers.cookie.split(";");
  const authCookie = rawCookiesList.map(cookie => {
    if(cookie.trim().indexOf("ls-auth-token") === 0) {
      return cookie.replace("ls-auth-token=", "").trim();
    }
  }).filter(Boolean)[0];

  return authCookie;
}