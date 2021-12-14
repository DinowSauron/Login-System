
const path = require('path');
const { executeLogin, isValidToken } = require("./services/AccessManager")

module.exports = {

  // GET

  index(req, res) {
    return res.sendFile(PathJoin("index.html"))
  },

  user(req, res) {
    const rawCookiesList = req.headers.cookie.split(";");
    const authCookie = rawCookiesList.map(cookie => {
      if(cookie.trim().indexOf("ls-auth-token") === 0) {
        return cookie.replace("ls-auth-token=", "").trim();
      }
    }).filter(Boolean)[0];


    console.log(isValidToken(authCookie));
    if(!authCookie || !isValidToken(authCookie)){
      res.redirect("/");
      return
    }

    res.json({a: "a"})

    // console.log(authCookie);

  },
  



  //POST

  sendForm(req, res){
    user = req.body;
    const {token, redirect, status, message} = executeLogin(user);

    if(token) {
      res.cookie("ls-auth-token", token)
    }
    console.log(status)
    if(redirect != "") {
      res.redirect(redirect)
    } else {
      res.redirect(`/?e=${message}`)
    }
  }
}


function PathJoin(pathName){
  return (path.join(__dirname + "/views/" + pathName));
}
