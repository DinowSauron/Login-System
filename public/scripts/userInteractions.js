setInputName()


if(location.pathname === "/createaccount") {
  
  const password = document.getElementById("password")
  const confirm_password = document.getElementById("confirm_password");
  password.onchange = validatePassword;
  confirm_password.onkeyup = validatePassword;
  
}



function validatePassword(){
  if(password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Senhas não Conhecidem");
  } else {
    confirm_password.setCustomValidity('');
  }
}

function handleLogout() {
  console.log("inicialize")
  document.cookie = "ls-auth-token= "
  location.reload()

}

function setImageByInput() {

  const img = document.getElementById("img");
  const input = document.getElementById("picture");

  img.setAttribute("src", input.value)

}

function setInputName() {

  if(localStorage.getItem("input-name")) {
    if(location.pathname == "/"){
    const name = localStorage.getItem("input-name");
    const nameInput = document.getElementById("name");
    nameInput.value = name;
    }
  }
}

function saveInputName(){
  const name = document.getElementById("name").value;
  localStorage.setItem("input-name", name);
}

if(location.search.includes("?e=")) {
  console.log("mathc")
  window.alert(location.search.replace("?e=", "").replaceAll("%20", " "))
}