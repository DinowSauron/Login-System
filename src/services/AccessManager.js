// require('dotenv').config()
const secretKey =  process.env.JWT_PRIVATE_KEY;
const jwt = require('jsonwebtoken');
const fs = require('fs');
let returnState = {
  state: "notResolved",
  message: "nothing to do",
  redirect: "/",
}



module.exports = {

  executeLogin(user) {
    const db = require("../database.json");
    let userExist = false;

    returnState = {
      state: "failed",
      message: "database crashed",
      redirect: "",
    }

    db.users?.some(dbUser => {
      if(dbUser.username === user.name) {
        if(dbUser.password === user.password) {
          getLoginToken(dbUser);
          writeDataInDatabase(db);
          return true;
        }else {
          returnState = {
            state: "failed",
            message: "Password Not Match",
            redirect: "/",
          }
        }
        userExist = true;
      } else {
        if(!userExist)
          returnState = {
            state: "failed",
            message: "This user not exist",
            redirect: "/",
          }
      }
    })
    
    return returnState
  },

  isValidToken,

  getUserData(token) {
    const db = require("../database.json");
    if(!isValidToken(token)) {
      return false;
    }

    const tokenData = jwt.verify(token, secretKey);

    const userData = db.users.find(user => {
      if(user.username === tokenData.name){
        return true
      }
    });

    return {userData, users: db.users.length};
  },

  getAllUsersData(token) {
    const db = require("../database.json");
    if(!isValidToken(token)) {
      return false;
    }

    const allUsers = db.users.map(user => {
      return {
        name: user.username,
        email: user.sub,
        picture: user.picture,
      }
    })

    return allUsers;
  },

  changeName(newName, token) {
    if(isValidToken(token)) {
      const db = require("../database.json");
      const username = jwt.verify(token, secretKey).name.trim();

      if(newName == username) {
        return {error: "Os nomes devem ser diferentes!"}
      }

      const hasUserWithThisName = db.users?.some(user => {
        if(user.username === newName){
          console.log("Usuário com mesmo nome: ln.80")
          return true;
        }
      })

      if(hasUserWithThisName) {
        return {error: "Já existe um usuário com este nome!"}
      }



      db.users?.forEach((user, index) => {
        if(user.username === username) {
          db.users[index].username = newName.trim();
          user.username = newName.trim();
          getLoginToken(user)
          return;
        }
      });

      writeDataInDatabase(db)
      return {success: "Nome alterado com sucesso!", returnState}

    }else {
      return {error: "Token has expired or is invalid."}
    }
  },

  createNewUser(userData) {
    console.log(userData);
    const db = require("../database.json");

    const userExists = db.users.some(user => {
      if(user.username === userData.name.trim()) {
        return true;
      }
    })
    if(userExists) {
      return {error: "User already exists"};
    }
    if(!userData.name.trim() || !userData.password.trim() || !userData.email) {
      return {error: "Missing user data"};
    }

    
    db.users.push({
      username: userData.name.trim(),
      password: userData.password.trim(),
      sub: userData.email,
      state: userData.state,
      picture: userData.picture.trim(),
      tokenInfo: {token: null}
    })


    writeDataInDatabase(db);
    return {success: "data saved", redirect: "/"}

  }

}





function isValidToken(token) {
  try {
    const db = require("../database.json");
    const userData = jwt.verify(token, secretKey);
    const isValidName = db.users?.some(user => {
      if(user.username === userData.name.trim()){
        return true
      }
    })
    if(!isValidName){
      return false;
    }
    return true
  } catch(err) {
    console.log("a")
    return false;
  }

}


function getLoginToken(user) {
  console.log("Generated new token")

  const userInfo = {
    name: user.username,
    email: user.email,
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



function writeDataInDatabase(db) {
  fs.writeFile('./src/database.json', JSON.stringify(db), 'utf8', (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON data saved.");
  });
}