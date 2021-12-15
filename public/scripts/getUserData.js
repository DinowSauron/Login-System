
setUserDataInHTML();

let user = {}



async function setUserDataInHTML() {

  
  const userInfo = await getUserInfo();
  console.log(userInfo)
  user = userInfo.userData;
  user.users = userInfo.users;

  localStorage.setItem("input-name", user.username);



  if(!user){
    location.replace("/")
  }

  setValueInElements("user-name", "username");
  setValueInElements("user-password", "password");
  setValueInElements("user-email", "sub");
  setValueInElements("user-state", "state");
  setValueInElements("user-id", "id");
  setValueInElements("user-permissions", "permissions");

  setValueInElements("db.users", "users");

  console.log(user)
  
  const profileImage = document.getElementById("profile-img") 
  if(user.picture) {
    profileImage.setAttribute("src", user.picture);
    profileImage.setAttribute("style", "display: block;")
  }




  function setValueInElements(className, valueName) {
    if(!user[valueName])
      return
    
    const htmlElements = document.getElementsByClassName(className);
    const elements = Array.prototype.slice.call(htmlElements);

    elements.forEach((element, index) => {
      element.innerHTML = user[valueName];
      element.value =user[valueName];
    })
  }
  async function getUserInfo() {
    return await fetch("/getUserInformation",{
      method: "GET",
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
    }).then((res) => res.json()).then(res => res)
  }

  // console.log(userInfo)
}