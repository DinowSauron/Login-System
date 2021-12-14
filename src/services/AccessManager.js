// require('dotenv').config()
const secretKey =  process.env.JWT_PRIVATE_KEY;
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { redirect } = require("express/lib/response");
let returnState = {
  state: "notResolved",
  message: "nothing to do",
  redirect: "/",
}



module.exports = {

  executeLogin(user) {
    const db = require("../database.json");

    returnState = {
      state: "failed",
      message: "database crashed",
      redirect: "",
    }

    db.users?.forEach(dbUser => {
      if(dbUser.username === user.name) {
        if(dbUser.password === user.password) {
          getLoginToken(dbUser);
          writeDataInDatabase(db);
        }else {
          returnState = {
            state: "failed",
            message: "Password Not Match",
            redirect: "/",
          }
        }
      } else {
        returnState = {
          state: "failed",
          message: "This user not exist",
          redirect: "/",
        }
      }
    })
    
    return returnState
  },

  isValidToken(token) {
    try {
      jwt.verify(token, secretKey)
      return true;
    } catch(err) {
      return false;
    }
  }

}


function getLoginToken(user) {
  const db = require("../database.json");

  try {
    jwt.verify(user.tokenInfo.token, secretKey);
    console.log("Token valid, redirecting...")

    returnState = {
      redirect: "/user",
      status: "success"
    }
  } catch(err) {
    console.log("Generated new token")

    const userInfo = {
      name: user.username,
      permissions: "none"
    }
    const expires = process.env.TOKEN_EXPIRES;
    const token = jwt.sign(userInfo, secretKey, {expiresIn: Number(expires)});

    user.tokenInfo.token = token

    returnState = {
      redirect: "/user",
      token: token,
      status: "success",
      message: "new token"
    }
  }
}



function writeDataInDatabase(db) {
  fs.writeFile('./src/database.json', JSON.stringify(db), 'utf8', (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON data saved.");
  });
}